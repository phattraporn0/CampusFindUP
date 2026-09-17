// // ========================================
// // ADMIN DEMO DATA
// // ข้อมูลจำลองเฉพาะฝั่ง ADMIN
// // ไม่เชื่อมกับข้อมูลของ รปภ.
// // ========================================

// const adminItems = [
//     {
//         id: "CLM-1001",
//         itemName: "กระเป๋าเป้สีดำ",
//         category: "กระเป๋า",
//         location: "อาคารเรียนรวม 1",
//         date: "21 สิงหาคม 2569",
//         time: "09:30 น.",
//         status: "waiting"
//     },

//     {
//         id: "CLM-1002",
//         itemName: "บัตรประจำตัวนักศึกษา",
//         category: "บัตร",
//         location: "โรงอาหารกลาง",
//         date: "21 สิงหาคม 2569",
//         time: "10:15 น.",
//         status: "waiting"
//     },

//     {
//         id: "CLM-1003",
//         itemName: "iPhone 13 สีฟ้า",
//         category: "อุปกรณ์อิเล็กทรอนิกส์",
//         location: "ตึกวิทยาศาสตร์",
//         date: "20 สิงหาคม 2569",
//         time: "14:20 น.",
//         status: "return"
//     },

//     {
//         id: "CLM-1004",
//         itemName: "กุญแจรถยนต์",
//         category: "กุญแจ",
//         location: "ลานจอดรถ",
//         date: "20 สิงหาคม 2569",
//         time: "16:45 น.",
//         status: "return"
//     },

//     {
//         id: "CLM-1005",
//         itemName: "กระเป๋าสตางค์สีน้ำตาล",
//         category: "กระเป๋า",
//         location: "หอประชุมมหาวิทยาลัย",
//         date: "19 สิงหาคม 2569",
//         time: "11:00 น.",
//         status: "delivered"
//     }
// ];


// // ========================================
// // SAVE ADMIN DATA
// // ========================================

// localStorage.setItem(
//     "adminItems",
//     JSON.stringify(adminItems)
// );


// // ========================================
// // GET ADMIN DATA
// // ========================================

// function getAdminItems() {

//     return JSON.parse(
//         localStorage.getItem("adminItems")
//     ) || [];

// }


// // ========================================
// // UPDATE DASHBOARD
// // ========================================

// function updateDashboard() {

//     const items = getAdminItems();

//     const waitingItems =
//         items.filter(item => item.status === "waiting");

//     const returnItems =
//         items.filter(item => item.status === "return");

//     const deliveredItems =
//         items.filter(item => item.status === "delivered");


//     const totalElement =
//         document.getElementById("totalItems");

//     const waitingElement =
//         document.getElementById("waitingItems");

//     const returnElement =
//         document.getElementById("returnItems");

//     const deliveredElement =
//         document.getElementById("deliveredItems");


//     if (totalElement) {
//         totalElement.textContent = items.length;
//     }

//     if (waitingElement) {
//         waitingElement.textContent =
//             waitingItems.length;
//     }

//     if (returnElement) {
//         returnElement.textContent =
//             returnItems.length;
//     }

//     if (deliveredElement) {
//         deliveredElement.textContent =
//             deliveredItems.length;
//     }

// }


// // ========================================
// // ADMIN → รายการทั้งหมด
// // ========================================

// function goToGuardItems() {

//     window.location.href =
//         "admin-items.html";

// }


// // ========================================
// // ADMIN → รอเจ้าของยืนยัน
// // ========================================

// function goToWaitingItems() {

//     window.location.href =
//         "admin-waiting.html";

// }


// // ========================================
// // ADMIN → รอการส่งมอบ
// // ========================================

// function goToReturnItems() {

//     window.location.href =
//         "admin-return.html";

// }


// // ========================================
// // ADMIN → ส่งคืนแล้ว
// // ========================================

// function goToDeliveryHistory() {

//     window.location.href =
//         "admin-delivery-history.html";

// }


// // ========================================
// // LOAD
// // ========================================

// updateDashboard();


// // ========================================
// // UPDATE WHEN RETURN TO PAGE
// // ========================================

// window.addEventListener(
//     "pageshow",
//     updateDashboard
// );

import { supabase, requireRole } from './supabaseClient.js';

requireRole(["admin"]);
let currentFilter = "all";

async function updateDashboard() {
    const { data: items, error } = await supabase
        .from("found_items")
        .select("id, description, category, location, status, claim_attempts, claim_locked_at, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", error.message);
        return;
    }

    const totalElement = document.getElementById("totalItems");
    const waitingElement = document.getElementById("waitingItems");
    const returnElement = document.getElementById("returnItems");
    const deliveredElement = document.getElementById("deliveredItems");

    const waitingCount = items.filter((i) => i.status === "waiting").length;
    const returnCount = items.filter((i) => ["claimed", "claim_verified"].includes(i.status)).length;
    const deliveredCount = items.filter((i) => i.status === "returned").length;

    if (totalElement) totalElement.textContent = items.length;
    if (waitingElement) waitingElement.textContent = waitingCount;
    if (returnElement) returnElement.textContent = returnCount;
    if (deliveredElement) deliveredElement.textContent = deliveredCount;

    const adminItemList = document.getElementById("adminItemList");
    if (adminItemList) {
        const visibleItems = items.filter((item) => currentFilter === "all"
            || (currentFilter === "claimed" && ["claimed", "claim_verified"].includes(item.status))
            || item.status === currentFilter);
        adminItemList.innerHTML = visibleItems.length ? visibleItems.map((item) => `
            <article class="admin-item-row">
                <div>
                    <strong>${escapeHtml(item.description || "ไม่ระบุสิ่งของ")}</strong>
                    <small>${escapeHtml(item.id.slice(0, 8))} · ${escapeHtml(item.category || "ไม่ระบุหมวดหมู่")} · ${escapeHtml(item.location || "ไม่ระบุสถานที่")}</small>
                    ${item.claim_attempts ? `<small class="warning-text">ตอบผิด ${item.claim_attempts}/3 ครั้ง${item.claim_locked_at ? ` · ระงับเมื่อ ${new Date(item.claim_locked_at).toLocaleString("th-TH")}` : ""}</small>` : ""}
                </div>
                <span class="status">${escapeHtml(statusText(item.status))}</span>
                <div class="admin-item-actions">
                    <button class="detail-btn" data-action="view" data-id="${item.id}">ดูรายละเอียด</button>
                    <button class="detail-btn danger-btn" data-action="delete" data-id="${item.id}">ลบ</button>
                </div>
            </article>`).join("") : `<div class="empty-state">ไม่มีรายการในหมวดนี้</div>`;

        adminItemList.querySelectorAll("button[data-action]").forEach((button) => {
            button.addEventListener("click", () => handleItemAction(button.dataset.action, button.dataset.id, button));
        });
    }

    const reviewItems = items.filter((item) => item.status === "claim_locked" || Number(item.claim_attempts || 0) >= 3);
    const reviewList = document.getElementById("reviewList");
    const reviewCount = document.getElementById("reviewCount");
    if (reviewCount) reviewCount.textContent = `${reviewItems.length} รายการ`;
    if (reviewList) {
        reviewList.innerHTML = reviewItems.length
            ? reviewItems.map((item) => `
                <button class="review-item" data-id="${item.id}">
                    <strong>${item.description || "ไม่ระบุสิ่งของ"}</strong>
                    <span>${item.id.slice(0, 8)} · ตอบผิดครบ 3 ครั้ง · รอ Admin ตรวจสอบ</span>
                </button>`).join("")
            : `<div class="empty-state">ไม่มีรายการที่ต้องตรวจสอบ</div>`;

        reviewList.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => {
            localStorage.setItem("adminSelectedItemId", button.dataset.id);
            window.location.href = `admin-item-detail.html?id=${encodeURIComponent(button.dataset.id)}`;
        }));
    }
}

function escapeHtml(value) {
    return String(value ?? "-")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function statusText(status) {
    return {
        waiting: "รอยืนยันการรับฝาก",
        claimed: "รอส่งคืนเจ้าของ",
        claim_verified: "รอส่งคืนเจ้าของ",
        returned: "ส่งคืนแล้ว",
        claim_locked: "ระงับการยืนยันแล้ว",
    }[status] || "ไม่ทราบสถานะ";
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
    await updateDashboard();
}

// ========================================
// ADMIN → รายการทั้งหมด / รอเจ้าของยืนยัน / รอการส่งมอบ / ประวัติ
// (window.xxx เพื่อให้ onclick="" ใน HTML เดิมเรียกใช้ได้)
// ========================================

window.goToGuardItems = function () {
    currentFilter = "all";
    updateDashboard();
};

window.goToWaitingItems = function () {
    currentFilter = "waiting";
    updateDashboard();
};

window.goToReturnItems = function () {
    currentFilter = "claimed";
    updateDashboard();
};

window.goToDeliveryHistory = function () {
    currentFilter = "returned";
    updateDashboard();
};

document.getElementById("addItemBtn")?.addEventListener("click", () => {
    window.location.href = "report-found.html";
});

document.getElementById("globalSearch")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.currentTarget.value.trim()) {
        window.location.href = `admin-items.html?search=${encodeURIComponent(event.currentTarget.value.trim())}`;
    }
});

document.querySelector(".notification-btn")?.addEventListener("click", () => {
    alert(`มีรายการที่ต้องตรวจสอบ ${document.getElementById("reviewCount")?.textContent || "0 รายการ"}`);
});

updateDashboard();
window.addEventListener("pageshow", updateDashboard);
