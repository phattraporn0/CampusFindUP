// // // =====================================
// // // CATEGORY
// // // =====================================

// // const category = document.getElementById("category");
// // const otherCategoryBox = document.getElementById("otherCategoryBox");
// // const otherCategoryInput = document.getElementById("otherCategory");

// // if (category) {

// //     category.addEventListener("change", function () {

// //         if (this.value === "other") {

// //             if (otherCategoryBox) {
// //                 otherCategoryBox.style.display = "block";
// //             }

// //         } else {

// //             if (otherCategoryBox) {
// //                 otherCategoryBox.style.display = "none";
// //             }

// //             if (otherCategoryInput) {
// //                 otherCategoryInput.value = "";
// //             }

// //         }

// //     });

// // }


// // // =====================================
// // // UPLOAD IMAGE
// // // =====================================

// // const imageInput = document.getElementById("itemImage");
// // const uploadBox = document.querySelector(".upload-box");

// // if (imageInput && uploadBox) {

// //     imageInput.addEventListener("change", function () {

// //         if (this.files.length > 0) {

// //             const file = this.files[0];

// //             uploadBox.innerHTML = `
// //                 <div class="upload-icon">
// //                     <i class="fa-solid fa-circle-check"></i>
// //                 </div>

// //                 <h3>${file.name}</h3>

// //                 <p>เลือกรูปภาพเรียบร้อยแล้ว</p>
// //             `;

// //         }

// //     });

// // }


// // // =====================================
// // // CANCEL BUTTON
// // // =====================================

// // const cancelBtn = document.querySelector(".cancel-btn");

// // if (cancelBtn) {

// //     cancelBtn.addEventListener("click", function () {

// //         window.location.href = "dashboard.html";

// //     });

// // }


// // // =====================================
// // // SAVE BUTTON
// // // =====================================

// // const saveBtn = document.querySelector(".save-btn");

// // if (saveBtn) {

// //     saveBtn.addEventListener("click", function () {

// //         // -----------------------------
// //         // ดึงข้อมูลจากหน้าแจ้งพบ
// //         // -----------------------------

// //         const categoryValue =
// //             document.getElementById("category")?.value || "";

// //         const otherCategory =
// //             document.getElementById("otherCategory")?.value || "";

// //         const description =
// //             document.getElementById("itemDescription")?.value || "";

// //         const defect =
// //             document.getElementById("itemDefect")?.value || "";


// //         // -----------------------------
// //         // ตรวจสอบช่องจุดเด่น / ตำหนิ
// //         // -----------------------------

// //         if (defect.trim() === "") {

// //             alert("กรุณากรอกจุดเด่น / ตำหนิของสิ่งของ");

// //             return;

// //         }


// //         // -----------------------------
// //         // สร้างข้อมูลสิ่งของ
// //         // -----------------------------

// //         const foundItem = {

// //             category:
// //                 categoryValue === "other"
// //                     ? otherCategory
// //                     : categoryValue,

// //             description: description,

// //             defect: defect

// //         };


// //         // -----------------------------
// //         // เก็บข้อมูลไว้ในเครื่อง
// //         // -----------------------------

// //         localStorage.setItem(
// //             "foundItemData",
// //             JSON.stringify(foundItem)
// //         );


// //         // -----------------------------
// //         // ไปหน้าสำเร็จ
// //         // -----------------------------

// //         window.location.href = "report-found-success.html";

// //     });

// // }
// import { supabase, requireLogin } from './supabaseClient.js';

// let currentUser = null;
// requireLogin().then((user) => { currentUser = user; });

// // =====================================
// // CATEGORY (เหมือนเดิม)
// // =====================================

// const category = document.getElementById("category");
// const otherCategoryBox = document.getElementById("otherCategoryBox");
// const otherCategoryInput = document.getElementById("otherCategory");

// if (category) {
//     category.addEventListener("change", function () {
//         if (this.value === "other") {
//             if (otherCategoryBox) otherCategoryBox.style.display = "block";
//         } else {
//             if (otherCategoryBox) otherCategoryBox.style.display = "none";
//             if (otherCategoryInput) otherCategoryInput.value = "";
//         }
//     });
// }

// // =====================================
// // UPLOAD IMAGE
// // =====================================

// let selectedFile = null;

// const imageInput = document.getElementById("itemImage");
// const uploadBox = document.querySelector(".upload-box");

// if (imageInput && uploadBox) {
//     imageInput.addEventListener("change", function () {
//         if (this.files.length > 0) {
//             selectedFile = this.files[0];
//             uploadBox.innerHTML = `
//                 <div class="upload-icon"><i class="fa-solid fa-circle-check"></i></div>
//                 <h3>${selectedFile.name}</h3>
//                 <p>เลือกรูปภาพเรียบร้อยแล้ว</p>
//             `;
//         }
//     });
// }

// // =====================================
// // CANCEL BUTTON (เหมือนเดิม)
// // =====================================

// const cancelBtn = document.querySelector(".cancel-btn");
// if (cancelBtn) {
//     cancelBtn.addEventListener("click", function () {
//         window.location.href = "dashboard.html";
//     });
// }

// // =====================================
// // SAVE BUTTON → บันทึกลง Supabase
// // =====================================

// const saveBtn = document.querySelector(".save-btn");

// if (saveBtn) {

//     saveBtn.addEventListener("click", async function () {

//         const categoryValue = document.getElementById("category")?.value || "";
//         const otherCategory = document.getElementById("otherCategory")?.value || "";
//         const description = document.getElementById("itemDescription")?.value.trim() || "";
//         const defect = document.getElementById("itemDefect")?.value.trim() || "";
//         const foundLocation = document.getElementById("foundLocation")?.value.trim() || "";
//         const foundDate = document.getElementById("foundDate")?.value || "";
//         const foundTime = document.getElementById("foundTime")?.value || "";
//         const storageLocation = document.getElementById("storageLocation")?.value || "";
//         const additionalNote = document.getElementById("additionalNote")?.value.trim() || "";

//         if (!foundLocation) { alert("กรุณากรอกสถานที่พบ"); return; }
//         if (!foundDate) { alert("กรุณาเลือกวันที่พบ"); return; }
//         if (!description) { alert("กรุณากรอกรายละเอียดของสิ่งของ"); return; }
//         if (defect === "") { alert("กรุณากรอกจุดเด่น / ตำหนิของสิ่งของ"); return; }

//         if (!currentUser) {
//             alert("กรุณาเข้าสู่ระบบก่อนแจ้งพบของ");
//             window.location.href = "login.html";
//             return;
//         }

//         const finalCategory = categoryValue === "other" ? otherCategory : categoryValue;

//         saveBtn.disabled = true;
//         saveBtn.textContent = "กำลังบันทึก...";

//         let imageUrl = null;
//         if (selectedFile) {
//             // const filePath = `found/${currentUser.id}/${Date.now()}_${selectedFile.name}`;
//             const fileExt = selectedFile.name.split('.').pop();
// const filePath = `found/${currentUser.id}/${Date.now()}.${fileExt}`;
//             const { error: uploadError } = await supabase
//                 .storage
//                 .from("item-photos")
//                 .upload(filePath, selectedFile);

//             if (uploadError) {
//                 alert("อัปโหลดรูปภาพไม่สำเร็จ: " + uploadError.message);
//             } else {
//                 const { data: publicUrlData } = supabase
//                     .storage
//                     .from("item-photos")
//                     .getPublicUrl(filePath);
//                 imageUrl = publicUrlData.publicUrl;
//             }
//         }

//         const { data, error } = await supabase
//             .from("found_items")
//             .insert({
//                 reporter_id: currentUser.id,
//                 category: finalCategory,
//                 description: description,
//                 defect: defect,              // เก็บเป็นคำตอบลับสำหรับยืนยันความเป็นเจ้าของ
//                 location: foundLocation,
//                 found_date: foundDate,
//                 found_time: foundTime || null,
//                 storage_location: storageLocation,
//                 additional_note: additionalNote || null,
//                 image_url: imageUrl,
//             })
//             .select()
//             .single();

//         saveBtn.disabled = false;
//         saveBtn.textContent = "บันทึกข้อมูล";

//         if (error) {
//             alert("บันทึกไม่สำเร็จ: " + error.message);
//             return;
//         }

//         localStorage.setItem("foundItem", JSON.stringify(data));
//         window.location.href = "report-found-success.html";
//     });

// }

import { supabase, requireRole } from './supabaseClient.js';

let currentUser = null;
requireRole(["user"]).then((user) => { currentUser = user; });

// =====================================
// CATEGORY (เหมือนเดิม)
// =====================================

const category = document.getElementById("category");
const otherCategoryBox = document.getElementById("otherCategoryBox");
const otherCategoryInput = document.getElementById("otherCategory");

// Use the same button-style category selector as the lost-item form while
// keeping the original select as the value source for the submit handler.
if (category) {
    const categoryOptions = [
        ["กระเป๋า", "กระเป๋า"],
        ["บัตร/เอกสาร", "บัตร/เอกสาร"],
        ["อุปกรณ์อิเล็กทรอนิกส์", "อุปกรณ์อิเล็กทรอนิกส์"],
        ["กุญแจ", "กุญแจ"],
        ["เครื่องแต่งกาย", "เครื่องแต่งกาย"],
        ["other", "อื่น ๆ"]
    ];
    const categorySelect = category;
    categoryOptions.forEach(([value, label]) => {
        if (![...categorySelect.options].some((option) => option.value === value)) {
            categorySelect.add(new Option(label, value));
        }
    });
    const categorySelectBox = document.createElement("div");
    categorySelectBox.className = "category-select";
    categoryOptions.forEach(([value, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-btn" + (categorySelect.value === value ? " active" : "");
        button.textContent = label;
        button.addEventListener("click", () => {
            categorySelect.value = value;
            categorySelect.dispatchEvent(new Event("change"));
            categorySelectBox.querySelectorAll(".category-btn").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
        });
        categorySelectBox.appendChild(button);
    });
    categorySelect.hidden = true;
    categorySelect.parentElement.insertBefore(categorySelectBox, categorySelect);
}

if (category) {
    category.addEventListener("change", function () {
        if (this.value === "other") {
            if (otherCategoryBox) otherCategoryBox.style.display = "block";
        } else {
            if (otherCategoryBox) otherCategoryBox.style.display = "none";
            if (otherCategoryInput) otherCategoryInput.value = "";
        }
    });
}

// =====================================
// UPLOAD IMAGE
// =====================================

let selectedFile = null;

const imageInput = document.getElementById("itemImage");
const uploadBox = document.querySelector(".upload-box");

if (imageInput && uploadBox) {
    imageInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            selectedFile = this.files[0];
            const previewUrl = URL.createObjectURL(selectedFile);
            uploadBox.innerHTML = `
                <img class="selected-image-preview" src="${previewUrl}" alt="ตัวอย่างรูปสิ่งของ">
                <div class="upload-icon"><i class="fa-solid fa-circle-check"></i></div>
                <h3>${selectedFile.name}</h3>
                <p>เลือกรูปภาพเรียบร้อยแล้ว</p>
            `;
        }
    });
}

// =====================================
// CANCEL BUTTON (เหมือนเดิม)
// =====================================

const cancelBtn = document.querySelector(".cancel-btn");
if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
}

// =====================================
// SAVE BUTTON → บันทึกลง Supabase
// =====================================

const saveBtn = document.querySelector(".save-btn");

if (saveBtn) {

    saveBtn.addEventListener("click", async function () {

        const categoryValue = document.getElementById("category")?.value || "";
        const otherCategory = document.getElementById("otherCategory")?.value || "";
        const description = document.getElementById("itemDescription")?.value.trim() || "";
        const defect = document.getElementById("itemDefect")?.value.trim() || "";
        const foundLocation = document.getElementById("foundLocation")?.value.trim() || "";
        const foundDate = document.getElementById("foundDate")?.value || "";
        const foundTime = document.getElementById("foundTime")?.value || "";
        const storageLocation = document.getElementById("storageLocation")?.value || "";
        const additionalNote = document.getElementById("additionalNote")?.value.trim() || "";

        if (!foundLocation) { alert("กรุณากรอกสถานที่พบ"); return; }
        if (!foundDate) { alert("กรุณาเลือกวันที่พบ"); return; }
        if (!description) { alert("กรุณากรอกรายละเอียดของสิ่งของ"); return; }
        if (defect === "") { alert("กรุณากรอกจุดเด่น / ตำหนิของสิ่งของ"); return; }

        if (!currentUser) {
            alert("กรุณาเข้าสู่ระบบก่อนแจ้งพบของ");
            window.location.href = "login.html";
            return;
        }

        const finalCategory = categoryValue === "other" ? otherCategory : categoryValue;

        saveBtn.disabled = true;
        saveBtn.textContent = "กำลังบันทึก...";

        let imageUrl = null;
        if (selectedFile) {
            const filePath = `found/${currentUser.id}/${Date.now()}_${selectedFile.name}`;
            const { error: uploadError } = await supabase
                .storage
                .from("item-photos")
                .upload(filePath, selectedFile);

            if (uploadError) {
                alert("อัปโหลดรูปภาพไม่สำเร็จ: " + uploadError.message);
            } else {
                const { data: publicUrlData } = supabase
                    .storage
                    .from("item-photos")
                    .getPublicUrl(filePath);
                imageUrl = publicUrlData.publicUrl;
            }
        }

        const { data, error } = await supabase
            .from("found_items")
            .insert({
                reporter_id: currentUser.id,
                category: finalCategory,
                description: description,
                defect: defect,              // เก็บเป็นคำตอบลับสำหรับยืนยันความเป็นเจ้าของ
                location: foundLocation,
                found_date: foundDate,
                found_time: foundTime || null,
                storage_location: storageLocation,
                additional_note: additionalNote || null,
                image_url: imageUrl,
            })
            .select()
            .single();

        saveBtn.disabled = false;
        saveBtn.textContent = "บันทึกข้อมูล";

        if (error) {
            alert("บันทึกไม่สำเร็จ: " + error.message);
            return;
        }

        localStorage.setItem("foundItem", JSON.stringify(data));
        window.location.href = "report-found-success.html";
    });

}
