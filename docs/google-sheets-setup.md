# ตั้งค่า Google Spreadsheet สำหรับเก็บ Raw Data

ฟอร์มจะเขียนข้อมูลลง 2 แท็บอัตโนมัติเมื่อกด **บันทึกลง Google Sheet**:

| แท็บ | เนื้อหา |
|------|---------|
| `Submissions` | 1 แถวต่อการตรวจ 1 ครั้ง (สรุป + grade รายหมวด) |
| `RawScores` | 1 แถวต่อรายการตรวจ (คะแนนดิบทุกรายการ) |

## ขั้นตอน

1. สร้าง Google Spreadsheet ว่างชื่อเช่น `PAIC Raw Data`
2. สร้าง Service Account ใน Google Cloud  
   - เปิด Google Cloud Console → IAM & Admin → Service Accounts  
   - Create service account → สร้าง Key แบบ JSON
3. เปิดชีต → Share → ใส่ `client_email` จากไฟล์ JSON เป็น **Editor**
4. คัดลอก Sheet ID จาก URL  
   `https://docs.google.com/spreadsheets/d/<<<SHEET_ID>>>/edit`
5. ใน Cursor ใส่ Secrets ของแอป:

| Secret | ค่า |
|--------|-----|
| `GOOGLE_CLIENT_EMAIL` | `client_email` จาก JSON |
| `GOOGLE_PRIVATE_KEY` | `private_key` จาก JSON (คง `\n` ไว้ได้) |
| `GOOGLE_SHEETS_ID` | Sheet ID |

6. Publish / republish แอปอีกครั้ง

ครั้งแรกที่กดบันทึก ระบบจะสร้างแท็บ `Submissions` และ `RawScores` พร้อมหัวคอลัมน์ให้เอง

## หมายเหตุ

- รูปภาพไม่ถูกอัปโหลดขึ้นชีต (เก็บเฉพาะสถานะมีรูป/ชื่อไฟล์) เพื่อไม่ให้ชีตใหญ่เกิน
- ถ้ายังไม่ได้ตั้ง Secrets แอปจะทำงานโหมดตัวอย่าง และยังไม่เขียนลงชีตจริง
