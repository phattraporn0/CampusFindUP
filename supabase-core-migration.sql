-- CampusFind UP: run this file once in Supabase SQL Editor.
-- It adds the server-side workflow used by users, guards, and administrators.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'user' check (role in ('user', 'guard', 'admin')),
    display_name text,
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

alter table public.profiles
    add column if not exists display_name text;

-- รองรับโปรเจกต์เดิมที่ใช้ full_name แทน display_name
do $$
begin
    if exists (
        select 1 from information_schema.columns
        where table_schema = 'public'
          and table_name = 'profiles'
          and column_name = 'full_name'
    ) then
        update public.profiles
        set display_name = coalesce(display_name, full_name)
        where display_name is null;
    end if;
end $$;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, display_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1)
from auth.users
on conflict (id) do nothing;

alter table public.found_items
    add column if not exists claimant_id uuid references auth.users(id),
    add column if not exists claim_attempts integer not null default 0,
    add column if not exists claim_locked_at timestamptz,
    add column if not exists claim_locked_from_status text,
    add column if not exists claim_token uuid unique,
    add column if not exists claim_expires_at timestamptz,
    add column if not exists claimed_at timestamptz,
    add column if not exists returned_at timestamptz,
    add column if not exists received_by uuid references auth.users(id);

-- Extend the legacy status constraint for the ownership-verification workflow.
-- The old constraint usually allowed only waiting/claimed/returned.
alter table public.found_items
    drop constraint if exists found_items_status_check;

alter table public.found_items
    add constraint found_items_status_check
    check (status in ('waiting', 'claimed', 'claim_verified', 'claim_locked', 'returned'));

create table if not exists public.handover_proofs (
    id uuid primary key default gen_random_uuid(),
    found_item_id uuid not null references public.found_items(id) on delete cascade,
    guard_id uuid not null references auth.users(id),
    image_url text,
    note text,
    created_at timestamptz not null default now()
);

create table if not exists public.claim_attempt_logs (
    id uuid primary key default gen_random_uuid(),
    found_item_id uuid not null references public.found_items(id) on delete cascade,
    claimant_id uuid not null references auth.users(id),
    attempt_no integer not null,
    submitted_answer text,
    attempted_at timestamptz not null default now()
);

alter table public.claim_attempt_logs
    add column if not exists submitted_answer text;

create index if not exists claim_attempt_logs_item_idx
    on public.claim_attempt_logs (found_item_id, attempted_at desc);

alter table public.handover_proofs enable row level security;
alter table public.claim_attempt_logs enable row level security;

create or replace function public.has_role(p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = any(p_roles)
    );
$$;

drop policy if exists "Staff can read all found items" on public.found_items;
create policy "Staff can read all found items"
on public.found_items for select to authenticated
using (public.has_role(array['guard', 'admin']));

drop policy if exists "Users can read their claimed found items" on public.found_items;
create policy "Users can read their claimed found items"
on public.found_items for select to authenticated
using (claimant_id = auth.uid());

drop policy if exists "Users can read their own lost items" on public.lost_items;
create policy "Users can read their own lost items"
on public.lost_items for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read all lost item announcements" on public.lost_items;
create policy "Users can read all lost item announcements"
on public.lost_items for select to authenticated
using (true);

drop policy if exists "Users can delete their own lost items" on public.lost_items;
create policy "Users can delete their own lost items"
on public.lost_items for delete to authenticated
using (user_id = auth.uid());

drop policy if exists "Guards can read lost items" on public.lost_items;
create policy "Guards can read lost items"
on public.lost_items for select to authenticated
using (public.has_role(array['guard', 'admin']));

drop policy if exists "Admins can update found items" on public.found_items;
create policy "Admins can update found items"
on public.found_items for update to authenticated
using (public.has_role(array['admin']))
with check (public.has_role(array['admin']));

drop policy if exists "Admins can delete found items" on public.found_items;
create policy "Admins can delete found items"
on public.found_items for delete to authenticated
using (public.has_role(array['admin']));

drop policy if exists "Staff can read handover proofs" on public.handover_proofs;
create policy "Staff can read handover proofs"
on public.handover_proofs for select to authenticated
using (public.has_role(array['guard', 'admin']));

drop policy if exists "Staff can read claim attempt logs" on public.claim_attempt_logs;
create policy "Staff can read claim attempt logs"
on public.claim_attempt_logs for select to authenticated
using (public.has_role(array['admin', 'guard']));

create or replace function public.normalize_claim_text(p_text text)
returns text
language sql
immutable
as $$
    select regexp_replace(lower(coalesce(p_text, '')), '[[:space:][:punct:]]+', '', 'g');
$$;

drop function if exists public.verify_claim(uuid, text);

create or replace function public.verify_claim(p_found_item_id uuid, p_answer text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.found_items%rowtype;
    v_answer text;
    v_correct text;
    v_secret text;
    v_is_match boolean;
    v_attempts_left integer;
begin
    if auth.uid() is null then
        raise exception 'Please sign in first';
    end if;

    select * into v_item
    from public.found_items
    where id = p_found_item_id
    for update;

    if not found then
        raise exception 'Item not found';
    end if;

    -- An expired QR releases the claim so the item can be claimed again.
    if v_item.status = 'claim_verified'
       and v_item.claim_expires_at is not null
       and v_item.claim_expires_at <= now() then
        update public.found_items
        set status = 'claimed',
            claimant_id = null,
            claim_token = null,
            claim_expires_at = null,
            claimed_at = null,
            claim_attempts = 0,
            claim_locked_at = null,
            claim_locked_from_status = null
        where id = v_item.id;

        select * into v_item
        from public.found_items
        where id = p_found_item_id
        for update;
    end if;

    if v_item.status = 'claim_verified' then
        return jsonb_build_object('success', false, 'locked', false, 'already_claimed', true, 'attempts_left', 0);
    end if;

    if v_item.status not in ('waiting', 'claimed') then
        return jsonb_build_object('success', false, 'locked', v_item.status = 'claim_locked', 'attempts_left', 0);
    end if;

    v_answer := public.normalize_claim_text(p_answer);
    v_secret := public.normalize_claim_text(
        coalesce(v_item.description, '') || ' ' ||
        coalesce(v_item.defect, '') || ' ' ||
        coalesce(v_item.additional_note, '') || ' ' ||
        coalesce(v_item.guard_remark, '')
    );

    -- The answer must contain a real phrase/word from the reporter's
    -- details, the defect, or the guard's note. Do not use fuzzy similarity:
    -- short values such as "20" must not pass by accident.
    v_is_match := length(v_answer) >= 2
        and v_answer !~ '^[0-9]+$'
        and (
            position(v_answer in v_secret) > 0
            or exists (
                select 1
                from regexp_split_to_table(coalesce(p_answer, ''), '[[:space:]]+') as answer_part
                where length(public.normalize_claim_text(answer_part)) >= 2
                  and position(public.normalize_claim_text(answer_part) in v_secret) > 0
            )
        );

    if v_is_match then
        update public.found_items
        set status = 'claim_verified',
            claimant_id = auth.uid(),
            claimed_at = now(),
            claim_token = gen_random_uuid(),
            claim_expires_at = now() + interval '24 hours'
        where id = v_item.id
        returning * into v_item;

        return jsonb_build_object(
            'success', true,
            'locked', false,
            'attempts_left', 3 - v_item.claim_attempts,
            'claim_token', v_item.claim_token,
            'claim_expires_at', v_item.claim_expires_at
        );
    end if;

    update public.found_items
    set claim_attempts = claim_attempts + 1,
        claim_locked_at = case when claim_attempts + 1 >= 3 then now() else null end,
        claim_locked_from_status = case when claim_attempts + 1 >= 3 then status else claim_locked_from_status end,
        status = case when claim_attempts + 1 >= 3 then 'claim_locked' else status end
    where id = v_item.id
    returning 3 - claim_attempts into v_attempts_left;

    insert into public.claim_attempt_logs (found_item_id, claimant_id, attempt_no, submitted_answer)
    values (v_item.id, auth.uid(), v_item.claim_attempts + 1, p_answer);

    return jsonb_build_object(
        'success', false,
        'locked', v_attempts_left <= 0,
        'attempts_left', greatest(v_attempts_left, 0)
    );
end;
$$;

create or replace function public.redeem_claim_token(p_claim_token uuid, p_note text default null, p_image_url text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.found_items%rowtype;
begin
    if not public.has_role(array['guard', 'admin']) then
        raise exception 'Only guards or administrators can hand over an item';
    end if;

    select * into v_item
    from public.found_items
    where claim_token = p_claim_token
    for update;

    if not found then
        raise exception 'Invalid QR code';
    end if;

    if v_item.status <> 'claim_verified' or v_item.claim_expires_at <= now() then
        raise exception 'This QR code has expired or was already used';
    end if;

    update public.found_items
    set status = 'returned', returned_at = now(), received_by = auth.uid()
    where id = v_item.id;

    insert into public.handover_proofs (found_item_id, guard_id, image_url, note)
    values (v_item.id, auth.uid(), p_image_url, p_note);

    return jsonb_build_object(
        'success', true,
        'item_id', v_item.id,
        'description', v_item.description,
        'returned_at', now()
    );
end;
$$;

grant execute on function public.verify_claim(uuid, text) to authenticated;
grant execute on function public.redeem_claim_token(uuid, text, text) to authenticated;
grant execute on function public.has_role(text[]) to authenticated;

create or replace function public.admin_reset_claim_attempts(p_found_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.found_items%rowtype;
begin
    if not public.has_role(array['admin']) then
        raise exception 'Only administrators can reset claim attempts';
    end if;

    update public.found_items
    set claim_attempts = 0,
        claim_locked_at = null,
        status = case
            when status = 'claim_locked' then coalesce(claim_locked_from_status, 'waiting')
            else status
        end,
        claim_locked_from_status = null
    where id = p_found_item_id
    returning * into v_item;

    if not found then
        raise exception 'Item not found';
    end if;

    return jsonb_build_object('success', true, 'item_id', v_item.id, 'status', v_item.status);
end;
$$;

grant execute on function public.admin_reset_claim_attempts(uuid) to authenticated;

create or replace function public.admin_approve_claim(p_found_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.found_items%rowtype;
    v_claimant_id uuid;
begin
    if not public.has_role(array['admin']) then
        raise exception 'Only administrators can approve a claim';
    end if;

    select * into v_item
    from public.found_items
    where id = p_found_item_id;

    if not found then
        raise exception 'Item not found';
    end if;

    select claimant_id into v_claimant_id
    from public.claim_attempt_logs
    where found_item_id = p_found_item_id
    order by attempted_at desc
    limit 1;

    update public.found_items
    set status = 'claim_verified',
        claim_attempts = 0,
        claimant_id = coalesce(v_claimant_id, v_item.claimant_id),
        claimed_at = now(),
        claim_token = gen_random_uuid(),
        claim_expires_at = now() + interval '24 hours',
        claim_locked_at = null,
        claim_locked_from_status = null
    where id = p_found_item_id
    returning * into v_item;

    return jsonb_build_object(
        'success', true,
        'item_id', v_item.id,
        'claim_token', v_item.claim_token,
        'claim_expires_at', v_item.claim_expires_at
    );
end;
$$;

grant execute on function public.admin_approve_claim(uuid) to authenticated;

-- Repair old records where the user already failed three times before the
-- claim_locked status was added. Do not change already verified/returned items.
update public.found_items fi
set claim_attempts = greatest(coalesce(fi.claim_attempts, 0), logs.attempt_count),
    claim_locked_at = coalesce(fi.claim_locked_at, now()),
    claim_locked_from_status = case
        when fi.status not in ('claim_locked', 'claim_verified', 'returned')
            then fi.status
        else fi.claim_locked_from_status
    end,
    status = case
        when fi.status not in ('claim_locked', 'claim_verified', 'returned')
            then 'claim_locked'
        else fi.status
    end
from (
    select found_item_id, count(*)::integer as attempt_count
    from public.claim_attempt_logs
    group by found_item_id
    having count(*) >= 3
) logs
where fi.id = logs.found_item_id
  and fi.status not in ('claim_verified', 'returned');

drop policy if exists "Guards can upload handover photos" on storage.objects;
create policy "Guards can upload handover photos"
on storage.objects for insert to authenticated
with check (
    bucket_id = 'item-photos'
    and public.has_role(array['guard', 'admin'])
);

drop policy if exists "Staff can read profiles" on public.profiles;
create policy "Staff can read profiles"
on public.profiles for select to authenticated
using (public.has_role(array['guard', 'admin']));

-- Assign these roles after choosing the staff accounts:
-- update public.profiles set role = 'admin' where id = '<ADMIN-USER-UUID>';
-- update public.profiles set role = 'guard' where id = '<GUARD-USER-UUID>';
