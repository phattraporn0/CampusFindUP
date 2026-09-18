import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['guard', 'admin']);

const itemId = localStorage.getItem('selectedGuardItemId');
const camera = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const startCamera = document.getElementById('startCamera');
const takePhoto = document.getElementById('takePhoto');
const retakePhoto = document.getElementById('retakePhoto');
const savePhoto = document.getElementById('savePhoto');
const result = document.getElementById('result');
let stream = null;
let photoBlob = null;

function showResult(message, error = false) {
    result.hidden = false;
    result.className = error ? 'result error' : 'result';
    result.textContent = message;
}

startCamera.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        camera.srcObject = stream;
        takePhoto.classList.remove('hidden');
        startCamera.classList.add('hidden');
    } catch (error) { showResult('เปิดกล้องไม่ได้: ' + error.message, true); }
});

takePhoto.addEventListener('click', () => {
    if (!camera.videoWidth) return showResult('กรุณารอให้กล้องพร้อมก่อนถ่ายรูป', true);
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    canvas.getContext('2d').drawImage(camera, 0, 0);
    canvas.toBlob((blob) => {
        photoBlob = blob;
        preview.src = URL.createObjectURL(blob);
        preview.classList.remove('hidden');
        camera.classList.add('hidden');
        takePhoto.classList.add('hidden');
        retakePhoto.classList.remove('hidden');
        savePhoto.classList.remove('hidden');
        showResult('ถ่ายรูปสำเร็จ สามารถกดถ่ายใหม่ หรือกดบันทึกรูปเพื่อกลับไปหน้าการเคลมได้');
        stream?.getTracks().forEach((track) => track.stop());
    }, 'image/jpeg', 0.88);
});

retakePhoto.addEventListener('click', () => {
    preview.classList.add('hidden');
    retakePhoto.classList.add('hidden');
    savePhoto.classList.add('hidden');
    startCamera.classList.remove('hidden');
    camera.classList.remove('hidden');
    photoBlob = null;
});

savePhoto.addEventListener('click', async () => {
    if (!itemId || !photoBlob) return showResult('ไม่พบรายการหรือรูปภาพ', true);
    savePhoto.disabled = true;
    const path = `handover/${itemId}/${Date.now()}_owner-with-item.jpg`;
    const { error } = await supabase.storage.from('item-photos').upload(path, photoBlob, { contentType: 'image/jpeg' });
    if (error) {
        savePhoto.disabled = false;
        return showResult('บันทึกรูปไม่สำเร็จ: ' + error.message, true);
    }
    const imageUrl = supabase.storage.from('item-photos').getPublicUrl(path).data.publicUrl;
    localStorage.setItem('handoverPhotoUrl', imageUrl);
    localStorage.setItem('handoverPhotoItemId', itemId);
    showResult('ถ่ายรูปและบันทึกหลักฐานแล้ว กำลังกลับไปหน้าการเคลมเพื่อยืนยันการส่งคืน');
    setTimeout(() => { window.location.href = 'guard-return-detail.html'; }, 500);
    return;
    const scannedClaimToken = localStorage.getItem('scannedClaimToken');
    if (scannedClaimToken) {
        const { data, error: redeemError } = await supabase.rpc('redeem_claim_token', {
            p_claim_token: scannedClaimToken,
            p_note: null,
            p_image_url: imageUrl,
        });
        if (redeemError) {
            savePhoto.disabled = false;
            return showResult('ส่งคืนไม่สำเร็จ: ' + redeemError.message, true);
        }
        localStorage.removeItem('scannedClaimToken');
        showResult(`ส่งมอบ “${data.description || 'สิ่งของ'}” เรียบร้อยแล้ว`);
    } else {
        localStorage.setItem('handoverPhotoUrl', imageUrl);
        showResult('บันทึกรูปหลักฐานเรียบร้อยแล้ว กรุณาสแกน QR Code ต่อ');
    }
    savePhoto.disabled = true;
});
