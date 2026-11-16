import {
  ALL_ITEMS,
  CATEGORIES,
  categoryStats,
  overallStats,
  type InspectionForm,
} from "./checklist-data";
import { sanitizeRow } from "./sanitize-cell";

export const SUBMISSIONS_HEADERS = [
  "submission_id",
  "submitted_at",
  "doc_no",
  "date",
  "rev",
  "area_inspected",
  "inspected_by",
  "person_in_charge",
  "remark",
  "answered",
  "total_items",
  "result_sum",
  "max_sum",
  "overall_grade",
  "overall_level_th",
  "overall_level_en",
  ...CATEGORIES.flatMap((cat, i) => [
    `cat${i + 1}_id`,
    `cat${i + 1}_title`,
    `cat${i + 1}_result`,
    `cat${i + 1}_max`,
    `cat${i + 1}_grade`,
    `cat${i + 1}_level`,
  ]),
] as const;

export const RAW_SCORE_HEADERS = [
  "submission_id",
  "submitted_at",
  "doc_no",
  "date",
  "area_inspected",
  "inspected_by",
  "category_id",
  "category_th",
  "category_en",
  "item_id",
  "item_no",
  "item_th",
  "item_en",
  "score",
  "na",
  "comment",
  "has_photo",
  "photo_name",
] as const;

export function buildSubmissionPayload(form: InspectionForm) {
  const submissionId = crypto.randomUUID();
  const submittedAt = new Date().toISOString();
  const overall = overallStats(form.items);

  const submissionRow = sanitizeRow([
    submissionId,
    submittedAt,
    form.docNo,
    form.date,
    form.rev,
    form.areaInspected,
    form.inspectedBy,
    form.personInCharge,
    form.remark,
    overall.answered,
    overall.total,
    overall.resultSum,
    overall.maxSum,
    overall.grade === null
      ? ""
      : Math.round(overall.grade * 100) / 100,
    overall.label?.levelTh ?? "",
    overall.label?.levelEn ?? "",
    ...CATEGORIES.flatMap((cat) => {
      const stats = categoryStats(cat, form.items);
      return [
        cat.id,
        `${cat.titleTh} / ${cat.titleEn}`,
        stats.resultSum,
        stats.maxSum,
        stats.grade === null ? "" : Math.round(stats.grade * 100) / 100,
        stats.label
          ? `${stats.label.levelTh} / ${stats.label.levelEn}`
          : "",
      ];
    }),
  ]);

  const rawRows = ALL_ITEMS.map((item) => {
    const cat = CATEGORIES.find((c) =>
      c.items.some((i) => i.id === item.id),
    )!;
    const ans = form.items[item.id];
    return sanitizeRow([
      submissionId,
      submittedAt,
      form.docNo,
      form.date,
      form.areaInspected,
      form.inspectedBy,
      cat.id,
      cat.titleTh,
      cat.titleEn,
      item.id,
      item.no,
      item.itemTh,
      item.itemEn,
      ans?.na ? "" : (ans?.score ?? ""),
      ans?.na ? "Y" : "N",
      ans?.comment ?? "",
      ans?.photo ? "Y" : "N",
      ans?.photo?.name ?? "",
    ]);
  });

  return { submissionId, submittedAt, submissionRow, rawRows, overall };
}
