// // // =====================================
// // // LOAD FOUND ITEM DATA
// // // =====================================

// // const foundItemData =
// //     JSON.parse(localStorage.getItem("foundItemData"));


// // // =====================================
// // // ELEMENTS
// // // =====================================

// // const answerInput =
// //     document.getElementById("answer");

// // const submitAnswer =
// //     document.getElementById("submitAnswer");

// // const attemptCount =
// //     document.getElementById("attemptCount");


// // // =====================================
// // // ATTEMPT
// // // =====================================

// // let attempts = 3;


// // // =====================================
// // // CHECK DATA
// // // =====================================

// // if (!foundItemData || !foundItemData.defect) {

// //     alert("ไม่พบข้อมูลสิ่งของ");

// //     window.location.href = "dashboard.html";

// // }


// // // =====================================
// // // NORMALIZE TEXT
// // // =====================================

// // function normalizeText(text) {

// //     return text
// //         .trim()
// //         .toLowerCase()
// //         .replace(/\s+/g, "");

// // }


// // // =====================================
// // // SUBMIT ANSWER
// // // =====================================

// // if (submitAnswer) {

// //     submitAnswer.addEventListener("click", function () {

// //         const userAnswer =
// //             answerInput.value.trim();


// //         // -----------------------------
// //         // ตรวจว่ากรอกหรือยัง
// //         // -----------------------------

// //         if (userAnswer === "") {

// //             alert("กรุณากรอกคำตอบ");

// //             return;

// //         }


// //         // -----------------------------
// //         // คำตอบที่ถูกต้อง
// //         // -----------------------------

// //         const correctAnswer =
// //             foundItemData.defect;


// //         // -----------------------------
// //         // เปรียบเทียบคำตอบ
// //         // -----------------------------

// //         if (
// //             normalizeText(userAnswer) ===
// //             normalizeText(correctAnswer)
// //         ) {

// //             // =========================
// //             // ตอบถูก
// //             // =========================

// //             localStorage.setItem(
// //                 "claimVerified",
// //                 "true"
// //             );

// //             window.location.href =
// //                 "claim-success.html";

// //             return;

// //         }


// //         // =============================
// //         // ตอบผิด
// //         // =============================

// //         attempts--;

// //         attemptCount.textContent = attempts;


// //         if (attempts > 0) {

// //             alert(
// //                 "คำตอบไม่ถูกต้อง\n" +
// //                 "กรุณาลองใหม่อีกครั้ง"
// //             );

// //             answerInput.value = "";

// //             answerInput.focus();

// //         } else {

// //             // =========================
// //             // ครบ 3 ครั้ง
// //             // =========================

// //             alert(
// //                 "คุณตอบผิดครบ 3 ครั้งแล้ว\n" +
// //                 "ไม่สามารถยืนยันความเป็นเจ้าของได้"
// //             );

// //             submitAnswer.disabled = true;

// //             submitAnswer.style.background =
// //                 "#9CA3AF";

// //             answerInput.disabled = true;

// //         }

// //     });

// // }
// import { supabase, requireLogin } from './supabaseClient.js';

// requireLogin();

// // =====================================
// // LOAD FOUND ITEM ID (เก็บไว้จากหน้ารายละเอียด)
// // =====================================

// const foundItemId = localStorage.getItem("claimFoundItemId");

// if (!foundItemId) {
//     alert("ไม่พบข้อมูลสิ่งของ");
//     window.location.href = "dashboard.html";
// }

// // =====================================
// // ELEMENTS (id เดิมในหน้า HTML)
// // =====================================

// const answerInput = document.getElementById("answer");
// const submitAnswer = document.getElementById("submitAnswer");
// const attemptCount = document.getElementById("attemptCount");

// // =====================================
// // SUBMIT ANSWER → เรียก RPC verify_claim บนฝั่งเซิร์ฟเวอร์
// // (คำตอบลับ "defect" ไม่เคยถูกส่งมาที่ browser เลย — ปลอดภัยกว่าการเทียบใน localStorage)
// // =====================================

// if (submitAnswer) {

//     submitAnswer.addEventListener("click", async function () {

//         const userAnswer = answerInput.value.trim();

//         if (userAnswer === "") {
//             alert("กรุณากรอกคำตอบ");
//             return;
//         }

//         submitAnswer.disabled = true;

//         const { data, error } = await supabase.rpc("verify_claim", {
//             p_found_item_id: foundItemId,
//             p_answer: userAnswer,
//         });

//         submitAnswer.disabled = false;

//         if (error) {
//             alert("เกิดข้อผิดพลาด: " + error.message);
//             return;
//         }

//         if (attemptCount) attemptCount.textContent = data.attempts_left;

//         if (data.success) {
//             localStorage.setItem("claimVerified", "true");
//             localStorage.setItem("claimToken", data.claim_token);
//             const serverExpiry = new Date(data.claim_expires_at);
//             const expiry = Number.isNaN(serverExpiry.getTime()) || serverExpiry <= new Date()
//                 ? new Date(Date.now() + 24 * 60 * 60 * 1000)
//                 : serverExpiry;
//             localStorage.setItem("claimQrExpiresAt", expiry.toISOString());
//             window.location.href = "claim-success.html";
//             return;
//         }

//         if (data.locked) {
//             alert("คุณตอบผิดครบ 3 ครั้งแล้ว\nไม่สามารถยืนยันความเป็นเจ้าของได้");
//             submitAnswer.disabled = true;
//             submitAnswer.style.background = "#9CA3AF";
//             answerInput.disabled = true;
//         } else {
//             alert("คำตอบไม่ถูกต้อง\nกรุณาลองใหม่อีกครั้ง");
//             answerInput.value = "";
//             answerInput.focus();
//         }
//     });

// }


import { supabase, requireRole } from './supabaseClient.js';

requireRole(["user"]);

// =====================================
// LOAD FOUND ITEM ID (เก็บไว้จากหน้ารายละเอียด)
// =====================================

const foundItemId = localStorage.getItem("claimFoundItemId");

if (!foundItemId) {
    alert("ไม่พบข้อมูลสิ่งของ");
    window.location.href = "dashboard.html";
}

// =====================================
// ELEMENTS (id เดิมในหน้า HTML)
// =====================================

const answerInputs = {
    brand: document.getElementById("answerBrand"),
    color: document.getElementById("answerColor"),
    description: document.getElementById("answerDescription"),
    distinctive_feature: document.getElementById("answerDistinctiveFeature")
};
const answerFields = Object.values(answerInputs);
const submitAnswer = document.getElementById("submitAnswer");
const attemptCount = document.getElementById("attemptCount");

async function checkClaimStatus() {
    if (!foundItemId) return;
    const { data: item, error } = await supabase
        .from("found_items")
        .select("status, claim_token, claim_expires_at, claim_attempts")
        .eq("id", foundItemId)
        .single();

    if (error || !item) return;

    const claimIsActive = item.claim_expires_at
        && new Date(item.claim_expires_at).getTime() > Date.now();

    if (item.status === "claim_verified" && item.claim_token && claimIsActive) {
        localStorage.setItem("claimToken", item.claim_token);
        localStorage.setItem("claimExpiresAt", item.claim_expires_at || "");
        localStorage.setItem("claimQrExpiresAt", item.claim_expires_at || "");
        window.location.href = `claim-success.html?item_id=${encodeURIComponent(foundItemId)}`;
        return;
    }

    if (item.status === "claim_verified" && !claimIsActive) {
        if (attemptCount) attemptCount.textContent = "3";
        localStorage.removeItem("claimToken");
        localStorage.removeItem("claimExpiresAt");
        localStorage.removeItem("claimQrExpiresAt");
        return;
    }

    if (attemptCount) attemptCount.textContent = Math.max(0, 3 - (item.claim_attempts || 0));

    if (item.status === "claim_locked") {
        submitAnswer.disabled = true;
        submitAnswer.style.background = "#9CA3AF";
        answerFields.forEach((input) => { input.disabled = true; });
        alert("คุณตอบผิดครบ 3 ครั้งแล้ว\nกรุณารอ Admin ตรวจสอบรายการ");
    }
}

checkClaimStatus();

// =====================================
// SUBMIT ANSWER → เรียก RPC verify_claim บนฝั่งเซิร์ฟเวอร์
// (คำตอบลับ "defect" ไม่เคยถูกส่งมาที่ browser เลย — ปลอดภัยกว่าการเทียบใน localStorage)
// =====================================

if (submitAnswer) {

    submitAnswer.addEventListener("click", async function () {

        const answers = Object.fromEntries(Object.entries(answerInputs).map(([key, input]) => [key, input.value.trim()]));

        if (Object.values(answers).some((value) => !value)) {
            alert("กรุณากรอกคำตอบให้ครบทั้ง 4 ข้อ");
            return;
        }

        submitAnswer.disabled = true;

        const embeddingResults = await Promise.all(Object.entries(answers).map(async ([key, text]) => {
            const result = await supabase.functions.invoke('generate-embedding', {
                body: { text, type: 'query' }
            });
            return [key, result];
        }));
        const embeddingError = embeddingResults.find(([, result]) => result.error || !result.data?.success || !Array.isArray(result.data.embedding));
        if (embeddingError) {
            submitAnswer.disabled = false;
            alert(`สร้างข้อมูลสำหรับตรวจคำตอบไม่สำเร็จ: ${embeddingError[1].error?.message || embeddingError[1].data?.error || 'ข้อมูลไม่ถูกต้อง'}`);
            return;
        }
        const answerEmbeddings = Object.fromEntries(embeddingResults.map(([key, result]) => [key, result.data.embedding]));
        const { data, error } = await supabase.rpc("verify_claim_answers", {
            p_found_item_id: foundItemId,
            p_answers: answerEmbeddings,
        });

        submitAnswer.disabled = false;

        if (error) {
            alert("เกิดข้อผิดพลาด: " + error.message);
            return;
        }

        if (attemptCount) attemptCount.textContent = data.attempts_left;

        if (data.success) {
            localStorage.setItem("claimVerified", "true");
            localStorage.setItem("claimToken", data.claim_token || "");
            localStorage.setItem("claimExpiresAt", data.claim_expires_at || "");
            localStorage.setItem("claimQrExpiresAt", data.claim_expires_at || "");
            window.location.href = `claim-success.html?item_id=${encodeURIComponent(foundItemId)}`;
            return;
        }

        if (data.locked) {
            alert("คุณตอบผิดครบ 3 ครั้งแล้ว\nไม่สามารถยืนยันความเป็นเจ้าของได้");
            submitAnswer.disabled = true;
            submitAnswer.style.background = "#9CA3AF";
            answerFields.forEach((input) => { input.disabled = true; });
        } else if (data.already_claimed) {
            alert("รายการนี้มีผู้ยืนยันความเป็นเจ้าของและยังไม่หมดอายุ QR Code");
            window.location.href = "dashboard.html";
        } else {
            alert("คำตอบไม่ถูกต้อง\nกรุณาลองใหม่อีกครั้ง");
            answerFields.forEach((input) => { input.value = ""; });
            answerInputs.brand.focus();
        }
    });

}
