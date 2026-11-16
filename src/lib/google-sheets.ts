import { google } from "googleapis";
import {
  RAW_SCORE_HEADERS,
  SUBMISSIONS_HEADERS,
} from "./submission-rows";

const SUBMISSIONS_TAB = "Submissions";
const RAW_TAB = "RawScores";

export type SheetsConfig = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
};

export function readSheetsConfig(): SheetsConfig | null {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim() ?? "";
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY?.trim() ?? "";
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID?.trim() ?? "";
  if (!clientEmail || !privateKeyRaw || !spreadsheetId) return null;
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  return { clientEmail, privateKey, spreadsheetId };
}

function getSheetsClient(config: SheetsConfig) {
  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function ensureTabWithHeaders(
  sheets: ReturnType<typeof getSheetsClient>,
  spreadsheetId: string,
  title: string,
  headers: readonly string[],
) {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  const existing = new Set(
    (meta.data.sheets ?? [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)),
  );

  if (!existing.has(title)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    });
  }

  const current = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${title}!1:1`,
  });
  const firstRow = current.data.values?.[0] ?? [];
  if (firstRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...headers]] },
    });
  }
}

export async function appendInspectionToSheet(args: {
  config: SheetsConfig;
  submissionRow: (string | number)[];
  rawRows: (string | number)[][];
}) {
  const sheets = getSheetsClient(args.config);
  const { spreadsheetId } = args.config;

  await ensureTabWithHeaders(
    sheets,
    spreadsheetId,
    SUBMISSIONS_TAB,
    SUBMISSIONS_HEADERS,
  );
  await ensureTabWithHeaders(sheets, spreadsheetId, RAW_TAB, RAW_SCORE_HEADERS);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SUBMISSIONS_TAB}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [args.submissionRow] },
  });

  if (args.rawRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${RAW_TAB}!A:A`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: args.rawRows },
    });
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
  };
}
