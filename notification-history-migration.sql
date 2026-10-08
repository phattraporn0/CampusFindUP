-- ประวัติแจ้งเตือน Automatch ของผู้ใช้แต่ละบัญชี
create table if not exists public.match_notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    lost_item_id uuid not null references public.lost_items(id) on delete cascade,
    found_item_id uuid not null references public.found_items(id) on delete cascade,
    status text not null default 'new' check (status in ('new', 'claimed', 'returned')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, lost_item_id, found_item_id)
);

alter table public.match_notifications enable row level security;

drop policy if exists "Users can read their match notifications" on public.match_notifications;
create policy "Users can read their match notifications"
on public.match_notifications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create their match notifications" on public.match_notifications;
create policy "Users can create their match notifications"
on public.match_notifications for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update their match notifications" on public.match_notifications;
create policy "Users can update their match notifications"
on public.match_notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- ให้ Supabase REST API เห็นตารางใหม่ทันที
notify pgrst, 'reload schema';
