"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  CircleAlert,
  Download,
  Eraser,
  Info,
  Printer,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ALL_ITEMS,
  CATEGORIES,
  MAX_ITEM_SCORE,
  SCORE_CRITERIA,
  STORAGE_KEY,
  SUMMARY_GRADES,
  categoryStats,
  createEmptyForm,
  emptyAnswer,
  overallStats,
  scoreLevel,
  todayISODate,
  type InspectionForm,
  type ItemAnswer,
} from "@/lib/checklist-data";
import { exportInspectionXlsx } from "@/lib/export-xlsx";
import { cn } from "@/lib/utils";
import { ItemPhotoField } from "@/components/inspection/item-photo-field";

const SCORE_OPTIONS = Array.from({ length: MAX_ITEM_SCORE + 1 }, (_, i) => i);

export function InspectionFormApp() {
  const [form, setForm] = useState<InspectionForm>(() => createEmptyForm());
  const [hydrated, setHydrated] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [saveFlash, setSaveFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as InspectionForm;
        if (parsed?.items) {
          const blank = createEmptyForm(todayISODate());
          const items = Object.fromEntries(
            ALL_ITEMS.map((item) => [
              item.id,
              { ...emptyAnswer(), ...parsed.items?.[item.id] },
            ]),
          );
          startTransition(() => {
            setForm({
              ...blank,
              ...parsed,
              date: parsed.date || blank.date,
              items,
            });
          });
          setHydrated(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    startTransition(() => setForm(createEmptyForm(todayISODate())));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      } catch {
        setError(
          "พื้นที่จัดเก็บฉบับร่างเต็ม (มักเกิดจากรูปจำนวนมาก) — ลบรูปบางรายการหรือส่งออก Excel ก่อน",
        );
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [form, hydrated]);

  const overall = useMemo(() => overallStats(form.items), [form.items]);

  function updateMeta<K extends keyof InspectionForm>(
    key: K,
    value: InspectionForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(id: string, patch: Partial<ItemAnswer>) {
    setForm((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [id]: { ...prev.items[id], ...patch },
      },
    }));
  }

  function flash(msg: string) {
    setSaveFlash(msg);
    window.setTimeout(() => setSaveFlash(null), 2200);
  }

  function handleSaveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    flash("บันทึกฉบับร่างแล้ว");
  }

  function handleClear() {
    if (!window.confirm("ล้างฟอร์มทั้งหมดและเริ่มใหม่?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setForm(createEmptyForm(todayISODate()));
    setError(null);
    flash("ล้างฟอร์มแล้ว");
  }

  function validateForExport() {
    if (!form.inspectedBy.trim() || !form.date) {
      setError("กรุณากรอก ผู้สำรวจ และวันที่ ก่อนส่งออก");
      return false;
    }
    if (overall.answered < overall.total) {
      setError(
        `ยังให้คะแนนไม่ครบ: ${overall.answered}/${overall.total} รายการ`,
      );
      return false;
    }
    setError(null);
    return true;
  }

  function handleExport() {
    if (!validateForExport()) return;
    try {
      exportInspectionXlsx(form);
      flash("ดาวน์โหลดไฟล์ Excel แล้ว");
    } catch {
      setError("ส่งออกไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="inspection-shell">
      <header className="hero print:hidden">
        <div className="hero-grid" aria-hidden />
        <div className="hero-inner">
          <p className="brand">PAIC</p>
          <h1>ใบรายงานการตรวจสอบพื้นที่</h1>
          <p className="lede">
            Area Inspection Report — Injection Production · ให้คะแนน 0–10 ตามเกณฑ์
            BRCGS Packaging Materials
          </p>
          <div className="hero-cta">
            <Button type="button" onClick={handleExport}>
              <Download className="size-4" />
              ส่งออก Excel
            </Button>
            <Button type="button" variant="secondary" onClick={handleSaveDraft}>
              <Save className="size-4" />
              บันทึกฉบับร่าง
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => setShowCriteria((v) => !v)}
            >
              <Info className="size-4" />
              เกณฑ์คะแนน
            </Button>
          </div>
          <p className="sheets-status">
            <a
              className="source-zip-link"
              href="/api/source-zip"
              download="production-area-inspection-github.zip"
            >
              ดาวน์โหลดโค้ด (ZIP) สำหรับอัปโหลดขึ้น GitHub
            </a>
          </p>
        </div>
      </header>

      <div className="sticky-bar print:hidden">
        <div className="sticky-inner">
          <div className="progress-block">
            <div className="progress-meta">
              <span>
                ความคืบหน้า {overall.answered}/{overall.total}
              </span>
              <span className="stats">
                คะแนน {overall.resultSum}/{overall.maxSum}
                {overall.grade !== null
                  ? ` · Grade ${overall.grade.toFixed(2)}`
                  : ""}
                {overall.label
                  ? ` · ${overall.label.levelTh}`
                  : ""}
              </span>
            </div>
            <div className="progress-track" aria-hidden>
              <div
                className="progress-fill"
                style={{ width: `${overall.pct}%` }}
              />
            </div>
          </div>
          <div className="sticky-actions">
            {saveFlash ? (
              <span className="flash">
                <CheckCircle2 className="size-4" />
                {saveFlash}
              </span>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => window.print()}
            >
              <Printer className="size-3.5" />
              พิมพ์
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleClear}>
              <Eraser className="size-3.5" />
              ล้าง
            </Button>
            <Button type="button" size="sm" onClick={handleExport}>
              <Download className="size-3.5" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      <main className="main">
        {error ? (
          <div className="banner-error print:hidden" role="alert">
            <CircleAlert className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {showCriteria ? (
          <section className="panel criteria-panel print:hidden">
            <div className="panel-head">
              <h2>เกณฑ์การให้คะแนน 0–10</h2>
              <p>Area Inspection Scoring Criteria — จากแท็บเกณฑ์คะแนน</p>
            </div>
            <div className="criteria-table-wrap">
              <table className="criteria-table">
                <thead>
                  <tr>
                    <th>คะแนน</th>
                    <th>ระดับ</th>
                    <th>เกณฑ์การพิจารณา</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORE_CRITERIA.map((c) => (
                    <tr key={c.score}>
                      <td className="score-cell">{c.score}</td>
                      <td>
                        <strong>{c.levelTh}</strong>
                        <br />
                        <span className="muted">{c.levelEn}</span>
                      </td>
                      <td>
                        {c.criteriaTh}
                        <br />
                        <span className="muted">{c.criteriaEn}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="subhead">เกณฑ์สรุปผลคะแนน</h3>
            <div className="criteria-table-wrap">
              <table className="criteria-table">
                <thead>
                  <tr>
                    <th>คะแนน</th>
                    <th>ระดับ</th>
                    <th>กิจกรรม</th>
                  </tr>
                </thead>
                <tbody>
                  {SUMMARY_GRADES.map((g) => (
                    <tr key={g.levelEn}>
                      <td className="score-cell">
                        {g.min}–{Math.floor(g.max)}
                      </td>
                      <td>
                        <strong>{g.levelTh}</strong>
                        <br />
                        <span className="muted">{g.levelEn}</span>
                      </td>
                      <td>
                        {g.actionTh}
                        <br />
                        <span className="muted">{g.actionEn}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="panel">
          <div className="panel-head">
            <h2>ข้อมูลการตรวจ</h2>
            <p>Area Inspection Report — ฝ่ายผลิต-ฉีด</p>
          </div>
          <div className="meta-grid">
            <Field label="วันที่ / Date *" htmlFor="date">
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateMeta("date", e.target.value)}
              />
            </Field>
            <Field label="พื้นที่สำรวจ / Area Inspected" htmlFor="area">
              <Input
                id="area"
                value={form.areaInspected}
                onChange={(e) => updateMeta("areaInspected", e.target.value)}
              />
            </Field>
            <Field label="ผู้สำรวจ / Inspected By *" htmlFor="inspector">
              <Input
                id="inspector"
                value={form.inspectedBy}
                onChange={(e) => updateMeta("inspectedBy", e.target.value)}
                placeholder="ชื่อผู้สำรวจ"
              />
            </Field>
            <Field
              label="ผู้รับผิดชอบพื้นที่ / Person in charge"
              htmlFor="pic"
            >
              <Input
                id="pic"
                value={form.personInCharge}
                onChange={(e) => updateMeta("personInCharge", e.target.value)}
              />
            </Field>
          </div>
        </section>

        {CATEGORIES.map((cat) => {
          const stats = categoryStats(cat, form.items);
          return (
            <section key={cat.id} className="panel">
              <div className="panel-head cat-head">
                <div>
                  <h2>
                    {cat.titleTh}
                    <span className="cat-en"> / {cat.titleEn}</span>
                  </h2>
                  <p>
                    Max {stats.maxSum} · Result {stats.resultSum}
                    {stats.grade !== null
                      ? ` · Grade ${stats.grade.toFixed(2)}`
                      : ""}
                    {stats.label
                      ? ` — ${stats.label.levelTh} / ${stats.label.levelEn}`
                      : ""}
                  </p>
                </div>
                {stats.label ? (
                  <span
                    className={cn(
                      "grade-pill",
                      gradeTone(stats.grade),
                    )}
                  >
                    {stats.grade?.toFixed(2)} · {stats.label.levelTh}
                  </span>
                ) : null}
              </div>
              <ul className="item-list">
                {cat.items.map((item) => {
                  const ans = form.items[item.id];
                  const level =
                    !ans.na && ans.score !== null
                      ? scoreLevel(ans.score)
                      : null;
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "item-row",
                        ans.na && "item-na",
                        !ans.na &&
                          ans.score !== null &&
                          ans.score <= 4 &&
                          "item-low",
                      )}
                    >
                      <div className="item-text">
                        <span className="item-no">{item.no}</span>
                        <div>
                          <p className="item-th">{item.itemTh}</p>
                          <p className="item-en">{item.itemEn}</p>
                        </div>
                      </div>
                      <div className="item-controls score-controls">
                        <div className="score-row">
                          <Label className="sr-only">คะแนน 0–10</Label>
                          <div className="score-group" role="group">
                            {SCORE_OPTIONS.map((s) => (
                              <button
                                key={s}
                                type="button"
                                disabled={ans.na}
                                className={cn(
                                  "score-btn",
                                  ans.score === s && !ans.na && "active",
                                  s <= 2 && "tone-crit",
                                  s >= 3 && s <= 4 && "tone-poor",
                                  s >= 5 && s <= 6 && "tone-fair",
                                  s >= 7 && s <= 8 && "tone-good",
                                  s >= 9 && "tone-excel",
                                )}
                                aria-pressed={ans.score === s && !ans.na}
                                onClick={() =>
                                  updateItem(item.id, {
                                    score: s,
                                    na: false,
                                  })
                                }
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            className={cn("na-btn", ans.na && "active")}
                            aria-pressed={ans.na}
                            onClick={() =>
                              updateItem(item.id, {
                                na: !ans.na,
                                score: null,
                              })
                            }
                          >
                            N/A
                          </button>
                        </div>
                        {level ? (
                          <p className="level-hint">
                            {level.levelTh} / {level.levelEn} —{" "}
                            {level.criteriaTh}
                          </p>
                        ) : null}
                        <ItemPhotoField
                          photo={ans.photo ?? null}
                          onChange={(photo) => updateItem(item.id, { photo })}
                        />
                        <Textarea
                          value={ans.comment}
                          onChange={(e) =>
                            updateItem(item.id, { comment: e.target.value })
                          }
                          placeholder="Comment (โปรดระบุเอกสารที่เกี่ยวข้อง)"
                          rows={2}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <section className="panel">
          <div className="panel-head">
            <h2>สรุปเกรดตามหมวด</h2>
            <p>Inspection Category Grade Summary</p>
          </div>
          <div className="summary-table-wrap">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Inspection Item</th>
                  <th>Max</th>
                  <th>Result</th>
                  <th>Grade</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat, i) => {
                  const stats = categoryStats(cat, form.items);
                  return (
                    <tr key={cat.id}>
                      <td>{i + 1}</td>
                      <td>
                        {cat.titleTh}
                        <br />
                        <span className="muted">{cat.titleEn}</span>
                      </td>
                      <td>{stats.maxSum}</td>
                      <td>{stats.resultSum}</td>
                      <td>
                        {stats.grade !== null ? stats.grade.toFixed(2) : "—"}
                      </td>
                      <td>
                        {stats.label
                          ? `${stats.label.levelTh} / ${stats.label.levelEn}`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
                <tr className="overall-row">
                  <td colSpan={2}>
                    <strong>ภาพรวม / Overall</strong>
                  </td>
                  <td>{overall.maxSum}</td>
                  <td>{overall.resultSum}</td>
                  <td>
                    {overall.grade !== null ? overall.grade.toFixed(2) : "—"}
                  </td>
                  <td>
                    {overall.label
                      ? `${overall.label.levelTh} / ${overall.label.levelEn}`
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {overall.label ? (
            <p className="action-hint">
              <strong>กิจกรรมที่แนะนำ:</strong> {overall.label.actionTh}
            </p>
          ) : null}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Remark</h2>
            <p>บันทึกเพิ่มเติม</p>
          </div>
          <Textarea
            value={form.remark}
            onChange={(e) => updateMeta("remark", e.target.value)}
            rows={3}
            placeholder="Remark"
          />
        </section>

        <div className="footer-actions print:hidden">
          <Button type="button" size="lg" onClick={handleExport}>
            <Download className="size-4" />
            ส่งออกเป็น Excel
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={handleSaveDraft}
          >
            <Save className="size-4" />
            บันทึกฉบับร่าง
          </Button>
        </div>

        <p className="footnote print:hidden">
          เกณฑ์คะแนน 0–10 และเกณฑ์สรุปผลอ้างอิงจากแท็บ &quot;เกณฑ์คะแนน&quot;
          ในไฟล์ต้นฉบับ · ฉบับร่างเก็บในเบราว์เซอร์เครื่องนี้เท่านั้น
        </p>
      </main>
    </div>
  );
}

function gradeTone(grade: number | null) {
  if (grade === null) return "";
  if (grade >= 9) return "tone-excel";
  if (grade >= 7) return "tone-good";
  if (grade >= 5) return "tone-fair";
  if (grade >= 3) return "tone-poor";
  return "tone-crit";
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
