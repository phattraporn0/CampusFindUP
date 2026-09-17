-- The frontend stores URLs created with getPublicUrl(), so this bucket
-- must be public for photos to render on the dashboard.
update storage.buckets
set public = true
where id = 'item-photos';

-- Confirm that the bucket is now public.
select id, public
from storage.buckets
where id = 'item-photos';
