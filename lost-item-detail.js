// // // =====================================
// // // LOST ITEM DETAIL
// // // =====================================

// // const itemData = {

// //     itemName: "กระเป๋าเป้สีดำ",

// //     brand: "ยี่ห้อ The North Face",

// //     category: "กระเป๋า",

// //     location: "ป้อมยาม ประตู 2",

// //     date: "10 สิงหาคม 2569",

// //     time: "10:30 น.",

// //     // =================================
// //     // ข้อมูลลับ
// //     // ห้ามแสดงในหน้ารายละเอียด
// //     // =================================

// //     secretDetails: {

// //         question1: "มีพวงกุญแจรูปแมวสีแดง",

// //         question2: "ซิปช่องหน้ามีรอยขีด 2 รอย",

// //         question3: "มีซองใส่บัตรอยู่ด้านใน"

// //     }

// // };


// // // =====================================
// // // แสดงข้อมูล
// // // =====================================

// // document.getElementById("itemName").textContent =
// //     itemData.itemName;

// // document.getElementById("brand").textContent =
// //     itemData.brand;

// // document.getElementById("category").textContent =
// //     itemData.category;

// // document.getElementById("location").textContent =
// //     itemData.location;

// // document.getElementById("date").textContent =
// //     itemData.date;

// // document.getElementById("time").textContent =
// //     itemData.time;


// // // =====================================
// // // เก็บข้อมูลไว้สำหรับหน้าตรวจสอบ
// // // =====================================

// // localStorage.setItem(
// //     "selectedLostItem",
// //     JSON.stringify(itemData)
// // );


// // // =====================================
// // // ปุ่มยืนยันความเป็นเจ้าของ
// // // =====================================

// // const claimBtn = document.getElementById("claimBtn");

// // if (claimBtn) {

// //     claimBtn.addEventListener("click", function () {

// //         window.location.href = "claim-verification.html";

// //     });

// // }
// import { supabase, requireLogin } from './supabaseClient.js';

// requireLogin();

// const itemId = localStorage.getItem("selectedFoundItemId");

// if (!itemId) {
//     alert("ไม่พบรายการสิ่งของ");
//     window.location.href = "dashboard.html";
// }

// async function loadDetail() {
//     const { data: item, error } = await supabase
//         .from("found_items_public")
//         .select("*")
//         .eq("id", itemId)
//         .single();

//     if (error || !item) {
//         alert("ไม่พบข้อมูลสิ่งของนี้ในระบบ");
//         window.location.href = "dashboard.html";
//         return;
//     }

//     const categoryEl = document.getElementById("category");
//     const nameEl = document.getElementById("itemName");
//     const brandEl = document.getElementById("brand");
//     const locationEl = document.getElementById("location");
//     const dateEl = document.getElementById("date");
//     const timeEl = document.getElementById("time");
//     const imageEl = document.getElementById("itemImage");
//     const photoPlaceholder = document.getElementById("photoPlaceholder");

//     if (categoryEl) categoryEl.textContent = item.category;
//     if (nameEl) nameEl.textContent = item.description;
//     if (brandEl) brandEl.textContent = item.additional_note || "";
//     if (locationEl) locationEl.textContent = item.location;
//     if (dateEl) dateEl.textContent = item.found_date;
//     if (timeEl) timeEl.textContent = item.found_time || "-";

//     if (imageEl && item.image_url) {
//         imageEl.src = item.image_url;
//         imageEl.hidden = false;
//         if (photoPlaceholder) photoPlaceholder.hidden = true;

//         imageEl.addEventListener("error", () => {
//             imageEl.hidden = true;
//             if (photoPlaceholder) photoPlaceholder.hidden = false;
//         });
//     }

//     // เก็บ id ไว้ให้หน้ายืนยันความเป็นเจ้าของใช้ต่อ
//     localStorage.setItem("claimFoundItemId", item.id);
// }

// const claimBtn = document.getElementById("claimBtn");
// if (claimBtn) {
//     claimBtn.addEventListener("click", function () {
//         window.location.href = "claim-verification.html";
//     });
// }

// loadDetail();

import { supabase, requireRole } from './supabaseClient.js';

requireRole(["user"]);

const itemId = new URLSearchParams(window.location.search).get('id') || localStorage.getItem("selectedFoundItemId");

if (!itemId) {
    alert("ไม่พบรายการสิ่งของ");
    window.location.href = "dashboard.html";
}

async function loadDetail() {
    const { data: item, error } = await supabase
        .from("found_items_public")
        .select("*")
        .eq("id", itemId)
        .single();

    if (error || !item) {
        alert("ไม่พบข้อมูลสิ่งของนี้ในระบบ");
        window.location.href = "dashboard.html";
        return;
    }

    const categoryEl = document.getElementById("category");
    const nameEl = document.getElementById("itemName");
    const brandEl = document.getElementById("brand");
    const locationEl = document.getElementById("location");
    const dateEl = document.getElementById("date");
    const timeEl = document.getElementById("time");
    const imageEl = document.getElementById("itemImage");
    const photoPlaceholder = document.getElementById("photoPlaceholder");

    if (categoryEl) categoryEl.textContent = item.category;
    if (nameEl) nameEl.textContent = item.description;
    if (brandEl) brandEl.textContent = item.additional_note || "";
    if (locationEl) locationEl.textContent = item.location;
    if (dateEl) dateEl.textContent = item.found_date;
    if (timeEl) timeEl.textContent = item.found_time || "-";

    if (imageEl && item.image_url) {
        imageEl.src = item.image_url;
        imageEl.hidden = false;
        if (photoPlaceholder) photoPlaceholder.hidden = true;
        imageEl.addEventListener("error", () => {
            imageEl.hidden = true;
            if (photoPlaceholder) photoPlaceholder.hidden = false;
        }, { once: true });
    }

    if (claimBtn && item.status !== 'claimed') {
        claimBtn.disabled = true;
        claimBtn.style.display = 'none';
        const notice = document.createElement('div');
        notice.className = 'security-notice';
        notice.textContent = item.status === 'claim_verified'
            ? 'รายการนี้มีผู้ยืนยันความเป็นเจ้าของแล้ว กรุณารอการส่งคืนให้เจ้าของรายการ'
            : 'รายการนี้ยังไม่พร้อมให้ยืนยันความเป็นเจ้าของ';
        claimBtn.parentElement?.appendChild(notice);
    }

    // เก็บ id ไว้ให้หน้ายืนยันความเป็นเจ้าของใช้ต่อ
    localStorage.setItem("claimFoundItemId", item.id);
}

const claimBtn = document.getElementById("claimBtn");
if (claimBtn) {
    claimBtn.addEventListener("click", function () {
        window.location.href = "claim-verification.html";
    });
}

loadDetail();
