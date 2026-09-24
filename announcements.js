import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);
const lostList = document.getElementById('lostList');
const foundList = document.getElementById('foundList');
const escapeHtml = (value) => String(value ?? '-').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function card(item, type) {
  const title = item.item_name || item.category || 'สิ่งของ';
  const categoryLabel = [item.category, item.subcategory].filter(Boolean).join(' / ');
  const href = type === 'lost' ? `lost-post-detail.html?id=${encodeURIComponent(item.id)}` : `lost-item-detail.html?id=${encodeURIComponent(item.id)}`;
  return `<article class="announcement-card"><div class="announcement-body"><small>${escapeHtml(categoryLabel || 'สิ่งของ')}</small><h3>${escapeHtml(title)}</h3><a href="${href}">ดูรายละเอียด</a></div></article>`;
}

const [{ data: lost }, foundResult] = await Promise.all([
  supabase.from('lost_items').select('id,item_name,subcategory,description,category,location,image_url,created_at').order('created_at',{ascending:false}),
  // Keep the full announcement list in sync with the dashboard.  The old
  // query only requested waiting/claimed rows, so verified/returned posts
  // disappeared from the "ดูทั้งหมด" page.
  supabase.from('found_items_public')
    .select('id,item_name,subcategory,category,location,found_date,found_time,image_url,status,created_at')
    .in('status',['waiting','claimed','claim_verified','claim_locked','returned'])
    .order('created_at',{ascending:false})
]);
let { data: found, error: foundError } = foundResult;
if (foundError && /item_name/i.test(foundError.message || '')) {
  ({ data: found, error: foundError } = await supabase.from('found_items_public')
    .select('id,item_name,subcategory,category,location,found_date,found_time,image_url,status,created_at')
    .in('status',['waiting','claimed','claim_verified','claim_locked','returned'])
    .order('created_at',{ascending:false}));
}
lostList.innerHTML = (lost || []).map((item) => card(item,'lost')).join('') || '<p>ยังไม่มีประกาศตามหาของ</p>';
foundList.innerHTML = foundError ? `<p>โหลดประกาศพบของไม่สำเร็จ: ${escapeHtml(foundError.message)}</p>` : ((found || []).map((item) => card(item,'found')).join('') || '<p>ยังไม่มีประกาศพบของ</p>');

const hash = window.location.hash;
if (hash === '#lost') {
  document.getElementById('found')?.remove();
  document.querySelector('.announcements-page h1').textContent = 'รายการประกาศตามหาของทั้งหมด';
} else if (hash === '#found') {
  document.getElementById('lost')?.remove();
  document.querySelector('.announcements-page h1').textContent = 'รายการประกาศพบของทั้งหมด';
}
