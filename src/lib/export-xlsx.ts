import * as XLSX from "xlsx";
import {
  ALL_ITEMS,
  CATEGORIES,
  SCORE_CRITERIA,
  SUMMARY_GRADES,
  categoryStats,
  overallStats,
  type InspectionForm,
} from "./checklist-data";

function fmtGrade(n: number | null) {
  if (n === null) return "";
  return (Math.round(n * 100) / 100).toFixed(2);
}

export function exportInspectionXlsx(form: InspectionForm) {
  const overall = overallStats(form.items);

  const rows: (string | number)[][] = [
    ["ใบรายงานการตรวจสอบพื้นที่ (Area Inspection Report)"],
    ["Production Area Inspection Checklist — Injection Production"],
    [],
    ["Doc. No.", form.docNo, "Date", form.date, "Rev.", form.rev],
    ["พื้นที่สำรวจ (Area Inspected)", form.areaInspected],
    [
      "ผู้สำรวจ (Inspected By)",
      form.inspectedBy,
      "ผู้รับผิดชอบพื้นที่ (Person in charge)",
      form.personInCharge,
    ],
    [],
    [
      "สรุปภาพรวม",
      `ตรวจแล้ว ${overall.answered}/${overall.total}`,
      `คะแนนรวม ${overall.resultSum}/${overall.maxSum}`,
      `Grade ${fmtGrade(overall.grade)}`,
      overall.label
        ? `${overall.label.levelTh} / ${overall.label.levelEn}`
        : "",
    ],
    [],
    [
      "No.",
      "หมวด / Category",
      "รายการตรวจ / Requirement",
      "Max",
      "Result (0–10)",
      "N/A",
      "Comment",
    ],
  ];

  for (const cat of CATEGORIES) {
    const stats = categoryStats(cat, form.items);
    rows.push([
      "",
      `${cat.titleTh} / ${cat.titleEn}`,
      "",
      stats.maxSum,
      stats.resultSum,
      "",
      `Grade ${fmtGrade(stats.grade)}${
        stats.label ? ` — ${stats.label.levelTh} / ${stats.label.levelEn}` : ""
      }`,
    ]);
    for (const item of cat.items) {
      const ans = form.items[item.id];
      rows.push([
        item.no,
        `${cat.titleTh} / ${cat.titleEn}`,
        `${item.itemTh} / ${item.itemEn}`,
        10,
        ans?.na ? "" : (ans?.score ?? ""),
        ans?.na ? "N/A" : "",
        ans?.comment ?? "",
      ]);
    }
  }

  rows.push([]);
  rows.push(["Inspection Category Grade Summary"]);
  rows.push(["No.", "Inspection Item", "Maximum Score", "Result Score", "Grade", "Level"]);
  CATEGORIES.forEach((cat, i) => {
    const stats = categoryStats(cat, form.items);
    rows.push([
      i + 1,
      `${cat.titleTh} / ${cat.titleEn}`,
      stats.maxSum,
      stats.resultSum,
      fmtGrade(stats.grade),
      stats.label ? `${stats.label.levelTh} / ${stats.label.levelEn}` : "",
    ]);
  });

  rows.push([]);
  rows.push(["Remark", form.remark]);
  rows.push([]);
  rows.push(["เกณฑ์การให้คะแนน 0–10 (Area Inspection Scoring Criteria)"]);
  rows.push(["คะแนน", "ระดับ", "เกณฑ์การพิจารณา"]);
  for (const c of SCORE_CRITERIA) {
    rows.push([
      c.score,
      `${c.levelTh} / ${c.levelEn}`,
      `${c.criteriaTh} / ${c.criteriaEn}`,
    ]);
  }
  rows.push([]);
  rows.push(["เกณฑ์สรุปผลคะแนน"]);
  rows.push(["คะแนน", "ระดับ", "กิจกรรม"]);
  for (const g of SUMMARY_GRADES) {
    rows.push([
      `${g.min}–${Math.floor(g.max)}`,
      `${g.levelTh} / ${g.levelEn}`,
      `${g.actionTh} / ${g.actionEn}`,
    ]);
  }

  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 6 },
    { wch: 36 },
    { wch: 70 },
    { wch: 10 },
    { wch: 14 },
    { wch: 6 },
    { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "INJECTION PRODUCTION");

  const criteriaRows: (string | number)[][] = [
    ["เกณฑ์การให้คะแนน [Area Inspection Scoring Criteria]"],
    [],
    ["1. เกณฑ์การให้คะแนน 0–10 คะแนน"],
    ["คะแนน", "ระดับการประเมิน", "เกณฑ์การพิจารณา (Evaluation Criteria)"],
    ...SCORE_CRITERIA.map((c) => [
      c.score,
      `${c.levelTh} (${c.levelEn})`,
      `${c.criteriaTh} / ${c.criteriaEn}`,
    ]),
    [],
    ["2. เกณฑ์การสรุปผลคะแนนการตรวจพื้นที่"],
    ["คะแนน", "ระดับการประเมิน", "กิจกรรม"],
    ...SUMMARY_GRADES.map((g) => [
      `${g.min}–${Math.floor(g.max)}`,
      `${g.levelTh} (${g.levelEn})`,
      `${g.actionTh} / ${g.actionEn}`,
    ]),
  ];
  const criteriaSheet = XLSX.utils.aoa_to_sheet(criteriaRows);
  criteriaSheet["!cols"] = [{ wch: 10 }, { wch: 28 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, criteriaSheet, "เกณฑ์คะแนน");

  const stamp = form.date || "draft";
  XLSX.writeFile(
    wb,
    `Production_Area_Inspection_Injection_${stamp}.xlsx`,
  );
  return ALL_ITEMS.length;
}
