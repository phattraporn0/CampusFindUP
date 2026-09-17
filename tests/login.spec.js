import { test, expect } from '@playwright/test'; //นำเครื่องมือจาก Playwright Test มาใช้
//test ใช้สำหรับ ประกาศ Test Case,สร้างการทดสอบ
//expect ใช้สำหรับ ตรวจสอบผลลัพธ์ที่คาดหวังมั้ย


const LOGIN_URL = 'http://127.0.0.1:5501/login.html';
//LOGIN_URL เพื่อเก็บ URL ของหน้า Login //จะเข้าไปเทสที่นี่
//สร้างทีเดียว จะได้ไม่ต้องเขียนซ้ำหลายครั้ง เทสอื่นๆเลยใช้โค้ด await page.goto(LOGIN_URL);


// test.use({
//   screenshot: 'on',
//   video: 'on',
// }); 

// test.afterEach(async ({ page }, testInfo) => {
//   if (!page.isClosed()) {
//     const screenshot = await page.screenshot({ fullPage: true });

//     await testInfo.attach('Screenshot', {
//       body: screenshot,
//       contentType: 'image/png',
//     });
//   }
// });


//async ใช้ประกาศว่า Function นี้มีการทำงานแบบ Asynchronous(ทำงานแบบไม่ต้องรอให้คำสั่งหรือกระบวนก่อนหน้าเสร็จสิ้นก่อน จึงค่อยไปทำขั้นตอนต่อไป)
//page เป็น Object ของ Playwright ที่แทนหน้าเว็บที่กำลังทดสอบ
//await คือ รอให้คำสั่งนี้ทำงานเสร็จก่อน แล้วค่อยไปคำสั่งถัดไป
//page.getByRole(...) เป็นการระบุตำแหน่ง
//fill() เป็น Function ใช้สำหรับกรอกข้อความลงใน Input
//expect(page) คาดหวังว่าจะมีผลลัพธ์บางอย่าง 
//.toHaveURL() เป็นการยืนยัน ใช้ตรวจสอบว่า URL ปัจจุบันตรงกับที่คาดหวังหรือไม่
//.toBeVisible() หมายถึง ตรวจสอบว่ามีองค์ประกอบนี้แสดงให้ผู้ใช้เห็นอยู่หรือไม่
test('TC001 Lonin สำเร็จ', async ({ page }) => {
  await page.goto(LOGIN_URL); //คำสั่งให้ Browser ไปยัง URL ที่กำหนด
  await page.getByRole('textbox', { name: 'xxxxxx@up.ac.th' }).fill('66000000@up.ac.th'); //ค้นหาช่องกรอกข้อมูลที่มีชื่อ xxxxxx@up.ac.th แล้วกรอก Email 66000000@up.ac.th ลงไป
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill('testpass_01'); //ค้นหาช่องกรอกข้อมูลที่มีชื่อ กรอกรหัสผ่าน แล้วกรอก password testpass_01 ลงไป
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click(); // หาองค์ประกอบที่เป็น button ที่มีชื่อว่าเข้าสู่ระบบ แล้วคลิก
  await expect(page).toHaveURL(/dashboard/); //หลังจากกด Login แล้ว ต้องถูกนำไปหน้า dashboard ถือว่า Login สำเร็จ
});
test('TC002 password ไม่ถูกต้อง', async ({ page }) => { //Email ถูก แต่ Password ผิด ระบบต้องแจ้งเตือน
  await page.goto(LOGIN_URL); 
  await page.getByRole('textbox', { name: 'xxxxxx@up.ac.th' }).fill('66000000@up.ac.th'); //ใช้ Email ที่ถูกต้อง
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill('pass01'); //Password ที่ไม่ถูกต้อง
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือไม่พบบัญชีผู้ใช้')).toBeVisible(); //ระบบต้องแสดงข้อความ "อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือไม่พบบัญชีผู้ใช้" ถ้าเห็นข้อความ → Pass, ถ้าไม่เห็น → Fail
});
test('TC003 ไม่กรอก password', async ({ page }) => { //กรอก Email แต่ไม่กรอก Password ระบบต้องแจ้งเตือน
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'xxxxxx@up.ac.th' }).fill('66000000@up.ac.th');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')).toBeVisible(); //ระบบต้องแสดงข้อความ "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน"
});

test('TC004 email ไม่ถูกต้อง', async ({ page }) => { //Email ไม่ถูกต้อง แต่ Password ถูกต้อง
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'xxxxxx@up.ac.th' }).fill('70000000@up.ac.th'); //ใช้ Email ที่ไม่ถูกต้อง
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill('testpass_01'); 
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือไม่พบบัญชีผู้ใช้')).toBeVisible();
});

test('TC005 email ไม่ถูกต้อง, password ไม่ถูกต้อง', async ({ page }) => {  //Email และ Password ไม่ถูกต้อง 
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'xxxxxx@up.ac.th' }).fill('70000000@up.ac.th'); 
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill('pass01'); //ใช้ password ที่ไม่ถูกต้อง
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือไม่พบบัญชีผู้ใช้')).toBeVisible();
});

test('TC006 email ไม่ถูกต้อง, ไม่กรอก password', async ({ page }) => { //Email ไม่ถูกต้อง และไม่กรอก Password
  await page.getByRole('textbox', { name: 'xxxxxx@up.ac.th' }).fill('70000000@up.ac.th');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')).toBeVisible();
});

test('TC007 ไม่กรอก email', async ({ page }) => { //ไม่กรอกEmail และ Password ถูกต้อง
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill('testpass_01');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')).toBeVisible();
});

test('TC008 ไม่กรอก email, password ไม่ถูกต้อง', async ({ page }) => { //ไม่กรอก Email และ Password ไม่ถูกต้อง
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่าน' }).fill('pass01');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')).toBeVisible();
});

test('TC009 ไม่กรอกข้อมูล', async ({ page }) => { //ไม่กรอก Email และ Password
  await page.goto(LOGIN_URL);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByText('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')).toBeVisible();
});