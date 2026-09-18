// // // ==========================
// // // Search
// // // ==========================

// // const searchInput = document.getElementById("searchInput");

// // if (searchInput) {
// //     searchInput.addEventListener("keyup", function () {
// //         const keyword = this.value.toLowerCase();

// //         console.log("ค้นหา :", keyword);

// //         // ภายหลังจะใช้ค้นหาข้อมูลจากการ์ดหรือฐานข้อมูล
// //     });
// // }

// // // ==========================
// // // Category
// // // ==========================

// // const categoryButtons = document.querySelectorAll(".category button");

// // categoryButtons.forEach(button => {

// //     button.addEventListener("click", () => {

// //         categoryButtons.forEach(btn => {
// //             btn.classList.remove("active");
// //         });

// //         button.classList.add("active");

// //         console.log("หมวด :", button.innerText);

// //     });

// // });



// // // ==========================
// // // Profile
// // // ==========================

// // const profile = document.querySelector(".profile");

// // if (profile) {

// //     profile.addEventListener("click", () => {

// //         window.location.href = "profile.html";

// //     });

// // }
// // const reportFoundBtn = document.getElementById("reportFoundBtn");

// // if (reportFoundBtn) {

// //     reportFoundBtn.addEventListener("click", function () {

// //         window.location.href = "report-found.html";

// //     });

// // }
// // const reportLostBtn = document.getElementById("reportLostBtn");

// // if (reportLostBtn) {

// //     reportLostBtn.addEventListener("click", function () {

// //         window.location.href = "report-lost.html";

// //     });

// // }

// // // ==========================
// // // ข้อมูลจำลองสิ่งของ
// // // ==========================

// // const lostItems = [
// //     {
// //         id: 1,
// //         name: "กระเป๋าเป้สีดำ",
// //         category: "กระเป๋า",
// //         location: "ป้อมยาม ประตู 2",
// //         date: "12 พฤศจิกายน 2566",
// //         time: "14:30 น."
// //     },

// //     {
// //         id: 2,
// //         name: "บัตรประจำตัวนักศึกษา",
// //         category: "บัตร",
// //         location: "ตึกวิศวกรรมศาสตร์",
// //         date: "12 พฤศจิกายน 2566",
// //         time: "16:45 น."
// //     }
// // ];


// // // ==========================
// // // แสดงรายการสิ่งของ
// // // ==========================

// // const itemsContainer = document.querySelector(".items-container");
// // const totalItem = document.querySelector(".total-item");

// // if (itemsContainer) {

// //     itemsContainer.innerHTML = "";

// //     lostItems.forEach(function (item) {

// //         const card = document.createElement("div");

// //         card.className = "item-card";

// //         card.innerHTML = `

// //             <div class="item-image">

// //                 <span>PHOTO</span>

// //             </div>

// //             <div class="item-info">

// //                 <div class="item-top">

// //                     <span class="item-category">
// //                         ${item.category}
// //                     </span>

// //                     <span class="item-time">
// //                         <i class="fa-regular fa-clock"></i>
// //                         ${item.time}
// //                     </span>

// //                 </div>

// //                 <h3>
// //                     ${item.name}
// //                 </h3>

// //                 <p class="item-location">

// //                     <i class="fa-solid fa-location-dot"></i>

// //                     ${item.location}

// //                 </p>

// //             </div>

// //         `;

// //         // ==========================
// //         // กดการ์ด
// //         // ==========================

// //         card.addEventListener("click", function () {

// //             // เก็บข้อมูลสิ่งของที่เลือก
// //             localStorage.setItem(
// //                 "selectedLostItem",
// //                 JSON.stringify(item)
// //             );

// //             // ไปหน้ารายละเอียด
// //             window.location.href = "lost-item-detail.html";

// //         });

// //         itemsContainer.appendChild(card);

// //     });

// // }


// // // ==========================
// // // จำนวนรายการ
// // // ==========================

// // if (totalItem) {

// //     totalItem.textContent =
// //         `${lostItems.length} รายการ`;

// // }
// import { supabase, requireLogin } from './supabaseClient.js';

// requireLogin();

// // ==========================
// // Profile / Nav buttons (เหมือนเดิม)
// // ==========================

// const profile = document.querySelector(".profile");
// if (profile) {
//     profile.addEventListener("click", () => { window.location.href = "profile.html"; });
// }

// const reportFoundBtn = document.getElementById("reportFoundBtn");
// if (reportFoundBtn) {
//     reportFoundBtn.addEventListener("click", function () {
//         window.location.href = "report-found.html";
//     });
// }

// const reportLostBtn = document.getElementById("reportLostBtn");
// if (reportLostBtn) {
//     reportLostBtn.addEventListener("click", function () {
//         window.location.href = "report-lost.html";
//     });
// }

// // ==========================
// // ดึงข้อมูลจาก Supabase (found_items_public — ไม่มีคำตอบลับติดมาด้วย)
// // ==========================

// let allItems = [];
// let activeCategory = "ทั้งหมด";

// const itemsContainer = document.querySelector(".items-container");
// const totalItem = document.querySelector(".total-item");

// async function loadItems() {
//     const { data, error } = await supabase
//         .from("found_items_public")
//         .select("*")
//         .eq("status", "waiting")
//         .order("created_at", { ascending: false });

//     if (error) {
//         console.error("โหลดรายการไม่สำเร็จ:", error.message);
//         return;
//     }

//     allItems = data;
//     renderItems();
// }

// function renderItems() {
//     if (!itemsContainer) return;

//     const keyword = (searchInput?.value || "").trim().toLowerCase();

//     const filtered = allItems.filter((item) => {
//         const matchCategory =
//             activeCategory === "ทั้งหมด" || item.category === activeCategory;

//         const matchKeyword =
//             keyword === "" ||
//             item.description?.toLowerCase().includes(keyword) ||
//             item.category?.toLowerCase().includes(keyword) ||
//             item.location?.toLowerCase().includes(keyword);

//         return matchCategory && matchKeyword;
//     });

//     itemsContainer.innerHTML = "";

//     if (filtered.length === 0) {
//         itemsContainer.innerHTML = `
//             <div class="empty-state">
//                 <div class="empty-icon"><i class="fa-regular fa-folder-open"></i></div>
//                 <h3>ไม่พบรายการที่ตรงกัน</h3>
//                 <p>ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
//             </div>
//         `;
//     } else {
//         filtered.forEach((item) => {
//             const card = document.createElement("div");
//             card.className = "item-card";
//             card.innerHTML = `
//                 <div class="item-image">
//                     ${item.image_url
//                         ? `<img src="${item.image_url}" alt="${item.category}" style="width:100%;height:100%;object-fit:cover;">`
//                         : `<span>PHOTO</span>`}
//                 </div>
//                 <div class="item-info">
//                     <div class="item-top">
//                         <span class="item-category">${item.category}</span>
//                         <span class="item-time"><i class="fa-regular fa-clock"></i> ${item.found_time || ""}</span>
//                     </div>
//                     <h3>${item.description}</h3>
//                     <p class="item-location"><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
//                 </div>
//             `;

//             card.addEventListener("click", function () {
//                 // เก็บแค่ id ไว้ แล้วให้หน้ารายละเอียดไปดึงข้อมูลสดจาก Supabase เอง
//                 localStorage.setItem("selectedFoundItemId", item.id);
//                 window.location.href = "lost-item-detail.html";
//             });

//             itemsContainer.appendChild(card);
//         });
//     }

//     if (totalItem) totalItem.textContent = `${filtered.length} รายการ`;
// }

// // ==========================
// // Search
// // ==========================

// const searchInput = document.getElementById("searchInput");
// if (searchInput) {
//     searchInput.addEventListener("keyup", renderItems);
// }

// // ==========================
// // Category
// // ==========================

// const categoryButtons = document.querySelectorAll(".category-list .category-btn");
// categoryButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//         categoryButtons.forEach((btn) => btn.classList.remove("active"));
//         button.classList.add("active");
//         activeCategory = button.textContent.trim();
//         renderItems();
//     });
// });

// loadItems();

import { supabase, requireRole } from './supabaseClient.js';

requireRole(["user"]);

// ==========================
// Profile / Nav buttons (เหมือนเดิม)
// ==========================

const profile = document.querySelector(".profile");
if (profile) {
    profile.addEventListener("click", () => { window.location.href = "profile.html"; });
}

const reportFoundBtn = document.getElementById("reportFoundBtn");
if (reportFoundBtn) {
    reportFoundBtn.addEventListener("click", function () {
        window.location.href = "report-found.html";
    });
}

const reportLostBtn = document.getElementById("reportLostBtn");
if (reportLostBtn) {
    reportLostBtn.addEventListener("click", function () {
        window.location.href = "report-lost.html";
    });
}

// ==========================
// ดึงข้อมูลจาก Supabase (found_items_public — ไม่มีคำตอบลับติดมาด้วย)
// ==========================

let allItems = [];
let ownFoundIds = new Set();
let currentUserId = null;
let activeCategory = "ทั้งหมด";

const itemsContainer = document.getElementById("allItemsContainer");
const totalItem = document.getElementById("allItemsTotal");

async function loadItems() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id || null;
    if (user) {
        const { data: ownItems } = await supabase.from('found_items').select('id').eq('reporter_id', user.id);
        ownFoundIds = new Set((ownItems || []).map((item) => item.id));
    }
    const { data, error } = await supabase
        .from("found_items_public")
        .select("*")
        .in("status", ["waiting", "claimed", "claim_verified", "returned"])
        .order("created_at", { ascending: false });

    if (error) {
        console.error("โหลดรายการไม่สำเร็จ:", error.message);
        return;
    }

    allItems = data.map((item) => ({ ...item, isMine: ownFoundIds.has(item.id) }));
    renderItems();
}

function renderItems() {
    if (!itemsContainer) return;

    const keyword = (searchInput?.value || "").trim().toLowerCase();

    const filtered = allItems.filter((item) => {
        const matchCategory =
            activeCategory === "ทั้งหมด" || item.category === activeCategory;

        const matchKeyword =
            keyword === "" ||
            item.description?.toLowerCase().includes(keyword) ||
            item.category?.toLowerCase().includes(keyword) ||
            item.location?.toLowerCase().includes(keyword);

        return matchCategory && matchKeyword;
    });

    itemsContainer.innerHTML = "";

    if (filtered.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-regular fa-folder-open"></i></div>
                <h3>ไม่พบรายการที่ตรงกัน</h3>
                <p>ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
            </div>
        `;
    } else {
        filtered.slice(0, 6).forEach((item) => {
            const card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
                <div class="item-image">
                    ${item.image_url
                        ? `<img src="${item.image_url}" alt="${item.category}" style="width:100%;height:100%;object-fit:cover;">`
                        : `<span>PHOTO</span>`}
                </div>
                <div class="item-info">
                    <div class="item-top">
                        <span class="item-category">${item.category}</span>
                        <span class="item-time"><i class="fa-regular fa-clock"></i> ${item.found_time || ""}</span>
                    </div>
                    <h3>${item.description}</h3>
                    <p class="item-location"><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
                    <p class="item-status">${item.status === 'claim_verified' ? 'รอส่งคืนเจ้าของ' : item.status === 'returned' ? 'ส่งคืนแล้ว' : item.status === 'claimed' ? 'พร้อมให้ยืนยันความเป็นเจ้าของ' : 'รอยืนยันการรับฝาก'}</p>
                </div>
            `;

            if (item.isMine) {
                const actions = document.createElement('div');
                actions.className = 'post-actions';
                actions.innerHTML = '<button type="button" class="edit-post-btn">แก้ไข</button><button type="button" class="delete-post-btn">ลบ</button>';
                actions.querySelector('.edit-post-btn').addEventListener('click', (event) => {
                    event.stopPropagation();
                    window.location.href = `report-found.html?edit_id=${encodeURIComponent(item.id)}`;
                });
                actions.querySelector('.delete-post-btn').addEventListener('click', async (event) => {
                    event.stopPropagation();
                    if (!confirm('ต้องการลบโพสต์แจ้งพบนี้ใช่หรือไม่?')) return;
                    const { error: deleteError } = await supabase.from('found_items').delete().eq('id', item.id).eq('reporter_id', currentUserId);
                    if (deleteError) return alert(`ลบโพสต์ไม่สำเร็จ: ${deleteError.message}`);
                    allItems = allItems.filter((entry) => entry.id !== item.id);
                    renderItems();
                });
                card.querySelector('.item-info')?.appendChild(actions);
            }

            card.addEventListener("click", function () {
                // เก็บแค่ id ไว้ แล้วให้หน้ารายละเอียดไปดึงข้อมูลสดจาก Supabase เอง
                localStorage.setItem("selectedFoundItemId", item.id);
                window.location.href = "lost-item-detail.html";
            });

            itemsContainer.appendChild(card);
        });
    }

    if (totalItem) totalItem.textContent = `${filtered.length} รายการ`;
}

// ==========================
// Search
// ==========================

const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", renderItems);
}

// ==========================
// Category
// ==========================

const categoryButtons = document.querySelectorAll(".category-list .category-btn");
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        categoryButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.textContent.trim();
        renderItems();
        loadMyLostItems();
        loadAllLostItems();
    });
});

loadItems();

function escapeClaimHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
}

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.querySelector(".navbar > .nav-right");
if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
        const opened = mobileNav.classList.toggle("mobile-open");
        mobileMenuBtn.setAttribute("aria-expanded", String(opened));
        mobileMenuBtn.innerHTML = opened
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
}

document.getElementById('myClaimsNavBtn')?.addEventListener('click', () => {
    window.location.href = 'my-claims.html';
});

document.getElementById('myLostNavBtn')?.addEventListener('click', () => {
    window.location.href = 'my-lost.html';
});

function claimStatusText(status) {
    return status === 'returned' ? 'ส่งคืนแล้ว' : 'รอส่งคืนเจ้าของ';
}

async function loadMyClaims() {
    const container = document.getElementById('myClaimsContainer');
    const total = document.getElementById('myClaimsTotal');
    if (!container) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: claims, error } = await supabase
        .from('found_items')
        .select('id, item_name, category, description, location, image_url, status, claim_token, claim_expires_at, claimed_at, returned_at')
        .eq('claimant_id', user.id)
        .in('status', ['claim_verified', 'returned'])
        .order('claimed_at', { ascending: false });

    if (error) {
        container.innerHTML = `<div class="empty-state"><h3>โหลดรายการเคลมไม่สำเร็จ</h3><p>${escapeClaimHtml(error.message)}</p></div>`;
        return;
    }

    if (total) total.textContent = `${claims.length} รายการ`;
    if (!claims.length) {
        container.innerHTML = '<div class="empty-state"><h3>ยังไม่มีรายการที่เคลม</h3><p>เมื่อยืนยันความเป็นเจ้าของสำเร็จ รายการจะแสดงตรงนี้</p></div>';
        return;
    }

    container.innerHTML = claims.map((item) => `
        <article class="item-card my-claim-card">
            <div class="item-image">
                ${item.image_url ? `<img src="${escapeClaimHtml(item.image_url)}" alt="รูปสิ่งของ" style="width:100%;height:100%;object-fit:cover;">` : '<span>PHOTO</span>'}
            </div>
            <div class="item-info">
                    <strong class="claim-item-name">${escapeClaimHtml(item.item_name || item.category || 'สิ่งของ')}</strong>
                <div class="item-top"><span class="item-category">${escapeClaimHtml(item.category)}</span><span class="item-time">${claimStatusText(item.status)}</span></div>
                <h3>${escapeClaimHtml(item.description || 'ไม่ระบุรายละเอียด')}</h3>
                <p class="item-location">${escapeClaimHtml(item.location || '')}</p>
                <button class="claim-detail-btn" data-claim-id="${item.id}" data-claim-token="${escapeClaimHtml(item.claim_token)}" data-claim-expiry="${escapeClaimHtml(item.claim_expires_at)}">ดูรายละเอียดและ QR Code</button>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('.my-claim-card').forEach((card, index) => {
        if (claims[index]?.status === 'returned') {
            card.querySelector('.claim-detail-btn')?.remove();
            const done = document.createElement('p');
            done.textContent = 'รับของคืนเรียบร้อยแล้ว';
            done.style.cssText = 'margin:10px 0 0;color:#15803d;font-weight:600;';
            card.appendChild(done);
        }
    });

    container.querySelectorAll('[data-claim-id]').forEach((button) => {
        button.addEventListener('click', () => {
            localStorage.setItem('claimToken', button.dataset.claimToken || '');
            localStorage.setItem('claimQrExpiresAt', button.dataset.claimExpiry || '');
            window.location.href = `claim-success.html?item_id=${encodeURIComponent(button.dataset.claimId)}`;
        });
    });
}

loadMyClaims();
window.addEventListener('pageshow', loadMyClaims);
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadMyClaims();
});
supabase.channel('user-claimed-items-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'found_items' }, loadMyClaims)
    .subscribe();

async function loadMyLostItems() {
    const container = document.getElementById('myLostContainer');
    const total = document.getElementById('myLostTotal');
    if (!container) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: lostItems, error } = await supabase
        .from('lost_items')
        .select('id, category, item_name, description, location, lost_date, lost_time, image_url, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<div class="empty-state"><h3>โหลดรายการแจ้งของหายไม่สำเร็จ</h3><p>${escapeClaimHtml(error.message)}</p></div>`;
        return;
    }

    const visibleLostItems = lostItems.filter((item) => activeCategory === 'ทั้งหมด' || item.category === activeCategory);
    total.textContent = `${visibleLostItems.length} รายการ`;
    if (!visibleLostItems.length) {
        container.innerHTML = '<div class="empty-state"><h3>ยังไม่มีรายการแจ้งของหาย</h3><p>รายการที่คุณแจ้งจะแสดงตรงนี้</p></div>';
        return;
    }

    container.innerHTML = visibleLostItems.map((item) => `
        <article class="item-card my-lost-card" data-lost-id="${item.id}" role="button" tabindex="0">
            <div class="item-image">
                ${item.image_url ? `<img src="${escapeClaimHtml(item.image_url)}" alt="รูปของที่หาย" style="width:100%;height:100%;object-fit:cover;">` : '<span>PHOTO</span>'}
            </div>
            <div class="item-info">
                <div class="item-top"><span class="item-category">${escapeClaimHtml(item.category || 'สิ่งของ')}</span><span class="item-time">กำลังตามหา</span></div>
                <h3>${escapeClaimHtml(item.item_name || item.description || 'ไม่ระบุชื่อสิ่งของ')}</h3>
                <p class="item-location">รายละเอียด: ${escapeClaimHtml(item.description || '-')}</p>
                <p class="item-location">สถานที่หาย: ${escapeClaimHtml(item.location || '-')}</p>
                <p class="item-location">วันที่หาย: ${escapeClaimHtml(item.lost_date || '-')} ${escapeClaimHtml(item.lost_time || '')}</p>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('[data-lost-id]').forEach((card) => {
        const openDetail = () => {
            localStorage.setItem('selectedLostItemId', card.dataset.lostId);
            window.location.href = `my-lost-detail.html?id=${encodeURIComponent(card.dataset.lostId)}`;
        };
        card.addEventListener('click', openDetail);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') openDetail();
        });
    });
}

async function loadAllLostItems() {
    const container = document.getElementById('allLostContainer');
    const total = document.getElementById('allLostTotal');
    if (!container) return;

    const { data: posts, error } = await supabase
        .from('lost_items')
        .select('id, category, item_name, description, location, lost_date, lost_time, image_url, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<div class="empty-state"><h3>โหลดรายการประกาศตามหาไม่สำเร็จ</h3><p>${escapeClaimHtml(error.message)}</p></div>`;
        return;
    }

    const visiblePosts = (posts || []).filter((item) => activeCategory === 'ทั้งหมด' || item.category === activeCategory);
    total.textContent = `${visiblePosts.length} รายการ`;
    if (!visiblePosts.length) {
        container.innerHTML = '<div class="empty-state"><h3>ยังไม่มีรายการประกาศตามหา</h3><p>เมื่อมีผู้แจ้งของหาย รายการจะแสดงตรงนี้</p></div>';
        return;
    }

    container.innerHTML = visiblePosts.slice(0, 6).map((item) => `
        <article class="item-card public-lost-card" data-public-lost-id="${item.id}" role="button" tabindex="0">
            <div class="item-image">${item.image_url ? `<img src="${escapeClaimHtml(item.image_url)}" alt="รูปของที่หาย" style="width:100%;height:100%;object-fit:cover;">` : '<span>PHOTO</span>'}</div>
            <div class="item-info">
                <div class="item-top"><span class="item-category">${escapeClaimHtml(item.category || 'สิ่งของ')}</span><span class="item-time">กำลังตามหา</span></div>
                <h3>${escapeClaimHtml(item.item_name || 'ไม่ระบุชื่อสิ่งของ')}</h3>
                <p class="item-location">รายละเอียด: ${escapeClaimHtml(item.description || '-')}</p>
                <p class="item-location">สถานที่หาย: ${escapeClaimHtml(item.location || '-')}</p>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('[data-public-lost-id]').forEach((card) => {
        const open = () => { window.location.href = `lost-post-detail.html?id=${encodeURIComponent(card.dataset.publicLostId)}`; };
        card.addEventListener('click', open);
        card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') open(); });
    });
}

loadMyLostItems();
loadAllLostItems();
window.addEventListener('pageshow', loadMyLostItems);
window.addEventListener('pageshow', loadAllLostItems);
supabase.channel('user-lost-items-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_items' }, loadMyLostItems)
    .subscribe();
supabase.channel('all-lost-items-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_items' }, loadAllLostItems)
    .subscribe();

function automatchScore(lost, found) {
    const normalize = (value) => String(value || '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
    const lostText = normalize(`${lost.item_name} ${lost.description} ${lost.details}`);
    const foundText = normalize(`${found.item_name} ${found.description}`);
    const lostLocation = normalize(lost.location);
    const foundLocation = normalize(found.location);
    let score = 0;
    if (lost.category && found.category && normalize(lost.category) === normalize(found.category)) score += 35;
    if (lostText && foundText && (lostText.includes(foundText) || foundText.includes(lostText))) score += 45;
    else if (lostText && foundText && [...lostText].some((char) => foundText.includes(char))) score += 15;
    if (lostLocation && foundLocation && (lostLocation.includes(foundLocation) || foundLocation.includes(lostLocation))) score += 15;
    if (lost.lost_date && found.found_date && lost.lost_date === found.found_date) score += 5;
    return score;
}

async function loadMatchNotifications() {
    const panel = document.getElementById('notificationPanel');
    const list = document.getElementById('notificationList');
    const count = document.getElementById('notificationCount');
    if (!panel || !list) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: lostItems }, { data: foundItems }] = await Promise.all([
        supabase.from('lost_items').select('id,item_name,description,details,category,location,lost_date').eq('user_id', user.id),
        loadPublicFoundMatches()
    ]);

    const matches = [];
    (lostItems || []).forEach((lost) => {
        const best = (foundItems || [])
            .map((found) => ({ found, score: automatchScore(lost, found) }))
            .sort((a, b) => b.score - a.score)[0];
        if (best && best.score >= 35) matches.push({ lost, ...best });
    });

    count.hidden = !matches.length;
    count.textContent = String(matches.length);
    list.innerHTML = matches.length ? matches.map(({ lost, found }) => `
        <button type="button" data-match-id="${found.id}" style="display:block;width:100%;border:0;background:#f8fafc;border-radius:10px;padding:10px;margin-top:8px;text-align:left;cursor:pointer;">
            <strong>นี่อาจจะเป็นสิ่งของที่คุณกำลังตามหาอยู่หรือเปล่า?</strong><br>
            <small>${escapeClaimHtml(found.description || 'รายการที่อาจตรงกัน')} · ${escapeClaimHtml(lost.item_name || 'ของที่คุณแจ้งหาย')}</small>
        </button>
    `).join('') : '<p style="color:#64748b;margin-bottom:0;">ยังไม่มีรายการที่ตรงกัน</p>';

    list.querySelectorAll('[data-match-id]').forEach((button) => {
        const note = document.createElement('small');
        note.textContent = 'หากรายการนี้ยังไม่ได้รับฝาก กรุณารอเจ้าหน้าที่รักษาความปลอดภัยอนุมัติก่อนจึงจะเคลมได้';
        note.style.cssText = 'display:block;margin-top:6px;color:#b45309;line-height:1.45;';
        button.appendChild(note);
    });
    list.querySelectorAll('[data-match-id]').forEach((button) => button.addEventListener('click', () => {
        localStorage.setItem('selectedFoundItemId', button.dataset.matchId);
        window.location.href = 'lost-item-detail.html';
    }));
}

async function loadPublicFoundMatches() {
    let result = await supabase.from('found_items_public')
        .select('id,item_name,description,category,location,found_date,image_url,status')
        .in('status', ['waiting', 'claimed']);
    if (result.error && /item_name/i.test(result.error.message || '')) {
        result = await supabase.from('found_items_public')
            .select('id,description,category,location,found_date,image_url,status')
            .in('status', ['waiting', 'claimed']);
    }
    return result;
}

document.getElementById('notificationBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('notificationPanel');
    if (panel) panel.hidden = !panel.hidden;
});
document.addEventListener('click', (event) => {
    const panel = document.getElementById('notificationPanel');
    const button = document.getElementById('notificationBtn');
    if (panel && !panel.hidden && !panel.contains(event.target) && !button?.contains(event.target)) panel.hidden = true;
});
loadMatchNotifications();
supabase.channel('user-automatch-notifications')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'found_items' }, loadMatchNotifications)
    .subscribe();
