# CampusFind UP - Hybrid Matching Design

เอกสารนี้เป็นแนวทางออกแบบ Hybrid Matching สำหรับระบบ CampusFind UP โดยอ้างอิงโครงสร้างข้อมูลและโค้ดที่มีอยู่ในโปรเจกต์ปัจจุบัน รวมถึง Evaluation Dataset และ Experiment Protocol ที่มีอยู่แล้ว

เอกสารนี้เป็นข้อเสนอเชิงออกแบบ ไม่ใช่การแก้ไขระบบ Production และไม่ใช่ผลยืนยันความเป็นเจ้าของสิ่งของ

## 1. วัตถุประสงค์

ระบบต้องช่วยจับคู่รายการของหายกับรายการสิ่งของที่พบ โดยใช้ข้อมูลสองลักษณะร่วมกัน:

- Structured Data สำหรับกรองและเปรียบเทียบคุณลักษณะที่มีโครงสร้างชัดเจน
- Semantic Similarity สำหรับเปรียบเทียบความหมายของชื่อสิ่งของ รายละเอียด และจุดสังเกต

Cosine Similarity ใช้เป็นหลักฐานด้านความใกล้เคียงของข้อความเท่านั้น ไม่ควรถูกตีความว่าเป็นหลักฐานยืนยันว่าสิ่งของสองรายการเป็นชิ้นเดียวกัน หรือเป็นของบุคคลเดียวกัน

การยืนยัน Ownership ต้องเป็นขั้นตอนแยกต่างหาก เช่น Claim Verification และการตรวจสอบโดยเจ้าหน้าที่

## 2. ผลจากการทดลอง Embedding ที่มีอยู่

ค่าต่อไปนี้เป็นข้อสังเกตจากผลทดลองที่มีอยู่ในบริบทของโครงการ ไม่ใช่ผลทดลองใหม่จากการสร้างเอกสารนี้:

- Model: `intfloat/multilingual-e5-small`
- Embedding Dimension: `384`
- Prefix strategy: `query` ตามที่ใช้ใน Runner ปัจจุบัน
- Dataset: `evaluation/evaluation-dataset.json`

ตัวอย่างข้อสังเกตที่ต้องระวัง:

- `TC-002` มี Ground Truth เป็น `Highly Similar` และมีค่า Cosine ประมาณ `0.9231`
- `TC-009` มี Ground Truth เป็น `Different` และมีค่า Cosine ประมาณ `0.9226`

ตัวอย่างนี้ชี้ให้เห็นว่าค่า Cosine ของคู่ที่มีความสัมพันธ์ต่างกันอาจอยู่ใกล้กันได้ จึงไม่ควรสร้าง Threshold หรือสรุปความเป็นเจ้าของจากค่าเพียงอย่างเดียว

ห้ามถือค่าตัวอย่างข้างต้นเป็น Threshold, Weight หรือกฎตัดสินผลถาวร

## 3. ข้อมูลที่ใช้ในการจับคู่

### 3.1 Structured Data

ข้อมูลที่เหมาะกับการกรองหรือเปรียบเทียบแบบมีโครงสร้าง:

- `category`
- `subcategory`
- `brand`
- `color`
- `material`
- `location`
- `date`
- `time`

หน้าที่หลักของข้อมูลกลุ่มนี้คือช่วยลด Candidate ที่ไม่เกี่ยวข้อง และช่วยให้ระบบอธิบายได้ว่ารายการสองรายการมีคุณลักษณะใดตรงกันหรือแตกต่างกัน

### 3.2 Semantic Data

ข้อมูลที่เหมาะสำหรับสร้าง Matching Text และ Sentence Embedding:

- `item_name`
- `brand`
- `color`
- `material`
- `description`
- `distinctive_feature`

`brand`, `color` และ `material` สามารถใช้ได้ทั้ง Structured Matching และ Semantic Matching โดยต้องระวังการสะกด ภาษาไทย/อังกฤษ และรูปแบบคำที่แตกต่างกัน

### 3.3 ข้อมูลลับหรือข้อมูลภายใน

ข้อมูลต่อไปนี้ไม่ควรนำไปสร้าง Public Matching Text หรือ Public Embedding:

- `defect` หรือรายละเอียดตำหนิที่เก็บไว้เพื่อยืนยันเจ้าของ
- `guard_remark`
- `storage_location`
- `claim_token`
- `claimant_id`
- `claim_attempts`
- คำตอบหรือข้อมูลภายในของ Claim Verification
- Private Detail ที่ผู้แจ้งตั้งใจเก็บไว้ใช้ตรวจสอบผู้เคลม

ข้อมูลลับควรถูกใช้เฉพาะในขั้น Ownership Verification หรือการตรวจสอบโดยเจ้าหน้าที่

## 4. Matching Text V1

Matching Text ของ Lost และ Found ต้องใช้รูปแบบเดียวกัน เพื่อให้ Embedding Model ได้รับข้อมูลที่มีโครงสร้างเทียบเคียงกัน:

```text
ชื่อสิ่งของ: {item_name}
ยี่ห้อ: {brand}
สี: {color}
วัสดุ: {material}
รายละเอียด: {description}
จุดสังเกต: {distinctive_feature}
```

กติกา:

1. ใช้เฉพาะ Field ที่มีข้อมูลจริง
2. ถ้า Field ว่าง ให้ละบรรทัดนั้นออก
3. ไม่เติมข้อความสมมติ เช่น `ไม่ระบุ`
4. ใช้การ Normalize พื้นฐานให้เหมือนกันระหว่าง Lost และ Found
5. Prefix ของ Model เช่น `query:` ต้องใช้ตามข้อกำหนดของ Model และต้องใช้กฎเดียวกันกับข้อมูลทั้งสองฝั่งในรอบทดลองเดียวกัน
6. ไม่ใส่ข้อมูล Ownership Verification หรือข้อมูลภายในเจ้าหน้าที่

## 5. โครงสร้าง Hybrid Matching

แนวทางหลัก:

```text
Lost Item
    ↓
Category / Subcategory Filtering
    ↓
Structured Attribute Comparison
    ↓
Location / Date / Time Comparison
    ↓
Matching Text
    ↓
Sentence Embedding
    ↓
Cosine Similarity
    ↓
Candidate Matches
    ↓
Ownership Verification
    ↓
Manual Review
    ↓
Return Item
```

### 5.1 Category และ Subcategory Filtering

ใช้ `category` และ `subcategory` เป็นข้อมูลระดับโครงสร้างเพื่อจำกัดรายการที่ควรนำมาเปรียบเทียบต่อ เช่น รายการโทรศัพท์ไม่ควรถูกนำไปเปรียบเทียบกับรายการกระเป๋าเป็น Candidate หลักเพียงเพราะมีสีเดียวกัน

การกรองไม่ควรลบกรณีที่ข้อมูลขาดหรือหมวดหมู่ไม่สมบูรณ์โดยไม่มีนโยบายรองรับ เพราะอาจทำให้รายการที่มีข้อมูลไม่ครบหายไปจาก Candidate ทั้งหมด

### 5.2 Structured Attribute Comparison

เปรียบเทียบ `brand`, `color`, `material`, `location`, `date` และ `time` ตามค่าที่มีจริง โดยแยกให้เห็นว่า:

- ตรงกัน
- แตกต่างกัน
- ฝั่งใดฝั่งหนึ่งไม่มีข้อมูล

ไม่ควรถือว่าข้อมูลที่ว่างเป็นข้อมูลที่ไม่ตรงกันโดยอัตโนมัติ

### 5.3 Semantic Matching

นำ Matching Text V1 ของ Lost และ Found ไปสร้าง Embedding ด้วย Model เดียวกัน แล้วคำนวณ Cosine Similarity เพื่อจัดลำดับความใกล้เคียงของ Candidate

ผลลัพธ์นี้เป็น Semantic Evidence หรือข้อมูลช่วยจัดลำดับ ไม่ใช่ผลยืนยัน Identity

## 6. ความสัมพันธ์กับโค้ดปัจจุบัน

จาก `lost-automatch.js` ปัจจุบันระบบมีโครงสร้างที่สอดคล้องกับแนวคิด Hybrid บางส่วนแล้ว:

- อ่าน Lost จาก `lost_items`
- อ่าน Found จาก `found_items_public`
- Normalize ค่า `category`, `subcategory`, `item_name`, `brand`, `color`, `material`, `description`, `distinctive_feature`, `location`, วันที่ และเวลา
- ใช้ `details` ของ Lost เป็นค่า fallback ของ `distinctive_feature` เมื่อไม่มี `distinctive_feature`
- เปรียบเทียบ Category และ Subcategory
- เปรียบเทียบ Brand, Color และ Material
- เปรียบเทียบข้อความด้วยการ Normalize และตรวจคำที่มีอยู่ในอีกข้อความหนึ่ง
- เปรียบเทียบ Location, Date และ Time
- เรียง Candidate ตามคะแนน Heuristic เดิม

ดังนั้น Matching ปัจจุบันยังเป็น Heuristic/Keyword Matching ไม่ใช่ Sentence Embedding และไม่ใช่ Cosine Similarity

ค่าคะแนนและเงื่อนไขที่มีอยู่ในโค้ดปัจจุบันเป็นพฤติกรรมเดิมของระบบ ไม่ใช่ Weight หรือ Threshold ใหม่จากเอกสารนี้

ไฟล์ `evaluation/run-embedding-experiment.js` เป็นส่วนทดลองแยกจาก Production โดยมีโครงสร้างสำหรับโหลด Dataset, สร้าง Matching Text, เรียก Embedding Model และคำนวณ Cosine Similarity

## 7. Semantic Matching กับ Ownership Verification

### Semantic Matching

ตอบคำถามว่า:

> รายละเอียดของของหายและสิ่งของที่พบมีความหมายใกล้เคียงกันหรือไม่

### Ownership Verification

ตอบคำถามว่า:

> ผู้ที่มาเคลมสามารถแสดงข้อมูลหรือหลักฐานที่ยืนยันว่าเป็นเจ้าของได้หรือไม่

สองขั้นตอนนี้ต้องแยกออกจากกันอย่างชัดเจน

ห้ามนำผล Semantic Similarity ไปตีความว่า:

- ผู้เคลมเป็นเจ้าของแน่นอน
- สิ่งของสองรายการเป็นชิ้นเดียวกันแน่นอน
- ต้องคืนสิ่งของทันที
- Model รู้จักตัวบุคคลหรือเจ้าของ

ข้อมูลอย่างตำหนิที่ไม่เปิดเผยต่อสาธารณะ รายละเอียดส่วนตัว Claim Token และข้อมูลผู้เคลมควรเปิดเผยเฉพาะขั้น Verification ที่เหมาะสม

## 8. Candidate และ Manual Review

ระบบควรส่งผลลัพธ์เป็น Candidate ที่มีข้อมูลประกอบ เช่น:

- รายการ Lost ที่ใช้เป็น Query
- รายการ Found ที่เป็น Candidate
- Field Structured ที่ตรงกันหรือแตกต่างกัน
- Matching Text ที่ใช้สำหรับการทดลองหรือการจัดลำดับ
- ค่า Semantic Similarity ถ้ามีการสร้าง Embedding แล้ว
- สถานะของรายการ Found

Candidate ไม่ใช่คำตัดสินสุดท้าย เจ้าหน้าที่หรือกระบวนการ Ownership Verification ต้องตรวจสอบเพิ่มเติม โดยเฉพาะกรณีที่ข้อมูลสั้น ข้อมูลขัดแย้ง หรือผล Semantic Similarity ไม่สอดคล้องกับ Category/Subcategory

## 9. Threshold และ Weight

เอกสารนี้ยังไม่กำหนด:

- Cosine Similarity Threshold
- Weight ของแต่ละ Field
- Final Matching Score
- เกณฑ์ผ่านหรือไม่ผ่าน

เหตุผลคือ Dataset ปัจจุบันมีเพียง 20 คู่ และตัวอย่างผลที่มีอยู่แสดงให้เห็นว่าคู่ที่มี Ground Truth ต่างกันอาจได้ค่า Cosine ใกล้กัน การกำหนดค่าดังกล่าวควรทำหลังจากมีข้อมูลจริงที่หลากหลายขึ้น มีการประเมิน Pairwise/Ranking/Retrieval และทำ Error Analysis แล้ว

## 10. ข้อจำกัดของแนวทาง

- Semantic Similarity ไม่เท่ากับ Item Identity
- ข้อความสั้นอาจมีข้อมูลไม่เพียงพอ
- สิ่งของคนละประเภทอาจมีคำร่วมกัน เช่น สีเดียวกัน
- คำไทย คำทับศัพท์ และคำไทย-อังกฤษอาจถูกตีความต่างกัน
- Category/Subcategory ที่กรอกไม่ครบหรือไม่ตรงกันอาจทำให้การกรองคลาดเคลื่อน
- `details` และ `distinctive_feature` อาจมีความหมายทับซ้อนกันในข้อมูลเดิม
- ข้อมูลลับไม่ควรถูกนำเข้า Public Embedding
- Dataset 20 คู่ยังไม่ครอบคลุมข้อมูลใช้งานจริงทั้งหมด
- ค่าที่ได้จาก Model หนึ่งไม่ควรนำไปเปรียบเทียบตรง ๆ กับ Vector Space ของอีก Model หนึ่ง
- Cosine Similarity เพียงอย่างเดียวไม่เพียงพอสำหรับ Ownership Verification

## 11. แนวทางพัฒนาต่อ

1. ตรวจสอบ Dataset Quality Notes โดยไม่แก้ Ground Truth อัตโนมัติ
2. ทดลอง Model Candidates ตาม Experiment Protocol เดียวกัน
3. บันทึก Model Version, Tokenizer, Pooling, Normalization และ Prefix
4. สร้าง Matching Text V1 จาก Dataset เดียวกันทุก Model
5. ประเมิน Pairwise Semantic Similarity
6. เพิ่ม Query-Candidate Dataset สำหรับ Ranking และ Top-K Retrieval
7. วิเคราะห์ False Positive, False Negative, Thai Synonym Failure, Spelling Failure และ Category Conflict
8. ทดสอบข้อมูลจริงที่ไม่ใช่เฉพาะตัวอย่างสั้น ๆ
9. พิจารณา Structured Filtering ร่วมกับ Semantic Ranking
10. ออกแบบการเก็บ Vector และการเรียก Embedding ในฝั่ง Server/Edge Function เมื่อพร้อมใช้งานจริง
11. รักษา Ownership Verification เป็นขั้นตอนแยกและไม่เปิดเผยข้อมูลลับ
12. พิจารณา Threshold และ Weight จากผลประเมินจริงในภายหลังเท่านั้น

เอกสารนี้ไม่เปลี่ยนแปลง Dataset, Experiment Protocol, Runner, Supabase Schema หรือโค้ด Production
