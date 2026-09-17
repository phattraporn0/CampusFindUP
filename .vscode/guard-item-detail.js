// // ========================================
// // GET SELECTED ITEM
// // ========================================

// const selectedId =
//     localStorage.getItem("selectedGuardItemId");


// let waitingItems =
//     JSON.parse(localStorage.getItem("guardWaitingItems")) || [];


// const item =
//     waitingItems.find(
//         item => String(item.id) === String(selectedId)
//     );


// const itemDetail =
//     document.getElementById("itemDetail");


// // ========================================
// // DISPLAY ITEM
// // ========================================

// if (!item) {

//     itemDetail.innerHTML = `
//         <div class="item-detail-card">
//             <h2>ไม่พบข้อมูลสิ่งของ</h2>
//             <p>ไม่พบรายการที่ต้องการตรวจสอบ</p>
//         </div>
//     `;

// } else {

//     itemDetail.innerHTML = `

//         <section class="item-detail-card">

//             <div class="item-main">

//                 <div class="item-photo">

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


//             <div class="remark-box">

//                 <h3>
//                     <i class="fa-solid fa-circle-info"></i>
//                     จุดเด่น / ตำหนิที่ผู้พบแจ้ง
//                 </h3>

//                 <p>
//                     ${item.remark || "ผู้พบไม่ได้ระบุ"}
//                 </p>

//             </div>

//         </section>

//     `;
// }


// // ========================================
// // CONFIRM
// // ========================================

// document
//     .getElementById("confirmBtn")
//     .addEventListener("click", function () {

//         if (!item) {
//             alert("ไม่พบข้อมูลสิ่งของ");
//             return;
//         }


//         const guardRemark =
//             document
//                 .getElementById("guardRemark")
//                 .value
//                 .trim();


//         // เพิ่มข้อมูลของยามเข้าไป
//         item.guardRemark = guardRemark;


//         // เปลี่ยนสถานะ
//         item.status = "waiting-return";


//         // เอาออกจากรอรับ
//         waitingItems =
//             waitingItems.filter(
//                 x => String(x.id) !== String(item.id)
//             );


//         // ดึงรายการรอคืนเดิม
//         let returnItems =
//             JSON.parse(
//                 localStorage.getItem("guardReturnItems")
//             ) || [];


//         // เพิ่มรายการเข้าไป
//         returnItems.push(item);


//         // บันทึก
//         localStorage.setItem(
//             "guardWaitingItems",
//             JSON.stringify(waitingItems)
//         );


//         localStorage.setItem(
//             "guardReturnItems",
//             JSON.stringify(returnItems)
//         );


//         alert("ยืนยันการรับฝากของเรียบร้อยแล้ว");


//         window.location.href =
//             "guard-items.html";

//     });

import { supabase, requireRole } from '../supabaseClient.js';

requireRole(["guard"]);

const selectedId = localStorage.getItem("selectedGuardItemId");
const itemDetail = document.getElementById("itemDetail");

let item = null;

async function loadItem() {
    if (!selectedId) {
        itemDetail.innerHTML = `<div class="item-detail-card"><h2>ไม่พบข้อมูลสิ่งของ</h2></div>`;
        return;
    }

    const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("id", selectedId)
        .single();

    if (error || !data) {
        itemDetail.innerHTML = `<div class="item-detail-card"><h2>ไม่พบข้อมูลสิ่งของ</h2><p>ไม่พบรายการที่ต้องการตรวจสอบ</p></div>`;
        return;
    }

    item = data;

    itemDetail.innerHTML = `
        <section class="item-detail-card">
            <div class="item-main">
                <div class="item-photo">${item.image_url ? `<img src="${item.image_url}">` : `<i class="fa-solid fa-box"></i>`}</div>
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
            <div class="remark-box">
                <h3><i class="fa-solid fa-circle-info"></i> จุดเด่น / ตำหนิที่ผู้พบแจ้ง</h3>
                <p>${item.defect || "ผู้พบไม่ได้ระบุ"}</p>
            </div>
        </section>
    `;
}

document.getElementById("confirmBtn").addEventListener("click", async function () {
    if (!item) {
        alert("ไม่พบข้อมูลสิ่งของ");
        return;
    }

    const guardRemark = document.getElementById("guardRemark").value.trim();
    const btn = this;
    btn.disabled = true;

    const { error } = await supabase
        .from("found_items")
        .update({
            status: "claimed",
            guard_remark: guardRemark || null,
        })
        .eq("id", item.id);

    btn.disabled = false;

    if (error) {
        alert("บันทึกไม่สำเร็จ: " + error.message);
        return;
    }

    alert("ยืนยันการรับฝากของเรียบร้อยแล้ว");
    window.location.href = "guard-items.html";
});

loadItem();
