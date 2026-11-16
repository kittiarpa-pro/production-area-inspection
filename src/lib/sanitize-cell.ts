/** Prevent spreadsheet formula injection for user-controlled text. */
export function sanitizeCell(value: unknown): string | number {
  if (typeof value === "number") {
    if (Number.isFinite(value)) return value;
    return "";
  }
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) return `'${text}`;
  return text;
}

export function sanitizeRow(values: unknown[]): (string | number)[] {
  return values.map(sanitizeCell);
}
