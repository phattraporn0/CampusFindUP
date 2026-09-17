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


// const deliveryDetail =
//     document.getElementById("deliveryDetail");


// if (!item) {

//     deliveryDetail.innerHTML = `
//         <div class="delivery-card">

//             <div class="delivery-content">

//                 <h2>ไม่พบข้อมูลรายการ</h2>

//             </div>

//         </div>
//     `;

// } else {

//     deliveryDetail.innerHTML = `

//         <div class="delivery-card">

//             <div class="delivery-code">

//                 <span>
//                     รหัสรายการ
//                 </span>

//                 <strong>
//                     ${item.id || "-"}
//                 </strong>

//             </div>


//             <div class="delivery-content">

//                 <div class="item-box">

//                     <div class="item-image">

//                         ${
//                             item.image
//                             ? `<img src="${item.image}">`
//                             : `<span>📦</span>`
//                         }

//                     </div>


//                     <div>

//                         <span>
//                             ${item.category || ""}
//                         </span>

//                         <h2>
//                             ${item.itemName || "-"}
//                         </h2>

//                         <p>
//                             ${item.description || ""}
//                         </p>

//                     </div>

//                 </div>


//                 <div class="owner-box">

//                     <h3>
//                         ผู้รับสิ่งของ
//                     </h3>

//                     <p>
//                         เจ้าของทรัพย์สิน
//                     </p>

//                 </div>

//             </div>

//         </div>

//     `;

// }


// // ========================================
// // CONFIRM DELIVERY
// // ========================================

// document
//     .getElementById("confirmDelivery")
//     .addEventListener("click", function () {

//         if (!item) {

//             alert("ไม่พบข้อมูลรายการ");

//             return;
//         }


//         // เปลี่ยนสถานะเป็นส่งคืนแล้ว

//         item.status = "returned";


//         item.returnedAt =
//             new Date().toISOString();


//         // ลบออกจากรายการรอส่งคืน

//         const newReturnItems =
//             returnItems.filter(
//                 x => String(x.id) !== String(item.id)
//             );


//         localStorage.setItem(
//             "guardReturnItems",
//             JSON.stringify(newReturnItems)
//         );


//         alert("ส่งมอบสิ่งของคืนเรียบร้อยแล้ว");


//         window.location.href =
//             "guard-items.html";

//     });

import { supabase, requireRole } from '../supabaseClient.js';

requireRole(["guard"]);

const scannedToken = new URLSearchParams(window.location.search).get("token");
const selectedId = localStorage.getItem("selectedGuardItemId");
const deliveryDetail = document.getElementById("deliveryDetail");
const evidenceCamera = document.getElementById("evidenceCamera");
const evidenceCanvas = document.getElementById("evidenceCanvas");
const startEvidenceCamera = document.getElementById("startEvidenceCamera");
const captureEvidence = document.getElementById("captureEvidence");
const photoPreview = document.getElementById("photoPreview");

let item = null;
let selectedPhoto = null;
let evidenceStream = null;

startEvidenceCamera?.addEventListener("click", async () => {
    try {
        evidenceStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false,
        });
        evidenceCamera.srcObject = evidenceStream;
        evidenceCamera.hidden = false;
        captureEvidence.hidden = false;
        startEvidenceCamera.hidden = true;
    } catch (error) {
        alert("เปิดกล้องไม่ได้: " + error.message);
    }
});

captureEvidence?.addEventListener("click", () => {
    if (!evidenceCamera.videoWidth) return alert("กรุณารอให้กล้องพร้อมก่อนถ่ายรูป");
    evidenceCanvas.width = evidenceCamera.videoWidth;
    evidenceCanvas.height = evidenceCamera.videoHeight;
    evidenceCanvas.getContext("2d").drawImage(evidenceCamera, 0, 0);
    evidenceCanvas.toBlob((blob) => {
        selectedPhoto = blob;
        photoPreview.src = URL.createObjectURL(blob);
        photoPreview.hidden = false;
        captureEvidence.hidden = true;
        evidenceCamera.hidden = true;
        evidenceStream?.getTracks().forEach((track) => track.stop());
    }, "image/jpeg", 0.88);
});

async function loadItem() {
    if (!selectedId && !scannedToken) {
        deliveryDetail.innerHTML = `<div class="delivery-card"><div class="delivery-content"><h2>ไม่พบข้อมูลรายการ</h2></div></div>`;
        return;
    }

    let query = supabase.from("found_items").select("*");
    query = scannedToken ? query.eq("claim_token", scannedToken) : query.eq("id", selectedId);
    const { data, error } = await query.single();

    if (error || !data) {
        deliveryDetail.innerHTML = `<div class="delivery-card"><div class="delivery-content"><h2>ไม่พบข้อมูลรายการ</h2></div></div>`;
        return;
    }

    item = data;

    // ดึงชื่อผู้รับของ (คนที่ยืนยันความเป็นเจ้าของถูกต้องผ่านหน้าเว็บมาก่อนแล้ว)
    let ownerName = "เจ้าของทรัพย์สิน";
    if (item.claimant_id) {
        const { data: owner } = await supabase
            .from("profiles").select("display_name").eq("id", item.claimant_id).single();
        if (owner?.display_name) ownerName = owner.display_name;
    }

    deliveryDetail.innerHTML = `
        <div class="delivery-card">
            <div class="delivery-code"><span>รหัสรายการ</span><strong>${item.id.slice(0, 8)}</strong></div>
            <div class="delivery-content">
                <div class="item-box">
                    <div class="item-image">${item.image_url ? `<img src="${item.image_url}">` : `<span>📦</span>`}</div>
                    <div>
                        <span>${item.category || ""}</span>
                        <h2>${item.description || "-"}</h2>
                        <p>${item.description || ""}</p>
                    </div>
                </div>
                <div class="owner-box">
                    <h3>ผู้รับสิ่งของ</h3>
                    <p>${ownerName}</p>
                </div>
            </div>
        </div>
    `;
}

document.getElementById("confirmDelivery").addEventListener("click", async function () {
    if (!item) {
        alert("ไม่พบข้อมูลรายการ");
        return;
    }

    const btn = this;
    btn.disabled = true;

    if (!selectedPhoto) {
        btn.disabled = false;
        alert("กรุณาถ่ายรูปเจ้าของคู่กับสิ่งของก่อนยืนยันการส่งมอบ");
        return;
    }

    let evidenceUrl = null;
    const filePath = `handover/${item.id}/${Date.now()}_owner-with-item.jpg`;
    const { error: uploadError } = await supabase.storage
        .from("item-photos")
        .upload(filePath, selectedPhoto, { contentType: "image/jpeg", upsert: false });

    if (uploadError) {
        btn.disabled = false;
        alert("อัปโหลดรูปหลักฐานไม่สำเร็จ: " + uploadError.message);
        return;
    }

    evidenceUrl = supabase.storage.from("item-photos").getPublicUrl(filePath).data.publicUrl;

    const { error } = await supabase.rpc("redeem_claim_token", {
        p_claim_token: item.claim_token,
        p_note: null,
        p_image_url: evidenceUrl,
    });

    btn.disabled = false;

    if (error) {
        alert("บันทึกไม่สำเร็จ: " + error.message);
        return;
    }

    alert("ส่งมอบสิ่งของคืนเรียบร้อยแล้ว");
    window.location.href = "guard-items.html";
});

loadItem();
