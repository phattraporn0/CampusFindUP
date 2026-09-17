import { supabase, requireRole } from './supabaseClient.js';

const itemList = document.getElementById('itemList');
const reviewPanel = document.getElementById('reviewPanel');
const latestItemsPanel = document.getElementById('latestItemsPanel');

function setReviewMode(visible) {
    if (reviewPanel) reviewPanel.hidden = !visible;
    if (latestItemsPanel) latestItemsPanel.hidden = visible;
}

setReviewMode(false);
let currentFilter = 'all';

function escapeHtml(value) {
    return String(value ?? '-').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

function statusText(status) {
    return {
        waiting: 'รอยืนยันการรับฝาก',
        claimed: 'รอส่งคืนเจ้าของ',
        claim_verified: 'รอส่งคืนเจ้าของ',
        returned: 'ส่งคืนแล้ว',
        claim_locked: 'รอ Admin ตรวจสอบ'
    }[status] || 'ไม่ทราบสถานะ';
}

function openDetail(id) {
    window.location.href = `admin-item-detail.html?id=${encodeURIComponent(id)}`;
}

async function loadDashboard() {
    let { data: items, error } = await supabase
        .from('found_items')
        .select('id, category, description, location, image_url, status, claim_attempts, created_at')
        .order('created_at', { ascending: false });

    // Keep the dashboard readable while an older database is being migrated.
    if (error && /claim_attempts/i.test(error.message || '')) {
        ({ data: items, error } = await supabase
            .from('found_items')
            .select('id, category, description, location, image_url, status, created_at')
            .order('created_at', { ascending: false }));
    }

    if (error) {
        itemList.innerHTML = `<p class="empty">โหลดข้อมูลไม่สำเร็จ: ${escapeHtml(error.message)}</p>`;
        const reviewList = document.getElementById('reviewList');
        if (reviewList) reviewList.innerHTML = '<p class="empty">ไม่สามารถโหลดรายการตรวจสอบได้</p>';
        return;
    }

    const counts = items.reduce((result, item) => {
        result[item.status] = (result[item.status] || 0) + 1;
        return result;
    }, {});

    document.getElementById('waitingCount').textContent = counts.waiting || 0;
    document.getElementById('verifiedCount').textContent = (counts.claim_verified || 0) + (counts.claimed || 0);
    document.getElementById('returnedCount').textContent = counts.returned || 0;
    document.getElementById('reviewCount').textContent = items.filter((item) => item.status === 'claim_locked' || Number(item.claim_attempts || 0) >= 3).length;
    document.getElementById('totalCount').textContent = items.length;

    const lockedItems = items.filter((item) => item.status === 'claim_locked'
        || Number(item.claim_attempts || 0) >= 3);
    const reviewList = document.getElementById('reviewList');
    if (reviewList) {
        reviewList.innerHTML = lockedItems.length
            ? lockedItems.map((item) => `
                <article class="row review-row">
                    <div>
                        <strong>${escapeHtml(item.description || 'ไม่ระบุรายละเอียด')}</strong><br>
                        <small>เจ้าของตอบผิดครบ 3 ครั้ง · ${escapeHtml(item.category || '')}</small>
                    </div>
                    <button class="action-btn view-btn" data-review-id="${item.id}">ตรวจสอบคำตอบ</button>
                </article>
            `).join('')
            : '<p class="empty">ไม่มีรายการที่รอ Admin ตรวจสอบ</p>';

        reviewList.querySelectorAll('[data-review-id]').forEach((button) => {
            button.addEventListener('click', () => openDetail(button.dataset.reviewId));
        });
    }

    const visibleItems = items.filter((item) => currentFilter === 'all'
        || (currentFilter === 'claimed' && ['claimed', 'claim_verified'].includes(item.status))
        || (currentFilter === 'review' && (item.status === 'claim_locked' || Number(item.claim_attempts || 0) >= 3))
        || item.status === currentFilter);

    itemList.innerHTML = visibleItems.length
        ? visibleItems.map((item) => `
            <article class="row">
                <div>${item.image_url
                    ? `<img src="${escapeHtml(item.image_url)}" alt="รูปสิ่งของ">`
                    : '<div class="placeholder">ไม่มีรูป</div>'}</div>
                <div>
                    <strong>${escapeHtml(item.description || 'ไม่ระบุรายละเอียด')}</strong><br>
                    <small>${escapeHtml(item.category || '')} · ${escapeHtml(item.location || '')}</small>
                </div>
                <span class="tag">${escapeHtml(statusText(item.status))}</span>
                <div class="row-actions">
                    <button class="action-btn view-btn" data-action="view" data-id="${item.id}">ดูรายละเอียด</button>
                    <button class="action-btn delete-btn" data-action="delete" data-id="${item.id}">ลบ</button>
                </div>
            </article>
        `).join('')
        : '<p class="empty">ไม่มีรายการในหมวดนี้</p>';
}

[['waitingCount', 'waiting'], ['verifiedCount', 'claimed'], ['returnedCount', 'returned'], ['reviewCount', 'review'], ['totalCount', 'all']]
    .forEach(([id, status]) => {
        const card = document.getElementById(id)?.closest('.stat');
        card?.classList.add('stat-link');
        card?.addEventListener('click', () => {
            document.querySelectorAll('.stats .stat').forEach((stat) => stat.classList.remove('stat-active'));
            card.classList.add('stat-active');
            currentFilter = status;
            setReviewMode(status === 'review');
            loadDashboard();
        });
    });

document.getElementById('totalCount')?.closest('.stat')?.classList.add('stat-active');

itemList.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;

    if (action === 'view') {
        openDetail(id);
        return;
    }

    if (!confirm('ต้องการลบรายการนี้ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้')) return;
    button.disabled = true;
    const { error } = await supabase.from('found_items').delete().eq('id', id);
    if (error) {
        alert(`ลบไม่สำเร็จ: ${error.message}`);
        button.disabled = false;
        return;
    }
    await loadDashboard();
});

document.getElementById('logoutButton')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

const access = await requireRole(['admin']);
if (access) {
    await loadDashboard();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) loadDashboard();
    });
    supabase.channel('admin-found-items-sync-root')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'found_items' }, loadDashboard)
        .subscribe();
}
