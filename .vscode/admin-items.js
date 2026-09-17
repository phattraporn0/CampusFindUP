// // ========================================
// // ADMIN ITEMS
// // ข้อมูลจำลองเฉพาะ Admin
// // ========================================

// const items = JSON.parse(
//     localStorage.getItem("adminItems")
// ) || [];


// // ========================================
// // ELEMENTS
// // ========================================

// const itemList =
//     document.getElementById("itemList");

// const searchInput =
//     document.getElementById("searchInput");

// const itemCount =
//     document.getElementById("itemCount");


// // ========================================
// // STATUS TEXT
// // ========================================

// function getStatusText(status) {

//     if (status === "waiting") {
//         return "รอเจ้าของยืนยัน";
//     }

//     if (status === "return") {
//         return "รอการส่งมอบ";
//     }

//     if (status === "delivered") {
//         return "ส่งคืนแล้ว";
//     }

//     return "ไม่ทราบสถานะ";

// }


// // ========================================
// // RENDER
// // ========================================

// function renderItems(keyword = "") {

//     itemList.innerHTML = "";

//     const filteredItems = items.filter(item => {

//         const text = `
//             ${item.id || ""}
//             ${item.itemName || ""}
//             ${item.category || ""}
//             ${item.location || ""}
//         `.toLowerCase();

//         return text.includes(
//             keyword.toLowerCase()
//         );

//     });


//     itemCount.textContent =
//         filteredItems.length;


//     if (filteredItems.length === 0) {

//         itemList.innerHTML = `

//             <div class="empty-state">

//                 <i class="fa-regular fa-folder-open"></i>

//                 <h3>
//                     ไม่พบรายการสิ่งของ
//                 </h3>

//                 <p>
//                     ลองค้นหาด้วยรหัสหรือชื่อสิ่งของอื่น
//                 </p>

//             </div>

//         `;

//         return;

//     }


//     filteredItems.forEach(item => {

//         const card =
//             document.createElement("div");

//         card.className =
//             "item-card";


//         card.innerHTML = `

//             <div class="item-image">

//                 <i class="fa-solid fa-box"></i>

//             </div>


//             <div class="item-info">

//                 <span class="item-code">

//                     ${item.id || "-"}

//                 </span>

//                 <h3>

//                     ${item.itemName || "ไม่ระบุชื่อสิ่งของ"}

//                 </h3>

//                 <div class="item-detail">

//                     หมวดหมู่:
//                     ${item.category || "-"}

//                 </div>

//                 <div class="item-detail">

//                     <i class="fa-solid fa-location-dot"></i>

//                     ${item.location || "ไม่ระบุสถานที่"}

//                 </div>

//                 <div class="item-detail">

//                     ${item.date || "-"}
//                     ${item.time || ""}

//                 </div>

//             </div>


//             <div class="item-status">

//                 <span class="status ${item.status || ""}">

//                     ${getStatusText(item.status)}

//                 </span>

//             </div>


//             <div class="item-action">

//                 <button
//                     class="detail-btn"
//                     onclick="openAdminItemDetail('${item.id}')">

//                     ดูรายละเอียด

//                 </button>

//             </div>

//         `;


//         itemList.appendChild(card);

//     });

// }


// // ========================================
// // OPEN ADMIN ITEM DETAIL
// // ========================================

// function openAdminItemDetail(id) {

//     localStorage.setItem(
//         "adminSelectedItemId",
//         id
//     );

//     window.location.href =
//         "admin-item-detail.html";

// }


// // ========================================
// // SEARCH
// // ========================================

// searchInput.addEventListener(
//     "input",
//     function () {

//         renderItems(this.value);

//     }
// );


// // ========================================
// // FIRST LOAD
// // ========================================

// renderItems();

import { supabase, requireRole } from '../supabaseClient.js';

requireRole(["admin"]);

const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("searchInput");
const itemCount = document.getElementById("itemCount");

let allItems = [];
const statusFilter = new URLSearchParams(window.location.search).get("status") || "all";

const filterTitles = {
    all: "รายการสิ่งของทั้งหมด",
    waiting: "รอยืนยันการรับฝาก",
    claimed: "รอส่งคืนเจ้าของ",
    returned: "ส่งคืนแล้ว",
};
const itemsTitle = document.getElementById("itemsTitle");
if (itemsTitle) itemsTitle.textContent = filterTitles[statusFilter] || filterTitles.all;

function getStatusText(status) {
    if (status === "waiting") return "รอยืนยันการรับฝาก";
    if (status === "claimed" || status === "claim_verified") return "รอส่งคืนเจ้าของ";
    if (status === "returned") return "ส่งคืนแล้ว";
    if (status === "claim_locked") return "ระงับการยืนยันแล้ว";
    return "ไม่ทราบสถานะ";
}

function escapeHtml(value) {
    return String(value ?? "-")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function loadItems() {
    const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("โหลดรายการไม่สำเร็จ:", error.message);
        return;
    }

    allItems = data;
    renderItems();
}

function renderItems(keyword = "") {
    itemList.innerHTML = "";

    const kw = keyword.toLowerCase();

    const filteredItems = allItems.filter((item) => {
        const matchesStatus = statusFilter === "all"
            || (statusFilter === "claimed" && ["claimed", "claim_verified"].includes(item.status))
            || item.status === statusFilter;
        if (!matchesStatus) return false;
        const text = `
            ${item.id || ""}
            ${item.description || ""}
            ${item.category || ""}
            ${item.location || ""}
        `.toLowerCase();
        return text.includes(kw);
    });

    itemCount.textContent = filteredItems.length;

    if (filteredItems.length === 0) {
        itemList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-folder-open"></i>
                <h3>ไม่พบรายการสิ่งของ</h3>
                <p>ลองค้นหาด้วยรหัสหรือชื่อสิ่งของอื่น</p>
            </div>
        `;
        return;
    }

    filteredItems.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
            <div class="item-image">
                ${item.image_url ? `<img src="${escapeHtml(item.image_url)}" style="width:100%;height:100%;object-fit:cover;">` : `<i class="fa-solid fa-box"></i>`}
            </div>
            <div class="item-info">
                <span class="item-code">${escapeHtml(item.id.slice(0, 8))}</span>
                <h3>${escapeHtml(item.description || "ไม่ระบุชื่อสิ่งของ")}</h3>
                <div class="item-detail">หมวดหมู่: ${escapeHtml(item.category || "-")}</div>
                <div class="item-detail"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.location || "ไม่ระบุสถานที่")}</div>
                <div class="item-detail">${escapeHtml(item.found_date || "-")} ${escapeHtml(item.found_time || "")}</div>
            </div>
            <div class="item-status">
                <span class="status ${item.status || ""}">${getStatusText(item.status)}</span>
            </div>
            <div class="item-action">
                <button class="detail-btn" data-action="view" data-id="${item.id}">ดูรายละเอียด</button>
                <button class="detail-btn danger-btn" data-action="delete" data-id="${item.id}">ลบ</button>
            </div>
        `;

        card.querySelectorAll(".detail-btn").forEach((button) => {
            button.addEventListener("click", () => handleItemAction(button.dataset.action, item.id, button));
        });

        itemList.appendChild(card);
    });
}

async function handleItemAction(action, id, button) {
    if (action === "view") {
        localStorage.setItem("adminSelectedItemId", id);
        window.location.href = `admin-item-detail.html?id=${encodeURIComponent(id)}`;
        return;
    }

    if (!confirm("ต้องการลบรายการนี้ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้")) return;
    button.disabled = true;
    const { error } = await supabase.from("found_items").delete().eq("id", id);
    if (error) {
        button.disabled = false;
        return alert(`ลบไม่สำเร็จ: ${error.message}`);
    }
    loadItems();
}

searchInput.addEventListener("input", function () {
    renderItems(this.value);
});

const initialSearch = new URLSearchParams(window.location.search).get("search");
if (initialSearch) searchInput.value = initialSearch;
loadItems();
