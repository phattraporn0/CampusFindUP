-- รันใน Supabase SQL Editor 1 ครั้ง เพื่อรองรับรูปหลายรูปทั้งแจ้งหายและแจ้งพบ
alter table public.lost_items
    add column if not exists image_urls text[] not null default '{}';

alter table public.found_items
    add column if not exists image_urls text[] not null default '{}';

-- ให้ PostgREST เห็นคอลัมน์ใหม่ทันที
notify pgrst, 'reload schema';
