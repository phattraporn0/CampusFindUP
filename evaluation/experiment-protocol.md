# Experiment Protocol: CampusFind UP Embedding Evaluation

เอกสารนี้กำหนดขั้นตอนสำหรับเปรียบเทียบ Embedding Model หลายตัวกับข้อมูล Lost และ Found ของ CampusFind UP อย่างเป็นธรรม

เอกสารนี้เป็น Protocol เท่านั้น ยังไม่มีการสร้าง Embedding เรียก Embedding API คำนวณผลการทดลอง เลือก Model ผู้ชนะ กำหนด Threshold หรือกำหนด Weight

## 1. Objective

ประเมินว่า Embedding Model แต่ละตัวสร้าง Representation ของ Matching Text ภาษาไทยและภาษาไทยผสมภาษาอังกฤษได้เหมาะสมเพียงใดสำหรับการเปรียบเทียบ Lost กับ Found

การทดลองครอบคลุม:

- Pairwise Semantic Similarity
- การจัดลำดับความใกล้เคียงของคู่ข้อความ
- Thai Synonym, Thai-English และ Spelling Variation
- Hard Negative และ Ambiguous Pair
- Structured vs Semantic Conflict ในกรณีที่ Dataset ระบุไว้

การทดลองนี้ไม่ใช่การยืนยันเจ้าของสิ่งของ และไม่ใช่การคำนวณ Ownership Probability หรือ Same-owner Probability

## 2. Dataset

ใช้ไฟล์เดียวกันกับทุก Model:

```text
evaluation/evaluation-dataset.json
```

Dataset ปัจจุบันมี 20 คู่ ได้แก่ `TC-001` ถึง `TC-020`

แต่ละคู่มี:

```text
test_case_id
group
lost
found
expected_relationship
reason
```

กลุ่มที่ใช้:

- Positive
- Hard Negative
- Ambiguous
- Thai Language Robustness
- Structured vs Semantic Conflict

Expected Relationship ที่ใช้เป็น Ground Truth:

- Highly Similar
- Similar
- Uncertain
- Different

Ground Truth หมายถึง Semantic Relationship ของข้อความตาม Dataset ไม่ใช่ความน่าจะเป็นว่าเป็นของเจ้าของคนเดียวกัน หรือเป็นสิ่งของชิ้นเดียวกัน

ห้ามแก้ Ground Truth ระหว่างการทดลองเพื่อให้ผลของ Model ใดดูดีขึ้น

## 3. Matching Text

Lost และ Found ทุกคู่ต้องถูกแปลงเป็น Matching Text V1 ด้วยรูปแบบเดียวกัน:

```text
ชื่อสิ่งของ: {item_name}
ยี่ห้อ: {brand}
สี: {color}
วัสดุ: {material}
รายละเอียด: {description}
จุดสังเกต: {distinctive_feature}
```

ถ้า Field ว่าง ให้ละทั้งบรรทัดนั้นออก ห้ามเติมข้อมูลสมมติ เช่น `ไม่ทราบ` หรือ `ไม่มีข้อมูล`

ห้ามนำข้อมูลต่อไปนี้เข้า Matching Text:

```text
defect
guard_remark
storage_location
claim_token
claimant_id
claim_attempts
submitted_answer
```

รวมถึงข้อมูลภายในเจ้าหน้าที่และข้อมูล Ownership Verification ทุกประเภท

## 4. Preprocessing

Preprocessing พื้นฐานต้องเหมือนกันสำหรับทุก Model:

- `null`, `undefined`, empty string และข้อความที่มีแต่ whitespace ถือเป็น Field ที่ไม่มีค่า
- Field ที่ไม่มีค่าให้ละออกจาก Matching Text
- ตัด whitespace ด้านหน้าและด้านท้าย
- รวม whitespace ซ้ำตามกฎเดียวกัน
- ใช้ Unicode normalization แบบเดียวกัน เช่น NFKC หาก Runtime รองรับ
- คงอักษรไทย วรรณยุกต์ และข้อความภาษาไทยตามต้นฉบับ
- คง Brand และคำภาษาอังกฤษตามต้นฉบับ
- ไม่แปลภาษา
- ไม่ทำ Synonym Expansion
- ไม่แก้คำสะกดผิดด้วยกฎพิเศษ
- ไม่เรียบเรียงประโยคใหม่

อนุญาตเฉพาะข้อกำหนดมาตรฐานของ Model เช่น Prefix ของ multilingual-e5 โดยต้องใช้กฎเดียวกันกับ Lost และ Found ภายใน Model เดียวกัน และบันทึกไว้ในผลการทดลอง

## 5. Embedding Procedure

สำหรับแต่ละ Model ให้ดำเนินการตามลำดับ:

1. อ่าน Dataset เดิม
2. สร้าง Matching Text ของ Lost
3. สร้าง Matching Text ของ Found
4. ส่งข้อความเข้า Model เดียวกัน
5. เก็บ Lost Vector และ Found Vector
6. บันทึก Metadata ของ Model

Metadata ที่ต้องบันทึก:

```text
model_name
model_version หรือ revision ถ้าระบุได้
tokenizer
pooling_method ถ้าเกี่ยวข้อง
normalization_method ถ้าเกี่ยวข้อง
prefix ถ้า Model กำหนด
runtime หรือ inference_method
```

Lost และ Found ต้องใช้ Matching Text, Dataset, Model, Tokenizer, Pooling และ Normalization ตาม Protocol เดียวกันภายในรอบนั้น

ไม่ควรเปรียบเทียบ Vector ที่สร้างจากคนละ Model โดยตรง เพราะ Vector Space และ Dimension อาจแตกต่างกัน

หากนำ WangchanBERTa มาทดลอง ต้องบันทึกวิธีสร้าง Sentence Representation เช่น Pooling และขั้นตอนเพิ่มเติม เพราะไม่ควรถือว่าเป็น Sentence Embedding Model โดยอัตโนมัติ

## 6. Cosine Similarity

ใช้ Cosine Similarity เพื่อเปรียบเทียบ Lost Vector กับ Found Vector:

```text
cos(A,B) = (A · B) / (||A|| ||B||)
```

โดย `A` คือ Lost Vector และ `B` คือ Found Vector

การคำนวณต้องใช้วิธีเดียวกันภายใน Experiment เดียวกัน และให้เก็บค่า Cosine Similarity ดิบไว้

Protocol นี้ยังไม่กำหนด:

- Similarity Threshold
- Cosine Cutoff
- Weight
- คะแนนผ่าน/ไม่ผ่าน

## 7. Pairwise Evaluation

คำนวณ Similarity ของทั้ง 20 คู่ใน Dataset สำหรับแต่ละ Model

แต่ละแถวของผลการทดลองควรมี:

```text
test_case_id
group
expected_relationship
cosine_similarity
model
```

รูปแบบตาราง:

| test_case_id | group | expected_relationship | cosine_similarity | model |
|---|---|---|---|---|
| TC-001 | Positive | Highly Similar | ค่าจากการทดลอง | Model ที่ทดสอบ |

ต้องวิเคราะห์ผลแยกตาม Positive, Hard Negative, Ambiguous, Thai Language Robustness และ Structured vs Semantic Conflict

Dataset Quality Notes:

- TC-001 และ TC-012 มีข้อความใกล้เคียงกันมาก แต่ Expected Relationship ต่างกัน
- TC-013 มีข้อมูล Lost มากกว่า Found และอาจสะท้อนความไม่แน่นอนของการจับคู่มากกว่าความแตกต่างทางความหมาย
- TC-008 และ TC-018 เป็น Structured Conflict แต่ Artifact ปัจจุบันไม่ได้เก็บ category และ subcategory เป็น Field แยก

ห้ามแก้ Dataset ระหว่างการทดลองเพียงเพื่อแก้ข้อสังเกตเหล่านี้

## 8. Ranking Evaluation

ยังไม่ต้องสร้างผลการทดลอง Ranking จาก Dataset ปัจจุบัน

ต้องเพิ่ม Found Candidate หลายรายการต่อ Lost หนึ่งรายการ เช่น:

```text
query_id
lost_item
candidate_found_1
candidate_found_2
candidate_found_3
relevance_label ของแต่ละ Candidate
```

Candidate Pool ควรมี Relevant Candidate, Hard Negative, Ambiguous Candidate และ Candidate ที่มีคำร่วมแต่เป็นคนละสิ่งของ

## 9. Top-K Retrieval

ยังไม่ต้องสร้างผลการทดลอง Top-K

ต้องเพิ่ม:

```text
query Lost
Found candidate pool
relevant candidate
hard negative candidate
ambiguous candidate
candidate relevance label
```

จึงจะสามารถทดสอบ Top-1, Top-3 และ Top-5 ได้ โดยยังไม่กำหนดว่า K ใดเป็นเกณฑ์ผ่าน

## 10. Metrics

### Pairwise Evaluation

เสนอให้ศึกษา:

- Spearman Correlation
- Kendall Correlation
- Pairwise Ordering Accuracy

เนื่องจาก Ground Truth เป็น 4 ระดับเชิงลำดับ ต้องระบุวิธีจัดการ Uncertain ก่อนคำนวณ Metric และไม่ควรแปลงเป็นคะแนนแบบมี Weight โดยไม่มีเหตุผล

### Retrieval Evaluation ในอนาคต

- Recall@K
- Precision@K
- Hit@K
- MRR เมื่อมี Relevant Item หลักหนึ่งรายการ
- nDCG เมื่อใช้ Graded Relevance

Protocol นี้ยังไม่คำนวณ Metric ใด

## 11. Fair Comparison Rules

1. ใช้ `evaluation/evaluation-dataset.json` เดียวกันทุก Model
2. ใช้ Lost และ Found คู่เดียวกันทุก Model
3. ใช้ Matching Text V1 และ Field เดียวกัน
4. ใช้ Ground Truth เดียวกัน
5. ใช้ Preprocessing พื้นฐานเดียวกัน
6. ไม่เติมข้อมูลที่ไม่มีใน Dataset
7. ไม่แก้คำสะกดหรือแปลภาษาเฉพาะให้ Model ใด
8. อนุญาตเฉพาะข้อกำหนดมาตรฐานของ Model เช่น Prefix
9. บันทึก Model Version, Tokenizer, Pooling และ Normalization
10. ไม่เปรียบเทียบ Vector ข้าม Model โดยตรง
11. แยกผลตาม Group และไม่รายงานเฉพาะค่าเฉลี่ยรวม
12. ไม่กำหนด Threshold หรือ Weight ในรอบ Pairwise แรก
13. ไม่ใช้ข้อมูล Ownership Verification ใน Matching Text

## 12. Dataset Limitations

Dataset ปัจจุบันมี 20 คู่ ไม่ใช่ 30 คู่ และมีข้อจำกัดดังนี้:

- Positive และ Hard Negative มีจำนวนไม่สมดุล
- Structured Conflict มีเพียง 2 คู่
- ไม่มี category และ subcategory เป็น Field แยกใน Artifact
- ยังไม่มี Candidate Pool สำหรับ Ranking
- ยังไม่มี Candidate Pool สำหรับ Top-K Retrieval
- มีข้อความสั้นหลายคู่
- TC-001, TC-012 และ TC-013 อาจสะท้อนความแตกต่างระหว่าง Semantic Similarity กับ Identity Confidence
- ยังไม่มีการทดลองกับข้อมูลจริงจำนวนมาก
- ยังไม่มีการวัดความสอดคล้องระหว่างผู้ประเมินหลายคน

ผลจาก Dataset นี้ควรตีความเป็นผลเบื้องต้น ไม่ใช่ข้อสรุปว่า Model ใดดีที่สุดในทุกกรณี

## 13. Future Experiment Steps

1. ตรวจสอบ Dataset Quality Notes โดยไม่แก้ Ground Truth โดยอัตโนมัติ
2. ระบุ Model Candidates ที่ต้องการทดสอบ
3. บันทึก Model Version และข้อกำหนดของแต่ละ Model
4. สร้าง Matching Text V1 จาก Dataset เดียวกัน
5. สร้าง Embedding ของ Lost และ Found
6. บันทึก Vector Metadata และขั้นตอน Normalize
7. คำนวณ Cosine Similarity ของทั้ง 20 คู่
8. สร้าง Pairwise Experiment Matrix
9. วิเคราะห์ผลแยกตาม Group
10. วิเคราะห์ False Positive, False Negative และ Thai Language Failure
11. เพิ่ม Candidate Pool สำหรับ Ranking ใน Experiment รอบถัดไป
12. เพิ่ม Query-Candidate Dataset สำหรับ Top-K Retrieval
13. คำนวณ Metrics หลังจากกำหนดวิธีจัดการ Ground Truth และ Uncertain อย่างชัดเจน

Protocol นี้ไม่รวมการเลือก Model Winner, การกำหนด Threshold, การกำหนด Weight, การแก้ Supabase Schema หรือการนำผลไปใช้ยืนยัน Ownership
