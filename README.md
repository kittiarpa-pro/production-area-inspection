# Production Area Inspection Checklist

ใบรายงานการตรวจสอบพื้นที่ (Area Inspection Report) — ฝ่ายผลิต-ฉีด  
ให้คะแนนตามแท็บ **เกณฑ์คะแนน** ในไฟล์ต้นฉบับ

## เกณฑ์คะแนน 0–10

| คะแนน | ระดับ |
|------:|------|
| 10 | ดีเยี่ยม (Excellent) |
| 9 | ดีมาก (Very Good) |
| 8 | ดี (Good) |
| 7 | ค่อนข้างดี (Satisfactory) |
| 6 | พอใช้ (Acceptable) |
| 5 | ต้องปรับปรุง (Needs Improvement) |
| 4 | ต่ำกว่ามาตรฐาน (Below Standard) |
| 3 | ไม่เป็นไปตามข้อกำหนด (Poor) |
| 2 | ไม่เป็นที่ยอมรับ (Very Poor) |
| 1 | วิกฤต (Critical Condition) |
| 0 | ไม่สามารถยอมรับได้ (Unacceptable) |

สรุปเกรดหมวด: `((ผลรวมคะแนน / คะแนนเต็ม) × 100) ÷ 10`  
แล้วเทียบ 9–10 ดีเยี่ยม · 7–8 ดี · 5–6 พอใช้ · 3–4 ต้องเร่งปรับปรุง · 0–2 วิกฤต/ไม่ผ่าน

## หมวดที่ตรวจ

1. Production Area — พื้นที่ผลิต  
2. Personnel / Locker Area — ล็อกเกอร์พนักงาน  
3. Toilet / Hand Washing Area — ห้องน้ำและจุดล้างมือ  
4. Chemical Storage Area — สารเคมี  
5. Waste Area — ของเสีย  
6. Pest Control — สัตว์พาหะ  
7. Documentation / Records — เอกสาร  
8. Glass / Brittle Plastic / Sharp Tools  
9. Cleaning — การทำความสะอาด  

## ใช้งาน

1. กรอกผู้สำรวจและวันที่  
2. ให้คะแนนแต่ละรายการ 0–10 หรือเลือก N/A  
3. แนบรูปภาพได้รายการละรูป (ไม่บังคับ)  
4. ใส่ Comment เมื่อจำเป็น  
5. กด **ส่งออก Excel** (ได้ทั้งชีตตรวจและชีตเกณฑ์คะแนน)

## รันท้องถิ่น

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```
