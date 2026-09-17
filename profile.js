import { supabase, requireLogin } from './supabaseClient.js';

const user = await requireLogin();
if (user) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const emailName = user.email ? user.email.split('@')[0] : '-';
    const role = profile?.role || 'user';
    const roleText = role === 'guard' ? 'เจ้าหน้าที่ รปภ.' : role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน';
    const homePage = role === 'guard' ? 'guard-items.html' : role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';

    document.getElementById('displayName').textContent = user.user_metadata?.display_name || emailName;
    document.getElementById('email').textContent = user.email || '-';
    document.getElementById('role').textContent = roleText;
    document.getElementById('homeLink').href = homePage;

    if (role === 'guard') {
        document.getElementById('profileTitle').textContent = 'ข้อมูลเจ้าหน้าที่';
        document.getElementById('profileSubtitle').textContent = 'ข้อมูลบัญชีสำหรับเจ้าหน้าที่รับฝากและส่งคืนสิ่งของ';
    }
}

document.getElementById('logoutButton').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});
