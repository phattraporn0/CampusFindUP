// // ========================================
// // ADMIN DELIVERY HISTORY
// // ใช้ข้อมูลจาก adminItems
// // ========================================

// let allItems =
//     JSON.parse(
//         localStorage.getItem("adminItems")
//     ) || [];


// // ========================================
// // เอาเฉพาะรายการที่ "ส่งคืนแล้ว"
// // ========================================

// let deliveryHistory =
//     allItems.filter(
//         item => item.status === "delivered"
//     );


// // ========================================
// // ELEMENT
// // ========================================

// const historyList =
//     document.getElementById("historyList");

// const historySearch =
//     document.getElementById("historySearch");


// // ========================================
// // RENDER
// // ========================================

// function renderHistory(keyword = "") {

//     historyList.innerHTML = "";


//     const filtered =
//         deliveryHistory.filter(item => {

//             const text = `

//                 ${item.id || ""}

//                 ${item.itemName || ""}

//                 ${item.studentName || ""}

//                 ${item.studentId || ""}

//                 ${item.location || ""}

//             `.toLowerCase();


//             return text.includes(
//                 keyword.toLowerCase()
//             );

//         });


//     if (filtered.length === 0) {

//         historyList.innerHTML = `

//             <div class="empty-history">

//                 <i class="fa-regular fa-folder-open"></i>

//                 <h3>
//                     ยังไม่มีประวัติการส่งมอบ
//                 </h3>

//             </div>

//         `;

//         return;

//     }


//     filtered.forEach(item => {

//         const row =
//             document.createElement("div");


//         row.className =
//             "history-row";


//         row.innerHTML = `

//             <div class="date">

//                 <strong>
//                     ${item.date || "-"}
//                 </strong>

//                 <span>

//                     <i class="fa-regular fa-clock"></i>

//                     ${item.time || "-"}

//                 </span>

//             </div>


//             <div>

//                 <span class="item-code">

//                     ${item.id || "-"}

//                 </span>

//             </div>


//             <div class="item-name">

//                 ${item.itemName || "-"}

//             </div>


//             <div class="student">

//                 <div class="student-avatar">

//                     ${
//                         (
//                             item.studentName ||
//                             "?"
//                         ).charAt(0)
//                     }

//                 </div>


//                 <div>

//                     <strong>

//                         ${item.studentName || "-"}

//                     </strong>

//                     <span>

//                         ${item.studentId || "-"}

//                     </span>

//                 </div>

//             </div>


//             <div class="location">

//                 <i class="fa-solid fa-location-dot"></i>

//                 ${item.location || "-"}

//             </div>


//             <div class="history-action">

//                 <button
//                     class="detail-btn"
//                     onclick="openAdminItemDetail('${item.id}')">

//                     ดูรายละเอียด

//                 </button>

//             </div>

//         `;


//         historyList.appendChild(row);

//     });

// }


// // ========================================
// // SEARCH
// // ========================================

// historySearch.addEventListener(
//     "input",
//     function () {

//         renderHistory(
//             this.value
//         );

//     }
// );


// // ========================================
// // ดูรายละเอียดของ Admin
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
// // FIRST LOAD
// // ========================================

// renderHistory();

import { supabase, requireRole } from '../supabaseClient.js';

requireRole(["admin"]);

const historyList = document.getElementById("historyList");
const historySearch = document.getElementById("historySearch");

let history = [];

async function loadHistory() {
    const { data: items, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("status", "returned")
        .order("returned_at", { ascending: true });

    if (error) {
        console.error("โหลดประวัติไม่สำเร็จ:", error.message);
        return;
    }

    // ดึงชื่อผู้รับของ (claimed_by) มาต่อให้แต่ละแถว — ทำแยกทีละคน เพื่อความง่าย
    const claimerIds = [...new Set(items.map((i) => i.claimant_id).filter(Boolean))];
    let profilesById = {};

    if (claimerIds.length > 0) {
        const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", claimerIds);

        (profiles || []).forEach((p) => { profilesById[p.id] = p; });
    }

    history = items.map((item) => ({
        ...item,
        claimerName: profilesById[item.claimant_id]?.display_name || profilesById[item.claimant_id]?.full_name || "ไม่ระบุ",
        claimerStudentId: "",
    }));

    renderHistory();
}

function renderHistory(keyword = "") {
    historyList.innerHTML = "";

    const kw = keyword.toLowerCase();
    const filtered = history.filter((item) => {
        const text = `${item.id} ${item.description} ${item.claimerName} ${item.claimerStudentId}`.toLowerCase();
        return text.includes(kw);
    });

    if (filtered.length === 0) {
        historyList.innerHTML = `<div class="empty-state"><h3>ไม่มีประวัติการส่งมอบ</h3></div>`;
        return;
    }

    filtered.forEach((item) => {
        const row = document.createElement("div");
        row.className = "history-row";

        const dateText = item.returned_at
            ? new Date(item.returned_at).toLocaleString("th-TH")
            : "-";

        row.innerHTML = `
            <div>${dateText}</div>
            <div>${item.id.slice(0, 8)}</div>
            <div>${item.description}</div>
            <div>${item.claimerName}${item.claimerStudentId ? " (" + item.claimerStudentId + ")" : ""}</div>
            <div>${item.storage_location || "-"}</div>
        `;

        historyList.appendChild(row);
    });
}

if (historySearch) {
    historySearch.addEventListener("input", function () {
        renderHistory(this.value);
    });
}

loadHistory();
