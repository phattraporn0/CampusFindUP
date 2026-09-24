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
        const { data: item } = await supabase.from('found_items').select('*').eq('id', editId).eq('reporter_id', user.id).single();
        if (!item) return;
        document.getElementById('itemName').value = item.item_name || '';
        document.getElementById('brand').value = item.brand || '';
        document.getElementById('color').value = item.color || '';
        document.getElementById('material').value = item.material || '';
        document.getElementById('itemDescription').value = item.description || '';
        document.getElementById('itemDefect').value = item.defect || '';
        document.getElementById('distinctiveFeature').value = item.distinctive_feature || '';
        document.getElementById('foundLocation').value = item.location || '';
        document.getElementById('foundDate').value = item.found_date || '';
        document.getElementById('foundTime').value = item.found_time || '';
        document.getElementById('additionalNote').value = item.additional_note || '';
        document.getElementById('storageLocation').value = item.storage_location || '';
        const knownCategory = Object.prototype.hasOwnProperty.call(categorySubcategories, item.category);
        const categoryForForm = knownCategory ? item.category : "other";
        category.value = categoryForForm;
        if (otherCategoryBox) otherCategoryBox.style.display = knownCategory ? "none" : "block";
        if (!knownCategory && otherCategoryInput) otherCategoryInput.value = item.category || '';
        updateSubcategoryOptions(knownCategory ? item.category : "อื่น ๆ", item.subcategory || '');
    }
});

// =====================================
// CATEGORY (เหมือนเดิม)
// =====================================

const category = document.getElementById("category");
const otherCategoryBox = document.getElementById("otherCategoryBox");
const otherCategoryInput = document.getElementById("otherCategory");
const subcategoryInput = document.getElementById("subcategory");
const otherSubcategoryBox = document.getElementById("otherSubcategoryBox");
const otherSubcategoryInput = document.getElementById("otherSubcategory");

function updateSubcategoryOptions(selectedCategory, selectedValue = "") {
    if (!subcategoryInput) return;

    const options = categorySubcategories[selectedCategory] || [];
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
const itemNameInput = document.getElementById("itemName");
if (itemNameInput) {
    const labels = itemNameInput.parentElement.querySelectorAll(':scope > label');
    if (labels.length > 1) labels[0].remove();
}

// Use the same button-style category selector as the lost-item form while
// keeping the original select as the value source for the submit handler.
if (category) {
    const categoryOptions = [
        ["กระเป๋าและสัมภาระ", "กระเป๋าและสัมภาระ"],
        ["บัตรและเอกสาร", "บัตรและเอกสาร"],
        ["อุปกรณ์อิเล็กทรอนิกส์", "อุปกรณ์อิเล็กทรอนิกส์"],
        ["กุญแจและอุปกรณ์ล็อก", "กุญแจและอุปกรณ์ล็อก"],
        ["เครื่องแต่งกายและของใช้ส่วนตัว", "เครื่องแต่งกายและของใช้ส่วนตัว"],
        ["เครื่องเขียนและอุปกรณ์การเรียน", "เครื่องเขียนและอุปกรณ์การเรียน"],
        ["อุปกรณ์กีฬา", "อุปกรณ์กีฬา"],
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
        updateSubcategoryOptions(this.value === "other" ? "อื่น ๆ" : this.value);
        if (this.value === "other") {
            if (otherCategoryBox) otherCategoryBox.style.display = "block";
        } else {
            if (otherCategoryBox) otherCategoryBox.style.display = "none";
            if (otherCategoryInput) otherCategoryInput.value = "";
        }
    });
    updateSubcategoryOptions(category.value === "other" ? "อื่น ๆ" : category.value);
}

// =====================================
// UPLOAD IMAGE
// =====================================

let selectedFile = null;

const imageInput = document.getElementById("itemImage");
const uploadBox = document.querySelector(".upload-box");

const foundLocationInput = document.getElementById('foundLocation');
const foundDateInput = document.getElementById('foundDate');
const foundTimeInput = document.getElementById('foundTime');
const defectInput = document.getElementById('itemDefect');
const photoInput = document.getElementById('itemImage');
const defectGroup = defectInput?.closest('.form-group');
const locationGroup = foundLocationInput?.closest('.form-group');
const dateTimeGroup = foundDateInput?.closest('.two-column');
const photoGroup = photoInput?.closest('.form-group');
if (defectGroup && locationGroup && dateTimeGroup && photoGroup) {
    const parent = photoGroup.parentElement;
    parent.insertBefore(defectGroup, locationGroup);
    parent.insertBefore(locationGroup, photoGroup);
    parent.insertBefore(dateTimeGroup, photoGroup);
}

if (imageInput && uploadBox) {
    imageInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            selectedFile = this.files[0];
            const previewUrl = URL.createObjectURL(selectedFile);
            uploadBox.innerHTML = `<img class="selected-image-preview" src="${previewUrl}" alt="รูปสิ่งของที่พบ">`;
            /* uploadBox.innerHTML = `
                <img class="selected-image-preview" src="${previewUrl}" alt="ตัวอย่างรูปสิ่งของ">
                <div class="upload-icon"><i class="fa-solid fa-circle-check"></i></div>
                <h3>${selectedFile.name}</h3>
                <p>เลือกรูปภาพเรียบร้อยแล้ว</p>
            `; */
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

function buildFoundMatchingText({ itemName, brand, color, material, description, distinctiveFeature }) {
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

function validateFoundEmbeddingResponse(response) {
    if (!response || response.success !== true || !Array.isArray(response.embedding)) {
        throw new Error('Edge Function returned an invalid embedding response.');
    }
    if (response.embedding.length !== 384 || response.dimension !== 384) {
        throw new Error('Embedding dimension must be 384.');
    }
    if (response.embedding.some((value) => typeof value !== 'number' || !Number.isFinite(value))) {
        throw new Error('Embedding contains an invalid numeric value.');
    }
    return response.embedding;
}

const saveBtn = document.querySelector(".save-btn");

if (saveBtn) {

    saveBtn.addEventListener("click", async function () {

        const categoryValue = document.getElementById("category")?.value || "";
        const otherCategory = document.getElementById("otherCategory")?.value || "";
        const selectedSubcategory = document.getElementById("subcategory")?.value || "";
        const otherSubcategory = document.getElementById("otherSubcategory")?.value.trim() || "";
        const finalSubcategory = selectedSubcategory === "อื่น ๆ" ? otherSubcategory : selectedSubcategory;
        const description = document.getElementById("itemDescription")?.value.trim() || "";
        const itemName = document.getElementById("itemName")?.value.trim() || "";
        const brand = document.getElementById("brand")?.value.trim() || "";
        const color = document.getElementById("color")?.value.trim() || "";
        const material = document.getElementById("material")?.value.trim() || "";
        const distinctiveFeature = document.getElementById("distinctiveFeature")?.value.trim() || "";
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

        if (!itemName) { alert("กรุณากรอกชื่อสิ่งของหรือยี่ห้อ"); return; }
        if (Object.prototype.hasOwnProperty.call(categorySubcategories, categoryValue === "other" ? "อื่น ๆ" : categoryValue) && !finalSubcategory) {
            alert("กรุณาเลือกประเภทย่อย");
            return;
        }

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
            const originalExtension = selectedFile.name.includes('.')
                ? selectedFile.name.slice(selectedFile.name.lastIndexOf('.') + 1).toLowerCase()
                : '';
            const safeExtension = originalExtension.replace(/[^a-z0-9]/g, '') || 'bin';
            const filePath = `found/${currentUser.id}/${Date.now()}_${crypto.randomUUID()}.${safeExtension}`;
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
            const { error: updateError } = await supabase.from('found_items').update({
                category: finalCategory,
                subcategory: finalSubcategory || null,
                item_name: itemName,
                brand: brand || null,
                color: color || null,
                material: material || null,
                description,
                defect,
                distinctive_feature: distinctiveFeature || null,
                location: foundLocation,
                found_date: foundDate,
                found_time: foundTime || null,
                storage_location: storageLocation,
                additional_note: additionalNote || null,
                ...(imageUrl ? { image_url: imageUrl } : {})
            }).eq('id', editId).eq('reporter_id', currentUser.id);
            saveBtn.disabled = false;
            if (updateError) return alert(`แก้ไขโพสต์ไม่สำเร็จ: ${updateError.message}`);
            window.location.href = 'dashboard.html';
            return;
        }

        const { data, error } = await supabase
            .from("found_items")
            .insert({
                reporter_id: currentUser.id,
                category: finalCategory,
                subcategory: finalSubcategory || null,
                item_name: itemName,
                brand: brand || null,
                color: color || null,
                material: material || null,
                description: description,
                defect: defect,              // เก็บเป็นคำตอบลับสำหรับยืนยันความเป็นเจ้าของ
                distinctive_feature: distinctiveFeature || null,
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

        const matchingText = buildFoundMatchingText({
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
                    type: 'passage'
                }
            }
        );

        if (embeddingError) {
            alert(`บันทึกข้อมูลแล้ว แต่สร้าง Embedding ไม่สำเร็จ: ${embeddingError.message}`);
            return;
        }

        let embedding;
        try {
            embedding = validateFoundEmbeddingResponse(embeddingResponse);
        } catch (embeddingValidationError) {
            alert(`บันทึกข้อมูลแล้ว แต่ได้รับ Embedding ไม่ถูกต้อง: ${embeddingValidationError.message}`);
            return;
        }

        console.log('[Embedding Debug] Updating found_items.embedding', {
            id: data.id,
            reporter_id: currentUser.id,
            embeddingExists: Boolean(embedding),
            embeddingLength: embedding?.length
        });

        const { data: updatedEmbeddingRow, error: embeddingUpdateError } = await supabase
            .from('found_items')
            .update({ embedding })
            .eq('id', data.id)
            .eq('reporter_id', currentUser.id)
            .select('id')
            .single();

        console.log('[Embedding Debug] UPDATE response', {
            updatedEmbeddingRow,
            embeddingUpdateError
        });

        if (embeddingUpdateError || !updatedEmbeddingRow || updatedEmbeddingRow.id !== data.id) {
            const errorMessage = embeddingUpdateError?.message || 'ไม่พบแถวที่ถูกอัปเดต';
            alert(`บันทึกข้อมูลแล้ว แต่จัดเก็บ Embedding ไม่สำเร็จ: ${errorMessage}`);
            return;
        }

        localStorage.setItem("foundItem", JSON.stringify(data));
        window.location.href = "report-found-success.html";
    });

}
