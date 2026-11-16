import { NextResponse } from "next/server";
import type { InspectionForm } from "@/lib/checklist-data";
import { ALL_ITEMS, overallStats } from "@/lib/checklist-data";
import { appendInspectionToSheet, readSheetsConfig } from "@/lib/google-sheets";
import { buildSubmissionPayload } from "@/lib/submission-rows";

type Body = {
  form?: InspectionForm;
};

function isForm(value: unknown): value is InspectionForm {
  if (!value || typeof value !== "object") return false;
  const form = value as InspectionForm;
  return (
    typeof form.inspectedBy === "string" &&
    typeof form.date === "string" &&
    typeof form.items === "object" &&
    form.items !== null
  );
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isForm(body.form)) {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const form = body.form;
  if (!form.inspectedBy.trim() || !form.date) {
    return NextResponse.json(
      { error: "missing_required_fields" },
      { status: 400 },
    );
  }

  const progress = overallStats(form.items);
  if (progress.answered < ALL_ITEMS.length) {
    return NextResponse.json(
      {
        error: "incomplete",
        answered: progress.answered,
        total: progress.total,
      },
      { status: 400 },
    );
  }

  const payload = buildSubmissionPayload(form);
  const config = readSheetsConfig();

  if (!config) {
    return NextResponse.json({
      ok: true,
      mode: "sample",
      submissionId: payload.submissionId,
      message:
        "ยังไม่ได้ตั้งค่า Google Sheets — บันทึกแบบตัวอย่างในระบบแล้ว (ยังไม่เขียนลงชีตจริง)",
    });
  }

  try {
    const result = await appendInspectionToSheet({
      config,
      submissionRow: payload.submissionRow,
      rawRows: payload.rawRows,
    });
    return NextResponse.json({
      ok: true,
      mode: "google_sheets",
      submissionId: payload.submissionId,
      spreadsheetUrl: result.spreadsheetUrl,
      message: "บันทึกลง Google Spreadsheet แล้ว",
    });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "sheets_append_failed";
    return NextResponse.json(
      { error: "sheets_failed", detail },
      { status: 502 },
    );
  }
}

export async function GET() {
  const config = readSheetsConfig();
  return NextResponse.json({
    configured: Boolean(config),
    mode: config ? "google_sheets" : "sample",
  });
}
