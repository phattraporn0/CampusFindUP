-- Run this migration in Supabase before enabling the four-field claim flow.
create extension if not exists vector;

alter table public.found_items
    add column if not exists brand_embedding vector(384),
    add column if not exists color_embedding vector(384),
    add column if not exists description_embedding vector(384),
    add column if not exists distinctive_feature_embedding vector(384);

create or replace function public.verify_claim_answers(
    p_found_item_id uuid,
    p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.found_items%rowtype;
    v_brand vector(384);
    v_color vector(384);
    v_description vector(384);
    v_distinctive_feature vector(384);
    v_score numeric;
    v_attempts_left integer;
begin
    if auth.uid() is null then
        raise exception 'Please sign in first';
    end if;

    if coalesce(trim(p_answers->>'brand'), '') = ''
       or coalesce(trim(p_answers->>'color'), '') = ''
       or coalesce(trim(p_answers->>'description'), '') = ''
       or coalesce(trim(p_answers->>'distinctive_feature'), '') = '' then
        raise exception 'All claim answers are required';
    end if;

    select * into v_item
    from public.found_items
    where id = p_found_item_id
    for update;

    if not found then
        raise exception 'Item not found';
    end if;

    if v_item.status = 'claim_verified'
       and v_item.claim_expires_at is not null
       and v_item.claim_expires_at <= now() then
        update public.found_items
        set status = 'claimed', claimant_id = null, claim_token = null,
            claim_expires_at = null, claimed_at = null, claim_attempts = 0,
            claim_locked_at = null, claim_locked_from_status = null
        where id = v_item.id;
        select * into v_item from public.found_items where id = p_found_item_id for update;
    end if;

    if v_item.status = 'claim_verified' then
        return jsonb_build_object('success', false, 'locked', false, 'already_claimed', true, 'attempts_left', 0);
    end if;

    if v_item.status not in ('waiting', 'claimed') then
        return jsonb_build_object('success', false, 'locked', v_item.status = 'claim_locked', 'attempts_left', 0);
    end if;

    if v_item.brand_embedding is null
       or v_item.color_embedding is null
       or v_item.description_embedding is null
       or v_item.distinctive_feature_embedding is null then
        raise exception 'This item does not have claim matching data yet';
    end if;

    v_brand := (p_answers->>'brand')::vector;
    v_color := (p_answers->>'color')::vector;
    v_description := (p_answers->>'description')::vector;
    v_distinctive_feature := (p_answers->>'distinctive_feature')::vector;

    -- Cosine similarity for each field; all four fields have equal weight.
    v_score := (
        (1 - (v_item.brand_embedding <=> v_brand)) +
        (1 - (v_item.color_embedding <=> v_color)) +
        (1 - (v_item.description_embedding <=> v_description)) +
        (1 - (v_item.distinctive_feature_embedding <=> v_distinctive_feature))
    ) / 4;

    if v_score >= 0.70 then
        update public.found_items
        set status = 'claim_verified', claimant_id = auth.uid(), claimed_at = now(),
            claim_token = gen_random_uuid(), claim_expires_at = now() + interval '24 hours'
        where id = v_item.id
        returning * into v_item;

        return jsonb_build_object(
            'success', true, 'locked', false, 'attempts_left', 3 - v_item.claim_attempts,
            'claim_token', v_item.claim_token, 'claim_expires_at', v_item.claim_expires_at,
            'similarity_score', round(v_score, 4)
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
    values (v_item.id, auth.uid(), v_item.claim_attempts + 1, 'four-field similarity answer');

    return jsonb_build_object('success', false, 'locked', v_attempts_left <= 0,
        'attempts_left', greatest(v_attempts_left, 0), 'similarity_score', round(v_score, 4));
end;
$$;
