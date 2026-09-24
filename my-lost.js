import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['user']);

const list = document.getElementById('list');
const total = document.getElementById('total');
const categoryFilter = document.getElementById('categoryFilter');
let allPosts = [];

function escapeHtml(value) {
    return String(value ?? '-').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

async function loadLostPosts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: posts, error } = await supabase
        .from('lost_items')
        .select('id, category, item_name, description, details, location, lost_date, lost_time, image_url, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        list.innerHTML = `<div class="empty">โหลดรายการไม่สำเร็จ: ${escapeHtml(error.message)}</div>`;
        return;
    }

    allPosts = posts;
    renderPosts();
}

function renderPosts() {
    const posts = allPosts.filter((item) => !categoryFilter.value || categoryFilter.value === 'ทั้งหมด' || item.category === categoryFilter.value);
    total.textContent = `${posts.length} รายการ`;
    if (!posts.length) {
        list.innerHTML = '<div class="empty"><h2>ยังไม่มีรายการประกาศตามหา</h2><p>โพสต์ที่คุณแจ้งหายจะแสดงตรงนี้</p></div>';
        return;
    }

    list.innerHTML = posts.map((item) => `
        <article class="card" data-id="${item.id}" tabindex="0" role="button">
            <div class="photo">ไม่แสดงรูปภาพ</div>
            <div class="info">
                <span class="status">กำลังตามหา</span>
                <small>${escapeHtml(item.category || 'สิ่งของ')}</small>
                <h2>${escapeHtml(item.item_name || 'ไม่ระบุชื่อสิ่งของ')}</h2>
                <p>รายละเอียด: ${escapeHtml(item.description || '-')}</p>
                <p>สถานที่หาย: ${escapeHtml(item.location || '-')}</p>
                <p>วันที่หาย: ${escapeHtml(item.lost_date || '-')} ${escapeHtml(item.lost_time || '')}</p>
            </div>
        </article>
    `).join('');

    list.querySelectorAll('[data-id]').forEach((card) => {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-post-btn';
        deleteButton.dataset.deleteId = card.dataset.id;
        deleteButton.textContent = 'ลบโพสต์';
        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            if (!confirm('ต้องการลบโพสต์แจ้งหายนี้ใช่หรือไม่?')) return;
            deleteButton.disabled = true;
            const { error } = await supabase.from('lost_items').delete().eq('id', card.dataset.id);
            if (error) {
                deleteButton.disabled = false;
                alert(`ลบโพสต์ไม่สำเร็จ: ${error.message}`);
                return;
            }
            allPosts = allPosts.filter((item) => item.id !== card.dataset.id);
            renderPosts();
        });
        card.querySelector('.info')?.appendChild(deleteButton);
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'edit-post-btn';
        editButton.textContent = 'แก้ไขโพสต์';
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            window.location.href = `report-lost.html?edit_id=${encodeURIComponent(card.dataset.id)}`;
        });
        card.querySelector('.info')?.appendChild(editButton);
        const open = () => {
            localStorage.setItem('selectedLostItemId', card.dataset.id);
            window.location.href = `my-lost-detail.html?id=${encodeURIComponent(card.dataset.id)}`;
        };
        card.addEventListener('click', open);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') open();
        });
    });
}

await loadLostPosts();
categoryFilter.addEventListener('change', renderPosts);
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadLostPosts();
});
supabase.channel('user-my-lost-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_items' }, loadLostPosts)
    .subscribe();
