export type ChecklistItemDef = {
  id: string;
  no: number;
  itemTh: string;
  itemEn: string;
};

export type CategoryDef = {
  id: string;
  titleTh: string;
  titleEn: string;
  items: ChecklistItemDef[];
};

export type ItemPhoto = {
  dataUrl: string;
  name: string;
};

/** Score 0–10, or null when marked N/A */
export type ItemAnswer = {
  score: number | null;
  na: boolean;
  comment: string;
  /** Optional evidence photo (not required) */
  photo: ItemPhoto | null;
};

export type InspectionForm = {
  areaInspected: string;
  inspectedBy: string;
  personInCharge: string;
  docNo: string;
  date: string;
  rev: string;
  items: Record<string, ItemAnswer>;
  remark: string;
};

export const SCORE_CRITERIA: {
  score: number;
  levelTh: string;
  levelEn: string;
  criteriaTh: string;
  criteriaEn: string;
}[] = [
  {
    score: 10,
    levelTh: "ดีเยี่ยม",
    levelEn: "Excellent",
    criteriaTh: "ปฏิบัติครบถ้วนตามข้อกำหนด สะอาด เป็นระเบียบ ไม่พบข้อบกพร่อง",
    criteriaEn:
      "Fully complies with the requirements; clean and orderly, with no deficiencies identified.",
  },
  {
    score: 9,
    levelTh: "ดีมาก",
    levelEn: "Very Good",
    criteriaTh:
      "ปฏิบัติครบถ้วน พบข้อสังเกตเล็กน้อยมาก แต่ไม่กระทบต่อคุณภาพหรือความปลอดภัย",
    criteriaEn:
      "Fully complies with the requirements, with only minor observations that do not affect product quality or safety.",
  },
  {
    score: 8,
    levelTh: "ดี",
    levelEn: "Good",
    criteriaTh: "พบข้อบกพร่องเล็กน้อย ไม่กระทบต่อผลิตภัณฑ์ และสามารถแก้ไขได้ทันที",
    criteriaEn:
      "Minor deficiencies identified that do not affect the product and can be corrected immediately.",
  },
  {
    score: 7,
    levelTh: "ค่อนข้างดี",
    levelEn: "Satisfactory",
    criteriaTh: "พบข้อบกพร่องเล็กน้อยหลายจุด ต้องมีการปรับปรุง",
    criteriaEn: "Multiple minor deficiencies identified; improvement is required.",
  },
  {
    score: 6,
    levelTh: "พอใช้",
    levelEn: "Acceptable",
    criteriaTh: "พบข้อบกพร่องชัดเจนบางรายการ แต่ยังไม่พบความเสี่ยงร้ายแรง",
    criteriaEn:
      "Some clear deficiencies identified; however, no serious risks were found.",
  },
  {
    score: 5,
    levelTh: "ต้องปรับปรุง",
    levelEn: "Needs Improvement",
    criteriaTh: "พบข้อบกพร่องหลายรายการ หรือมีการปฏิบัติไม่สม่ำเสมอ",
    criteriaEn:
      "Multiple deficiencies identified, or inconsistent implementation of requirements.",
  },
  {
    score: 4,
    levelTh: "ต่ำกว่ามาตรฐาน",
    levelEn: "Below Standard",
    criteriaTh:
      "พบข้อบกพร่องสำคัญที่อาจเพิ่มความเสี่ยงต่อคุณภาพหรือสุขลักษณะ",
    criteriaEn:
      "Significant deficiencies identified that may increase risks to product quality or hygiene.",
  },
  {
    score: 3,
    levelTh: "ไม่เป็นไปตามข้อกำหนด",
    levelEn: "Poor",
    criteriaTh: "พบข้อบกพร่องสำคัญหลายจุด ต้องเร่งแก้ไข",
    criteriaEn:
      "Multiple significant deficiencies identified; urgent corrective action is required.",
  },
  {
    score: 2,
    levelTh: "ไม่เป็นที่ยอมรับ",
    levelEn: "Very Poor",
    criteriaTh:
      "พบสภาพพื้นที่ที่มีความเสี่ยงสูงต่อการปนเปื้อนหรือคุณภาพผลิตภัณฑ์",
    criteriaEn:
      "The area conditions pose a high risk of product contamination or compromised product quality.",
  },
  {
    score: 1,
    levelTh: "วิกฤต",
    levelEn: "Critical Condition",
    criteriaTh: "พบสภาพที่มีความเสี่ยงร้ายแรง ต้องควบคุมและดำเนินการแก้ไขทันที",
    criteriaEn:
      "Critical risk conditions identified; immediate control measures and corrective actions are required.",
  },
  {
    score: 0,
    levelTh: "ไม่สามารถยอมรับได้",
    levelEn: "Unacceptable",
    criteriaTh:
      "ไม่ปฏิบัติตามข้อกำหนดอย่างรุนแรง หรือพบเหตุการณ์ที่อาจส่งผลกระทบโดยตรงต่อความปลอดภัยของผลิตภัณฑ์",
    criteriaEn:
      "Severe non-compliance with requirements identified, or an incident that may directly compromise product safety.",
  },
];

export const SUMMARY_GRADES: {
  min: number;
  max: number;
  levelTh: string;
  levelEn: string;
  actionTh: string;
  actionEn: string;
}[] = [
  {
    min: 9,
    max: 10,
    levelTh: "ดีเยี่ยม",
    levelEn: "Excellent",
    actionTh: "รักษามาตรฐานและติดตามผลตามรอบปกติ",
    actionEn:
      "Maintain established standards and conduct routine follow-up inspections.",
  },
  {
    min: 7,
    max: 8.999,
    levelTh: "ดี",
    levelEn: "Good",
    actionTh: "แก้ไขข้อบกพร่องเล็กน้อยและติดตามผล",
    actionEn: "Correct minor deficiencies and follow up on corrective actions.",
  },
  {
    min: 5,
    max: 6.999,
    levelTh: "พอใช้",
    levelEn: "Fair",
    actionTh: "ต้องจัดทำแผนปรับปรุงและกำหนดวันแล้วเสร็จ",
    actionEn:
      "An improvement plan must be established with a defined completion date.",
  },
  {
    min: 3,
    max: 4.999,
    levelTh: "ต้องเร่งปรับปรุง",
    levelEn: "Poor",
    actionTh: "แจ้งหัวหน้างาน แก้ไขเร่งด่วน และตรวจติดตามซ้ำ",
    actionEn:
      "Notify the supervisor, implement urgent corrective actions, and conduct a follow-up inspection.",
  },
  {
    min: 0,
    max: 2.999,
    levelTh: "วิกฤต / ไม่ผ่าน",
    levelEn: "Critical / Fail",
    actionTh:
      "ควบคุมความเสี่ยงทันที แจ้งผู้รับผิดชอบ และพิจารณาหยุดกิจกรรมที่เกี่ยวข้องตามความจำเป็น",
    actionEn:
      "Immediately control the risk, notify the person responsible, and consider suspending the relevant activities as necessary.",
  },
];

export const MAX_ITEM_SCORE = 10;

export const CATEGORIES: CategoryDef[] = [
  {
    id: "production",
    titleTh: "พื้นที่ผลิต",
    titleEn: "Production Area",
    items: [
      {
        id: "p1",
        no: 1,
        itemTh: "พื้นที่สะอาด เป็นระเบียบ ไม่มีสิ่งสกปรกหรือสิ่งปนเปื้อน",
        itemEn:
          "The area is clean, orderly, and free from dirt and contamination.",
      },
      {
        id: "p2",
        no: 2,
        itemTh: "พื้น ผนัง และเพดานอยู่ในสภาพดี ไม่ชำรุด",
        itemEn:
          "Floors, walls, and ceilings are maintained in good condition and free from damage.",
      },
      {
        id: "p3",
        no: 3,
        itemTh:
          "เครื่องจักรและอุปกรณ์สะอาด ไม่มีสนิม คราบน้ำมัน หรือชิ้นส่วนหลุดร่วง",
        itemEn:
          "Machinery and equipment are clean and free from rust, oil contamination, or loose components.",
      },
      {
        id: "p4",
        no: 4,
        itemTh: "ไม่พบ Foreign Body หรือวัสดุที่อาจก่อให้เกิดการปนเปื้อน",
        itemEn:
          "No foreign bodies or materials that could cause contamination are present.",
      },
      {
        id: "p5",
        no: 5,
        itemTh: "มีพื้นที่เพียงพอในการผลิตและจัดวางผลิตภัณฑ์",
        itemEn: "Adequate space is provided for production and product storage.",
      },
      {
        id: "p6",
        no: 6,
        itemTh: "ไม่มีสินค้าวางสัมผัสพื้นโดยตรง",
        itemEn: "Products are not stored directly on the floor.",
      },
      {
        id: "p7",
        no: 7,
        itemTh: "ไม่ใช้พาเลทไม้ในการจัดวางสินค้าและวัตถุดิบ",
        itemEn:
          "Wooden pallets are not used for storing or placing products and raw materials.",
      },
      {
        id: "p8",
        no: 8,
        itemTh: "ไม่พบอาหารหรือเครื่องดื่มในพื้นที่ผลิต",
        itemEn: "No food or beverages are present in the production area.",
      },
      {
        id: "p9",
        no: 9,
        itemTh: "พนักงานปฏิบัติตามข้อกำหนด Personal Hygiene",
        itemEn: "Personnel comply with personal hygiene requirements.",
      },
      {
        id: "p10",
        no: 10,
        itemTh: "พนักงานไม่สวมใส่เครื่องประดับ",
        itemEn: "Personnel do not wear jewellery.",
      },
      {
        id: "p11",
        no: 11,
        itemTh:
          "เล็บมือสั้น สะอาด ไม่ทาเล็บและไม่ใส่เล็บปลอม กรณีสวมถุงมือมีการเปลี่ยนสม่ำเสมอ ไม่มีเส้นใยหลุดร่วง",
        itemEn:
          "Fingernails are short and clean, with no nail polish or artificial nails. Where gloves are worn, they are changed regularly, kept in good condition, and free from loose fibers.",
      },
      {
        id: "p12",
        no: 12,
        itemTh: "พนักงานสวม Protective Clothing อย่างถูกต้อง",
        itemEn: "Personnel wear protective clothing correctly.",
      },
      {
        id: "p13",
        no: 13,
        itemTh: "ไม่มีการใช้โทรศัพท์มือถือโดยบุคคลที่ไม่ได้รับอนุญาต",
        itemEn: "Mobile phones are not used by unauthorised persons.",
      },
      {
        id: "p14",
        no: 14,
        itemTh: "อุปกรณ์ทำความสะอาดจัดเก็บในพื้นที่ที่กำหนด",
        itemEn: "Cleaning equipment is stored in designated areas.",
      },
      {
        id: "p15",
        no: 15,
        itemTh: "มีการควบคุมและจัดการของเสียอย่างเหมาะสม",
        itemEn: "Waste is appropriately controlled and managed.",
      },
      {
        id: "p16",
        no: 16,
        itemTh:
          "ก่อนเริ่มผลิตใหม่ ต้องมีการเคลียร์พื้นที่ เพื่อให้มั่นใจว่าพื้นที่ เครื่องจักร อุปกรณ์ และวัสดุจากการผลิตก่อนหน้าได้รับการตรวจสอบและนำออกอย่างครบถ้วน",
        itemEn:
          "Before starting a new production run, line clearance is carried out to ensure that the area, equipment, and materials from the previous production run have been properly checked and removed.",
      },
      {
        id: "p17",
        no: 17,
        itemTh:
          "ห้ามนำผลิตภัณฑ์ที่ผลิตแล้วไปใช้ในวัตถุประสงค์อื่นนอกเหนือจากที่กำหนด",
        itemEn:
          "Manufactured products shall not be used for any purpose other than their intended use.",
      },
      {
        id: "p18",
        no: 18,
        itemTh:
          "มีชิ้นงานตัวอย่างที่ผ่าน FAI พร้อมจุดชี้บ่ง และมี Working Standard ที่ถูกต้องตรงกับงานที่กำลังผลิต",
        itemEn:
          "FAI-approved sample parts are clearly identified, and the correct Working Standard matches the product in production.",
      },
      {
        id: "p19",
        no: 19,
        itemTh: "ตรวจสอบอุปกรณ์และเครื่องมือก่อนนำเข้าและนำออกจากพื้นที่ผลิต",
        itemEn:
          "Equipment and tools are checked before entering and leaving production areas.",
      },
      {
        id: "p20",
        no: 20,
        itemTh: "ตรวจวัดอุณหภูมิและคัดกรองอาการเจ็บป่วยก่อนเข้าพื้นที่ผลิต",
        itemEn:
          "Temperature and health screening are conducted before entering production areas.",
      },
    ],
  },
  {
    id: "locker",
    titleTh: "พื้นที่ล็อกเกอร์พนักงาน",
    titleEn: "Personnel / Locker Area",
    items: [
      {
        id: "l1",
        no: 21,
        itemTh: "ตู้ล็อกเกอร์สะอาดและอยู่ในสภาพดี",
        itemEn: "Lockers are clean and maintained in good condition.",
      },
      {
        id: "l2",
        no: 22,
        itemTh: "ไม่พบอาหารและเครื่องดื่ม",
        itemEn: "No food or beverages are found.",
      },
      {
        id: "l3",
        no: 23,
        itemTh: "ไม่พบสิ่งของที่อาจก่อให้เกิดการปนเปื้อน",
        itemEn: "No items that could present a contamination risk are found.",
      },
      {
        id: "l4",
        no: 24,
        itemTh: "เสื้อผ้าส่วนตัวแยกจากชุดที่ใช้ในพื้นที่ผลิต",
        itemEn:
          "Personal clothing is segregated from workwear used in production areas.",
      },
      {
        id: "l5",
        no: 25,
        itemTh: "สิ่งของจัดเก็บอย่างเป็นระเบียบ",
        itemEn: "Personal belongings are stored in an orderly manner.",
      },
      {
        id: "l6",
        no: 26,
        itemTh: "ไม่มีการเก็บของใช้ส่วนตัวที่ไม่เหมาะสม",
        itemEn: "Inappropriate personal belongings are not stored in lockers.",
      },
    ],
  },
  {
    id: "toilet",
    titleTh: "ห้องน้ำและจุดล้างมือ",
    titleEn: "Toilet / Hand Washing Area",
    items: [
      {
        id: "t1",
        no: 27,
        itemTh: "อ่างน้ำ / ห้องน้ำสะอาดและถูกสุขลักษณะ",
        itemEn: "Sink / Toilets are clean and hygienically maintained.",
      },
      {
        id: "t2",
        no: 28,
        itemTh: "ห้องน้ำไม่เปิดโดยตรงเข้าสู่พื้นที่ผลิต",
        itemEn: "Toilets do not open directly into production areas.",
      },
      {
        id: "t3",
        no: 29,
        itemTh: "มีน้ำสะอาดเพียงพอ",
        itemEn: "An adequate supply of clean water is available.",
      },
      {
        id: "t4",
        no: 30,
        itemTh: "มีสบู่/น้ำยาล้างมือ",
        itemEn: "Soap or hand-cleaning agents are available.",
      },
      {
        id: "t5",
        no: 31,
        itemTh: "มีอุปกรณ์เป่ามือ / ทำให้แห้ง",
        itemEn:
          "Hand-drying facilities are available and in good working condition.",
      },
      {
        id: "t6",
        no: 32,
        itemTh: "มีแอลกอฮอล์ล้างมือ",
        itemEn: "Alcohol-based hand cleaning agents are available.",
      },
      {
        id: "t7",
        no: 33,
        itemTh: "อุปกรณ์อยู่ในสภาพพร้อมใช้งาน",
        itemEn: "Facilities and equipment are in good working condition.",
      },
      {
        id: "t8",
        no: 34,
        itemTh: "มีป้ายหรือคำแนะนำการล้างมือที่เหมาะสม",
        itemEn: "Appropriate hand-washing instructions or signage are provided.",
      },
    ],
  },
  {
    id: "chemical",
    titleTh: "พื้นที่จัดเก็บสารเคมี",
    titleEn: "Chemical Storage Area",
    items: [
      {
        id: "c1",
        no: 35,
        itemTh: "สารเคมีมีฉลากระบุชัดเจน",
        itemEn: "Chemicals are clearly labelled.",
      },
      {
        id: "c2",
        no: 36,
        itemTh: "สารเคมีจัดเก็บในภาชนะที่ปิดสนิท",
        itemEn: "Chemicals are stored in suitable, securely closed containers.",
      },
      {
        id: "c3",
        no: 37,
        itemTh: "สารเคมีแยกจากวัตถุดิบและผลิตภัณฑ์",
        itemEn: "Chemicals are segregated from raw materials and products.",
      },
      {
        id: "c4",
        no: 38,
        itemTh: "มี SDS ที่เกี่ยวข้อง",
        itemEn: "Relevant Safety Data Sheets (SDS) are available.",
      },
      {
        id: "c5",
        no: 39,
        itemTh: "มีการควบคุมการเบิกจ่ายและการใช้งาน",
        itemEn: "Chemical issue and usage are appropriately controlled.",
      },
      {
        id: "c6",
        no: 40,
        itemTh: "ไม่พบการรั่วไหลหรือภาชนะชำรุด",
        itemEn: "No leakage or damaged containers are observed.",
      },
    ],
  },
  {
    id: "waste",
    titleTh: "พื้นที่จัดเก็บของเสีย",
    titleEn: "Waste Area",
    items: [
      {
        id: "w1",
        no: 41,
        itemTh: "มีพื้นที่จัดเก็บของเสีย / ขยะ ที่กำหนดชัดเจน",
        itemEn: "Designated waste storage areas are clearly defined.",
      },
      {
        id: "w2",
        no: 42,
        itemTh: "มีการแยกประเภทของเสีย / ขยะ",
        itemEn: "Waste is appropriately segregated by type.",
      },
      {
        id: "w3",
        no: 43,
        itemTh: "ภาชนะบรรจุของเสีย / ขยะ เหมาะสมและมีฝาปิดตามความจำเป็น",
        itemEn:
          "Suitable waste containers are provided and covered where required.",
      },
      {
        id: "w4",
        no: 44,
        itemTh: "ไม่มีการสะสมของเสีย / ขยะ ในพื้นที่ผลิต",
        itemEn: "Waste is not allowed to accumulate in production areas.",
      },
      {
        id: "w5",
        no: 45,
        itemTh: "มีการนำของเสีย / ขยะ ออกจากพื้นที่ตามความถี่ที่กำหนด",
        itemEn: "Waste is removed at the defined frequency.",
      },
      {
        id: "w6",
        no: 46,
        itemTh:
          "การจัดการของเสีย / ขยะ ไม่ก่อให้เกิดความเสี่ยงต่อการปนเปื้อนหรือ Pest",
        itemEn:
          "Waste management does not present a risk of contamination or pest activity.",
      },
    ],
  },
  {
    id: "pest",
    titleTh: "การควบคุมสัตว์พาหะ",
    titleEn: "Pest Control",
    items: [
      {
        id: "pe1",
        no: 47,
        itemTh: "Pest Trap / Insect Light Trap อยู่ในตำแหน่งที่กำหนด",
        itemEn: "Pest traps and insect light traps are located as specified.",
      },
      {
        id: "pe2",
        no: 48,
        itemTh: "อุปกรณ์ควบคุมสัตว์พาหะอยู่ในสภาพดี",
        itemEn: "Pest control devices are maintained in good condition.",
      },
      {
        id: "pe3",
        no: 49,
        itemTh: "ไม่พบหลักฐาน Pest Activity",
        itemEn: "No evidence of pest activity is present.",
      },
      {
        id: "pe4",
        no: 50,
        itemTh: "ไม่มีช่องเปิดหรือจุดที่อาจทำให้สัตว์พาหะเข้าพื้นที่ผลิต",
        itemEn:
          "No openings or points that could allow pest ingress are present.",
      },
      {
        id: "pe5",
        no: 51,
        itemTh:
          "รางระบายน้ำต้องติดตะแกรงหรือกับดักเพื่อป้องกันสัตว์พาหะเข้ามาภายในอาคารผลิต",
        itemEn:
          "Drainage channels are fitted with grates or traps to prevent pest entry into the production building.",
      },
      {
        id: "pe6",
        no: 52,
        itemTh: "มีการตรวจสอบตามความถี่ที่กำหนด",
        itemEn: "Pest control inspections are conducted at the defined frequency.",
      },
      {
        id: "pe7",
        no: 53,
        itemTh: "มีบันทึกผลการตรวจและการแก้ไขเมื่อพบความผิดปกติ",
        itemEn:
          "Inspection records and corrective actions are maintained where abnormalities are identified.",
      },
    ],
  },
  {
    id: "docs",
    titleTh: "เอกสารและบันทึก",
    titleEn: "Documentation / Records",
    items: [
      {
        id: "d1",
        no: 54,
        itemTh: "มีการตรวจพื้นที่ตามความถี่ที่กำหนด",
        itemEn: "Area inspections are conducted at the defined frequency.",
      },
      {
        id: "d2",
        no: 55,
        itemTh: "ผู้ตรวจสอบลงชื่อและวันที่ครบถ้วน",
        itemEn:
          "The inspector's name/signature and inspection date are recorded.",
      },
      {
        id: "d3",
        no: 56,
        itemTh: "มีการระบุข้อบกพร่องที่พบอย่างชัดเจน",
        itemEn: "Identified deficiencies are clearly recorded.",
      },
      {
        id: "d4",
        no: 57,
        itemTh: "มีการกำหนดผู้รับผิดชอบและกำหนดวันแก้ไข",
        itemEn:
          "Responsible persons and corrective action due dates are assigned.",
      },
    ],
  },
  {
    id: "glass",
    titleTh: "การควบคุมแก้ว/กระจก พลาสติกแข็ง และของมีคม",
    titleEn: "Glass, Brittle Plastic and Sharp Tools Control",
    items: [
      {
        id: "g1",
        no: 58,
        itemTh:
          "มีทะเบียนรายการแก้ว กระจก พลาสติกแข็ง และวัสดุเปราะบางที่อยู่ในพื้นที่ผลิต",
        itemEn:
          "A register of glass, brittle plastic, and other brittle materials within production areas is maintained.",
      },
      {
        id: "g2",
        no: 59,
        itemTh:
          "รายการแก้ว/กระจกและพลาสติกแข็งได้รับการระบุและสามารถตรวจสอบตำแหน่งได้",
        itemEn:
          "Glass, glass-like materials, and brittle plastics are identified and their locations are traceable.",
      },
      {
        id: "g3",
        no: 60,
        itemTh: "แก้ว กระจก และพลาสติกแข็งอยู่ในสภาพสมบูรณ์ ไม่แตก ร้าว หรือชำรุด",
        itemEn:
          "Glass and brittle plastics are intact and free from cracks, breaks, or damage.",
      },
      {
        id: "g4",
        no: 61,
        itemTh: "หลอดไฟและโคมไฟที่อยู่เหนือหรือใกล้ผลิตภัณฑ์มีการป้องกันการแตก",
        itemEn:
          "Light bulbs and lighting fixtures located above or near products are adequately protected against breakage.",
      },
      {
        id: "g5",
        no: 62,
        itemTh:
          "กระจกหรือวัสดุเปราะบางที่มีความเสี่ยงต่อผลิตภัณฑ์มีการป้องกันอย่างเหมาะสม",
        itemEn:
          "Glass or brittle materials presenting a product contamination risk are appropriately protected.",
      },
      {
        id: "g6",
        no: 63,
        itemTh:
          "ไม่มีเศษแก้ว กระจก พลาสติกแข็ง หรือวัสดุแตกหักตกค้างในพื้นที่ผลิต",
        itemEn:
          "No broken glass, brittle plastic, or other fragments are present in production areas.",
      },
      {
        id: "g7",
        no: 64,
        itemTh: "มีการตรวจสอบสภาพแก้ว กระจก และพลาสติกแข็งตามความถี่ที่กำหนด",
        itemEn:
          "Glass and brittle plastic inspections are conducted at the defined frequency.",
      },
      {
        id: "g8",
        no: 65,
        itemTh:
          "เมื่อพบแก้ว/กระจกหรือพลาสติกแข็งแตก มีการหยุดหรือควบคุมพื้นที่ตามความเสี่ยง",
        itemEn:
          "Where glass or brittle plastic is broken, the affected area is stopped or controlled according to the assessed risk.",
      },
      {
        id: "g9",
        no: 66,
        itemTh: "มีการควบคุมของมีคม เช่น ใบมีด กรรไกร และเครื่องมือปลายแหลม",
        itemEn:
          "Sharp tools, such as blades, scissors, and pointed tools, are appropriately controlled.",
      },
      {
        id: "g10",
        no: 67,
        itemTh:
          "ไม่อนุญาตให้ใช้ใบมีดหรือของมีคมที่สามารถหักหรือหลุดร่วงได้ในพื้นที่ผลิต",
        itemEn:
          "Utility knives or loose blades that could break or become detached are not permitted in production areas.",
      },
      {
        id: "g11",
        no: 68,
        itemTh: "ของมีคมมีการจัดเก็บในพื้นที่ที่กำหนดและสามารถควบคุมจำนวนได้",
        itemEn:
          "Sharp tools are stored in designated areas and are subject to appropriate control and accountability.",
      },
      {
        id: "g12",
        no: 69,
        itemTh: "พนักงานได้รับการอบรมเกี่ยวกับการควบคุมแก้ว พลาสติกแข็ง และของมีคม",
        itemEn:
          "Personnel are trained on the control of glass, brittle plastic, and sharp tools.",
      },
    ],
  },
  {
    id: "cleaning",
    titleTh: "การทำความสะอาด",
    titleEn: "Cleaning",
    items: [
      {
        id: "cl1",
        no: 70,
        itemTh: "มีโปรแกรมการทำความสะอาดที่กำหนดไว้และมีการปฏิบัติตาม",
        itemEn: "A documented cleaning programme is established and implemented.",
      },
      {
        id: "cl2",
        no: 71,
        itemTh: "อุปกรณ์ทำความสะอาดถูกจัดเก็บไว้ในตู้เก็บอย่างเหมาะสม",
        itemEn:
          "Cleaning equipment is properly stored in designated storage cabinets.",
      },
      {
        id: "cl3",
        no: 72,
        itemTh:
          "มีการควบคุมน้ำยาหรือสารเคมีที่ใช้ทำความสะอาดตามอัตราส่วนที่กำหนด",
        itemEn:
          "Cleaning chemicals are controlled and used at the specified concentration or dilution ratio.",
      },
      {
        id: "cl4",
        no: 73,
        itemTh:
          "ไม่ใช้ไม้กวาดดอกหญ้าในไลน์ผลิต โดยใช้เฉพาะเครื่องดูดฝุ่นหรือไม้กวาดพลาสติก",
        itemEn:
          "Grass brooms are not used on the production line. Only vacuum cleaners or plastic brooms are used for cleaning.",
      },
    ],
  },
];

export const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);

export function emptyAnswer(): ItemAnswer {
  return { score: null, na: false, comment: "", photo: null };
}

export function todayISODate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function createEmptyForm(date = ""): InspectionForm {
  const items: Record<string, ItemAnswer> = {};
  for (const item of ALL_ITEMS) {
    items[item.id] = emptyAnswer();
  }
  return {
    areaInspected: "ฝ่ายผลิต-ฉีด (Production - Injection)",
    inspectedBy: "",
    personInCharge: "",
    docNo: "",
    date,
    rev: "",
    items,
    remark: "",
  };
}

/** Grade 0–10 from Excel: ((resultSum / maxSum) * 100) / 10 */
export function calcGrade(resultSum: number, maxSum: number) {
  if (maxSum <= 0) return null;
  return (resultSum / maxSum) * 10;
}

export function gradeLabel(grade: number | null) {
  if (grade === null || Number.isNaN(grade)) return null;
  const rounded = Math.round(grade * 10) / 10;
  for (const g of SUMMARY_GRADES) {
    if (rounded >= g.min && rounded <= g.max + 0.001) return g;
  }
  return SUMMARY_GRADES[SUMMARY_GRADES.length - 1];
}

export function scoreLevel(score: number) {
  return SCORE_CRITERIA.find((c) => c.score === score) ?? null;
}

export function categoryStats(
  category: CategoryDef,
  answers: Record<string, ItemAnswer>,
) {
  let maxSum = 0;
  let resultSum = 0;
  let answered = 0;
  let na = 0;
  for (const item of category.items) {
    const ans = answers[item.id];
    if (!ans) continue;
    if (ans.na) {
      na += 1;
      answered += 1;
      continue;
    }
    if (ans.score === null) continue;
    answered += 1;
    maxSum += MAX_ITEM_SCORE;
    resultSum += ans.score;
  }
  const grade = calcGrade(resultSum, maxSum);
  return {
    total: category.items.length,
    answered,
    na,
    maxSum,
    resultSum,
    grade,
    label: gradeLabel(grade),
  };
}

export function overallStats(answers: Record<string, ItemAnswer>) {
  let maxSum = 0;
  let resultSum = 0;
  let answered = 0;
  let na = 0;
  const total = ALL_ITEMS.length;
  for (const item of ALL_ITEMS) {
    const ans = answers[item.id];
    if (!ans) continue;
    if (ans.na) {
      na += 1;
      answered += 1;
      continue;
    }
    if (ans.score === null) continue;
    answered += 1;
    maxSum += MAX_ITEM_SCORE;
    resultSum += ans.score;
  }
  const grade = calcGrade(resultSum, maxSum);
  return {
    total,
    answered,
    na,
    maxSum,
    resultSum,
    grade,
    label: gradeLabel(grade),
    pct: Math.round((answered / total) * 100),
  };
}

export const STORAGE_KEY = "production-area-inspection-draft-v3-photo";
