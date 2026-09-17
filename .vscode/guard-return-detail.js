// const selectedId =
//     localStorage.getItem("selectedGuardItemId");


// const returnItems =
//     JSON.parse(
//         localStorage.getItem("guardReturnItems")
//     ) || [];


// const item =
//     returnItems.find(
//         x => String(x.id) === String(selectedId)
//     );


// const returnDetail =
//     document.getElementById("returnDetail");


// if (!item) {

//     returnDetail.innerHTML = `
//         <div class="return-card">
//             <h2>ไม่พบข้อมูลสิ่งของ</h2>
//         </div>
//     `;

// } else {

//     returnDetail.innerHTML = `

//         <section class="return-card">

//             <div class="return-main">

//                 <div class="return-photo">

//                     ${
//                         item.image
//                         ? `<img src="${item.image}">`
//                         : `<i class="fa-solid fa-box"></i>`
//                     }

//                 </div>


//                 <div>

//                     <span class="code">
//                         รหัสรายการ: ${item.id || "-"}
//                     </span>

//                     <h2>
//                         ${item.itemName || "-"}
//                     </h2>

//                     <p>
//                         หมวดหมู่:
//                         ${item.category || "-"}
//                     </p>

//                 </div>

//             </div>


//             <div class="info-row">

//                 <div class="info-label">
//                     วันที่พบ
//                 </div>

//                 <div class="info-value">
//                     ${item.date || "-"}
//                 </div>

//             </div>


//             <div class="info-row">

//                 <div class="info-label">
//                     เวลาที่พบ
//                 </div>

//                 <div class="info-value">
//                     ${item.time || "-"}
//                 </div>

//             </div>


//             <div class="info-row">

//                 <div class="info-label">
//                     สถานที่ที่พบ
//                 </div>

//                 <div class="info-value">
//                     ${item.location || "-"}
//                 </div>

//             </div>


//             <div class="info-row">

//                 <div class="info-label">
//                     รายละเอียด
//                 </div>

//                 <div class="info-value">
//                     ${item.description || "-"}
//                 </div>

//             </div>


//             <div class="remark-section">

//                 <h3>
//                     <i class="fa-solid fa-circle-info"></i>
//                     จุดเด่น / ตำหนิ
//                 </h3>

//                 <p>
//                     ${item.remark || "ผู้พบไม่ได้ระบุ"}
//                 </p>


//                 ${
//                     item.guardRemark
//                     ? `
//                         <br>

//                         <strong>
//                             ข้อมูลเพิ่มเติมจากยาม
//                         </strong>

//                         <p>
//                             ${item.guardRemark}
//                         </p>
//                     `
//                     : ""
//                 }

//             </div>

//         </section>

//     `;

// }


// // ========================================
// // SCAN BUTTON
// // ========================================

// document
//     .getElementById("scanBtn")
//     .addEventListener("click", function () {

//         localStorage.setItem(
//             "selectedGuardItemId",
//             selectedId
//         );

//         window.location.href =
//             "guard-scan.html";

//     });

import { supabase, requireRole } from '../supabaseClient.js';

requireRole(["guard"]);

const selectedId = localStorage.getItem("selectedGuardItemId");
const returnDetail = document.getElementById("returnDetail");

async function loadItem() {
    if (!selectedId) {
        returnDetail.innerHTML = `<div class="return-card"><h2>ไม่พบข้อมูลสิ่งของ</h2></div>`;
        return;
    }

    const { data: item, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("id", selectedId)
        .single();

    if (error || !item) {
        returnDetail.innerHTML = `<div class="return-card"><h2>ไม่พบข้อมูลสิ่งของ</h2></div>`;
        return;
    }

    returnDetail.innerHTML = `
        <section class="return-card">
            <div class="return-main">
                <div class="return-photo">${item.image_url ? `<img src="${item.image_url}">` : `<i class="fa-solid fa-box"></i>`}</div>
                <div>
                    <span class="code">รหัสรายการ: ${item.id.slice(0, 8)}</span>
                    <h2>${item.description || "-"}</h2>
                    <p>หมวดหมู่: ${item.category || "-"}</p>
                </div>
            </div>
            <div class="info-row"><div class="info-label">วันที่พบ</div><div class="info-value">${item.found_date || "-"}</div></div>
            <div class="info-row"><div class="info-label">เวลาที่พบ</div><div class="info-value">${item.found_time || "-"}</div></div>
            <div class="info-row"><div class="info-label">สถานที่ที่พบ</div><div class="info-value">${item.location || "-"}</div></div>
            <div class="info-row"><div class="info-label">รายละเอียด</div><div class="info-value">${item.description || "-"}</div></div>
            <div class="remark-section">
                <h3><i class="fa-solid fa-circle-info"></i> จุดเด่น / ตำหนิ</h3>
                <p>${item.defect || "ผู้พบไม่ได้ระบุ"}</p>
                ${item.guard_remark ? `<br><strong>ข้อมูลเพิ่มเติมจากยาม</strong><p>${item.guard_remark}</p>` : ""}
            </div>
        </section>
    `;
}

document.getElementById("scanBtn").addEventListener("click", function () {
    // selectedGuardItemId ถูกเก็บไว้อยู่แล้วจากหน้ารายการ ไม่ต้องเซ็ตซ้ำ
    window.location.href = "guard-scan.html";
});

loadItem();
