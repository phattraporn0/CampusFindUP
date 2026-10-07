import { supabase, requireRole } from './supabaseClient.js';

const itemList = document.getElementById('itemList');
const reviewPanel = document.getElementById('reviewPanel');
const latestItemsPanel = document.getElementById('latestItemsPanel');
const categoryList = document.getElementById('categoryList');
const categorySummary = document.getElementById('categorySummary');
const categoryFilterDescription = document.getElementById('categoryFilterDescription');
const itemsPanelTitle = document.getElementById('itemsPanelTitle');

function setReviewMode(visible) {
    if (reviewPanel) reviewPanel.hidden = !visible;
    if (latestItemsPanel) latestItemsPanel.hidden = visible;
}

setReviewMode(false);
let currentFilter = 'all';
let currentCategory = 'all';

// ใช้เฉพาะหมวดหมู่หลักชุดเดียวกับแบบฟอร์มปัจจุบันของระบบ
const standardCategories = [
    'กระเป๋าและสัมภาระ',
    'บัตรและเอกสาร',
    'อุปกรณ์อิเล็กทรอนิกส์',
    'กุญแจและอุปกรณ์ล็อก',
    'เครื่องแต่งกายและของใช้ส่วนตัว',
    'เครื่องเขียนและอุปกรณ์การเรียน',
    'อุปกรณ์กีฬา',
    'อื่น ๆ'
];
const legacyCategoryAliases = {
    'กระเป๋า': 'กระเป๋าและสัมภาระ',
    'บัตร': 'บัตรและเอกสาร',
    'กุญแจ': 'กุญแจและอุปกรณ์ล็อก',
    other: 'อื่น ๆ'
};

function categoryLabel(category) {
    const value = String(category || '').trim();
    return standardCategories.includes(value)
        ? value
        : (legacyCategoryAliases[value] || 'อื่น ๆ');
}

function matchesStatusFilter(item) {
    return currentFilter === 'all'
        || (currentFilter === 'claimed' && ['claimed', 'claim_verified'].includes(item.status))
        || (currentFilter === 'review' && (item.status === 'claim_locked' || Number(item.claim_attempts || 0) >= 3))
        || item.status === currentFilter;
}

function statusFilterLabel() {
    return {
        waiting: 'รอยืนยันการรับฝาก',
        claimed: 'รอส่งคืนเจ้าของ',
        returned: 'ส่งคืนแล้ว',
        review: 'รอ Admin ตรวจสอบ',
        all: 'ทั้งหมด'
    }[currentFilter] || 'ทั้งหมด';
}

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

function renderCategories(items) {
    if (!categoryList) return;

    const statusFilteredItems = items.filter(matchesStatusFilter);
    const categoryCounts = standardCategories.reduce((result, category) => {
        result[category] = 0;
        return result;
    }, {});
    statusFilteredItems.forEach((item) => {
        categoryCounts[categoryLabel(item.category)] += 1;
    });

    categoryList.innerHTML = [
        ['all', 'ทั้งหมด', statusFilteredItems.length],
        ...standardCategories.map((label) => [label, label, categoryCounts[label]])
    ].map(([value, label, count]) => `
        <button type="button" class="category-card${currentCategory === value ? ' category-active' : ''}"
                data-category="${escapeHtml(value)}">
            <span class="category-name">${escapeHtml(label)}</span>
            <strong>${count}</strong>
            <small>รายการ</small>
        </button>
    `).join('');

    if (categorySummary) {
        const selectedCount = currentCategory === 'all'
            ? statusFilteredItems.length
            : (categoryCounts[currentCategory] || 0);
        categorySummary.textContent = currentCategory === 'all'
            ? `ทั้งหมด ${selectedCount} รายการ`
            : `${currentCategory} · ${selectedCount} รายการ`;
    }
    if (categoryFilterDescription) {
        categoryFilterDescription.textContent = `จำนวนหมวดหมู่ตามสถานะ: ${statusFilterLabel()}`;
    }
}

async function loadDashboard() {
    let { data: items, error } = await supabase
        .from('found_items')
        .select('id, item_name, category, description, location, image_url, status, claim_attempts, created_at')
        .order('created_at', { ascending: false });

    // Keep the dashboard readable while an older database is being migrated.
    if (error && /claim_attempts|item_name/i.test(error.message || '')) {
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
    renderCategories(items);

    const lockedItems = items.filter((item) => matchesStatusFilter(item)
        && (item.status === 'claim_locked' || Number(item.claim_attempts || 0) >= 3)
        && (currentCategory === 'all' || categoryLabel(item.category) === currentCategory));
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

    const visibleItems = items.filter((item) =>
        (currentCategory === 'all' || categoryLabel(item.category) === currentCategory)
        && matchesStatusFilter(item));

    if (itemsPanelTitle) {
        itemsPanelTitle.textContent = currentCategory === 'all'
            ? 'รายการล่าสุด'
            : `รายการในหมวดหมู่ ${currentCategory}`;
    }

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

categoryList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    currentCategory = button.dataset.category || 'all';
    setReviewMode(currentFilter === 'review');
    loadDashboard();
});

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
