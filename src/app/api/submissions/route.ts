import { NextResponse } from "next/server";
import type { InspectionForm } from "@/lib/checklist-data";
import { ALL_ITEMS, overallStats } from "@/lib/checklist-data";
import { appendInspectionToSheet, readSheetsConfig } from "@/lib/google-sheets";
import {
  accessCodeMatches,
  assertBodySize,
  checkRateLimit,
  clientIp,
  readSubmitAccessCode,
} from "@/lib/submit-auth";
import { formWithoutPhotoBytes } from "@/lib/strip-photos";
import { buildSubmissionPayload } from "@/lib/submission-rows";

type Body = {
  form?: InspectionForm;
  accessCode?: string;
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
  if (!assertBodySize(request)) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const ip = clientIp(request);
  const rate = checkRateLimit(`submit:${ip}`);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : undefined,
      },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isForm(body.form)) {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const expectedCode = readSubmitAccessCode();
  const sheetsConfig = readSheetsConfig();

  // Writing to Google Sheets always requires a shared access code (free gate).
  if (sheetsConfig && !expectedCode) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 503 },
    );
  }

  if (expectedCode && !accessCodeMatches(body.accessCode, expectedCode)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = formWithoutPhotoBytes(body.form);
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

  if (!sheetsConfig) {
    return NextResponse.json({
      ok: true,
      mode: "sample",
      submissionId: payload.submissionId,
      message:
        "ยังไม่ได้ตั้งค่า Google Sheets — บันทึกแบบตัวอย่างในระบบแล้ว (ยังไม่เขียนลงชีตจริง)",
    });
  }

  try {
    await appendInspectionToSheet({
      config: sheetsConfig,
      submissionRow: payload.submissionRow,
      rawRows: payload.rawRows,
    });
    return NextResponse.json({
      ok: true,
      mode: "google_sheets",
      submissionId: payload.submissionId,
      message: "บันทึกลง Google Spreadsheet แล้ว",
    });
  } catch {
    return NextResponse.json({ error: "sheets_failed" }, { status: 502 });
  }
}

export async function GET() {
  const config = readSheetsConfig();
  const authConfigured = Boolean(readSubmitAccessCode());
  return NextResponse.json({
    configured: Boolean(config),
    authRequired: Boolean(config) || authConfigured,
    mode: config ? "google_sheets" : "sample",
  });
}
