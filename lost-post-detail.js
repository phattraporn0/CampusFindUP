import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);
const detail = document.getElementById('detail');
const itemId = new URLSearchParams(window.location.search).get('id');

function escapeHtml(value) {
    return String(value ?? '-').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

if (!itemId) {
    detail.innerHTML = '<p>ไม่พบประกาศตามหา</p>';
} else {
    const { data: item, error } = await supabase.from('lost_items')
        .select('id, category, item_name, description, location, lost_date, lost_time, image_url, created_at')
        .eq('id', itemId).single();
    if (error || !item) {
        detail.innerHTML = `<p>ไม่สามารถโหลดข้อมูลได้: ${escapeHtml(error?.message || 'ไม่พบรายการ')}</p>`;
    } else {
        detail.innerHTML = `
            <div class="placeholder">ไม่แสดงรูปภาพ</div>
            <h1>${escapeHtml(item.item_name || 'ไม่ระบุชื่อสิ่งของ')}</h1>
            <div class="row"><div class="label">หมวดหมู่</div><div class="value">${escapeHtml(item.category)}</div></div>
            <div class="row"><div class="label">รายละเอียด</div><div class="value">ซ่อนไว้เพื่อป้องกันการแอบอ้าง</div></div>
            <div class="row"><div class="label">สถานที่หาย</div><div class="value">${escapeHtml(item.location)}</div></div>
            <div class="row"><div class="label">วันที่และเวลาที่หาย</div><div class="value">${escapeHtml(item.lost_date)} ${escapeHtml(item.lost_time || '')}</div></div>
            <div class="row"><div class="label">สถานะ</div><div class="value">กำลังตามหา</div></div>`;
    }
}
