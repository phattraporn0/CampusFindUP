const qrCamera = document.getElementById("qrCamera");
const startQrCamera = document.getElementById("startQrCamera");
const demoScan = document.getElementById("demoScan");
let qrStream;
let scanning = false;

async function startQrScanning() {
    if (!("BarcodeDetector" in window)) {
        alert("เบราว์เซอร์นี้ไม่รองรับการอ่าน QR อัตโนมัติ กรุณาใช้ Chrome บนมือถือ");
        return;
    }
    try {
        qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        qrCamera.srcObject = qrStream;
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        scanning = true;
        const scan = async () => {
            if (!scanning) return;
            if (qrCamera.readyState >= 2) {
                const codes = await detector.detect(qrCamera);
                if (codes[0]?.rawValue) {
                    scanning = false;
                    qrStream.getTracks().forEach((track) => track.stop());
                    window.location.href = `guard-delivery.html?token=${encodeURIComponent(codes[0].rawValue)}`;
                    return;
                }
            }
            requestAnimationFrame(scan);
        };
        scan();
    } catch (error) {
        alert("เปิดกล้องสแกน QR ไม่ได้: " + error.message);
    }
}

startQrCamera?.addEventListener("click", startQrScanning);
demoScan?.addEventListener("click", () => { window.location.href = "guard-delivery.html"; });
