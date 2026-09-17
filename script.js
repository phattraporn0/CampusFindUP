// // // รหัสผ่าน
// // const password = document.getElementById("password");
// // const togglePassword = document.getElementById("togglePassword");
// // if (password && togglePassword) {
// // togglePassword.addEventListener("click", function () {
// //     if (password.type === "password") {
// //         password.type = "text";
// //         this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
// //     } else {
// //         password.type = "password";
// //         this.innerHTML = '<i class="fa-solid fa-eye"></i>';
// //     }
// // });
// // }

// // // ยืนยันรหัสผ่าน
// // const confirmPassword = document.getElementById("confirmPassword");
// // const toggleConfirm = document.getElementById("toggleConfirm");
// // if (confirmPassword && toggleConfirm) {
// // toggleConfirm.addEventListener("click", function () {
// //     if (confirmPassword.type === "password") {
// //         confirmPassword.type = "text";
// //         this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
// //     } else {
// //         confirmPassword.type = "password";
// //         this.innerHTML = '<i class="fa-solid fa-eye"></i>';
// //     }
// // });
// // }

// // //เข้าสู่ระบบ
// // const loginPassword = document.getElementById("loginPassword");
// // const toggleLoginPassword = document.getElementById("toggleLoginPassword");
// // if (loginPassword && toggleLoginPassword) {
// // toggleLoginPassword.addEventListener("click", function () {
// //     if (loginPassword.type === "password") {
// //         loginPassword.type = "text";
// //         this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
// //     } else {
// //         loginPassword.type = "password";
// //         this.innerHTML = '<i class="fa-solid fa-eye"></i>';
// //     }
// // });
// // }

// // //หน้าหลัก
// // const categoryButtons = document.querySelectorAll(".category-btn");
// // categoryButtons.forEach((button) => {
// //     button.addEventListener("click", () => {
// //         categoryButtons.forEach((btn) => {
// //             btn.classList.remove("active");
// //         });
// //         button.classList.add("active");
// //     });
// // });

// // // ======================================
// // // SEARCH
// // // ======================================

// // const searchInput = document.getElementById("searchInput");

// // if (searchInput) {

// //     searchInput.addEventListener("keyup", function () {

// //         const keyword = this.value.trim().toLowerCase();

// //         console.log("ค้นหา :", keyword);

// //         // เชื่อมฐานข้อมูลภายหลัง

// //     });

// // }

// // // ======================================
// // // FLOATING BUTTON
// // // ======================================

// // const floatingBtn = document.querySelector(".floating-btn");

// // if (floatingBtn) {

// //     floatingBtn.addEventListener("click", () => {

// //         window.location.href = "report.html";

// //     });

// // }

// // // ======================================
// // // REPORT BUTTON
// // // ======================================

// // const reportBtn = document.querySelector(".report-btn");

// // if (reportBtn) {

// //     reportBtn.addEventListener("click", () => {

// //         window.location.href = "report.html";

// //     });

// // }

// // // ======================================
// // // PROFILE
// // // ======================================

// // const profile = document.querySelector(".profile");

// // if (profile) {

// //     profile.style.cursor = "pointer";

// //     profile.addEventListener("click", () => {

// //         window.location.href = "profile.html";

// //     });

// // }

// // // ======================================
// // // PAGE LOAD
// // // ======================================

// // window.addEventListener("load", () => {

// //     document.body.style.opacity = "1";

// // });

// // // ==========================
// // // Login Form
// // // ==========================

// // const loginForm = document.getElementById("loginForm");

// // if (loginForm) {

// //     loginForm.addEventListener("submit", function (e) {

// //         e.preventDefault();

// //         // ไปหน้า Dashboard
// //         window.location.href = "dashboard.html";

// //     });

// // }
// import { supabase, getCurrentProfile } from './supabaseClient.js';

// // รหัสผ่าน
// const password = document.getElementById("password");
// const togglePassword = document.getElementById("togglePassword");
// if (password && togglePassword) {
// togglePassword.addEventListener("click", function () {
//     if (password.type === "password") {
//         password.type = "text";
//         this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
//     } else {
//         password.type = "password";
//         this.innerHTML = '<i class="fa-solid fa-eye"></i>';
//     }
// });
// }

// // ยืนยันรหัสผ่าน
// const confirmPassword = document.getElementById("confirmPassword");
// const toggleConfirm = document.getElementById("toggleConfirm");
// if (confirmPassword && toggleConfirm) {
// toggleConfirm.addEventListener("click", function () {
//     if (confirmPassword.type === "password") {
//         confirmPassword.type = "text";
//         this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
//     } else {
//         confirmPassword.type = "password";
//         this.innerHTML = '<i class="fa-solid fa-eye"></i>';
//     }
// });
// }

// //เข้าสู่ระบบ
// const loginPassword = document.getElementById("loginPassword");
// const toggleLoginPassword = document.getElementById("toggleLoginPassword");
// if (loginPassword && toggleLoginPassword) {
// toggleLoginPassword.addEventListener("click", function () {
//     if (loginPassword.type === "password") {
//         loginPassword.type = "text";
//         this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
//     } else {
//         loginPassword.type = "password";
//         this.innerHTML = '<i class="fa-solid fa-eye"></i>';
//     }
// });
// }

// //หน้าหลัก
// const categoryButtons = document.querySelectorAll(".category-btn");
// categoryButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//         categoryButtons.forEach((btn) => {
//             btn.classList.remove("active");
//         });
//         button.classList.add("active");
//     });
// });

// // ======================================
// // FLOATING BUTTON / PROFILE (เหมือนเดิม)
// // ======================================

// const floatingBtn = document.querySelector(".floating-btn");
// if (floatingBtn) {
//     floatingBtn.addEventListener("click", () => {
//         window.location.href = "report.html";
//     });
// }

// const reportBtn = document.querySelector(".report-btn");
// if (reportBtn) {
//     reportBtn.addEventListener("click", () => {
//         window.location.href = "report.html";
//     });
// }

// const profile = document.querySelector(".profile");
// if (profile) {
//     profile.style.cursor = "pointer";
//     profile.addEventListener("click", () => {
//         window.location.href = "profile.html";
//     });
// }

// window.addEventListener("load", () => {
//     document.body.style.opacity = "1";
// });

// // ==========================
// // REGISTER FORM (index.html)
// // เพิ่ม id="registerForm" ให้ <form> ในไฟล์ index.html ก่อน
// // ==========================

// const registerForm = document.getElementById("registerForm");

// if (registerForm) {

//     const passwordInput = document.getElementById("password");
//     const passwordError = document.createElement("p");
//     passwordError.className = "field-error";
//     passwordError.setAttribute("role", "alert");
//     passwordInput?.closest(".password-box")?.insertAdjacentElement("afterend", passwordError);

//     function setPasswordError(message = "") {
//         passwordError.textContent = message;
//         passwordInput?.classList.toggle("input-error", Boolean(message));
//         passwordInput?.setAttribute("aria-invalid", Boolean(message));
//     }

//     passwordInput?.addEventListener("input", function () {
//         if (this.value.length >= 8) setPasswordError();
//     });

//     registerForm.addEventListener("submit", function (event) {
//         if ((passwordInput?.value.length || 0) < 8) {
//             event.preventDefault();
//             event.stopImmediatePropagation();
//             setPasswordError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
//             passwordInput?.focus();
//         }
//     }, true);

//     registerForm.addEventListener("submit", async function (e) {
//         e.preventDefault();

//         const email = registerForm.querySelector('input[type="email"]').value.trim();
//         const pass = document.getElementById("password").value;
//         const confirmPass = document.getElementById("confirmPassword").value;

//         if (!email.endsWith("@up.ac.th")) {
//             alert("รองรับเฉพาะอีเมลมหาวิทยาลัย (@up.ac.th) เท่านั้น");
//             return;
//         }

//         if (pass.length < 8) {
//             alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
//             return;
//         }

//         if (pass !== confirmPass) {
//             alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
//             return;
//         }

//         const submitBtn = registerForm.querySelector('button[type="submit"]');
//         if (submitBtn) submitBtn.disabled = true;

//         const { data, error } = await supabase.auth.signUp({
//             email: email,
//             password: pass,
//         });

//         if (submitBtn) submitBtn.disabled = false;

//         if (error) {
//             alert("สมัครสมาชิกไม่สำเร็จ: " + error.message);
//             return;
//         }

//         alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
//         window.location.href = "login.html";
//     });

// }

// // ==========================
// // Login Form (login.html)
// // ==========================

// const loginForm = document.getElementById("loginForm");

// if (loginForm) {

//     const loginEmailInput = loginForm.querySelector('input[type="email"]');
//     const loginPasswordInput = document.getElementById("loginPassword");
//     const loginError = document.createElement("p");
//     loginError.className = "field-error";
//     loginError.setAttribute("role", "alert");
//     loginForm.querySelector('button[type="submit"]')?.insertAdjacentElement("beforebegin", loginError);

//     function setLoginError(message = "") {
//         loginError.textContent = message;
//     }

//     [loginEmailInput, loginPasswordInput].forEach((input) => {
//         input?.addEventListener("input", () => {
//             input.classList.remove("input-error");
//             if (loginEmailInput.value.trim() && loginPasswordInput.value) setLoginError();
//         });
//     });

//     loginForm.addEventListener("submit", async function (event) {
//         event.preventDefault();
//         event.stopImmediatePropagation();

//         const emailMissing = !loginEmailInput.value.trim();
//         const passwordMissing = !loginPasswordInput.value;

//         if (emailMissing || passwordMissing) {
//             loginEmailInput.classList.toggle("input-error", emailMissing);
//             loginPasswordInput.classList.toggle("input-error", passwordMissing);
//             setLoginError("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
//             (emailMissing ? loginEmailInput : loginPasswordInput).focus();
//             return;
//         }

//         const submitButton = loginForm.querySelector('button[type="submit"]');
//         submitButton.disabled = true;
//         setLoginError();

//         const { error } = await supabase.auth.signInWithPassword({
//             email: loginEmailInput.value.trim(),
//             password: loginPasswordInput.value,
//         });

//         submitButton.disabled = false;

//         if (error) {
//             setLoginError("อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือไม่พบบัญชีผู้ใช้");
//             loginPasswordInput.classList.add("input-error");
//             loginPasswordInput.focus();
//             return;
//         }

//         const profile = await getCurrentProfile();
//         window.location.href = profile?.role === "admin"
//             ? "admin-dashboard.html"
//             : profile?.role === "guard"
//                 ? "guard-scan.html"
//                 : "dashboard.html";
//     }, true);

//     // loginForm.addEventListener("submit", async function (e) {
//     //     e.preventDefault();

//     //     const email = loginForm.querySelector('input[type="email"]').value.trim();
//     //     const pass = document.getElementById("loginPassword").value;

//     //     const submitBtn = loginForm.querySelector('button[type="submit"]');
//     //     if (submitBtn) submitBtn.disabled = true;

//     //     const { data, error } = await supabase.auth.signInWithPassword({
//     //         email: email,
//     //         password: pass,
//     //     });

//     //     if (submitBtn) submitBtn.disabled = false;

//     //     if (error) {
//     //         alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
//     //         return;
//     //     }

//     //     const profile = await getCurrentProfile();
//     //     const destination = profile?.role === "admin"
//     //         ? "admin-dashboard.html"
//     //         : profile?.role === "guard"
//     //             ? "guard-scan.html"
//     //             : "dashboard.html";

//     //     window.location.href = destination;
//     // });

// }

import { supabase, getUserRole } from './supabaseClient.js';

// รหัสผ่าน
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
if (password && togglePassword) {
togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        password.type = "password";
        this.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
});
}

// ยืนยันรหัสผ่าน
const confirmPassword = document.getElementById("confirmPassword");
const toggleConfirm = document.getElementById("toggleConfirm");
if (confirmPassword && toggleConfirm) {
toggleConfirm.addEventListener("click", function () {
    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        confirmPassword.type = "password";
        this.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
});
}

//เข้าสู่ระบบ
const loginPassword = document.getElementById("loginPassword");
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
if (loginPassword && toggleLoginPassword) {
toggleLoginPassword.addEventListener("click", function () {
    if (loginPassword.type === "password") {
        loginPassword.type = "text";
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        loginPassword.type = "password";
        this.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
});
}

//หน้าหลัก
const categoryButtons = document.querySelectorAll(".category-btn");
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        categoryButtons.forEach((btn) => {
            btn.classList.remove("active");
        });
        button.classList.add("active");
    });
});

// ======================================
// FLOATING BUTTON / PROFILE (เหมือนเดิม)
// ======================================

const floatingBtn = document.querySelector(".floating-btn");
if (floatingBtn) {
    floatingBtn.addEventListener("click", () => {
        window.location.href = "report.html";
    });
}

const reportBtn = document.querySelector(".report-btn");
if (reportBtn) {
    reportBtn.addEventListener("click", () => {
        window.location.href = "report.html";
    });
}

const profile = document.querySelector(".profile");
if (profile) {
    profile.style.cursor = "pointer";
    profile.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

window.addEventListener("load", () => {
    document.body.style.opacity = "1";
});

// ==========================
// REGISTER FORM (index.html)
// เพิ่ม id="registerForm" ให้ <form> ในไฟล์ index.html ก่อน
// ==========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = registerForm.querySelector('input[type="email"]').value.trim();
        const pass = document.getElementById("password").value;
        const confirmPass = document.getElementById("confirmPassword").value;

        if (!email.endsWith("@up.ac.th")) {
            alert("รองรับเฉพาะอีเมลมหาวิทยาลัย (@up.ac.th) เท่านั้น");
            return;
        }

        if (pass.length < 8) {
            alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
            return;
        }

        if (pass !== confirmPass) {
            alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: pass,
        });

        if (submitBtn) submitBtn.disabled = false;

        if (error) {
            alert("สมัครสมาชิกไม่สำเร็จ: " + error.message);
            return;
        }

        alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        window.location.href = "login.html";
    });

}

// ==========================
// Login Form (login.html)
// ==========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value.trim();
        const pass = document.getElementById("loginPassword").value;

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
        });

        if (submitBtn) submitBtn.disabled = false;

        if (error) {
            alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
            return;
        }

        // ไปหน้าตาม role ของผู้ใช้ (user → dashboard, guard → guard-items, admin → admin-dashboard)
        const role = await getUserRole(data.user.id);
        if (role === "admin") {
            window.location.href = "admin-dashboard.html";
        } else if (role === "guard") {
            window.location.href = "guard-items.html";
        } else {
            window.location.href = "dashboard.html";
        }
    });

}