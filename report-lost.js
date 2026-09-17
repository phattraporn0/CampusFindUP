// // // =====================================
// // // CATEGORY
// // // =====================================

// // const categoryButtons = document.querySelectorAll(".category-btn");

// // const categoryInput = document.getElementById("category");

// // const otherCategoryBox =
// //     document.getElementById("otherCategoryBox");

// // const otherCategoryInput =
// //     document.getElementById("otherCategory");


// // categoryButtons.forEach(function (button) {

// //     button.addEventListener("click", function () {

// //         // เอา active ออกจากทุกปุ่ม
// //         categoryButtons.forEach(function (btn) {
// //             btn.classList.remove("active");
// //         });

// //         // เพิ่ม active ให้ปุ่มที่เลือก
// //         this.classList.add("active");

// //         const selectedCategory =
// //             this.textContent.trim();

// //         // เก็บหมวดหมู่
// //         if (categoryInput) {
// //             categoryInput.value = selectedCategory;
// //         }

// //         // ถ้าเลือก "อื่น ๆ"
// //         if (selectedCategory === "อื่น ๆ") {

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

// // });


// // // =====================================
// // // UPLOAD IMAGE
// // // =====================================

// // const imageInput =
// //     document.getElementById("itemImage");

// // const uploadBox =
// //     document.querySelector(".upload-box");


// // if (imageInput && uploadBox) {

// //     imageInput.addEventListener("change", function () {

// //         if (this.files && this.files.length > 0) {

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
// // // SUBMIT LOST ITEM
// // // =====================================

// // const submitLostBtn =
// //     document.querySelector(".submit-btn");


// // if (submitLostBtn) {

// //     submitLostBtn.addEventListener("click", function (event) {

// //         event.preventDefault();

// //         // -----------------------------
// //         // ดึงข้อมูลจากหน้าแจ้งของหาย
// //         // -----------------------------

// //         const itemName =
// //             document.getElementById("itemName")?.value.trim() || "";

// //         const description =
// //             document.getElementById("itemDescription")?.value.trim() || "";

// //         const location =
// //             document.getElementById("lostLocation")?.value.trim() || "";

// //         const date =
// //             document.getElementById("lostDate")?.value || "";

// //         const time =
// //             document.getElementById("lostTime")?.value || "";

// //         const category =
// //             document.getElementById("category")?.value || "";

// //         const otherCategory =
// //             document.getElementById("otherCategory")?.value.trim() || "";


// //         // -----------------------------
// //         // ตรวจสอบข้อมูล
// //         // -----------------------------

// //         if (!category) {

// //             alert("กรุณาเลือกหมวดหมู่สิ่งของ");

// //             return;

// //         }


// //         if (!itemName) {

// //             alert("กรุณากรอกชื่อสิ่งของ / ยี่ห้อ");

// //             return;

// //         }


// //         if (!description) {

// //             alert("กรุณากรอกรายละเอียดของสิ่งของ");

// //             return;

// //         }


// //         if (!location) {

// //             alert("กรุณากรอกสถานที่คาดว่าทำหาย");

// //             return;

// //         }


// //         if (!date) {

// //             alert("กรุณาเลือกวันที่ทำหาย");

// //             return;

// //         }


// //         // -----------------------------
// //         // ถ้าเลือก "อื่น ๆ"
// //         // -----------------------------

// //         let finalCategory = category;

// //         if (category === "อื่น ๆ" && otherCategory) {

// //             finalCategory = otherCategory;

// //         }


// //         // -----------------------------
// //         // สร้างข้อมูล
// //         // -----------------------------

// //         const lostItemData = {

// //             category: finalCategory,

// //             itemName: itemName,

// //             description: description,

// //             location: location,

// //             date: date,

// //             time: time

// //         };


// //         // -----------------------------
// //         // บันทึกข้อมูล
// //         // -----------------------------

// //         localStorage.setItem(
// //             "lostItemData",
// //             JSON.stringify(lostItemData)
// //         );


// //         // -----------------------------
// //         // ไปหน้าสำเร็จ
// //         // -----------------------------

// //         window.location.href =
// //             "report-lost-success.html";

// //     });

// // }
// import { supabase, requireLogin } from './supabaseClient.js';

// let currentUser = null;
// requireLogin().then((user) => { currentUser = user; });

// // =====================================
// // CATEGORY (เหมือนเดิม)
// // =====================================

// const categoryButtons = document.querySelectorAll(".category-btn");
// const categoryInput = document.getElementById("category");
// const otherCategoryBox = document.getElementById("otherCategoryBox");
// const otherCategoryInput = document.getElementById("otherCategory");

// categoryButtons.forEach(function (button) {
//     button.addEventListener("click", function () {
//         categoryButtons.forEach(function (btn) { btn.classList.remove("active"); });
//         this.classList.add("active");
//         const selectedCategory = this.textContent.trim();
//         if (categoryInput) categoryInput.value = selectedCategory;

//         if (selectedCategory === "อื่น ๆ") {
//             if (otherCategoryBox) otherCategoryBox.style.display = "block";
//         } else {
//             if (otherCategoryBox) otherCategoryBox.style.display = "none";
//             if (otherCategoryInput) otherCategoryInput.value = "";
//         }
//     });
// });

// // =====================================
// // UPLOAD IMAGE (เก็บไฟล์ไว้ในตัวแปร ยังไม่อัปโหลดจนกว่าจะกดยืนยัน)
// // =====================================

// let selectedFile = null;

// const imageInput = document.getElementById("itemImage");
// const uploadBox = document.querySelector(".upload-box");

// if (imageInput && uploadBox) {
//     imageInput.addEventListener("change", function () {
//         if (this.files && this.files.length > 0) {
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
// // SUBMIT LOST ITEM → บันทึกลง Supabase
// // =====================================

// const submitLostBtn = document.querySelector(".submit-btn");

// if (submitLostBtn) {

//     submitLostBtn.addEventListener("click", async function (event) {
//         event.preventDefault();

//         const itemName = document.getElementById("itemName")?.value.trim() || "";
//         const description = document.getElementById("itemDescription")?.value.trim() || "";
//         const location = document.getElementById("lostLocation")?.value.trim() || "";
//         const date = document.getElementById("lostDate")?.value || "";
//         const time = document.getElementById("lostTime")?.value || "";
//         const category = document.getElementById("category")?.value || "";
//         const otherCategory = document.getElementById("otherCategory")?.value.trim() || "";

//         if (!category) { alert("กรุณาเลือกหมวดหมู่สิ่งของ"); return; }
//         if (!itemName) { alert("กรุณากรอกชื่อสิ่งของ / ยี่ห้อ"); return; }
//         if (!description) { alert("กรุณากรอกรายละเอียดของสิ่งของ"); return; }
//         if (!location) { alert("กรุณากรอกสถานที่คาดว่าทำหาย"); return; }
//         if (!date) { alert("กรุณาเลือกวันที่ทำหาย"); return; }

//         if (!currentUser) {
//             alert("กรุณาเข้าสู่ระบบก่อนแจ้งของหาย");
//             window.location.href = "login.html";
//             return;
//         }

//         let finalCategory = category;
//         if (category === "อื่น ๆ" && otherCategory) finalCategory = otherCategory;

//         submitLostBtn.disabled = true;
//         submitLostBtn.textContent = "กำลังบันทึก...";

//         // อัปโหลดรูป (ถ้ามี) ไปที่ Storage bucket "item-photos"
//         let imageUrl = null;
//         if (selectedFile) {
//             // const filePath = `lost/${currentUser.id}/${Date.now()}_${selectedFile.name}`;
//             const fileExt = selectedFile.name.split('.').pop();
// const filePath = `lost/${currentUser.id}/${Date.now()}.${fileExt}`;
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
//             .from("lost_items")
//             .insert({
//                 user_id: currentUser.id,
//                 category: finalCategory,
//                 item_name: itemName,
//                 description: description,
//                 location: location,
//                 lost_date: date,
//                 lost_time: time || null,
//                 image_url: imageUrl,
//             })
//             .select()
//             .single();

//         submitLostBtn.disabled = false;
//         submitLostBtn.textContent = "ยืนยันการแจ้งของหาย";

//         if (error) {
//             alert("บันทึกไม่สำเร็จ: " + error.message);
//             return;
//         }

//         localStorage.setItem("lostItemData", JSON.stringify({
//             category: data.category,
//             location: data.location,
//             date: data.lost_date,
//             description: data.description,
//         }));
//         window.location.href = "report-lost-success.html";
//     });

// }

import { supabase, requireRole } from './supabaseClient.js';

let currentUser = null;
requireRole(["user"]).then((user) => { currentUser = user; });

// =====================================
// CATEGORY (เหมือนเดิม)
// =====================================

const categoryButtons = document.querySelectorAll(".category-btn");
const categoryInput = document.getElementById("category");
const otherCategoryBox = document.getElementById("otherCategoryBox");
const otherCategoryInput = document.getElementById("otherCategory");

categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        categoryButtons.forEach(function (btn) { btn.classList.remove("active"); });
        this.classList.add("active");
        const selectedCategory = this.textContent.trim();
        if (categoryInput) categoryInput.value = selectedCategory;

        if (selectedCategory === "อื่น ๆ") {
            if (otherCategoryBox) otherCategoryBox.style.display = "block";
        } else {
            if (otherCategoryBox) otherCategoryBox.style.display = "none";
            if (otherCategoryInput) otherCategoryInput.value = "";
        }
    });
});

// =====================================
// UPLOAD IMAGE (เก็บไฟล์ไว้ในตัวแปร ยังไม่อัปโหลดจนกว่าจะกดยืนยัน)
// =====================================

let selectedFile = null;

const imageInput = document.getElementById("itemImage");
const uploadBox = document.querySelector(".upload-box");

if (imageInput && uploadBox) {
    imageInput.addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
            selectedFile = this.files[0];
            const previewUrl = URL.createObjectURL(selectedFile);
            uploadBox.innerHTML = `
                <img class="selected-image-preview" src="${previewUrl}" alt="ตัวอย่างรูปสิ่งของที่หาย">
                <div class="upload-icon"><i class="fa-solid fa-circle-check"></i></div>
                <h3>${selectedFile.name}</h3>
                <p>เลือกรูปภาพเรียบร้อยแล้ว</p>
            `;
        }
    });
}

// =====================================
// SUBMIT LOST ITEM → บันทึกลง Supabase
// =====================================

const submitLostBtn = document.querySelector(".submit-btn");

if (submitLostBtn) {

    submitLostBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const itemName = document.getElementById("itemName")?.value.trim() || "";
        const description = document.getElementById("itemDescription")?.value.trim() || "";
        const location = document.getElementById("lostLocation")?.value.trim() || "";
        const date = document.getElementById("lostDate")?.value || "";
        const time = document.getElementById("lostTime")?.value || "";
        const category = document.getElementById("category")?.value || "";
        const otherCategory = document.getElementById("otherCategory")?.value.trim() || "";

        if (!category) { alert("กรุณาเลือกหมวดหมู่สิ่งของ"); return; }
        if (!itemName) { alert("กรุณากรอกชื่อสิ่งของ / ยี่ห้อ"); return; }
        if (!description) { alert("กรุณากรอกรายละเอียดของสิ่งของ"); return; }
        if (!location) { alert("กรุณากรอกสถานที่คาดว่าทำหาย"); return; }
        if (!date) { alert("กรุณาเลือกวันที่ทำหาย"); return; }

        if (!currentUser) {
            alert("กรุณาเข้าสู่ระบบก่อนแจ้งของหาย");
            window.location.href = "login.html";
            return;
        }

        let finalCategory = category;
        if (category === "อื่น ๆ" && otherCategory) finalCategory = otherCategory;

        submitLostBtn.disabled = true;
        submitLostBtn.textContent = "กำลังบันทึก...";

        // อัปโหลดรูป (ถ้ามี) ไปที่ Storage bucket "item-photos"
        let imageUrl = null;
        if (selectedFile) {
            const filePath = `lost/${currentUser.id}/${Date.now()}_${selectedFile.name}`;
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
            .from("lost_items")
            .insert({
                user_id: currentUser.id,
                category: finalCategory,
                item_name: itemName,
                description: description,
                location: location,
                lost_date: date,
                lost_time: time || null,
                image_url: imageUrl,
            })
            .select()
            .single();

        submitLostBtn.disabled = false;
        submitLostBtn.textContent = "ยืนยันการแจ้งของหาย";

        if (error) {
            alert("บันทึกไม่สำเร็จ: " + error.message);
            return;
        }

        localStorage.setItem("lostItemData", JSON.stringify(data));
        window.location.href = `report-lost-success.html?lost_id=${encodeURIComponent(data.id)}`;
    });

}
