import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);

const list = document.getElementById('claimsList');
const total = document.getElementById('claimsTotal');

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

async function loadClaims() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: claims, error } = await supabase
        .from('found_items')
        .select('id, item_name, category, description, location, image_url, status, claim_token, claim_expires_at, claimed_at, returned_at')
        .eq('claimant_id', user.id)
        .in('status', ['claim_verified', 'returned'])
        .order('claimed_at', { ascending: false });

    if (error) {
        list.innerHTML = `<div class="empty-claims">โหลดข้อมูลไม่สำเร็จ: ${escapeHtml(error.message)}</div>`;
        return;
    }

    const activeClaims = claims.filter((item) => item.status === 'returned'
        || !item.claim_expires_at
        || new Date(item.claim_expires_at).getTime() > Date.now());

    total.textContent = `${activeClaims.length} รายการ`;
    if (!activeClaims.length) {
        list.innerHTML = '<div class="empty-claims"><h2>ยังไม่มีรายการที่เคลม</h2><p>เมื่อยืนยันความเป็นเจ้าของสำเร็จ รายการจะแสดงตรงนี้</p></div>';
        return;
    }

    list.innerHTML = activeClaims.map((item) => `
        <article class="claim-card">
            <div class="claim-image">
                ${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="รูปสิ่งของ">` : '<span>ไม่มีรูป</span>'}
            </div>
            <div class="claim-info">
                <span class="claim-status">${item.status === 'returned' ? 'ส่งคืนแล้ว' : 'รอส่งคืนเจ้าของ'}</span>
                <small>${escapeHtml(item.category || 'สิ่งของ')}</small>
                <h2>${escapeHtml(item.description || 'ไม่ระบุรายละเอียด')}</h2>
                <p>สถานที่พบ: ${escapeHtml(item.location || 'ไม่ระบุ')}</p>
                <button class="claim-detail-btn" data-id="${item.id}" data-token="${escapeHtml(item.claim_token)}" data-expiry="${escapeHtml(item.claim_expires_at)}">ดูรายละเอียดและ QR Code</button>
            </div>
        </article>
    `).join('');

    list.querySelectorAll('.claim-card').forEach((card, index) => {
        if (activeClaims[index]?.status === 'returned') {
            card.querySelector('.claim-detail-btn')?.remove();
            const done = document.createElement('p');
            done.className = 'returned-message';
            done.textContent = 'รับของคืนเรียบร้อยแล้ว';
            card.querySelector('.claim-info')?.appendChild(done);
        }
    });

    list.querySelectorAll('[data-id]').forEach((button) => {
        button.addEventListener('click', () => {
            localStorage.setItem('claimToken', button.dataset.token || '');
            localStorage.setItem('claimQrExpiresAt', button.dataset.expiry || '');
            window.location.href = `claim-success.html?item_id=${encodeURIComponent(button.dataset.id)}`;
        });
    });
}

await loadClaims();
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadClaims();
});
supabase.channel('user-my-claims-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'found_items' }, loadClaims)
    .subscribe();
