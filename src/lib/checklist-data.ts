export type ResultValue = "" | "pass" | "fail" | "na";
export type RiskValue = "" | "high" | "medium" | "low";

export type ChecklistItemDef = {
  id: string;
  no: number;
  areaTh: string;
  areaEn: string;
  itemTh: string;
  itemEn: string;
};

export type ItemAnswer = {
  result: ResultValue;
  risk: RiskValue;
  action: string;
};

export type FollowUp = {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
};

export type InspectionForm = {
  site: string;
  building: string;
  productionLine: string;
  shift: string;
  date: string;
  inspectedBy: string;
  department: string;
  items: Record<string, ItemAnswer>;
  followUps: FollowUp[];
  overallNotes: string;
  inspectedBySign: string;
  reviewedBy: string;
  approvedBy: string;
};

export const SHIFTS = ["กะเช้า", "กะบ่าย", "กะดึก", "กะพิเศษ"] as const;

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  {
    id: "1",
    no: 1,
    areaTh: "ทางเดินและพื้น",
    areaEn: "Aisles & walking surfaces",
    itemTh: "ทางเดินโล่งตามความกว้างที่กำหนด ไม่มีสิ่งกีดขวาง",
    itemEn: "Aisles keep full width; nothing left in them",
  },
  {
    id: "2",
    no: 2,
    areaTh: "ทางเดินและพื้น",
    areaEn: "Aisles & walking surfaces",
    itemTh: "พื้นไม่มีจุดสะดุด หลุม หรือคราบน้ำมัน/น้ำหก",
    itemEn: "Floors free of trip points, holes, oil or water spills",
  },
  {
    id: "3",
    no: 3,
    areaTh: "ทางเดินและพื้น",
    areaEn: "Aisles & walking surfaces",
    itemTh: "ราวบันไดแน่นหนา และพื้นบันไดกันลื่น",
    itemEn: "Stair handrails secure; treads slip-resistant",
  },
  {
    id: "4",
    no: 4,
    areaTh: "ทางเดินและพื้น",
    areaEn: "Aisles & walking surfaces",
    itemTh: "แท่นยก/พื้นที่ทำงานสูงมีราวกั้นป้องกันตก",
    itemEn: "Raised platforms have guardrails",
  },
  {
    id: "5",
    no: 5,
    areaTh: "เครื่องจักร",
    areaEn: "Machinery",
    itemTh: "ฝาครอบ/รั้วป้องกันเครื่องจักรติดตั้งครบ ไม่ถูกถอด",
    itemEn: "Machine guards and safety fences in place",
  },
  {
    id: "6",
    no: 6,
    areaTh: "เครื่องจักร",
    areaEn: "Machinery",
    itemTh: "ปุ่มหยุดฉุกเฉินใช้งานได้",
    itemEn: "Emergency stops work",
  },
  {
    id: "7",
    no: 7,
    areaTh: "เครื่องจักร",
    areaEn: "Machinery",
    itemTh: "ไม่มีอันตรายจากการถูกหนีบที่ชิ้นส่วนหมุน/เคลื่อนที่",
    itemEn: "No caught-in hazard at rotating/moving parts",
  },
  {
    id: "8",
    no: 8,
    areaTh: "เครื่องจักร",
    areaEn: "Machinery",
    itemTh: "มีขั้นตอน Lockout/Tagout สำหรับซ่อมบำรุง",
    itemEn: "Lockout/tagout procedure in place for service",
  },
  {
    id: "9",
    no: 9,
    areaTh: "ไฟฟ้า",
    areaEn: "Electrical",
    itemTh: "ฉนวนสายไฟ/สายเคเบิลไม่ชำรุด",
    itemEn: "Cord and cable insulation undamaged",
  },
  {
    id: "10",
    no: 10,
    areaTh: "ไฟฟ้า",
    areaEn: "Electrical",
    itemTh: "ไม่ต่อพ่วงปลั๊กแบบ daisy-chain หรือสายชั่วคราวค้างไว้",
    itemEn: "No daisy-chained strips or temporary wiring left",
  },
  {
    id: "11",
    no: 11,
    areaTh: "ไฟฟ้า",
    areaEn: "Electrical",
    itemTh: "ไม่เก็บของขวางหน้าตู้ไฟ/แผงควบคุม",
    itemEn: "Nothing stored in front of electrical panels",
  },
  {
    id: "12",
    no: 12,
    areaTh: "ไฟฟ้า",
    areaEn: "Electrical",
    itemTh: "ระบบสายดินของอุปกรณ์ต่อครบ",
    itemEn: "Equipment grounding connected",
  },
  {
    id: "13",
    no: 13,
    areaTh: "สารเคมี",
    areaEn: "Chemicals",
    itemTh: "ภาชนะมีป้ายชื่อสารและอันตรายชัดเจน",
    itemEn: "Containers labeled with product name and hazards",
  },
  {
    id: "14",
    no: 14,
    areaTh: "สารเคมี",
    areaEn: "Chemicals",
    itemTh: "พื้นที่เก็บแยกตามประเภทอันตราย / ล็อกได้",
    itemEn: "Storage locked or separated by hazard class",
  },
  {
    id: "15",
    no: 15,
    areaTh: "สารเคมี",
    areaEn: "Chemicals",
    itemTh: "มี SDS ให้พนักงานเข้าถึงได้ทันที",
    itemEn: "Safety data sheets available to workers",
  },
  {
    id: "16",
    no: 16,
    areaTh: "สารเคมี",
    areaEn: "Chemicals",
    itemTh: "ชุดดูดซับสารหกและระบบระบายอากาศเฉพาะที่ใช้ได้",
    itemEn: "Spill kits and local exhaust ventilation working",
  },
  {
    id: "17",
    no: 17,
    areaTh: "ดับเพลิงและฉุกเฉิน",
    areaEn: "Fire & emergency",
    itemTh: "ถังดับเพลิงครบ ชาร์จ และมีแท็กตรวจล่าสุด",
    itemEn: "Extinguishers in place, charged, current tag",
  },
  {
    id: "18",
    no: 18,
    areaTh: "ดับเพลิงและฉุกเฉิน",
    areaEn: "Fire & emergency",
    itemTh: "ทางหนีไฟและประตูทางออกไม่ถูกปิดกั้น",
    itemEn: "Exit routes and doors not blocked",
  },
  {
    id: "19",
    no: 19,
    areaTh: "ดับเพลิงและฉุกเฉิน",
    areaEn: "Fire & emergency",
    itemTh: "ไม่มีวัสดุติดไฟใกล้จุดงานร้อน/เปลวไฟ",
    itemEn: "No combustibles near hot work or open flame",
  },
  {
    id: "20",
    no: 20,
    areaTh: "ดับเพลิงและฉุกเฉิน",
    areaEn: "Fire & emergency",
    itemTh: "ป้ายทางออกส่องสว่าง อ่านได้",
    itemEn: "Exit signs lit and readable",
  },
  {
    id: "21",
    no: 21,
    areaTh: "ดับเพลิงและฉุกเฉิน",
    areaEn: "Fire & emergency",
    itemTh: "ชุดปฐมพยาบาลครบ; อายวอชใช้งานได้เมื่อใช้สารเคมี",
    itemEn: "First aid stocked; eyewash working where needed",
  },
  {
    id: "22",
    no: 22,
    areaTh: "PPE",
    areaEn: "PPE",
    itemTh: "พนักงานสวม PPE ตามที่กำหนด",
    itemEn: "Required PPE issued and worn",
  },
  {
    id: "23",
    no: 23,
    areaTh: "PPE",
    areaEn: "PPE",
    itemTh: "PPE ไม่ชำรุดหรือเสื่อมสภาพ",
    itemEn: "PPE not damaged or worn out",
  },
  {
    id: "24",
    no: 24,
    areaTh: "PPE",
    areaEn: "PPE",
    itemTh: "มีที่เก็บ PPE เป็นระเบียบ",
    itemEn: "PPE has a set storage place",
  },
  {
    id: "25",
    no: 25,
    areaTh: "สภาพแวดล้อมงาน",
    areaEn: "Work environment",
    itemTh: "แสงสว่างเพียงพอต่องาน",
    itemEn: "Lighting enough for the task",
  },
  {
    id: "26",
    no: 26,
    areaTh: "สภาพแวดล้อมงาน",
    areaEn: "Work environment",
    itemTh: "ระบบระบายอากาศทำงานปกติ",
    itemEn: "Ventilation working",
  },
  {
    id: "27",
    no: 27,
    areaTh: "สภาพแวดล้อมงาน",
    areaEn: "Work environment",
    itemTh: "มีการควบคุมเสียง/การสั่นสะเทือน",
    itemEn: "Noise and vibration controls in place",
  },
  {
    id: "28",
    no: 28,
    areaTh: "สภาพแวดล้อมงาน",
    areaEn: "Work environment",
    itemTh: "มีการควบคุมความร้อน (น้ำ พักผ่อน ที่ร่ม/ทำความเย็น)",
    itemEn: "Heat stress controls in place",
  },
  {
    id: "29",
    no: 29,
    areaTh: "ความเป็นระเบียบ (5S)",
    areaEn: "Housekeeping",
    itemTh: "ไม่มีของที่ไม่จำเป็นวางเกลื่อน",
    itemEn: "No unneeded items left lying around",
  },
  {
    id: "30",
    no: 30,
    areaTh: "ความเป็นระเบียบ (5S)",
    areaEn: "Housekeeping",
    itemTh: "เครื่องมือ/จิ๊กเก็บในที่กำหนด",
    itemEn: "Tools and fixtures kept in set places",
  },
  {
    id: "31",
    no: 31,
    areaTh: "ความเป็นระเบียบ (5S)",
    areaEn: "Housekeeping",
    itemTh: "ขยะแยกประเภทและเก็บในภาชนะที่ถูกต้อง",
    itemEn: "Waste sorted and stored in right containers",
  },
  {
    id: "32",
    no: 32,
    areaTh: "การขนส่งในพื้นที่",
    areaEn: "Workplace transport",
    itemTh: "เส้นทางรถยก/รถเข็นชัดเจน ไม่ชนกับทางเดินคน",
    itemEn: "FLT/cart routes clear; separated from pedestrians",
  },
  {
    id: "33",
    no: 33,
    areaTh: "การขนส่งในพื้นที่",
    areaEn: "Workplace transport",
    itemTh: "วัสดุวางซ้อนมั่นคง ไม่เกินความสูงที่กำหนด",
    itemEn: "Materials stacked securely within height limits",
  },
  {
    id: "34",
    no: 34,
    areaTh: "สุขอนามัยพื้นที่ผลิต",
    areaEn: "Production hygiene",
    itemTh: "พื้นที่ผลิตสะอาด พร้อมใช้งาน ไม่มีเศษวัสดุค้าง",
    itemEn: "Production area clean and ready; no debris",
  },
  {
    id: "35",
    no: 35,
    areaTh: "สุขอนามัยพื้นที่ผลิต",
    areaEn: "Production hygiene",
    itemTh: "ไม่พบร่องรอยสัตว์พาหะ / กับดักหนูอยู่ในสภาพดี",
    itemEn: "No pest evidence; traps in good condition",
  },
];

export function emptyAnswer(): ItemAnswer {
  return { result: "", risk: "", action: "" };
}

export function todayISODate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function createEmptyForm(date = ""): InspectionForm {
  const items: Record<string, ItemAnswer> = {};
  for (const item of CHECKLIST_ITEMS) {
    items[item.id] = emptyAnswer();
  }
  return {
    site: "",
    building: "",
    productionLine: "",
    shift: "",
    date,
    inspectedBy: "",
    department: "",
    items,
    followUps: [{ id: "fu-1", task: "", owner: "", dueDate: "" }],
    overallNotes: "",
    inspectedBySign: "",
    reviewedBy: "",
    approvedBy: "",
  };
}

export function groupItemsByArea(items: ChecklistItemDef[]) {
  const groups: { areaTh: string; areaEn: string; items: ChecklistItemDef[] }[] =
    [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.areaTh === item.areaTh) {
      last.items.push(item);
    } else {
      groups.push({
        areaTh: item.areaTh,
        areaEn: item.areaEn,
        items: [item],
      });
    }
  }
  return groups;
}

export function countProgress(form: InspectionForm) {
  const total = CHECKLIST_ITEMS.length;
  let answered = 0;
  let pass = 0;
  let fail = 0;
  let na = 0;
  for (const def of CHECKLIST_ITEMS) {
    const r = form.items[def.id]?.result;
    if (r === "pass") {
      answered += 1;
      pass += 1;
    } else if (r === "fail") {
      answered += 1;
      fail += 1;
    } else if (r === "na") {
      answered += 1;
      na += 1;
    }
  }
  return { total, answered, pass, fail, na, pct: Math.round((answered / total) * 100) };
}

export const STORAGE_KEY = "production-area-inspection-draft-v1";
