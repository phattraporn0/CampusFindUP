// // ========================================
// // DATA
// // ========================================

// // ดึงข้อมูลจาก localStorage
// let waitingItems =
//     JSON.parse(localStorage.getItem("guardWaitingItems")) || [];

// let returnItems =
//     JSON.parse(localStorage.getItem("guardReturnItems")) || [];


// // ========================================
// // ตัวอย่างข้อมูลจำลอง
// // ========================================

// if (waitingItems.length === 0) {

//     waitingItems = [

//         {
//             id: "FND-0001",
//             itemName: "กระเป๋าเป้สีดำ",
//             category: "กระเป๋า",
//             location: "โรงอาหารกลาง",
//             date: "20 สิงหาคม 2569",
//             time: "14:30 น.",
//             description: "กระเป๋าเป้สีดำ มีช่องใส่โน้ตบุ๊กด้านใน",
//             highlight: "มีสติกเกอร์รูปดาวสีขาวติดอยู่ด้านหน้า",
//             image: ""
//         },

//         {
//             id: "FND-0002",
//             itemName: "บัตรประจำตัวนักศึกษา",
//             category: "บัตร",
//             location: "อาคารเรียน",
//             date: "20 สิงหาคม 2569",
//             time: "16:45 น.",
//             description: "บัตรนักศึกษาของมหาวิทยาลัยพะเยา",
//             highlight: "บัตรมีรอยขีดข่วนบริเวณมุมขวา",
//             image: ""
//         },

//         {
//             id: "FND-0003",
//             itemName: "กุญแจรถ",
//             category: "กุญแจ",
//             location: "ลานจอดรถ",
//             date: "19 สิงหาคม 2569",
//             time: "11:20 น.",
//             description: "กุญแจรถพร้อมพวงกุญแจ",
//             highlight: "พวงกุญแจเป็นรูปแมวสีดำ",
//             image: ""
//         }

//     ];

//     localStorage.setItem(
//         "guardWaitingItems",
//         JSON.stringify(waitingItems)
//     );

// }


// // ========================================
// // ELEMENTS
// // ========================================

// const waitingTab = document.getElementById("waitingTab");
// const returnTab = document.getElementById("returnTab");

// const waitingSection = document.getElementById("waitingSection");
// const returnSection = document.getElementById("returnSection");

// const waitingList = document.getElementById("waitingList");
// const returnList = document.getElementById("returnList");

// const waitingCount = document.getElementById("waitingCount");
// const returnCount = document.getElementById("returnCount");

// const searchInput = document.getElementById("searchInput");


// // ========================================
// // UPDATE COUNT
// // ========================================

// function updateCounts() {

//     waitingItems =
//         JSON.parse(localStorage.getItem("guardWaitingItems")) || [];

//     returnItems =
//         JSON.parse(localStorage.getItem("guardReturnItems")) || [];

//     waitingCount.textContent = `(${waitingItems.length})`;
//     returnCount.textContent = `(${returnItems.length})`;
// }


// // ========================================
// // SHOW WAITING TAB
// // ========================================

// waitingTab.addEventListener("click", function () {

//     waitingTab.classList.add("active");
//     returnTab.classList.remove("active");

//     waitingSection.style.display = "block";
//     returnSection.style.display = "none";

//     renderWaitingItems(searchInput.value);

// });


// // ========================================
// // SHOW RETURN TAB
// // ========================================

// returnTab.addEventListener("click", function () {

//     returnTab.classList.add("active");
//     waitingTab.classList.remove("active");

//     waitingSection.style.display = "none";
//     returnSection.style.display = "block";

//     renderReturnItems(searchInput.value);

// });


// // ========================================
// // RENDER WAITING ITEMS
// // ========================================

// function renderWaitingItems(keyword = "") {

//     // โหลดข้อมูลใหม่ทุกครั้ง
//     waitingItems =
//         JSON.parse(localStorage.getItem("guardWaitingItems")) || [];

//     waitingList.innerHTML = "";

//     const searchKeyword = keyword.toLowerCase().trim();


//     const filteredItems = waitingItems.filter(item => {

//         const text = `
//             ${item.id || ""}
//             ${item.itemName || ""}
//             ${item.category || ""}
//             ${item.location || ""}
//         `.toLowerCase();

//         return text.includes(searchKeyword);

//     });


//     // อัปเดตจำนวน
//     waitingCount.textContent =
//         `(${waitingItems.length})`;


//     // ไม่มีข้อมูล
//     if (filteredItems.length === 0) {

//         waitingList.innerHTML = `
//             <div class="empty-state">

//                 <i class="fa-regular fa-folder-open"></i>

//                 <h3>
//                     ไม่มีรายการที่รอตรวจรับ
//                 </h3>

//                 <p>
//                     เมื่อมีผู้แจ้งพบสิ่งของ
//                     รายการจะแสดงที่นี่
//                 </p>

//             </div>
//         `;

//         return;
//     }


//     // แสดงรายการ
//     filteredItems.forEach(item => {

//         const card = document.createElement("div");

//         card.className = "item-card";


//         card.innerHTML = `

//             <div class="item-image">

//                 ${
//                     item.image
//                     ? `
//                         <img
//                             src="${item.image}"
//                             alt="รูปสิ่งของ">
//                     `
//                     : `
//                         <i class="fa-solid fa-box"></i>
//                     `
//                 }

//             </div>


//             <div class="item-info">

//                 <span class="item-code">
//                     ${item.id || "-"}
//                 </span>

//                 <h3>
//                     ${item.itemName || "ไม่ระบุชื่อสิ่งของ"}
//                 </h3>

//                 <div class="item-detail">

//                     <i class="fa-solid fa-location-dot"></i>

//                     ${item.location || "ไม่ระบุสถานที่"}

//                 </div>

//                 <div class="item-detail">

//                     <i class="fa-regular fa-clock"></i>

//                     ${item.time || "-"}

//                 </div>

//             </div>


//             <div class="item-action">

//                 <button
//                     class="check-btn"
//                     onclick="openCheckPage('${item.id}')">

//                     ตรวจรับ

//                 </button>

//             </div>

//         `;


//         waitingList.appendChild(card);

//     });

// }


// // ========================================
// // RENDER RETURN ITEMS
// // ========================================

// function renderReturnItems(keyword = "") {

//     // โหลดข้อมูลใหม่ทุกครั้ง
//     returnItems =
//         JSON.parse(localStorage.getItem("guardReturnItems")) || [];

//     returnList.innerHTML = "";

//     const searchKeyword = keyword.toLowerCase().trim();


//     const filteredItems = returnItems.filter(item => {

//         const text = `
//             ${item.id || ""}
//             ${item.itemName || ""}
//             ${item.category || ""}
//             ${item.location || ""}
//         `.toLowerCase();

//         return text.includes(searchKeyword);

//     });


//     // อัปเดตจำนวนทันที
//     returnCount.textContent =
//         `(${returnItems.length})`;


//     // ไม่มีข้อมูล
//     if (filteredItems.length === 0) {

//         returnList.innerHTML = `
//             <div class="empty-state">

//                 <i class="fa-solid fa-box-open"></i>

//                 <h3>
//                     ยังไม่มีสิ่งของที่รอส่งคืน
//                 </h3>

//                 <p>
//                     เมื่อยามยืนยันรับฝากของ
//                     รายการจะแสดงที่นี่
//                 </p>

//             </div>
//         `;

//         return;
//     }


//     // แสดงรายการ
//     filteredItems.forEach(item => {

//         const card = document.createElement("div");

//         card.className = "item-card";


//         card.innerHTML = `

//             <div class="item-image">

//                 ${
//                     item.image
//                     ? `
//                         <img
//                             src="${item.image}"
//                             alt="รูปสิ่งของ">
//                     `
//                     : `
//                         <i class="fa-solid fa-box"></i>
//                     `
//                 }

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

//                     สถานะ:
//                     รอส่งคืนเจ้าของ

//                 </div>

//             </div>


//             <div class="item-action">

//                 <button
//                     class="check-btn"
//                     onclick="openReturnPage('${item.id}')">

//                     ดูรายละเอียด

//                 </button>

//             </div>

//         `;


//         returnList.appendChild(card);

//     });

// }


// // ========================================
// // SEARCH
// // ========================================

// searchInput.addEventListener("input", function () {

//     const keyword = this.value;


//     // เช็กว่ากำลังอยู่แท็บไหน
//     if (waitingSection.style.display !== "none") {

//         renderWaitingItems(keyword);

//     } else {

//         renderReturnItems(keyword);

//     }

// });


// // ========================================
// // OPEN CHECK PAGE
// // ========================================

// function openCheckPage(id) {

//     localStorage.setItem(
//         "selectedGuardItemId",
//         id
//     );

//     window.location.href =
//         "guard-item-detail.html";

// }


// // ========================================
// // OPEN RETURN PAGE
// // ========================================

// function openReturnPage(id) {

//     localStorage.setItem(
//         "selectedGuardItemId",
//         id
//     );

//     window.location.href =
//         "guard-return-detail.html";

// }


// // ========================================
// // REFRESH DATA
// // ========================================

// function refreshGuardItems() {

//     waitingItems =
//         JSON.parse(localStorage.getItem("guardWaitingItems")) || [];

//     returnItems =
//         JSON.parse(localStorage.getItem("guardReturnItems")) || [];


//     updateCounts();


//     // แสดงหน้าปัจจุบัน
//     if (returnSection.style.display !== "none") {

//         renderReturnItems(searchInput.value);

//     } else {

//         renderWaitingItems(searchInput.value);

//     }

// }


// // ========================================
// // FIRST LOAD
// // ========================================

// // สำคัญมาก!
// // อัปเดตตัวเลขทั้งสองฝั่งตั้งแต่เปิดหน้า

// updateCounts();


// // แสดงรายการฝั่ง "ยืนยันการรับฝากของ"
// renderWaitingItems();


// // อัปเดตอีกครั้งหลังโหลดเสร็จ
// setTimeout(function () {

//     refreshGuardItems();

// }, 100);

// // ========================================
// // เปิด Tab จากหน้า Admin
// // ========================================

// const activeTab =
//     localStorage.getItem("guardActiveTab");


// if (activeTab === "return") {

//     returnTab.click();

//     localStorage.removeItem("guardActiveTab");

// }


// else if (activeTab === "waiting") {

//     waitingTab.click();

//     localStorage.removeItem("guardActiveTab");

// }

import { supabase, requireRole } from './supabaseClient.js';

requireRole(["guard"]);

const waitingTab = document.getElementById("waitingTab");
const returnTab = document.getElementById("returnTab");
const lostTab = document.getElementById("lostTab");

const waitingSection = document.getElementById("waitingSection");
const returnSection = document.getElementById("returnSection");
const lostSection = document.getElementById("lostSection");

const waitingList = document.getElementById("waitingList");
const returnList = document.getElementById("returnList");
const lostList = document.getElementById("lostList");

const waitingCount = document.getElementById("waitingCount");
const returnCount = document.getElementById("returnCount");
const lostCount = document.getElementById("lostCount");

const searchInput = document.getElementById("searchInput");
const profileBtn = document.getElementById("profileBtn");

let waitingItems = [];
let returnItems = [];
let lostItems = [];

profileBtn?.addEventListener("click", () => {
    window.location.href = "profile.html";
});

async function loadAll() {
    const { data: waiting } = await supabase
        .from("found_items").select("*").eq("status", "waiting")
        .order("created_at", { ascending: false });

    const { data: toReturn } = await supabase
        .from("found_items").select("*").in("status", ["claimed", "claim_verified"])
        .order("created_at", { ascending: false });

    const { data: reportedLost } = await supabase
        .from("lost_items").select("*")
        .order("created_at", { ascending: false });

    waitingItems = waiting || [];
    returnItems = toReturn || [];
    lostItems = reportedLost || [];

    waitingCount.textContent = `(${waitingItems.length})`;
    returnCount.textContent = `(${returnItems.length})`;
    lostCount.textContent = `(${lostItems.length})`;

    renderWaitingItems(searchInput.value);
    renderReturnItems(searchInput.value);
    renderLostItems(searchInput.value);
}

function renderLostItems(keyword = "") {
    lostList.innerHTML = "";
    const kw = keyword.toLowerCase().trim();
    const filtered = lostItems.filter((item) => `${item.id} ${item.item_name} ${item.description} ${item.category} ${item.location}`.toLowerCase().includes(kw));

    if (!filtered.length) {
        lostList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>ยังไม่มีรายการแจ้งของหาย</h3><p>เมื่อผู้ใช้แจ้งของหาย รายการจะแสดงตรงนี้</p></div>';
        return;
    }

    filtered.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-image">${item.image_url ? `<img src="${item.image_url}">` : '<i class="fa-solid fa-triangle-exclamation"></i>'}</div>
            <div class="item-info">
                <span class="item-code">แจ้งของหาย</span>
                <h3>${item.item_name || item.description || 'ไม่ระบุสิ่งของ'}</h3>
                <div class="item-detail">หมวดหมู่: ${item.category || '-'}</div>
                <div class="item-detail">รายละเอียด: ${item.description || '-'}</div>
                <div class="item-detail">สถานที่หาย: ${item.location || '-'}</div>
                <div class="item-detail">วันที่หาย: ${item.lost_date || '-'} ${item.lost_time || ''}</div>
            </div>
        `;
        lostList.appendChild(card);
    });
}

function renderWaitingItems(keyword = "") {
    waitingList.innerHTML = "";
    const kw = keyword.toLowerCase().trim();

    const filtered = waitingItems.filter((item) => {
        const text = `${item.id} ${item.item_name} ${item.description} ${item.category} ${item.subcategory} ${item.location}`.toLowerCase();
        return text.includes(kw);
    });

    if (filtered.length === 0) {
        waitingList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-folder-open"></i>
                <h3>ไม่มีรายการที่รอตรวจรับ</h3>
                <p>เมื่อมีผู้แจ้งพบสิ่งของ รายการจะแสดงที่นี่</p>
            </div>
        `;
        return;
    }

    filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <div class="item-image">${item.image_url ? `<img src="${item.image_url}">` : `<i class="fa-solid fa-box"></i>`}</div>
            <div class="item-info">
                <span class="item-code">${item.id.slice(0, 8)}</span>
                <h3>${item.item_name || item.description || "ไม่ระบุชื่อสิ่งของ"}</h3>
                <div class="item-detail"><i class="fa-solid fa-location-dot"></i> ${item.location || "ไม่ระบุสถานที่"}</div>
                <div class="item-detail"><i class="fa-regular fa-clock"></i> ${item.found_time || "-"}</div>
            </div>
            <div class="item-action"><button class="check-btn" data-id="${item.id}">ตรวจรับ</button></div>
        `;
        card.querySelector(".check-btn").addEventListener("click", () => {
            localStorage.setItem("selectedGuardItemId", item.id);
            window.location.href = "guard-item-detail.html";
        });
        waitingList.appendChild(card);
    });
}

function renderReturnItems(keyword = "") {
    returnList.innerHTML = "";
    const kw = keyword.toLowerCase().trim();

    const filtered = returnItems.filter((item) => {
        const text = `${item.id} ${item.item_name} ${item.description} ${item.category} ${item.subcategory} ${item.location}`.toLowerCase();
        return text.includes(kw);
    });

    if (filtered.length === 0) {
        returnList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <h3>ยังไม่มีสิ่งของที่รอส่งคืน</h3>
                <p>เมื่อยามยืนยันรับฝากของ รายการจะแสดงที่นี่</p>
            </div>
        `;
        return;
    }

    filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <div class="item-image">${item.image_url ? `<img src="${item.image_url}">` : `<i class="fa-solid fa-box"></i>`}</div>
            <div class="item-info">
                <span class="item-code">${item.id.slice(0, 8)}</span>
                <h3>${item.item_name || item.description || "ไม่ระบุชื่อสิ่งของ"}</h3>
                <div class="item-detail">หมวดหมู่: ${item.category || "-"}</div>
                <div class="item-detail">สถานะ: รอส่งคืนเจ้าของ</div>
            </div>
            <div class="item-action"><button class="check-btn" data-id="${item.id}">ดูรายละเอียด</button></div>
        `;
        card.querySelector(".check-btn").addEventListener("click", () => {
            localStorage.setItem("selectedGuardItemId", item.id);
            window.location.href = "guard-return-detail.html";
        });
        returnList.appendChild(card);
    });
}

waitingTab.addEventListener("click", function () {
    waitingTab.classList.add("active");
    returnTab.classList.remove("active");
    lostTab.classList.remove("active");
    waitingSection.style.display = "block";
    returnSection.style.display = "none";
    lostSection.style.display = "none";
    renderWaitingItems(searchInput.value);
});

returnTab.addEventListener("click", function () {
    returnTab.classList.add("active");
    waitingTab.classList.remove("active");
    waitingSection.style.display = "none";
    returnSection.style.display = "block";
    lostSection.style.display = "none";
    renderReturnItems(searchInput.value);
});

lostTab.addEventListener("click", function () {
    lostTab.classList.add("active");
    waitingTab.classList.remove("active");
    returnTab.classList.remove("active");
    waitingSection.style.display = "none";
    returnSection.style.display = "none";
    lostSection.style.display = "block";
    renderLostItems(searchInput.value);
});

searchInput.addEventListener("input", function () {
    const keyword = this.value;
    if (waitingSection.style.display !== "none") {
        renderWaitingItems(keyword);
    } else if (lostSection.style.display !== "none") {
        renderLostItems(keyword);
    } else {
        renderReturnItems(keyword);
    }
});

loadAll();
window.addEventListener('pageshow', loadAll);
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadAll();
});
supabase.channel('guard-found-items-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'found_items' }, loadAll)
    .subscribe();

// เปิด Tab ตามที่มาจากหน้า Admin (ถ้ามี)
const activeTab = localStorage.getItem("guardActiveTab");
if (activeTab === "return") {
    returnTab.click();
    localStorage.removeItem("guardActiveTab");
} else if (activeTab === "waiting") {
    waitingTab.click();
    localStorage.removeItem("guardActiveTab");
}
