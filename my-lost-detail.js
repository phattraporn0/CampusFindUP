import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);

const detail = document.getElementById('detail');
const itemId = new URLSearchParams(window.location.search).get('id') || localStorage.getItem('selectedLostItemId');

function escapeHtml(value) {
    return String(value ?? '-').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

if (!itemId) {
    detail.innerHTML = '<p>ไม่พบรายการแจ้งของหาย</p>';
} else {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: item, error } = await supabase
        .from('lost_items')
        .select('id, category, item_name, description, details, location, lost_date, lost_time, image_url, created_at')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single();

    if (error || !item) {
        detail.innerHTML = `<p>ไม่สามารถโหลดข้อมูลได้: ${escapeHtml(error?.message || 'ไม่พบรายการ')}</p>`;
    } else {
        detail.innerHTML = `
            <div class="row"><div class="label">Item details</div><div class="value">${escapeHtml(item.details)}</div></div>
            <div class="placeholder">ไม่แสดงรูปภาพ</div>
            <h1>${escapeHtml(item.item_name || 'ไม่ระบุชื่อสิ่งของ')}</h1>
            <div class="row"><div class="label">หมวดหมู่</div><div class="value">${escapeHtml(item.category)}</div></div>
            <div class="row"><div class="label">รายละเอียด</div><div class="value">${escapeHtml(item.description)}</div></div>
            <div class="row"><div class="label">สถานที่หาย</div><div class="value">${escapeHtml(item.location)}</div></div>
            <div class="row"><div class="label">วันที่และเวลาที่หาย</div><div class="value">${escapeHtml(item.lost_date)} ${escapeHtml(item.lost_time || '')}</div></div>
            <div class="row"><div class="label">สถานะ</div><div class="value">ส่งแจ้งให้เจ้าหน้าที่รักษาความปลอดภัยแล้ว</div></div>
        `;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-post-btn';
        deleteButton.textContent = 'ลบโพสต์นี้';
        deleteButton.addEventListener('click', async () => {
            if (!confirm('ต้องการลบโพสต์แจ้งหายนี้ใช่หรือไม่?')) return;
            const { error: deleteError } = await supabase.from('lost_items').delete().eq('id', item.id).eq('user_id', user.id);
            if (deleteError) return alert(`ลบโพสต์ไม่สำเร็จ: ${deleteError.message}`);
            window.location.href = 'my-lost.html';
        });
        detail.appendChild(deleteButton);
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'edit-post-btn';
        editButton.textContent = 'แก้ไขโพสต์นี้';
        editButton.addEventListener('click', () => {
            window.location.href = `report-lost.html?edit_id=${encodeURIComponent(item.id)}`;
        });
        detail.appendChild(editButton);
    }
}
