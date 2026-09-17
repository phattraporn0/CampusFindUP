// // ========================================
// // ADMIN RETURN
// // ========================================

// const allItems = JSON.parse(
//     localStorage.getItem("adminItems")
// ) || [];

// const returnItems =
//     allItems.filter(
//         item => item.status === "return"
//     );


// const returnList =
//     document.getElementById("returnList");

// const searchInput =
//     document.getElementById("searchInput");

// const count =
//     document.getElementById("count");


// // ========================================
// // RENDER
// // ========================================

// function renderReturn(keyword = "") {

//     returnList.innerHTML = "";

//     const filtered =
//         returnItems.filter(item => {

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

//         returnList.innerHTML = `

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

//                 <i class="fa-solid fa-box-open"></i>

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
//                 รอการส่งมอบ
//             </span>


//             <button
//                 class="detail-btn"
//                 onclick="viewReturn('${item.id}')">

//                 ดูรายละเอียด

//             </button>

//         `;


//         returnList.appendChild(card);

//     });

// }


// // ========================================
// // VIEW
// // ========================================
// function viewReturn(id) {

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

//         renderReturn(this.value);

//     }
// );


// renderReturn();

import { supabase, requireRole } from '../supabaseClient.js';

requireRole(["admin"]);

const returnList = document.getElementById("returnList");
const searchInput = document.getElementById("searchInput");
const count = document.getElementById("count");

let returnItems = [];

async function loadReturn() {
    const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .in("status", ["claimed", "claim_verified"])
        .order("created_at", { ascending: false });

    if (error) {
        console.error("โหลดรายการไม่สำเร็จ:", error.message);
        return;
    }

    returnItems = data;
    renderReturn();
}

function renderReturn(keyword = "") {
    returnList.innerHTML = "";

    const kw = keyword.toLowerCase();
    const filtered = returnItems.filter((item) => {
        const text = `${item.id} ${item.description} ${item.category} ${item.location}`.toLowerCase();
        return text.includes(kw);
    });

    count.textContent = filtered.length;

    if (filtered.length === 0) {
        returnList.innerHTML = `
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
            <div class="item-image"><i class="fa-solid fa-box-open"></i></div>
            <div class="item-info">
                <span class="item-code">${item.id.slice(0, 8)}</span>
                <h3>${item.description}</h3>
                <div class="item-detail">หมวดหมู่: ${item.category}</div>
                <div class="item-detail"><i class="fa-solid fa-location-dot"></i> ${item.location}</div>
            </div>
            <span class="status">รอส่งคืนเจ้าของ</span>
            <button class="detail-btn" data-id="${item.id}">ดูรายละเอียด</button>
        `;

        card.querySelector(".detail-btn").addEventListener("click", () => {
            localStorage.setItem("adminSelectedItemId", item.id);
            window.location.href = `admin-item-detail.html?id=${encodeURIComponent(item.id)}`;
        });

        returnList.appendChild(card);
    });
}

searchInput.addEventListener("input", function () {
    renderReturn(this.value);
});

loadReturn();
