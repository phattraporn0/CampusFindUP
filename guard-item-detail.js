import { supabase, requireRole } from './supabaseClient.js';

const itemDetail = document.getElementById('itemDetail');
const guardRemark = document.getElementById('guardRemark');
const confirmBtn = document.getElementById('confirmBtn');
const selectedItemId = localStorage.getItem('selectedGuardItemId');

function escapeHtml(value) {
    return String(value ?? '-')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function displayDate(value) {
    if (!value) return '-';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('th-TH', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).format(date);
}

function renderItem(item) {
    const rows = [
        ['หมวดหมู่', item.category],
        ['สถานที่พบ', item.location],
        ['วันที่พบ', displayDate(item.found_date)],
        ['เวลาที่พบ', item.found_time],
        ['รายละเอียดสิ่งของ', item.description],
        ['จุดเด่น / ตำหนิ', item.defect],
        ['จุดส่งมอบที่ผู้แจ้งระบุ', item.storage_location],
        ['บันทึกเพิ่มเติมจากผู้แจ้ง', item.additional_note]
    ];

    itemDetail.innerHTML = `
        <article class="item-detail-card">
            <div class="item-main">
                <div class="item-photo">
                    ${item.image_url
                        ? `<img src="${escapeHtml(item.image_url)}" alt="รูปสิ่งของที่ผู้แจ้งพบ">`
                        : '<i class="fa-solid fa-box"></i>'}
                </div>
                <div>
                    <p class="code">รหัสรายการ: ${escapeHtml(item.id.slice(0, 8))}</p>
                    <h2>ข้อมูลที่ผู้แจ้งพบกรอกไว้</h2>
                    <p>ตรวจสอบรายละเอียดด้านล่างก่อนยืนยันการรับฝาก</p>
                </div>
            </div>
            <div class="reported-details">
                ${rows.map(([label, value]) => `
                    <div class="info-row">
                        <div class="info-label">${label}</div>
                        <div class="info-value">${escapeHtml(value || '-')}</div>
                    </div>
                `).join('')}
            </div>
        </article>
    `;

    guardRemark.value = item.guard_remark || '';
}

async function loadItem() {
    if (!selectedItemId) {
        itemDetail.innerHTML = '<div class="item-detail-card">ไม่พบรายการที่เลือก กรุณากลับไปเลือกรายการอีกครั้ง</div>';
        confirmBtn.disabled = true;
        return;
    }

    const { data: item, error } = await supabase
        .from('found_items')
        .select('*')
        .eq('id', selectedItemId)
        .single();

    if (error || !item) {
        itemDetail.innerHTML = '<div class="item-detail-card">ไม่สามารถโหลดข้อมูลรายการได้</div>';
        confirmBtn.disabled = true;
        console.error('Load guard item detail failed:', error?.message);
        return;
    }

    renderItem(item);
}

confirmBtn.addEventListener('click', async () => {
    if (!selectedItemId) return;

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...';

    const { error } = await supabase
        .from('found_items')
        .update({
            guard_remark: guardRemark.value.trim() || null,
            status: 'claimed'
        })
        .eq('id', selectedItemId)
        .eq('status', 'waiting');

    if (error) {
        alert(`บันทึกข้อมูลไม่สำเร็จ: ${error.message}`);
        console.error('Save guard remark failed:', error.message);
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> ยืนยันการรับฝากของ';
        return;
    }

    localStorage.removeItem('selectedGuardItemId');
    window.location.href = 'guard-items.html';
});

requireRole(['guard']).then((user) => {
    if (user) loadItem();
});
