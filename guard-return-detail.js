import { supabase, requireRole } from './supabaseClient.js';

const returnDetail = document.getElementById('returnDetail');
const scanBtn = document.getElementById('scanBtn');
const photoBtn = document.getElementById('photoBtn');
const completeBtn = document.getElementById('completeBtn');
let selectedItemId = localStorage.getItem('selectedGuardItemId');
let scannedClaimToken = localStorage.getItem('scannedClaimToken');

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
        ['จุดเด่น / ตำหนิจากผู้แจ้ง', item.defect],
        ['จุดรับฝาก', item.storage_location],
        ['บันทึกเพิ่มเติมจากผู้แจ้ง', item.additional_note]
    ];

    returnDetail.innerHTML = `
        <article class="return-card">
            <div class="return-main">
                <div class="return-photo">
                    ${item.image_url
                        ? `<img src="${escapeHtml(item.image_url)}" alt="รูปสิ่งของ">`
                        : '<i class="fa-solid fa-box"></i>'}
                </div>
                <div>
                    <p class="code">รหัสรายการ: ${escapeHtml(item.id.slice(0, 8))}</p>
                    <h2>รายละเอียดสิ่งของ</h2>
                    <p>ตรวจสอบข้อมูลก่อนสแกน QR Code เพื่อส่งคืนเจ้าของ</p>
                </div>
            </div>

            <div class="return-details">
                ${rows.map(([label, value]) => `
                    <div class="info-row">
                        <div class="info-label">${label}</div>
                        <div class="info-value">${escapeHtml(value || '-')}</div>
                    </div>
                `).join('')}
            </div>

            ${item.guard_remark ? `
                <section class="remark-section">
                    <h3>ข้อมูลเพิ่มเติมจาก รปภ.</h3>
                    <p>${escapeHtml(item.guard_remark)}</p>
                </section>
            ` : ''}
        </article>
    `;
}

async function loadItem() {
    if (!selectedItemId && !scannedClaimToken) {
        returnDetail.innerHTML = '<div class="return-card">ไม่พบรายการที่เลือก กรุณากลับไปเลือกรายการอีกครั้ง</div>';
        scanBtn.disabled = true;
        return;
    }

    const query = supabase.from('found_items').select('*').in('status', ['claimed', 'claim_verified']);
    const { data: item, error } = await (scannedClaimToken
        ? query.eq('claim_token', scannedClaimToken).single()
        : query.eq('id', selectedItemId).single());

    if (error || !item) {
        returnDetail.innerHTML = '<div class="return-card">ไม่สามารถโหลดข้อมูลรายการได้</div>';
        scanBtn.disabled = true;
        console.error('Load return item detail failed:', error?.message);
        return;
    }

    selectedItemId = item.id;
    localStorage.setItem('selectedGuardItemId', item.id);
    renderItem(item);
    const hasPhoto = localStorage.getItem('handoverPhotoItemId') === item.id
        && Boolean(localStorage.getItem('handoverPhotoUrl'));
    if (scannedClaimToken) {
        scanBtn.hidden = true;
        photoBtn.disabled = false;
        completeBtn.hidden = !hasPhoto;
        if (hasPhoto) {
            returnDetail.insertAdjacentHTML('beforeend', '<p class="result">ถ่ายรูปหลักฐานแล้ว กรุณากดยืนยันเพื่อบันทึกการส่งคืน</p>');
        }
    } else {
        photoBtn.disabled = true;
        completeBtn.hidden = true;
    }
}

scanBtn.addEventListener('click', () => {
    localStorage.removeItem('scannedClaimToken');
    localStorage.removeItem('handoverPhotoUrl');
    localStorage.removeItem('handoverPhotoItemId');
    window.location.href = 'guard-scan.html';
});

photoBtn.addEventListener('click', () => {
    window.location.href = 'guard-photo.html';
});

completeBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('scannedClaimToken');
    const imageUrl = localStorage.getItem('handoverPhotoUrl');
    if (!token || !imageUrl) {
        alert('กรุณาสแกน QR Code และถ่ายรูปหลักฐานก่อน');
        return;
    }
    completeBtn.disabled = true;
    const { data, error } = await supabase.rpc('redeem_claim_token', {
        p_claim_token: token,
        p_note: 'บันทึกการส่งคืนจากหน้าหน่วยรักษาความปลอดภัย',
        p_image_url: imageUrl
    });
    if (error) {
        completeBtn.disabled = false;
        alert(`บันทึกการส่งคืนไม่สำเร็จ: ${error.message}`);
        return;
    }
    localStorage.removeItem('scannedClaimToken');
    localStorage.removeItem('handoverPhotoUrl');
    localStorage.removeItem('handoverPhotoItemId');
    completeBtn.hidden = true;
    photoBtn.disabled = true;
    returnDetail.insertAdjacentHTML('afterbegin', `<div class="result">ส่งคืน “${escapeHtml(data?.description || 'สิ่งของ')}” และบันทึกหลักฐานเรียบร้อยแล้ว</div>`);
});

requireRole(['guard']).then((user) => {
    if (user) loadItem();
});
