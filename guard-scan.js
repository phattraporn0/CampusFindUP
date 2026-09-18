import { supabase, requireRole } from './supabaseClient.js';

await requireRole(['guard', 'admin']);

const qrCamera = document.getElementById('qrCamera');
const startQrCamera = document.getElementById('startQrCamera');
const result = document.getElementById('result');
const qrCanvas = document.getElementById('qrCanvas');
let qrStream = null;
let scanning = false;

function showResult(message, error = false) {
    result.hidden = false;
    result.className = error ? 'result error' : 'result';
    result.textContent = message;
}

startQrCamera.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
        showResult('เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง กรุณาเปิดผ่าน HTTPS หรือ localhost', true);
        return;
    }
    try {
        qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        qrCamera.srcObject = qrStream;
        startQrCamera.disabled = true;
        const detector = 'BarcodeDetector' in window ? new BarcodeDetector({ formats: ['qr_code'] }) : null;
        const context = qrCanvas?.getContext('2d', { willReadFrequently: true });
        scanning = true;
        const scan = async () => {
            if (!qrStream || !scanning) return;
            if (qrCamera.readyState >= 2) {
                let rawValue = '';
                if (detector) {
                    try { rawValue = (await detector.detect(qrCamera))[0]?.rawValue || ''; } catch (_) { /* fallback */ }
                } else if (qrCanvas && context && window.jsQR) {
                    qrCanvas.width = qrCamera.videoWidth;
                    qrCanvas.height = qrCamera.videoHeight;
                    context.drawImage(qrCamera, 0, 0, qrCanvas.width, qrCanvas.height);
                    const frame = context.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
                    rawValue = window.jsQR(frame.data, frame.width, frame.height)?.data || '';
                }
                const token = rawValue.replace(/^CampusFind-UP-Claim:/i, '').trim();
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
                    scanning = false;
                    const expectedItemId = localStorage.getItem('selectedGuardItemId');
                    const { data: scannedItem, error: lookupError } = await supabase
                        .from('found_items')
                        .select('id, status')
                        .eq('claim_token', token)
                        .single();
                    if (lookupError || !scannedItem || scannedItem.status !== 'claim_verified') {
                        scanning = true;
                        showResult('QR Code นี้ไม่ใช่รายการที่รอส่งคืน หรือหมดอายุแล้ว', true);
                        requestAnimationFrame(scan);
                        return;
                    }
                    if (expectedItemId && expectedItemId !== scannedItem.id) {
                        scanning = true;
                        showResult('QR Code ไม่ตรงกับรายการที่เลือก กรุณาสแกน QR ของรายการนี้เท่านั้น', true);
                        requestAnimationFrame(scan);
                        return;
                    }
                    qrStream.getTracks().forEach((track) => track.stop());
                    localStorage.setItem('scannedClaimToken', token);
                    window.location.href = 'guard-return-detail.html';
                    return;
                }
            }
            requestAnimationFrame(scan);
        };
        scan();
    } catch (error) {
        startQrCamera.disabled = false;
        showResult('เปิดกล้องไม่ได้: ' + error.message, true);
    }
});
