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
  Plus,
  Printer,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CHECKLIST_ITEMS,
  SHIFTS,
  STORAGE_KEY,
  countProgress,
  createEmptyForm,
  groupItemsByArea,
  todayISODate,
  type InspectionForm,
  type ItemAnswer,
  type ResultValue,
  type RiskValue,
} from "@/lib/checklist-data";
import { exportInspectionXlsx } from "@/lib/export-xlsx";
import { cn } from "@/lib/utils";

const RESULT_OPTIONS: { value: ResultValue; label: string; short: string }[] = [
  { value: "pass", label: "ผ่าน", short: "Pass" },
  { value: "fail", label: "ไม่ผ่าน", short: "Fail" },
  { value: "na", label: "N/A", short: "N/A" },
];

const RISK_OPTIONS: { value: RiskValue; label: string }[] = [
  { value: "high", label: "สูง" },
  { value: "medium", label: "กลาง" },
  { value: "low", label: "ต่ำ" },
];

export function InspectionFormApp() {
  const [form, setForm] = useState<InspectionForm>(() => createEmptyForm());
  const [hydrated, setHydrated] = useState(false);
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
          startTransition(() => {
            setForm({
              ...blank,
              ...parsed,
              date: parsed.date || blank.date,
              items: { ...blank.items, ...parsed.items },
              followUps:
                parsed.followUps?.length > 0
                  ? parsed.followUps
                  : blank.followUps,
            });
          });
          setHydrated(true);
          return;
        }
      }
    } catch {
      // ignore corrupt draft
    }
    startTransition(() => {
      setForm(createEmptyForm(todayISODate()));
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, 400);
    return () => window.clearTimeout(t);
  }, [form, hydrated]);

  const groups = useMemo(() => groupItemsByArea(CHECKLIST_ITEMS), []);
  const progress = useMemo(() => countProgress(form), [form]);

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
    setForm(createEmptyForm());
    setError(null);
    flash("ล้างฟอร์มแล้ว");
  }

  function validateForExport() {
    if (!form.site.trim() || !form.inspectedBy.trim() || !form.date) {
      setError("กรุณากรอก สถานที่, ผู้ตรวจ และวันที่ ก่อนส่งออก");
      return false;
    }
    if (progress.answered < progress.total) {
      setError(
        `ยังตรวจไม่ครบ: ${progress.answered}/${progress.total} รายการ (ช่องว่าง = ยังไม่ได้ตรวจ)`,
      );
      return false;
    }
    const missingRisk = CHECKLIST_ITEMS.some((item) => {
      const ans = form.items[item.id];
      return ans.result === "fail" && !ans.risk;
    });
    if (missingRisk) {
      setError("รายการที่ไม่ผ่านต้องระบุระดับความเสี่ยง");
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

  function handlePrint() {
    window.print();
  }

  return (
    <div className="inspection-shell">
      <header className="hero print:hidden">
        <div className="hero-grid" aria-hidden />
        <div className="hero-inner">
          <p className="brand">PAIC</p>
          <h1>Production Area Inspection Checklist</h1>
          <p className="lede">
            แบบตรวจพื้นที่ผลิต — กรอกผลผ่าน/ไม่ผ่าน/N/A พร้อมความเสี่ยงและการแก้ไข
            แล้วส่งออกเป็น Excel
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
          </div>
        </div>
      </header>

      <div className="sticky-bar print:hidden">
        <div className="sticky-inner">
          <div className="progress-block">
            <div className="progress-meta">
              <span>
                ความคืบหน้า {progress.answered}/{progress.total}
              </span>
              <span className="stats">
                ผ่าน {progress.pass} · ไม่ผ่าน {progress.fail} · N/A{" "}
                {progress.na}
              </span>
            </div>
            <div className="progress-track" aria-hidden>
              <div
                className="progress-fill"
                style={{ width: `${progress.pct}%` }}
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
            <Button type="button" size="sm" variant="outline" onClick={handlePrint}>
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

        <section className="panel">
          <div className="panel-head">
            <h2>ข้อมูลการตรวจ</h2>
            <p>กรอกก่อนเดินตรวจพื้นที่ — ใช้หนึ่งฟอร์มต่อพื้นที่/สายการผลิต</p>
          </div>
          <div className="meta-grid">
            <Field label="สถานที่ / Site *" htmlFor="site">
              <Input
                id="site"
                value={form.site}
                onChange={(e) => updateMeta("site", e.target.value)}
                placeholder="เช่น โรงงาน A"
              />
            </Field>
            <Field label="อาคาร / Building" htmlFor="building">
              <Input
                id="building"
                value={form.building}
                onChange={(e) => updateMeta("building", e.target.value)}
                placeholder="เช่น Building C"
              />
            </Field>
            <Field label="สายการผลิต / Line" htmlFor="line">
              <Input
                id="line"
                value={form.productionLine}
                onChange={(e) => updateMeta("productionLine", e.target.value)}
                placeholder="เช่น Line 2"
              />
            </Field>
            <Field label="กะ / Shift" htmlFor="shift">
              <select
                id="shift"
                className="select"
                value={form.shift}
                onChange={(e) => updateMeta("shift", e.target.value)}
              >
                <option value="">เลือกกะ</option>
                {SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก / Department" htmlFor="dept">
              <Input
                id="dept"
                value={form.department}
                onChange={(e) => updateMeta("department", e.target.value)}
                placeholder="เช่น Production"
              />
            </Field>
            <Field label="วันที่ / Date *" htmlFor="date">
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateMeta("date", e.target.value)}
              />
            </Field>
            <Field label="ผู้ตรวจ / Inspected by *" htmlFor="inspector">
              <Input
                id="inspector"
                value={form.inspectedBy}
                onChange={(e) => updateMeta("inspectedBy", e.target.value)}
                placeholder="ชื่อ-นามสกุล"
              />
            </Field>
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.areaTh} className="panel">
            <div className="panel-head">
              <h2>{group.areaTh}</h2>
              <p>{group.areaEn}</p>
            </div>
            <ul className="item-list">
              {group.items.map((item) => {
                const ans = form.items[item.id];
                const isFail = ans.result === "fail";
                return (
                  <li
                    key={item.id}
                    className={cn("item-row", isFail && "item-fail")}
                  >
                    <div className="item-text">
                      <span className="item-no">{item.no}</span>
                      <div>
                        <p className="item-th">{item.itemTh}</p>
                        <p className="item-en">{item.itemEn}</p>
                      </div>
                    </div>
                    <div className="item-controls">
                      <div
                        className="result-group"
                        role="radiogroup"
                        aria-label={`ผลรายการ ${item.no}`}
                      >
                        {RESULT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            className={cn(
                              "result-btn",
                              opt.value,
                              ans.result === opt.value && "active",
                            )}
                            aria-pressed={ans.result === opt.value}
                            onClick={() =>
                              updateItem(item.id, {
                                result: opt.value,
                                risk:
                                  opt.value === "fail" ? ans.risk : "",
                              })
                            }
                          >
                            <span>{opt.label}</span>
                            <small>{opt.short}</small>
                          </button>
                        ))}
                      </div>
                      {isFail ? (
                        <div className="fail-extra">
                          <div className="risk-row">
                            <Label>ความเสี่ยง</Label>
                            <div className="risk-group">
                              {RISK_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  className={cn(
                                    "risk-btn",
                                    opt.value,
                                    ans.risk === opt.value && "active",
                                  )}
                                  onClick={() =>
                                    updateItem(item.id, { risk: opt.value })
                                  }
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Textarea
                            value={ans.action}
                            onChange={(e) =>
                              updateItem(item.id, { action: e.target.value })
                            }
                            placeholder="ปัญหาที่พบ และการแก้ไข / Corrective action"
                            rows={2}
                          />
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="panel">
          <div className="panel-head">
            <h2>งานค้างก่อนการตรวจครั้งถัดไป</h2>
            <p>สิ่งที่ยังแก้ไม่เสร็จ — ผู้รับผิดชอบและกำหนดเสร็จ</p>
          </div>
          <div className="follow-list">
            {form.followUps.map((fu, index) => (
              <div key={fu.id} className="follow-row">
                <Input
                  value={fu.task}
                  onChange={(e) =>
                    setForm((prev) => {
                      const next = [...prev.followUps];
                      next[index] = { ...next[index], task: e.target.value };
                      return { ...prev, followUps: next };
                    })
                  }
                  placeholder="รายการที่ต้องทำ"
                />
                <Input
                  value={fu.owner}
                  onChange={(e) =>
                    setForm((prev) => {
                      const next = [...prev.followUps];
                      next[index] = { ...next[index], owner: e.target.value };
                      return { ...prev, followUps: next };
                    })
                  }
                  placeholder="ผู้รับผิดชอบ"
                />
                <Input
                  type="date"
                  value={fu.dueDate}
                  onChange={(e) =>
                    setForm((prev) => {
                      const next = [...prev.followUps];
                      next[index] = {
                        ...next[index],
                        dueDate: e.target.value,
                      };
                      return { ...prev, followUps: next };
                    })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="print:hidden"
                  aria-label="ลบรายการ"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      followUps:
                        prev.followUps.length <= 1
                          ? [
                              {
                                id: `fu-${Date.now()}`,
                                task: "",
                                owner: "",
                                dueDate: "",
                              },
                            ]
                          : prev.followUps.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="print:hidden w-fit"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  followUps: [
                    ...prev.followUps,
                    {
                      id: `fu-${Date.now()}-${prev.followUps.length}`,
                      task: "",
                      owner: "",
                      dueDate: "",
                    },
                  ],
                }))
              }
            >
              <Plus className="size-4" />
              เพิ่มรายการ
            </Button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>บันทึกและลงนาม</h2>
            <p>สรุปภาพรวมและผู้รับรอง</p>
          </div>
          <Field label="บันทึกเพิ่มเติม / Overall notes" htmlFor="notes">
            <Textarea
              id="notes"
              value={form.overallNotes}
              onChange={(e) => updateMeta("overallNotes", e.target.value)}
              rows={3}
              placeholder="สรุปภาพรวมพื้นที่ผลิต หรือข้อสังเกตอื่น"
            />
          </Field>
          <div className="sign-grid">
            <Field label="ผู้ตรวจ / Inspected by" htmlFor="sign1">
              <Input
                id="sign1"
                value={form.inspectedBySign}
                onChange={(e) => updateMeta("inspectedBySign", e.target.value)}
                placeholder={form.inspectedBy || "ชื่อผู้ตรวจ"}
              />
            </Field>
            <Field label="ผู้ทบทวน / Reviewed by" htmlFor="sign2">
              <Input
                id="sign2"
                value={form.reviewedBy}
                onChange={(e) => updateMeta("reviewedBy", e.target.value)}
                placeholder="หัวหน้างาน"
              />
            </Field>
            <Field label="ผู้อนุมัติ / Approved by" htmlFor="sign3">
              <Input
                id="sign3"
                value={form.approvedBy}
                onChange={(e) => updateMeta("approvedBy", e.target.value)}
                placeholder="ผู้จัดการ"
              />
            </Field>
          </div>
        </section>

        <div className="footer-actions print:hidden">
          <Button type="button" size="lg" onClick={handleExport}>
            <Download className="size-4" />
            ส่งออกเป็น Excel
          </Button>
          <Button type="button" size="lg" variant="secondary" onClick={handleSaveDraft}>
            <Save className="size-4" />
            บันทึกฉบับร่างในเบราว์เซอร์
          </Button>
        </div>

        <p className="footnote print:hidden">
          ฉบับร่างถูกบันทึกอัตโนมัติในเบราว์เซอร์เครื่องนี้เท่านั้น
          ไม่ได้ส่งขึ้นเซิร์ฟเวอร์ — ดาวน์โหลด Excel เพื่อเก็บหลักฐานการตรวจ
        </p>
      </main>
    </div>
  );
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
