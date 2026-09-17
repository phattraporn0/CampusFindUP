// // ========================================
// // ADMIN ITEM DETAIL
// // ========================================


// // รหัสรายการที่เลือก
// const selectedId =
//     localStorage.getItem("adminSelectedItemId");


// // พื้นที่แสดงรายละเอียด
// const detailContent =
//     document.getElementById("detailContent");


// // ========================================
// // ดึงข้อมูลรายการทั้งหมด
// // ========================================

// let items =
//     JSON.parse(
//         localStorage.getItem("adminItems")
//     ) || [];


// // ========================================
// // หารายการที่เลือก
// // ========================================

// const item =
//     items.find(function (data) {

//         return String(data.id) === String(selectedId);

//     });


// // ========================================
// // ถ้าไม่พบข้อมูล
// // ========================================

// if (!item) {

//     detailContent.innerHTML = `

//         <div class="detail-card">

//             <div class="detail-body">

//                 <h2>ไม่พบข้อมูลรายการ</h2>

//                 <p>
//                     ไม่พบข้อมูลของสิ่งของรายการนี้
//                 </p>

//             </div>

//         </div>

//     `;

// }


// // ========================================
// // แสดงข้อมูล
// // ========================================

// else {

//     detailContent.innerHTML = `

//         <div class="detail-card">


//             <!-- HEADER -->

//             <div class="detail-header">

//                 <div>

//                     <h1>
//                         ${item.itemName || "ไม่ระบุชื่อสิ่งของ"}
//                     </h1>

//                     <div class="item-code">

//                         รหัสรายการ:
//                         ${item.id || "-"}

//                     </div>

//                 </div>


//                 <span class="status">

//                     ${item.status || "รอตรวจสอบ"}

//                 </span>

//             </div>


//             <!-- BODY -->

//             <div class="detail-body">


//                 <!-- IMAGE -->

//                 <div class="item-image">

//                     ${
//                         item.image

//                         ?

//                         `<img
//                             src="${item.image}"
//                             alt="รูปสิ่งของ"
//                         >`

//                         :

//                         `
//                         <div class="no-image">

//                             <i class="fa-regular fa-image"></i>

//                             <p>
//                                 ไม่มีรูปภาพสิ่งของ
//                             </p>

//                         </div>
//                         `
//                     }

//                 </div>


//                 <!-- BASIC INFORMATION -->

//                 <section class="info-section">

//                     <h2>
//                         <i class="fa-solid fa-box"></i>
//                         ข้อมูลสิ่งของ
//                     </h2>


//                     <div class="info-grid">


//                         <div class="info-box">

//                             <div class="info-label">
//                                 หมวดหมู่
//                             </div>

//                             <div class="info-value">
//                                 ${item.category || "-"}
//                             </div>

//                         </div>


//                         <div class="info-box">

//                             <div class="info-label">
//                                 ชื่อสิ่งของ
//                             </div>

//                             <div class="info-value">
//                                 ${item.itemName || "-"}
//                             </div>

//                         </div>


//                         <div class="info-box">

//                             <div class="info-label">
//                                 สถานที่พบ
//                             </div>

//                             <div class="info-value">
//                                 ${item.location || "-"}
//                             </div>

//                         </div>


//                         <div class="info-box">

//                             <div class="info-label">
//                                 วันที่พบ
//                             </div>

//                             <div class="info-value">
//                                 ${item.date || "-"}
//                             </div>

//                         </div>


//                         <div class="info-box">

//                             <div class="info-label">
//                                 เวลาที่พบ
//                             </div>

//                             <div class="info-value">
//                                 ${item.time || "-"}
//                             </div>

//                         </div>


//                         <div class="info-box full">

//                             <div class="info-label">
//                                 รายละเอียดของสิ่งของ
//                             </div>

//                             <div class="info-value">
//                                 ${item.description || "-"}
//                             </div>

//                         </div>

//                     </div>

//                 </section>



//                 <!-- SPECIAL DETAIL -->

//                 <section class="info-section">

//                     <h2>
//                         <i class="fa-solid fa-magnifying-glass"></i>
//                         จุดเด่น / ตำหนิ / ลักษณะพิเศษ
//                     </h2>


//                     <div class="special-box">

//                         <h3>
//                             ข้อมูลจากผู้พบ
//                         </h3>

//                         <p>

//                             ${item.specialDetail || "ไม่ได้ระบุ"}

//                         </p>

//                     </div>


//                     ${
//                         item.guardSpecialDetail

//                         ?

//                         `
//                         <div class="guard-box">

//                             <h3>
//                                 ข้อมูลเพิ่มเติมจาก รปภ.
//                             </h3>

//                             <p>

//                                 ${item.guardSpecialDetail}

//                             </p>

//                         </div>
//                         `

//                         :

//                         ""
//                     }

//                 </section>



//                 <!-- FOUND INFORMATION -->

//                 <section class="info-section">

//                     <h2>

//                         <i class="fa-solid fa-location-dot"></i>

//                         ข้อมูลการรับฝาก

//                     </h2>


//                     <div class="info-grid">


//                         <div class="info-box">

//                             <div class="info-label">
//                                 จุดส่งมอบ
//                             </div>

//                             <div class="info-value">

//                                 ${item.dropPoint || "-"}

//                             </div>

//                         </div>


//                         <div class="info-box">

//                             <div class="info-label">
//                                 ผู้แจ้งพบ
//                             </div>

//                             <div class="info-value">

//                                 ${item.finderName || "-"}

//                             </div>

//                         </div>


//                         <div class="info-box full">

//                             <div class="info-label">
//                                 บันทึกเพิ่มเติม
//                             </div>

//                             <div class="info-value">

//                                 ${item.note || "-"}

//                             </div>

//                         </div>


//                     </div>

//                 </section>


//             </div>

//         </div>

//     `;

// }

import { supabase, requireRole } from './supabaseClient.js';

function escapeHtml(value) {
    return String(value ?? "-").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

requireRole(["admin"]);

const selectedId = new URLSearchParams(window.location.search).get("id")
    || localStorage.getItem("adminSelectedItemId");
const detailContent = document.getElementById("detailContent");

function statusText(status) {
    if (status === "waiting") return "รอยืนยันการรับฝาก";
    if (status === "claimed" || status === "claim_verified") return "รอส่งคืนเจ้าของ";
    if (status === "returned") return "ส่งคืนแล้ว";
    return "ไม่ทราบสถานะ";
}

async function loadDetail() {
    if (!selectedId) {
        detailContent.innerHTML = `<div class="detail-card"><div class="detail-body"><h2>ไม่พบข้อมูลรายการ</h2></div></div>`;
        return;
    }

    const { data: item, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("id", selectedId)
        .single();

    if (error || !item) {
        detailContent.innerHTML = `<div class="detail-card"><div class="detail-body"><h2>ไม่พบข้อมูลรายการ</h2><p>ไม่พบข้อมูลของสิ่งของรายการนี้</p></div></div>`;
        return;
    }

    // ดึงชื่อผู้แจ้งพบ (ไม่จำเป็น แต่ทำให้เห็นข้อมูลครบเหมือนต้นฉบับ)
    let finderName = "-";
    if (item.reporter_id) {
        const { data: reporter } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", item.reporter_id)
            .single();
        if (reporter) finderName = reporter.display_name || reporter.full_name || "-";
    }

    detailContent.innerHTML = `
        <div class="detail-card">

            <div class="detail-header">
                <div>
                    <h1>${item.description || "ไม่ระบุชื่อสิ่งของ"}</h1>
                    <div class="item-code">รหัสรายการ: ${item.id.slice(0, 8)}</div>
                </div>
                <span class="status">${statusText(item.status)}</span>
            </div>

            <div class="detail-body">

                <div class="item-image">
                    ${item.image_url
                        ? `<img src="${item.image_url}" alt="รูปสิ่งของ">`
                        : `<div class="no-image"><i class="fa-regular fa-image"></i><p>ไม่มีรูปภาพสิ่งของ</p></div>`}
                </div>

                <section class="info-section">
                    <h2><i class="fa-solid fa-box"></i> ข้อมูลสิ่งของ</h2>
                    <div class="info-grid">
                        <div class="info-box"><div class="info-label">หมวดหมู่</div><div class="info-value">${item.category || "-"}</div></div>
                        <div class="info-box"><div class="info-label">สถานที่พบ</div><div class="info-value">${item.location || "-"}</div></div>
                        <div class="info-box"><div class="info-label">วันที่พบ</div><div class="info-value">${item.found_date || "-"}</div></div>
                        <div class="info-box"><div class="info-label">เวลาที่พบ</div><div class="info-value">${item.found_time || "-"}</div></div>
                        <div class="info-box full"><div class="info-label">รายละเอียดของสิ่งของ</div><div class="info-value">${item.description || "-"}</div></div>
                    </div>
                </section>

                <section class="info-section">
                    <h2><i class="fa-solid fa-magnifying-glass"></i> จุดเด่น / ตำหนิ / ลักษณะพิเศษ</h2>
                    <div class="special-box">
                        <h3>ข้อมูลจากผู้พบ</h3>
                        <p>${item.defect || "ไม่ได้ระบุ"}</p>
                    </div>
                    ${item.guard_remark
                        ? `<div class="guard-box"><h3>ข้อมูลเพิ่มเติมจาก รปภ.</h3><p>${item.guard_remark}</p></div>`
                        : ""}
                </section>

                <section class="info-section">
                    <h2><i class="fa-solid fa-location-dot"></i> ข้อมูลการรับฝาก</h2>
                    <div class="info-grid">
                        <div class="info-box"><div class="info-label">จุดส่งมอบ</div><div class="info-value">${item.storage_location || "-"}</div></div>
                        <div class="info-box"><div class="info-label">ผู้แจ้งพบ</div><div class="info-value">${finderName}</div></div>
                        <div class="info-box full"><div class="info-label">บันทึกเพิ่มเติม</div><div class="info-value">${item.additional_note || "-"}</div></div>
                    </div>
                </section>

            </div>
        </div>
    `;

    const { data: attempts, error: attemptsError } = await supabase
        .from("claim_attempt_logs")
        .select("attempt_no, attempted_at, submitted_answer")
        .eq("found_item_id", item.id)
        .order("attempted_at", { ascending: false });

    const attemptRows = attempts?.length
        ? attempts.map((a) => `<li>ครั้งที่ ${a.attempt_no} · คำตอบ: ${escapeHtml(a.submitted_answer || "-")} · ${new Date(a.attempted_at).toLocaleString("th-TH")}</li>`).join("")
        : (item.claim_attempts > 0 ? `<li>พบการตอบผิดแล้ว ${item.claim_attempts} ครั้ง${item.claim_locked_at ? ` · ระงับเมื่อ ${new Date(item.claim_locked_at).toLocaleString("th-TH")}` : ""}${attemptsError ? " · ยังไม่ได้สร้างตารางประวัติรายครั้ง" : ""}</li>` : "<li>ยังไม่มีประวัติการตอบผิด</li>");

    detailContent.insertAdjacentHTML("beforeend", `
        ${item.claim_token ? `<section class="info-section"><h2>QR สำหรับรับของ</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`CampusFind-UP-Claim:${item.claim_token}`)}" alt="QR สำหรับรับของ"><p>QR นี้หมดอายุ ${item.claim_expires_at ? new Date(item.claim_expires_at).toLocaleString("th-TH") : "ภายใน 24 ชั่วโมง"}</p></section>` : ""}
        <section class="info-section admin-controls">
            <h2>การจัดการรายการ</h2>
            ${item.status === "claim_locked" ? `<button id="approveClaimBtn" class="detail-btn">อนุมัติแทนเจ้าของ</button>` : ""}
            <button id="resetClaimBtn" class="detail-btn">รีเซ็ตการยืนยันตัวตนเจ้าของ</button>
            <button id="deleteItemBtn" class="detail-btn danger-btn">ลบรายการ</button>
        </section>
        <section class="info-section">
            <h2>ประวัติการยืนยันคำตอบผิด</h2>
            <p>ตอบผิดทั้งหมด ${item.claim_attempts || 0} / 3 ครั้ง</p>
            <ul>${attemptRows}</ul>
        </section>
    `);

    document.getElementById("approveClaimBtn")?.addEventListener("click", async () => {
        if (!confirm("ต้องการอนุมัติการยืนยันตัวตนแทนเจ้าของรายการนี้หรือไม่?")) return;
        const { error } = await supabase.rpc("admin_approve_claim", { p_found_item_id: item.id });
        if (error) return alert(`อนุมัติไม่สำเร็จ: ${error.message}`);
        alert("อนุมัติแทนเจ้าของเรียบร้อยแล้ว ระบบสร้าง QR สำหรับรับของให้แล้ว");
        loadDetail();
    });

    document.getElementById("resetClaimBtn").addEventListener("click", async () => {
        if (!confirm("ต้องการรีเซ็ตเฉพาะการยืนยันตัวตนของเจ้าของหรือไม่? ข้อมูลการรับฝากของ รปภ. จะไม่ถูกแก้ไข")) return;
        const { data: updatedItem, error: updateError } = await supabase.from("found_items").update({
            claim_attempts: 0,
            claim_locked_at: null,
            claim_locked_from_status: null,
            status: item.status === "claim_locked" ? (item.claim_locked_from_status || "waiting") : item.status,
        }).eq("id", item.id).select("id, claim_attempts, status").single();
        if (updateError) return alert(`รีเซ็ตไม่สำเร็จ: ${updateError.message}`);
        if (!updatedItem || updatedItem.claim_attempts !== 0) return alert("รีเซ็ตไม่สำเร็จ: ระบบยังอ่านค่าจำนวนครั้งเดิมจากฐานข้อมูล");
        alert("รีเซ็ตการยืนยันเรียบร้อยแล้ว");
        loadDetail();
    });

    document.getElementById("deleteItemBtn").addEventListener("click", async () => {
        if (!confirm("ต้องการลบรายการนี้ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้")) return;
        const { error } = await supabase.from("found_items").delete().eq("id", item.id);
        if (error) return alert(`ลบไม่สำเร็จ: ${error.message}`);
        window.location.href = "admin-items.html";
    });
}

loadDetail();
