// @ts-check
import { defineConfig, devices } from '@playwright/test'; //การ นำสิ่งที่ Playwright เตรียมไว้มาใช้งานในไฟล์นี้
//defineConfig เป็น Function ที่ Playwright จัดเตรียมไว้ใช้สำหรับสร้าง Configuration(การกำหนดค่า)
//devices เป็นชุด Configuration ของอุปกรณ์/Browser ที่ Playwright เตรียมไว้ให้
//@playwright/test คือ Package ของ Playwright ปกติถูกติดตั้งผ่าน npm install -D @playwright/test
//ciเป็นแนวทางที่ใช้ใตรวจสอบโค้ด ทดสอบ และนำระบบขึ้นใช้งานเป็นไปโดยอัตโนมัติ

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests', //ไฟล์ test อยู๋ในโฟลเดอร์ tests
  fullyParallel: true, //สามารถให้ Test หลายไฟล์ทำงานแบบงานหลายงานดำเนินการพร้อมกันในเสี้ยววินาทีเดียวกัน
  forbidOnly: !!process.env.CI, //ถ้ากำลังทำงานบน CI ให้ตรวจสอบว่าไม่มี test.only หลงเหลืออยู่
  retries: process.env.CI ? 2 : 0, //กำหนดจำนวนครั้งที่ Playwright จะลอง Test ใหม่เมื่อ Test ล้มเหลว 
  //เงื่อนไข ? ถ้าเป็นจริง : ถ้าเป็นเท็จ //ถ้า CI → Retry 2 ครั้ง ถ้าไม่ใช่ CI → Retry 0 ครั้ง
  workers: process.env.CI ? 1 : undefined, //workers คือจำนวน Worker ที่ใช้รัน Test (Worker คือ "คนงานที่ช่วยกันรัน Test")
  //ถ้าเป็น CI → ใช้ 1 Worke ถ้าไม่ใช่ CI → ใช้ค่า Default ของ Playwright
  testMatch: 'login.spec.js', // กำหนดว่าจะเลือกไฟล์ test ไหนมารัน
  outputDir: 'test-results', //กำหนด Folder สำหรับเก็บผลลัพธ์หรือไฟล์ที่เกิดจากการ Test
  reporter: 'html', //กำหนดรูปแบบรายงานผลการ test 
  use: { //กำหนด ค่าร่วมของ Test
    baseURL: 'http://127.0.0.1:5501', //เว็บไซต์ที่เราจะทดสอบ
    screenshot: 'on', //ให้ถ่าย Screenshot ระหว่างการ Test
    video: 'on', //ให้บันทึก Video ระหว่างการ Test
    trace: 'on', //เก็บรายละเอียดการทำงานของ Test มีประโยชน์มากเวลา Test Error เพราะสามารถย้อนดูได้ว่า "ก่อนที่ Test จะพัง มันทำอะไรไปบ้าง"
    headless: false, //headless หมายถึงการรัน Browser แบบไม่มีหน้าต่าง Browser ให้เห็น
  //ให้แสดง Browser จริงออกมา เวลา Run Test คุณจะเห็น Chrome เปิดขึ้นมาและเห็นมัน เปิดหน้าเว็บ --> กรอก Email --> กรอก Password --> กดปุ่ม --> ตรวจสอบผล
  },

  projects: [ //"ชุดการตั้งค่าสำหรับการรัน Test"
    {
      name: 'chromium', //Chromium เป็น Browser Engine ที่ใช้โดย Browser อย่าง Chrome และ Browser ที่ใช้ Chromium หลายตัว
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

