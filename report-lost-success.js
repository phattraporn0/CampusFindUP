// =====================================
// GET LOST ITEM DATA
// =====================================

const savedData = localStorage.getItem("lostItemData");

if (savedData) {

    const data = JSON.parse(savedData);
    const successImage = document.getElementById("lostSuccessImage");
    if (successImage && data.image_url) {
        successImage.src = data.image_url;
        successImage.style.display = "block";
    }

    // หมวดหมู่
    const category = document.getElementById("successCategory");
    const itemName = document.getElementById("successItemName");
    const time = document.getElementById("successTime");
    const details = document.getElementById("successDetails");
    const dateItem = document.getElementById("successDate")?.closest('.item');
    const timeItem = time?.closest('.item');
    if (dateItem && timeItem) dateItem.after(timeItem);

    if (itemName) itemName.textContent = data.item_name || "-";
    if (time) time.textContent = data.lost_time || "-";
    if (details) details.textContent = data.details || "-";

    if (category) {
        category.textContent = data.category || "-";
    }


    // สถานที่
    const location = document.getElementById("successLocation");

    if (location) {
        location.textContent = data.location || "-";
    }


    // วันที่
    const date = document.getElementById("successDate");

    if (date) {

        if (data.lost_date || data.date) {

            const dateObject = new Date(data.lost_date || data.date);

            date.textContent =
                dateObject.toLocaleDateString("th-TH");

        } else {

            date.textContent = "-";

        }

    }


    // จุดเด่น / ตำหนิ
    const description =
        document.getElementById("successDescription");

    if (description) {

        description.textContent =
            data.description || "-";

    }

}


// =====================================
// Generate Reference ID
// =====================================

const referenceId = "LO-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

document.getElementById("referenceId").textContent =
    referenceId;


// =====================================
// Back Dashboard
// =====================================

const backDashboardBtn =
    document.getElementById("backDashboardBtn");

if (backDashboardBtn) {

    backDashboardBtn.addEventListener("click", function () {

        window.location.href = "dashboard.html";

    });

}


// =====================================
// Track Lost Item
// =====================================

const trackLostBtn =
    document.getElementById("trackLostBtn");

if (trackLostBtn) {

    trackLostBtn.addEventListener("click", function () {

        alert("ระบบติดตามของหายจะเปิดใช้งานเมื่อเชื่อมต่อฐานข้อมูล");

    });

}

