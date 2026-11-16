import { timingSafeEqual } from "crypto";

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 10;
const MAX_BODY_BYTES = 400_000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function readSubmitAccessCode(): string | null {
  const code = process.env.SUBMIT_ACCESS_CODE?.trim() ?? "";
  return code.length > 0 ? code : null;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

export function checkRateLimit(key: string): {
  ok: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (current.count >= RATE_MAX) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return { ok: true };
}

export function assertBodySize(request: Request): boolean {
  const raw = request.headers.get("content-length");
  if (!raw) return true;
  const size = Number(raw);
  if (!Number.isFinite(size) || size < 0) return false;
  return size <= MAX_BODY_BYTES;
}

export function accessCodeMatches(
  provided: string | undefined,
  expected: string,
): boolean {
  if (typeof provided !== "string") return false;
  const a = Buffer.from(provided.trim());
  const b = Buffer.from(expected);
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

export { MAX_BODY_BYTES };
