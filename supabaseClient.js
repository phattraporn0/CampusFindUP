// // supabaseClient.js
// // วางไฟล์นี้ไว้ที่ root โปรเจกต์ (ระดับเดียวกับ script.js, dashboard.js ฯลฯ)
// // แล้วแก้ URL / KEY ด้านล่างเป็นของโปรเจกต์ Supabase ของคุณเอง
// // (Project Settings > API Keys ในหน้า Supabase Dashboard — ใช้ค่าจาก "Publishable key",
// // คีย์รุ่นใหม่ที่ใช้แทน anon key เดิม ปลอดภัยสำหรับใช้ฝั่งเว็บเพราะ RLS ยังคุมสิทธิ์อยู่)

// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// const SUPABASE_URL = "https://mvpptzupubwamnxppjhe.supabase.co";
// const SUPABASE_ANON_KEY = "sb_publishable_raOEpDLdpp6hTsxaBYIFnw_Cc7Yym2R"; // sb_publishable_...

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// // ฟังก์ชันช่วยเช็คว่า login อยู่หรือยัง ใช้ได้ทุกหน้าที่ import ไฟล์นี้
// export async function requireLogin(redirectTo = "login.html") {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) {
//         window.location.href = redirectTo;
//         return null;
//     }
//     return session.user;
// }

// export async function getCurrentProfile() {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) return null;

//     const { data, error } = await supabase
//         .from("profiles")
//         .select("id, role, display_name")
//         .eq("id", session.user.id)
//         .single();

//     if (error) {
//         console.error("ไม่สามารถโหลดบทบาทผู้ใช้:", error.message);
//         return null;
//     }

//     return data;
// }

// export async function requireRole(roles, redirectTo = "dashboard.html") {
//     const user = await requireLogin();
//     if (!user) return null;

//     const profile = await getCurrentProfile();
//     if (!profile || !roles.includes(profile.role)) {
//         alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
//         window.location.href = redirectTo;
//         return null;
//     }

//     return { user, profile };
// }

// supabaseClient.js
// วางไฟล์นี้ไว้ที่ root โปรเจกต์ (ระดับเดียวกับ script.js, dashboard.js ฯลฯ)
// แล้วแก้ URL / KEY ด้านล่างเป็นของโปรเจกต์ Supabase ของคุณเอง
// (Project Settings > API Keys ในหน้า Supabase Dashboard — ใช้ค่าจาก "Publishable key",
// คีย์รุ่นใหม่ที่ใช้แทน anon key เดิม ปลอดภัยสำหรับใช้ฝั่งเว็บเพราะ RLS ยังคุมสิทธิ์อยู่)

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://mvpptzupubwamnxppjhe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_raOEpDLdpp6hTsxaBYIFnw_Cc7Yym2R"; // sb_publishable_...

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// หาว่า role นี้ "บ้าน" ของตัวเองคือหน้าไหน (ใช้ตอน redirect หลัง login และตอนเข้าหน้าผิด)
function homeForRole(role) {
    if (role === "admin") return "admin-dashboard.html";
    if (role === "guard") return "guard-items.html";
    return "dashboard.html";
}

// ดึง role ปัจจุบันของผู้ใช้ที่ login อยู่ (คืนค่า "user" ถ้าไม่มีข้อมูล)
export async function getUserRole(userId) {
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
    return profile?.role || "user";
}

// ฟังก์ชันช่วยเช็คว่า login แล้ว "และ" role ตรงกับที่อนุญาตหรือไม่
// allowedRoles คือ array เช่น ["user"], ["guard"], ["admin"]
// ถ้า role ไม่ตรง จะเด้งกลับไปหน้า "บ้าน" ของ role นั้นเองทันที (ไม่ใช่หน้า login)
export async function requireRole(allowedRoles) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = "login.html";
        return null;
    }

    const user = session.user;
    const role = await getUserRole(user.id);

    if (!allowedRoles.includes(role)) {
        window.location.href = homeForRole(role);
        return null;
    }

    return user;
}

// ฟังก์ชันช่วยเช็คว่า login อยู่หรือยัง (ไม่เช็ค role) ใช้ได้ทุกหน้าที่ import ไฟล์นี้
export async function requireLogin(redirectTo = "login.html") {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = redirectTo;
        return null;
    }
    return session.user;
}