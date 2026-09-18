import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);
const lostList = document.getElementById('lostList');
const foundList = document.getElementById('foundList');
const escapeHtml = (value) => String(value ?? '-').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function card(item, type) {
  const title = item.item_name || item.description || 'ไม่ระบุชื่อสิ่งของ';
  const detail = type === 'lost' ? item.location : item.location;
  const href = type === 'lost' ? `lost-post-detail.html?id=${encodeURIComponent(item.id)}` : `lost-item-detail.html?id=${encodeURIComponent(item.id)}`;
  return `<article class="announcement-card"><a href="${href}">${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="รูปสิ่งของ">` : '<div class="announcement-placeholder">ไม่มีรูปภาพ</div>'}</a><div class="announcement-body"><small>${escapeHtml(item.category || 'สิ่งของ')}</small><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail || '-')}</p><a href="${href}">ดูรายละเอียด</a></div></article>`;
}

const [{ data: lost }, foundResult] = await Promise.all([
  supabase.from('lost_items').select('id,item_name,description,category,location,image_url,created_at').order('created_at',{ascending:false}),
  supabase.from('found_items_public').select('id,item_name,description,category,location,image_url,status,created_at').in('status',['waiting','claimed']).order('created_at',{ascending:false})
]);
let { data: found, error: foundError } = foundResult;
if (foundError && /item_name/i.test(foundError.message || '')) {
  ({ data: found, error: foundError } = await supabase.from('found_items_public').select('id,description,category,location,image_url,status,created_at').in('status',['waiting','claimed']).order('created_at',{ascending:false}));
}
lostList.innerHTML = (lost || []).map((item) => card(item,'lost')).join('') || '<p>ยังไม่มีประกาศตามหาของ</p>';
foundList.innerHTML = foundError ? `<p>โหลดประกาศพบของไม่สำเร็จ: ${escapeHtml(foundError.message)}</p>` : ((found || []).map((item) => card(item,'found')).join('') || '<p>ยังไม่มีประกาศพบของ</p>');
