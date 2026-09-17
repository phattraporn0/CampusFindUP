// // ========================================
// // ADMIN WAITING
// // ========================================

// const allItems = JSON.parse(
//     localStorage.getItem("adminItems")
// ) || [];

// const waitingItems =
//     allItems.filter(
//         item => item.status === "waiting"
//     );


// const waitingList =
//     document.getElementById("waitingList");

// const searchInput =
//     document.getElementById("searchInput");

// const count =
//     document.getElementById("count");


// // ========================================
// // RENDER
// // ========================================

// function renderWaiting(keyword = "") {

//     waitingList.innerHTML = "";

//     const filtered =
//         waitingItems.filter(item => {

//             const text = `
//                 ${item.id}
//                 ${item.itemName}
//                 ${item.category}
//                 ${item.location}
//             `.toLowerCase();

//             return text.includes(
//                 keyword.toLowerCase()
//             );

//         });


//     count.textContent =
//         filtered.length;


//     if (filtered.length === 0) {

//         waitingList.innerHTML = `

//             <div class="empty">

//                 <i class="fa-regular fa-folder-open"></i>

//                 <h3>
//                     ไม่มีรายการ
//                 </h3>

//             </div>

//         `;

//         return;

//     }


//     filtered.forEach(item => {

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
//                     ${item.id}
//                 </span>

//                 <h3>
//                     ${item.itemName}
//                 </h3>

//                 <div class="item-detail">
//                     หมวดหมู่: ${item.category}
//                 </div>

//                 <div class="item-detail">
//                     <i class="fa-solid fa-location-dot"></i>
//                     ${item.location}
//                 </div>

//             </div>


//             <span class="status">
//                 รอเจ้าของยืนยัน
//             </span>


//             <button
//                 class="detail-btn"
//                 onclick="viewWaiting('${item.id}')">

//                 ดูรายละเอียด

//             </button>

//         `;


//         waitingList.appendChild(card);

//     });

// }


// // ========================================
// // VIEW
// // ========================================

// function viewWaiting(id) {

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

//         renderWaiting(this.value);

//     }
// );


// renderWaiting();

import { supabase, requireRole } from './supabaseClient.js';

requireRole(["admin"]);

const waitingList = document.getElementById("waitingList");
const searchInput = document.getElementById("searchInput");
const count = document.getElementById("count");

let waitingItems = [];

async function loadWaiting() {
    const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("status", "waiting")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("โหลดรายการไม่สำเร็จ:", error.message);
        return;
    }

    waitingItems = data;
    renderWaiting();
}

function renderWaiting(keyword = "") {
    waitingList.innerHTML = "";

    const kw = keyword.toLowerCase();
    const filtered = waitingItems.filter((item) => {
        const text = `${item.id} ${item.description} ${item.category} ${item.location}`.toLowerCase();
        return text.includes(kw);
    });

    count.textContent = filtered.length;

    if (filtered.length === 0) {
        waitingList.innerHTML = `
            <div class="empty">
                <i class="fa-regular fa-folder-open"></i>
                <h3>ไม่มีรายการ</h3>
            </div>
        `;
        return;
    }

    filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
            <div class="item-image"><i class="fa-solid fa-box"></i></div>
            <div class="item-info">
                <span class="item-code">${item.id.slice(0, 8)}</span>
                <h3>${item.description}</h3>
                <div class="item-detail">หมวดหมู่: ${item.category}</div>
                <div class="item-detail"><i class="fa-solid fa-location-dot"></i> ${item.location}</div>
            </div>
            <span class="status">รอเจ้าของยืนยัน</span>
            <button class="detail-btn" data-id="${item.id}">ดูรายละเอียด</button>
        `;

        card.querySelector(".detail-btn").addEventListener("click", () => {
            localStorage.setItem("adminSelectedItemId", item.id);
            window.location.href = "admin-item-detail.html";
        });

        waitingList.appendChild(card);
    });
}

searchInput.addEventListener("input", function () {
    renderWaiting(this.value);
});

loadWaiting();