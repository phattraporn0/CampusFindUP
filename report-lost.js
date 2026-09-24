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
const editId = new URLSearchParams(window.location.search).get('edit_id');

const categorySubcategories = {
    "กระเป๋าและสัมภาระ": ["กระเป๋าเป้", "กระเป๋าสะพาย", "กระเป๋าสตางค์", "กระเป๋าเอกสาร"],
    "บัตรและเอกสาร": ["บัตรนักศึกษา", "บัตรประชาชน", "ใบขับขี่", "เอกสารทั่วไป"],
    "อุปกรณ์อิเล็กทรอนิกส์": ["โทรศัพท์มือถือ", "แท็บเล็ต", "โน้ตบุ๊ก", "หูฟัง", "อุปกรณ์ชาร์จ"],
    "กุญแจและอุปกรณ์ล็อก": ["กุญแจบ้าน", "กุญแจรถ", "คีย์การ์ด", "พวงกุญแจ"],
    "เครื่องแต่งกายและของใช้ส่วนตัว": ["เสื้อผ้า", "รองเท้า", "หมวก", "แว่นตา", "ร่ม"],
    "เครื่องเขียนและอุปกรณ์การเรียน": ["ปากกา", "ดินสอ", "สมุด", "เครื่องคิดเลข"],
    "อุปกรณ์กีฬา": ["ลูกบอล", "รองเท้าออกกำลังกาย", "อุปกรณ์กีฬาอื่น ๆ"],
    "อื่น ๆ": []
};

requireRole(["user"]).then(async (user) => {
    currentUser = user;
    if (editId) {
        const { data: item } = await supabase.from('lost_items').select('*').eq('id', editId).eq('user_id', user.id).single();
        if (!item) return;
        document.getElementById('itemName').value = item.item_name || '';
        document.getElementById('itemDescription').value = item.description || '';
        document.getElementById('brand').value = item.brand || '';
        document.getElementById('color').value = item.color || '';
        document.getElementById('material').value = item.material || '';
        document.getElementById('distinctiveFeature').value = item.distinctive_feature || item.details || '';
        document.getElementById('lostLocation').value = item.location || '';
        document.getElementById('lostDate').value = item.lost_date || '';
        document.getElementById('lostTime').value = item.lost_time || '';
        if (categoryInput) {
            const knownCategory = Object.prototype.hasOwnProperty.call(categorySubcategories, item.category);
            const categoryForForm = knownCategory ? item.category : "อื่น ๆ";
            categoryInput.value = categoryForForm;
            categoryButtons.forEach((button) => button.classList.toggle('active', button.textContent.trim() === categoryForForm));
            if (otherCategoryBox) otherCategoryBox.style.display = knownCategory ? "none" : "block";
            if (!knownCategory) otherCategoryInput.value = item.category || '';
            updateSubcategoryOptions(categoryForForm, item.subcategory || '');
        }
    }
});

// =====================================
// CATEGORY (เหมือนเดิม)
// =====================================

const categoryButtons = document.querySelectorAll(".category-btn");
const categoryInput = document.getElementById("category");
const otherCategoryBox = document.getElementById("otherCategoryBox");
const otherCategoryInput = document.getElementById("otherCategory");
const subcategoryInput = document.getElementById("subcategory");
const otherSubcategoryBox = document.getElementById("otherSubcategoryBox");
const otherSubcategoryInput = document.getElementById("otherSubcategory");

function updateSubcategoryOptions(category, selectedValue = "") {
    if (!subcategoryInput) return;

    const options = categorySubcategories[category] || [];
    const optionsWithOther = [...options, "อื่น ๆ"];
    subcategoryInput.innerHTML = '<option value="">-- เลือกประเภทย่อย --</option>';
    optionsWithOther.forEach((subcategory) => {
        const option = document.createElement("option");
        option.value = subcategory;
        option.textContent = subcategory;
        subcategoryInput.appendChild(option);
    });

    const isCustomSubcategory = selectedValue && !options.includes(selectedValue);
    subcategoryInput.value = isCustomSubcategory ? "อื่น ๆ" : (selectedValue || "");
    if (otherSubcategoryBox) otherSubcategoryBox.style.display = isCustomSubcategory ? "block" : "none";
    if (otherSubcategoryInput) otherSubcategoryInput.value = isCustomSubcategory ? selectedValue : "";
}

if (subcategoryInput) {
    subcategoryInput.addEventListener("change", () => {
        const isOther = subcategoryInput.value === "อื่น ๆ";
        if (otherSubcategoryBox) otherSubcategoryBox.style.display = isOther ? "block" : "none";
        if (!isOther && otherSubcategoryInput) otherSubcategoryInput.value = "";
        if (isOther) otherSubcategoryInput?.focus();
    });
}

categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        categoryButtons.forEach(function (btn) { btn.classList.remove("active"); });
        this.classList.add("active");
        const selectedCategory = this.textContent.trim();
        if (categoryInput) categoryInput.value = selectedCategory;
        updateSubcategoryOptions(selectedCategory);

        if (selectedCategory === "อื่น ๆ") {
            if (otherCategoryBox) otherCategoryBox.style.display = "block";
        } else {
            if (otherCategoryBox) otherCategoryBox.style.display = "none";
            if (otherCategoryInput) otherCategoryInput.value = "";
        }
    });
});

const initialCategory = categoryButtons[0]?.textContent.trim() || categoryInput?.value || "";
if (categoryInput) categoryInput.value = initialCategory;
updateSubcategoryOptions(categoryInput?.value || initialCategory);

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

function buildLostMatchingText({ itemName, brand, color, material, description, distinctiveFeature }) {
    return [
        ["ชื่อสิ่งของ", itemName],
        ["ยี่ห้อ", brand],
        ["สี", color],
        ["วัสดุ", material],
        ["รายละเอียด", description],
        ["จุดสังเกต", distinctiveFeature]
    ]
        .filter(([, value]) => String(value ?? '').trim() !== '')
        .map(([label, value]) => `${label}: ${String(value).trim()}`)
        .join('\n');
}

function validateLostEmbeddingResponse(response) {
    if (!response || response.success !== true || !Array.isArray(response.embedding)) {
        throw new Error('Edge Function returned an invalid embedding response.');
    }
    if (response.dimension !== 384 || response.embedding.length !== 384) {
        throw new Error('Embedding dimension must be 384.');
    }
    if (response.embedding.some((value) => typeof value !== 'number' || !Number.isFinite(value))) {
        throw new Error('Embedding contains an invalid numeric value.');
    }
    return response.embedding;
}

const submitLostBtn = document.querySelector(".submit-btn");

if (submitLostBtn) {

    submitLostBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const itemName = document.getElementById("itemName")?.value.trim() || "";
        const description = document.getElementById("itemDescription")?.value.trim() || "";
        const brand = document.getElementById("brand")?.value.trim() || "";
        const color = document.getElementById("color")?.value.trim() || "";
        const material = document.getElementById("material")?.value.trim() || "";
        const distinctiveFeature = document.getElementById("distinctiveFeature")?.value.trim() || "";
        const location = document.getElementById("lostLocation")?.value.trim() || "";
        const date = document.getElementById("lostDate")?.value || "";
        const time = document.getElementById("lostTime")?.value || "";
        const category = document.getElementById("category")?.value || "";
        const otherCategory = document.getElementById("otherCategory")?.value.trim() || "";
        const selectedSubcategory = document.getElementById("subcategory")?.value || "";
        const otherSubcategory = document.getElementById("otherSubcategory")?.value.trim() || "";
        const finalSubcategory = selectedSubcategory === "อื่น ๆ" ? otherSubcategory : selectedSubcategory;

        if (!category) { alert("กรุณาเลือกหมวดหมู่สิ่งของ"); return; }
        if (!itemName) { alert("กรุณากรอกชื่อสิ่งของ / ยี่ห้อ"); return; }
        if (!description) { alert("กรุณากรอกรายละเอียดของสิ่งของ"); return; }
        if (!location) { alert("กรุณากรอกสถานที่คาดว่าทำหาย"); return; }
        if (!date) { alert("กรุณาเลือกวันที่ทำหาย"); return; }
        if (selectedSubcategory === "อื่น ๆ" && !otherSubcategory) {
            alert("กรุณาระบุประเภทย่อย");
            return;
        }
        if (category !== "อื่น ๆ" && Object.prototype.hasOwnProperty.call(categorySubcategories, category) && !finalSubcategory) {
            alert("กรุณาเลือกประเภทย่อย");
            return;
        }

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
            const originalExtension = selectedFile.name.includes('.')
                ? selectedFile.name.slice(selectedFile.name.lastIndexOf('.') + 1).toLowerCase()
                : '';
            const safeExtension = originalExtension.replace(/[^a-z0-9]/g, '') || 'bin';
            const filePath = `lost/${currentUser.id}/${Date.now()}_${crypto.randomUUID()}.${safeExtension}`;
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

        if (editId) {
            const { error: updateError } = await supabase.from('lost_items').update({
                category: finalCategory,
                subcategory: finalSubcategory || null,
                item_name: itemName,
                brand: brand || null,
                color: color || null,
                material: material || null,
                description,
                details: distinctiveFeature || null,
                distinctive_feature: distinctiveFeature || null,
                location,
                lost_date: date,
                lost_time: time || null,
                ...(imageUrl ? { image_url: imageUrl } : {})
            }).eq('id', editId).eq('user_id', currentUser.id);
            submitLostBtn.disabled = false;
            if (updateError) return alert(`แก้ไขโพสต์ไม่สำเร็จ: ${updateError.message}`);
            window.location.href = `my-lost-detail.html?id=${encodeURIComponent(editId)}`;
            return;
        }

        const { data, error } = await supabase
            .from("lost_items")
            .insert({
                user_id: currentUser.id,
                category: finalCategory,
                subcategory: finalSubcategory || null,
                item_name: itemName,
                brand: brand || null,
                color: color || null,
                material: material || null,
                description: description,
                details: distinctiveFeature || null,
                distinctive_feature: distinctiveFeature || null,
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

        const matchingText = buildLostMatchingText({
            itemName,
            brand,
            color,
            material,
            description,
            distinctiveFeature
        });

        const { data: embeddingResponse, error: embeddingError } = await supabase.functions.invoke(
            'generate-embedding',
            {
                body: {
                    text: matchingText,
                    type: 'query'
                }
            }
        );

        if (embeddingError) {
            alert(`บันทึกข้อมูลแล้ว แต่สร้าง Embedding ไม่สำเร็จ: ${embeddingError.message}`);
            return;
        }

        let embedding;
        try {
            embedding = validateLostEmbeddingResponse(embeddingResponse);
        } catch (embeddingValidationError) {
            alert(`บันทึกข้อมูลแล้ว แต่ได้รับ Embedding ไม่ถูกต้อง: ${embeddingValidationError.message}`);
            return;
        }

        const { data: updatedEmbeddingRow, error: embeddingUpdateError } = await supabase
            .from('lost_items')
            .update({ embedding })
            .eq('id', data.id)
            .eq('user_id', currentUser.id)
            .select('id')
            .single();

        if (
            embeddingUpdateError
            || !updatedEmbeddingRow
            || updatedEmbeddingRow.id !== data.id
        ) {
            const updateMessage = embeddingUpdateError?.message
                || 'ไม่พบแถวข้อมูลที่ถูกอัปเดต หรือรหัสรายการไม่ตรงกัน';
            alert(`บันทึกข้อมูลแล้ว แต่จัดเก็บ Embedding ไม่สำเร็จ: ${updateMessage}`);
            return;
        }

        localStorage.setItem("lostItemData", JSON.stringify(data));
        window.location.href = `report-lost-success.html?lost_id=${encodeURIComponent(data.id)}`;
    });

}

// Final photo-only preview: keep the selected image full-frame.
imageInput?.addEventListener('change', function () {
    const file = this.files?.[0];
    if (!file || !uploadBox) return;
    const url = URL.createObjectURL(file);
    uploadBox.innerHTML = `<img class="selected-image-preview" src="${url}" alt="รูปสิ่งของที่หาย">`;
    uploadBox.classList.add('has-photo');
}, { once: true });
