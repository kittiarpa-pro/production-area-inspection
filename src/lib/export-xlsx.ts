import * as XLSX from "xlsx";
import {
  CHECKLIST_ITEMS,
  type InspectionForm,
  countProgress,
} from "./checklist-data";

const RESULT_LABEL: Record<string, string> = {
  pass: "ผ่าน / Pass",
  fail: "ไม่ผ่าน / Fail",
  na: "N/A",
  "": "",
};

const RISK_LABEL: Record<string, string> = {
  high: "สูง / High",
  medium: "กลาง / Medium",
  low: "ต่ำ / Low",
  "": "",
};

export function exportInspectionXlsx(form: InspectionForm) {
  const progress = countProgress(form);

  const headerRows: (string | number)[][] = [
    ["Production Area Inspection Checklist"],
    ["แบบตรวจพื้นที่ผลิต"],
    [],
    ["สถานที่ / Site", form.site, "อาคาร / Building", form.building],
    [
      "สายการผลิต / Line",
      form.productionLine,
      "กะ / Shift",
      form.shift,
    ],
    ["แผนก / Department", form.department, "วันที่ / Date", form.date],
    ["ผู้ตรวจ / Inspected by", form.inspectedBy],
    [],
    [
      "สรุป / Summary",
      `ตรวจแล้ว ${progress.answered}/${progress.total}`,
      `ผ่าน ${progress.pass}`,
      `ไม่ผ่าน ${progress.fail}`,
      `N/A ${progress.na}`,
    ],
    [],
    [
      "No.",
      "พื้นที่ / Area",
      "รายการตรวจ / Inspection item",
      "ผล / Result",
      "ความเสี่ยง / Risk",
      "ปัญหา / การแก้ไข / Problem & corrective action",
    ],
  ];

  const itemRows = CHECKLIST_ITEMS.map((item) => {
    const ans = form.items[item.id];
    return [
      item.no,
      `${item.areaTh} / ${item.areaEn}`,
      `${item.itemTh} / ${item.itemEn}`,
      RESULT_LABEL[ans?.result ?? ""] ?? "",
      RISK_LABEL[ans?.risk ?? ""] ?? "",
      ans?.action ?? "",
    ];
  });

  const followRows: (string | number)[][] = [
    [],
    ["งานค้างก่อนการตรวจครั้งถัดไป / Follow-up before next inspection"],
    ["รายการ / Task", "ผู้รับผิดชอบ / Owner", "กำหนดเสร็จ / Due date"],
    ...form.followUps
      .filter((f) => f.task.trim() || f.owner.trim() || f.dueDate)
      .map((f) => [f.task, f.owner, f.dueDate]),
    [],
    ["บันทึกเพิ่มเติม / Overall notes", form.overallNotes],
    [],
    [
      "ผู้ตรวจ / Inspected by",
      form.inspectedBySign || form.inspectedBy,
      "ผู้ทบทวน / Reviewed by",
      form.reviewedBy,
      "ผู้อนุมัติ / Approved by",
      form.approvedBy,
    ],
  ];

  const sheet = XLSX.utils.aoa_to_sheet([
    ...headerRows,
    ...itemRows,
    ...followRows,
  ]);

  sheet["!cols"] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 55 },
    { wch: 16 },
    { wch: 16 },
    { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Inspection");
  const stamp = form.date || "draft";
  const safeSite = (form.site || "site").replace(/[^\w\u0E00-\u0E7F-]+/g, "_");
  XLSX.writeFile(wb, `Production_Area_Inspection_${safeSite}_${stamp}.xlsx`);
}
