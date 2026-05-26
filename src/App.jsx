import { useState, useEffect } from "react";
import { caseData } from "./data";

const CD_ENTRIES = caseData.events;

const CASE_INFO = {
  title: "State vs Suresh Kumar & Ors.",
  priority: "High Priority",
  caseType: "Sessions Trial",
  statusTag: "Under Trial",
  firNo: "0142/2024",
  firDate: "12 Apr 2024",
  court: "ASJ Court, Gurugram",
  ccNo: "CC No. 88/2024",
  chargeSheetNo: "CS-0142/2024",
  nextDate: "28 May 2025",
  nextHearingDetail: "Witness 19 — Dr. Manoj Gupta (PM Doctor) · Examination",
  csDate: "11 Jun 2024",
  ps: "PS Sector-29, Gurugram",
  dist: "Gurugram, Haryana",
  io: "HC Rajveer Singh (BP No. 3421)",
  sho: "Insp. Hari Om Sharma",
  pp: "PP Sh. Vikram Singh",
  victim: "Ramesh Kumar",
  offence: ["BNS §103", "BNS §3(5)", "BNS §61"],
  offenceDesc: "Murder r/w Common Intention & Criminal Conspiracy",
  ptn: "PTN-2024-GGN-0142",
  cnr: "CNR-NCRB-2024-0918",
  standardNote: "BNSS / BPR&D forensic protocol applied",
  accused: [
    {
      name: "Suresh Kumar", status: "Judicial Custody", age: 35,
      father: "Late Ramesh Kumar", addr: "VPO Pataudi, Gurugram",
      arrestDate: "18 Apr 2024", arrestTime: "05:40 hrs",
      pcFrom: "19 Apr 2024", pcTo: "24 Apr 2024", pcDays: 5,
      jcFrom: "24 Apr 2024", jailName: "Bhondsi Jail, Gurugram", custodyDays: 397,
      bail: [
        { seq: 1, court: "JMFC Court-3", applied: "07 May 2024", decided: "17 May 2024", result: "Rejected", reason: "BNS §103 — murder punishable with death / life. Gravity of offence. Strong prima facie case." },
        { seq: 2, court: "ASJ (Sessions Court)", applied: "28 May 2024", decided: "04 Jun 2024", result: "Rejected", reason: "Trial witnesses yet to be examined — flight risk. Court cautioned against repeat applications without new grounds." },
      ],
    },
    {
      name: "Prem Lal", status: "Judicial Custody", age: 29,
      father: "Mohan Lal", addr: "Sector 12, Gurugram",
      arrestDate: "18 Apr 2024", arrestTime: "06:10 hrs",
      pcFrom: "19 Apr 2024", pcTo: "24 Apr 2024", pcDays: 5,
      jcFrom: "24 Apr 2024", jailName: "Bhondsi Jail, Gurugram", custodyDays: 397,
      bail: [
        { seq: 1, court: "JMFC Court-3", applied: "07 May 2024", decided: "17 May 2024", result: "Rejected", reason: "Co-accused of A1 — same heinous offence. Cannot be treated differently at this stage." },
        { seq: 2, court: "ASJ (Sessions Court)", applied: "28 May 2024", decided: "04 Jun 2024", result: "Rejected", reason: "Deep involvement in criminal conspiracy established — CDR evidence. Strong reasons to deny bail." },
      ],
    },
    {
      name: "Bhola Singh", status: "PO Declared", age: 31,
      father: "Sukh Ram", addr: "VPO Dhankot, Gurugram",
      arrestDate: null, pcFrom: null, pcTo: null, jcFrom: null, jailName: null, custodyDays: null,
      bail: [],
      poTimeline: [
        { date: "20 Apr 2024", event: "NBW Issued", detail: "Non-Bailable Warrant by JMFC Court-3" },
        { date: "26 Apr 2024", event: "LO Issued", detail: "Look-Out Circular — all state borders, airports, railway" },
        { date: "01 May 2024", event: "BNSS §84 Notice", detail: "Published Dainik Bhaskar — Gurugram edition" },
        { date: "03 May 2024", event: "Notice Affixed", detail: "Affixed at last known residence, VPO Dhankot" },
        { date: "16 May 2024", event: "PO Declared", detail: "JMFC Sh. Ankit Singhal — 30 days elapsed without surrender" },
        { date: "May 2024",    event: "Red Corner Notice", detail: "Coordination with NCRB / Interpol — active" },
      ],
    },
  ],
};

const STATUS = {
  done:    { dot: "✓", bg: "#d7ebdd", color: "#1f5836", border: "#7fcba4", line: "#b8d4c0", label: "Completed" },
  active:  { dot: "▶", bg: "#dbe9ff", color: "#1a56a8", border: "#7aadee", line: "#c7d3e8", label: "In Progress" },
  pending: { dot: "◌", bg: "#f4f5f7", color: "#6c7280", border: "#d1d5db", line: "#e5e8ee", label: "Pending" },
  delayed: { dot: "⚠", bg: "#fdf2f2", color: "#991b1b", border: "#f9a8a8", line: "#f2d9d9", label: "Action Required" },
};

const PHASE_CONFIG = {
  "① Initial Registration":   { bg: "#1e3a8a", text: "#bfdbfe", bar: "#3b82f6", desc: "GD Entry → FIR Registration → CCTNS / IIF-1" },
  "② Scene & Investigation":  { bg: "#78350f", text: "#fde68a", bar: "#f59e0b", desc: "Crime scene inspection · IIF-II · PM / MLC · Witnesses · CCTV" },
  "③ Arrest & Custody":       { bg: "#7f1d1d", text: "#fecaca", bar: "#ef4444", desc: "Arrest · Medical exam · Production · PC / JC · PO declaration" },
  "④ Evidence & Forensics":   { bg: "#14532d", text: "#bbf7d0", bar: "#22c55e", desc: "Disclosure recovery · Seizure · Malkhana · FSL dispatch & reports" },
  "⑤ Chargesheet":            { bg: "#1e3a5f", text: "#bae6fd", bar: "#0ea5e9", desc: "Draft review · Final report u/s BNSS §193 · SP countersignature" },
  "⑥ Cognizance & Committal": { bg: "#3b0764", text: "#e9d5ff", bar: "#a855f7", desc: "JMFC cognizance u/s BNSS §210 → Committal to Sessions u/s BNSS §232" },
  "⑦ Trial":                  { bg: "#451a03", text: "#fed7aa", bar: "#f97316", desc: "Charge framing · Witness examination · Accused statement · Defence witnesses · Judgment" },
  "⑧ Appeal":                 { bg: "#1c1917", text: "#d6d3d1", bar: "#78716c", desc: "HC / SC appellate proceedings" },
};

const STAGES = [
  // ─── ① Initial Registration ───────────────────────────────────────────────
  {
    id: 1, phase: "① Initial Registration",
    name: "GD Entry",
    hindi: "जनरल डायरी प्रविष्टि",
    status: "done", date: "03 Apr 2024", time: "10:15 hrs", officer: "PS In-charge",
    law: ["Police Act §44", "BNSS §173"],
    details: [
      { k: "GD No.",           v: "165/2024" },
      { k: "Station",          v: "PS Sector-29, Gurugram" },
      { k: "Reporting Person", v: "Complainant Asha Sharma" },
      { k: "Nature",           v: "Cognizable offence — unnatural death reported" },
    ],
    note: "GD entry recorded at PS as first formal step when complaint received. Preliminary screening done before FIR lodging — establishes cognizable offence. Case diary begins from this entry.",
    docs: ["GD Entry Memo.pdf"],
  },
  {
    id: 2, phase: "① Initial Registration",
    name: "FIR Registration & IIF-1",
    hindi: "प्रथम सूचना रिपोर्ट (FIR) एवं IIF-1",
    status: "done", date: "03 Apr 2024", time: "11:00 hrs", officer: "HC Rajveer Singh (IO)",
    law: ["BNSS §173", "CCTNS / NCRB Portal"],
    details: [
      { k: "FIR No.",     v: "0142/2024" },
      { k: "Complainant", v: "Asha Sharma" },
      { k: "Offence",     v: "BNS §103, §3(5), §61" },
      { k: "IIF-1",       v: "Incident Information Form-1 entered in CCTNS portal" },
    ],
    note: "FIR formally registered u/s BNSS §173. IIF-1 entered in CCTNS for national tracking. IO HC Rajveer Singh deputed for investigation. Investigation formally commences from this stage.",
    docs: ["FIR Copy.pdf", "CCTNS IIF-1 Entry.pdf"],
  },

  // ─── ② Scene & Investigation ──────────────────────────────────────────────
  {
    id: 3, phase: "② Scene & Investigation",
    name: "Crime Scene Inspection & IIF-II",
    hindi: "अपराध स्थल निरीक्षण (IIF-II)",
    status: "done", date: "04 Apr 2024", time: "13:00 hrs", officer: "HC Rajveer Singh (IO)",
    law: ["BNSS §105", "BNSS §185"],
    details: [
      { k: "Scene",       v: "Sector 12 residence & surrounding lane" },
      { k: "Photographs", v: "48 images captured" },
      { k: "Panchnama",   v: "Prepared with 4 independent witnesses" },
      { k: "IIF-II",      v: "Crime detail form — logged in CCTNS by IO" },
    ],
    note: "IO visited crime scene, prepared panchnama with 4 witnesses. 48 photographs taken. IIF-II (crime scene detail form) logged in CCTNS. This is the IO's primary scene documentation — foundation of evidence chain.",
    docs: ["Scene Panchnama.pdf", "Scene Photographs.zip"],
  },
  {
    id: 4, phase: "② Scene & Investigation",
    name: "Suspect Identification & CCTV Review",
    hindi: "आरोपियों की पहचान एवं सीसीटीवी समीक्षा",
    status: "done", date: "05 Apr 2024", time: "16:45 hrs", officer: "HC Rajveer Singh (IO)",
    law: ["Police Act §9", "BNSS §176"],
    details: [
      { k: "CCTV Reviewed",    v: "Toll plaza + street cameras" },
      { k: "Vehicle Identified", v: "White Eeco HR26-CG-2211" },
      { k: "Primary Leads",    v: "A1, A2 identified from neighbourhood inputs" },
      { k: "Evidence Logged",  v: "Vehicle footage entered in case diary" },
    ],
    note: "CCTV review and witness leads produced key suspect information. Vehicle identified from toll plaza footage. IO recorded in case diary. This shaped the arrest strategy.",
    docs: ["CCTV Review Memo.pdf", "Vehicle Lead Note.pdf"],
  },
  {
    id: 5, phase: "② Scene & Investigation",
    name: "Inquest Proceedings & Post Mortem Report",
    hindi: "मृत्यु जाँच पड़ताल / पोस्ट मॉर्टम (धारा 194 BNSS)",
    status: "done", date: "13 Apr 2024", time: "14:30 hrs", officer: "Dr. Manoj Gupta, Civil Hospital Gurugram",
    law: ["BNSS §194", "BNSS §195"],
    details: [
      { k: "PM No.",             v: "CH-GGN-PM-0214/2024" },
      { k: "PM Doctor",          v: "Dr. Manoj Gupta, MS (Surgery)" },
      { k: "Cause of Death",     v: "Firearm injury — right temporal region" },
      { k: "Entry/Exit Wound",   v: "Entry: right temple | No exit wound" },
      { k: "Bullet Recovered",   v: "Yes — .32 bore lead bullet — sealed as MK-004" },
      { k: "Time of Death (est.)", v: "10–12 Apr 2024, night hours" },
      { k: "Blood Group",        v: "B+ (confirmed)" },
      { k: "Viscera Preserved",  v: "Yes — sent to RFSL Madhuban" },
      { k: "Clothes Seized",     v: "Bloodstained shirt — MK-007" },
      { k: "Final Opinion",      v: "Death is homicidal — due to firearm injury" },
    ],
    note: "PM at Civil Hospital Gurugram. .32 bore bullet recovered from cranium — sealed as MK-004 and handed to IO. Viscera preserved (liver, stomach, blood, urine) and sent to RFSL Madhuban. PM opinion: homicidal death by gunshot wound.",
    docs: ["PM Report (CH-GGN-PM-0214).pdf", "Viscera Forwarding Form.pdf", "Bullet Seizure Memo.pdf", "Bloodstained Cloth Memo.pdf"],
  },
  {
    id: 6, phase: "② Scene & Investigation",
    name: "Witness Statements u/s BNSS §180",
    hindi: "गवाहों के बयान (धारा 180 BNSS)",
    status: "done", date: "13 Apr – 10 Jun 2024", time: "Multiple dates", officer: "HC Rajveer Singh (IO)",
    law: ["BNSS §180", "BNSS §181"],
    details: [
      { k: "Total Statements",   v: "28 witnesses examined" },
      { k: "Witness-1 (Complainant)", v: "Ramesh Devi — 13 Apr 2024" },
      { k: "Key Eye Witness",    v: "Mohd. Irfan (autowala) — saw accused vehicle at 11:45 PM near scene" },
      { k: "Toll Plaza Manager", v: "Provided CCTV footage — vehicle identified" },
      { k: "CDR Expert (Airtel)", v: "Call records between all accused confirmed" },
      { k: "CCTV Expert (CFSL)", v: "Authenticated footage — not tampered" },
      { k: "Neighbours (4)",     v: "Deceased's character, past enmity with accused" },
      { k: "FSL Experts",        v: "RFSL Madhuban — ballistic + DNA experts" },
      { k: "All Statements",     v: "Recorded in Case Diary (not signed — BNSS §181)" },
    ],
    note: "28 witnesses examined u/s BNSS §180. Not signed per BNSS §181. Key witness: autowala Mohd. Irfan — saw white Eeco HR26-CG-2211 near scene at 11:45 PM. CDR: 46 calls between accused in 3 days before murder — establishes conspiracy. IO recorded all in case diary.",
    docs: ["Witness List (28 persons).pdf", "161 Statement Summary.pdf", "CDR Analysis Report.pdf"],
  },

  // ─── ③ Arrest & Custody ───────────────────────────────────────────────────
  {
    id: 7, phase: "③ Arrest & Custody",
    name: "Arrest of Accused — A1 & A2",
    hindi: "अभियुक्तों की गिरफ्तारी — A1 सुरेश कुमार, A2 प्रेम लाल",
    status: "done", date: "18 Apr 2024", time: "05:40 hrs (A1) / 06:10 hrs (A2)", officer: "HC Rajveer Singh + SIT (6 officers)",
    law: ["BNSS §35", "BNSS §47", "BNSS §48", "BNSS §58"],
    details: [
      { k: "A1 — Full Name",          v: "Suresh Kumar, 35 yrs, S/o Late Ramesh Kumar" },
      { k: "A1 — Arrested From",      v: "His residence, VPO Pataudi — 05:40 hrs" },
      { k: "A1 — Arrest Witness",     v: "Kamla Devi (wife) — family witness" },
      { k: "A2 — Full Name",          v: "Prem Lal, 29 yrs, S/o Mohan Lal" },
      { k: "A2 — Arrested From",      v: "His flat, Sector 12 — 06:10 hrs" },
      { k: "A2 — Arrest Witness",     v: "Raju (neighbour)" },
      { k: "Rights u/s BNSS §47",     v: "Oral + written notice in Hindi — both accused" },
      { k: "Family Informed u/s BNSS §48", v: "Yes — immediately after arrest" },
      { k: "Medical Exam",            v: "Civil Hospital Gurugram — 10:00 hrs (18 Apr)" },
      { k: "Property Seized at Arrest", v: "Mobile phones — MK-009 (A1) & MK-010 (A2)" },
      { k: "A3 Bhola Singh",          v: "Could not be found — absconding" },
    ],
    note: "Both A1 and A2 arrested in early morning raid. Arrest memos prepared in presence of family witnesses. Rights u/s BNSS §47 explained in Hindi. Family informed immediately u/s BNSS §48. Medical exam within 6 hrs at Civil Hospital before production. A3 Bhola Singh absconding.",
    docs: ["Arrest Memo A1.pdf", "Arrest Memo A2.pdf", "Rights Notice A1.pdf", "Rights Notice A2.pdf", "Medical Exam A1.pdf", "Medical Exam A2.pdf", "Mobile Phone Seizure Memo.pdf"],
  },
  {
    id: 8, phase: "③ Arrest & Custody",
    name: "Production, Police Remand & Judicial Custody",
    hindi: "न्यायालय पेशी / पुलिस रिमांड / न्यायिक अभिरक्षा (धारा 187 BNSS)",
    status: "done", date: "19 Apr 2024", time: "11:00 hrs", officer: "JMFC Court-3, Gurugram (Sh. Ankit Singhal)",
    law: ["BNSS §187", "BNSS §58"],
    details: [
      { k: "Produced Before",       v: "JMFC Court-3, Gurugram" },
      { k: "Production within",     v: "24 hrs of arrest ✓" },
      { k: "Police Remand (PC)",    v: "5 days — 19 Apr to 24 Apr 2024" },
      { k: "PC Reason",             v: "Recovery of weapon + further interrogation" },
      { k: "Judicial Custody (JC)", v: "From 24 Apr 2024 — Bhondsi Jail" },
    ],
    note: "Both produced before JMFC within 24 hrs (BNSS §58). PC of 5 days granted for weapon recovery and interrogation. During PC, A1 disclosed weapon location (→ Phase 4). After PC on 24 Apr, both sent to Judicial Custody at Bhondsi Jail.",
    docs: ["PC Order (19-Apr).pdf", "JC Order (24-Apr).pdf", "Bail Rejection JMFC (17-May).pdf", "Bail Rejection Sessions (04-Jun).pdf"],
  },
  {
    id: 11, phase: "③ Arrest & Custody",
    name: "A3 Bhola Singh — Proclaimed Offender & Arrest Warrant",
    hindi: "उद्घोषित अपराधी घोषणा / गिरफ्तारी वारंट (धारा 84 BNSS)",
    status: "done", date: "16 May 2024", time: "11:00 hrs", officer: "JMFC Court-3, Gurugram",
    law: ["BNSS §84", "BNSS §85"],
    details: [
      { k: "A3 Name",              v: "Bhola Singh, 31 yrs, S/o Sukh Ram, VPO Dhankot" },
      { k: "LO Issued",            v: "26 Apr 2024 — all border points, railway" },
      { k: "NBW Issued",           v: "Yes — by JMFC on 20 Apr 2024" },
      { k: "Notice u/s BNSS §84",  v: "Published 01 May 2024 — Dainik Bhaskar, GGM edition" },
      { k: "Notice at Residence",  v: "Affixed at VPO Dhankot — 03 May 2024" },
      { k: "PO Order Date",        v: "16 May 2024" },
      { k: "PO Order by",          v: "JMFC Sh. Ankit Singhal" },
      { k: "Red Corner Notice",    v: "Issued — coordination with Interpol & NCRB" },
      { k: "Supp. Chargesheet",    v: "To be filed after A3 arrest" },
    ],
    note: "A3 not traced despite raids at Pataudi, Dhankot, Rewari. NBW issued 20 Apr. BNSS §84 notice published in Dainik Bhaskar on 01 May and affixed at last known residence. After 30 days, JMFC declared PO on 16 May 2024. Red Corner Notice through NCRB / Interpol. Supplementary CS to be filed on arrest.",
    docs: ["LO Notice.pdf", "NBW Order.pdf", "Sec-82 Notice.pdf", "PO Order (16-May).pdf"],
  },

  // ─── ④ Evidence & Forensics ───────────────────────────────────────────────
  {
    id: 9, phase: "④ Evidence & Forensics",
    name: "Weapon Recovery on Disclosure of A1 (u/s BSA §23)",
    hindi: "हथियार बरामदगी — धारा 23 भारतीय साक्ष्य अधिनियम (BSA)",
    status: "done", date: "22 Apr 2024", time: "14:30 hrs", officer: "HC Rajveer Singh + PC Team",
    law: ["BSA §23", "BNSS §185"],
    details: [
      { k: "Disclosure Memo Date",  v: "21 Apr 2024 — at PS before recovery" },
      { k: "Disclosed by",          v: "A1 Suresh Kumar (in PC)" },
      { k: "Recovery Location",     v: "Bhondsi Canal bank, near Bhondsi Village" },
      { k: "Item Recovered-1",      v: "Country-made pistol (.32 bore) — MK-005" },
      { k: "Item Recovered-2",      v: "2 live cartridges (.32 bore) — MK-006" },
      { k: "Panchnama Witnesses",   v: "4 independent witnesses" },
      { k: "FSL Sent",              v: "24 Apr 2024 — RFSL Madhuban (Batch-2)" },
      { k: "Disclosure Witness-1",  v: "Ram Niwas (shopkeeper)" },
      { k: "Disclosure Witness-2",  v: "Mahesh Kumar (teacher)" },
    ],
    note: "A1 disclosed weapon location during PC interrogation on 21 Apr. Disclosure memo prepared at PS before leaving — signed by A1, IO, and 2 witnesses (mandatory for BSA §23 admissibility). Pistol found buried in green polythene bag 2m from canal bank. Sealed and sent to RFSL Batch-2.",
    docs: ["Disclosure Memo A1 (21-Apr).pdf", "Recovery Panchnama (22-Apr).pdf", "FSL Requisition-2.pdf"],
  },
  {
    id: 10, phase: "④ Evidence & Forensics",
    name: "Search, Seizure & Malkhana Deposit",
    hindi: "सम्पत्ति जब्ती एवं मालखाना जमा (MK-001 to MK-010)",
    status: "done", date: "Various dates", time: "Multiple", officer: "HC Rajveer Singh (IO) + HC Suresh (Malkhana)",
    law: ["BNSS §106", "BNSS §185", "Police Rules §49"],
    details: [
      { k: "MK-001", v: "Bloodstained soil from scene — 500g, sealed (13 Apr)" },
      { k: "MK-002", v: "Broken glass piece from scene — sealed (13 Apr)" },
      { k: "MK-003", v: "Empty cartridge case .32 bore from scene (13 Apr)" },
      { k: "MK-004", v: "Lead bullet recovered at PM from cranium (13 Apr)" },
      { k: "MK-005", v: "Country-made pistol .32 bore — recovered 22 Apr" },
      { k: "MK-006", v: "2 live cartridges .32 bore — recovered 22 Apr" },
      { k: "MK-007", v: "Bloodstained shirt of victim — from PM (13 Apr)" },
      { k: "MK-008", v: "CCTV Hard Disk — Toll Plaza (15 Apr)" },
      { k: "MK-009", v: "Mobile phone of A1 Suresh Kumar (18 Apr)" },
      { k: "MK-010", v: "Mobile phone of A2 Prem Lal (18 Apr)" },
      { k: "Total Articles", v: "10 articles in Malkhana" },
      { k: "FSL Batch-1",    v: "MK-001,002,003,004,007 → RFSL Madhuban" },
      { k: "FSL Batch-2",    v: "MK-005,006 → RFSL Madhuban (after PC recovery)" },
      { k: "CFSL",           v: "MK-008 → CFSL Delhi (CCTV authentication)" },
    ],
    note: "All 10 seized articles deposited in Malkhana with individual sealed packet numbers and MK register entries. Sent to RFSL in two batches. CCTV hard disk sent to CFSL Delhi for authentication. All entries in PS register and CCTNS.",
    docs: ["Seizure Memos All.pdf", "Malkhana Register Pages.pdf", "RFSL Batch-1 Forwarding.pdf", "RFSL Batch-2 Forwarding.pdf", "CFSL Delhi Forwarding.pdf"],
  },
  {
    id: 12, phase: "④ Evidence & Forensics",
    name: "RFSL Report — Ballistic, Blood & DNA Analysis",
    hindi: "फोरेंसिक विज्ञान प्रयोगशाला रिपोर्ट — RFSL मधुबन",
    status: "done", date: "05 Jun 2024", time: "10:00 hrs", officer: "RFSL Madhuban → IO via SP Office",
    law: ["BSA §39", "BSA §243", "BNSS/BPR&D FSL Protocol"],
    details: [
      { k: "RFSL Report No.",        v: "RFSL/GGN/2024/0318" },
      { k: "Expert",                 v: "Dr. Surender Hooda, Sr. Scientific Officer" },
      { k: "MK-003 (cartridge case)", v: "✓ Fired from MK-005 (recovered pistol) — CONFIRMED" },
      { k: "MK-004 (lead bullet)",   v: "Consistent with .32 bore from MK-005" },
      { k: "MK-001 (bloodstained soil)", v: "Human blood — Group B+ (victim's group)" },
      { k: "MK-007 (shirt)",         v: "Human blood — Group B+ (victim's group)" },
      { k: "CFSL CCTV Report",       v: "Video authentic, not tampered — vehicle identified" },
      { k: "DNA Report",             v: "Viscera DNA matches victim's mother's profile" },
      { k: "CDR Expert Report",      v: "46 calls between accused — conspiracy established" },
      { k: "Overall FSL Opinion",    v: "Strongly supports prosecution — all exhibits consistent" },
    ],
    note: "RFSL Madhuban report conclusively links scene evidence to recovered weapon. Ballistic analysis: cartridge case fired from recovered pistol confirmed. FSL analysis per BNSS/BPR&D standards. Core scientific foundation for chargesheet.",
    docs: ["RFSL Report 0318-2024.pdf", "Ballistic Opinion.pdf", "Blood Group Report.pdf", "DNA Report.pdf", "CFSL CCTV Report.pdf"],
  },

  // ─── ⑤ Chargesheet ────────────────────────────────────────────────────────
  {
    id: 13, phase: "⑤ Chargesheet",
    name: "Draft Charge-sheet Review & Legal Opinion",
    hindi: "ड्राफ्ट चार्जशीट समीक्षा एवं विधिक राय",
    status: "done", date: "08 Jun 2024", time: "14:00 hrs", officer: "SHO + PP Sh. Vikram Singh",
    law: ["BNSS §193", "BPR&D Case File Review"],
    details: [
      { k: "Review Date",       v: "08 Jun 2024" },
      { k: "Reviewed By",       v: "SHO Insp. Hari Om Sharma + PP Sh. Vikram Singh" },
      { k: "Forensic Evidence", v: "Verified against RFSL/CFSL reports" },
      { k: "Witness List",      v: "Checked for completeness — 34 witnesses confirmed" },
      { k: "Material Articles", v: "10 Malkhana articles verified" },
      { k: "Legal Opinion",     v: "Adequate evidence for BNS §103 / §3(5) / §61" },
    ],
    note: "Draft chargesheet presented for internal review before filing. SHO and PP confirmed investigation file, forensic evidence, and witness statements adequate for final report u/s BNSS §193.",
    docs: ["Draft CS Review Memo.pdf", "SP Countersignature Note.pdf"],
  },
  {
    id: 14, phase: "⑤ Chargesheet",
    name: "Chargesheet Filed u/s BNSS §193 (Final Report)",
    hindi: "चार्जशीट / अंतिम प्रतिवेदन — धारा 193 BNSS",
    status: "done", date: "11 Jun 2024", time: "15:30 hrs", officer: "HC Rajveer Singh + SHO + SP (countersigned)",
    law: ["BNSS §193", "BNS §103", "BNS §3(5)", "BNS §61"],
    details: [
      { k: "Chargesheet No.",     v: "CS-0142/2024" },
      { k: "Filed Before",        v: "JMFC Court-3, Gurugram" },
      { k: "Days from Arrest",    v: "54 days (18 Apr → 11 Jun) — within 60-day limit ✓" },
      { k: "A1 in CS",            v: "Suresh Kumar — BNS §103 r/w §3(5), §61" },
      { k: "A2 in CS",            v: "Prem Lal — BNS §103 r/w §3(5), §61" },
      { k: "A3 in CS",            v: "Bhola Singh — Supplementary CS pending arrest" },
      { k: "Total Witnesses",     v: "34 witnesses listed" },
      { k: "Documentary Exhibits", v: "52 documents" },
      { k: "Material Articles",   v: "10 Malkhana articles (MK-001 to MK-010)" },
      { k: "SP Countersigned",    v: "Yes — 10 Jun 2024" },
      { k: "CS Summary",          v: "Investigation summary + CDR + CCTV + FSL evidence" },
    ],
    note: "Final report u/s BNSS §193 filed within 54 days from arrest (limit: 60 days). Includes 34 witnesses, 52 documentary exhibits, 10 material articles, CDR analysis, CCTV evidence, complete RFSL/CFSL forensic reports. SP Gurugram countersigned on 10 Jun.",
    docs: ["Chargesheet (CS-0142-2024).pdf", "PW List (34 witnesses).pdf", "Document List (52 exhibits).pdf", "MK Article List.pdf"],
  },

  // ─── ⑥ Cognizance & Committal ────────────────────────────────────────────
  {
    id: 15, phase: "⑥ Cognizance & Committal",
    name: "JMFC Cognizance & Committal to Sessions Court",
    hindi: "न्यायालय संज्ञान एवं सत्र न्यायालय को प्रेषण (धारा 210, 232 BNSS)",
    status: "done", date: "15 Jun 2024 / 28 Jun 2024", time: "11:00 hrs", officer: "JMFC Court-3 → ASJ Gurugram",
    law: ["BNSS §210", "BNSS §232"],
    details: [
      { k: "Cognizance Date",        v: "15 Jun 2024" },
      { k: "JMFC Order",             v: "Prima facie case made out — cognizance taken" },
      { k: "Committal to Sessions",  v: "28 Jun 2024" },
      { k: "Sessions Case No.",      v: "CC No. 88/2024" },
      { k: "ASJ Assigned",           v: "Sh. Arun Kumar Sharma, ASJ Gurugram" },
      { k: "PP Assigned",            v: "PP Sh. Vikram Singh" },
      { k: "Legal Aid A1",           v: "Adv. R.K. Mehta (District Legal Aid)" },
      { k: "Legal Aid A2",           v: "Adv. Sunita Kumari (District Legal Aid)" },
    ],
    note: "JMFC took cognizance on 15 Jun 2024 — prima facie case found. BNS §103 is exclusively triable by Sessions Court — case committed u/s BNSS §232 to ASJ Gurugram on 28 Jun. CC No. 88/2024 assigned. Legal aid counsel provided to both accused in JC.",
    docs: ["Cognizance Order (15-Jun).pdf", "Committal Order (28-Jun).pdf"],
  },

  // ─── ⑦ Trial ──────────────────────────────────────────────────────────────
  {
    id: 16, phase: "⑦ Trial",
    name: "Framing of Charges (u/s BNSS §251)",
    hindi: "आरोप विरचन — धारा 251 BNSS",
    status: "done", date: "22 Aug 2024", time: "10:30 hrs", officer: "ASJ Sh. Arun Kumar Sharma",
    law: ["BNSS §250", "BNSS §251", "BNS §103", "BNS §3(5)", "BNS §61"],
    details: [
      { k: "Discharge Application", v: "Filed by defence — REJECTED by ASJ" },
      { k: "Charge-1 (A1 & A2)",   v: "BNS §103 r/w §3(5) — Murder with common intention" },
      { k: "Charge-2 (A1 & A2)",   v: "BNS §61 — Criminal Conspiracy to commit murder" },
      { k: "A1 Plea",              v: "Not Guilty" },
      { k: "A2 Plea",              v: "Not Guilty" },
      { k: "Trial Commenced",      v: "Yes — same date" },
      { k: "Defence Counsel",      v: "Adv. R.K. Mehta (A1) + Adv. Sunita Kumari (A2)" },
    ],
    note: "Discharge application by defence rejected — prima facie strong case. Charges framed: BNS §103 r/w §3(5) (murder with common intention) and BNS §61 (criminal conspiracy). Both accused pleaded Not Guilty. Trial commenced 22 Aug 2024.",
    docs: ["Charge Framing Order (22-Aug).pdf", "Discharge Rejection Order.pdf"],
  },
  {
    id: 17, phase: "⑦ Trial",
    name: "Trial — Witness Examination & Statements",
    hindi: "गवाहों की गवाही एवं बयान",
    status: "active", date: "Sep 2024 — Ongoing", time: "Multiple hearings", officer: "PP Sh. Vikram Singh",
    law: ["BNSS §254", "BNSS §255", "BSA §113"],
    details: [
      { k: "Trial Started",                  v: "10 Sep 2024" },
      { k: "Total Witnesses",                v: "34 witnesses to be examined" },
      { k: "Witness 1 (Complainant)",        v: "Ramesh Devi — Examined 10 Sep 2024" },
      { k: "Witness 2–6",                    v: "Neighbours, eye witness — Sep–Oct 2024" },
      { k: "Witness 7 (Autowala — key)",     v: "Mohd. Irfan — Examined 05 Oct 2024" },
      { k: "Witness 8–18",                   v: "CCTV expert, CDR expert, SHO, panchnama witnesses — Oct–Dec 2024" },
      { k: "⚑ Next: Witness 19 (PM Doctor)", v: "Dr. Manoj Gupta — 28 May 2025" },
      { k: "Witness 20 (IO)",               v: "HC Rajveer Singh — Pending" },
      { k: "Witness 21 (FSL Expert)",       v: "Dr. Surender Hooda, RFSL Madhuban — Pending" },
      { k: "Witness 22 (Ballistic)",        v: "Pending" },
      { k: "Witness 23 (DNA Expert)",       v: "Pending" },
      { k: "Witness 24–34",                 v: "Remaining — Pending" },
      { k: "Documents Marked",              v: "Ex-1 to Ex-31 (31 of 52 admitted so far)" },
      { k: "Witnesses Examined",            v: "18 of 34 done" },
      { k: "Adjournments",                  v: "3 total — IO leave ×1, Witness absent ×2" },
      { k: "Summons Status",                v: "Issued for all remaining witnesses — 2 non-compliant" },
      { k: "Court Warning",                 v: "Public Prosecutor cautioned — no further adjournments" },
    ],
    note: "Witness examination ongoing — 18 of 34 examined. Key remaining: Witness 19 PM Doctor (28 May 2025), Witness 20 IO, Witness 21 FSL Expert, Witness 22 Ballistic, Witness 23 DNA. Court cautioned PP against adjournments. 31 of 52 documents admitted. CCTV record and RFSL report are most critical exhibits.",
    docs: ["PE Order Sheet.pdf", "PW Examination Progress.pdf", "Exhibit List (31 marked).pdf"],
  },
  {
    id: 18, phase: "⑦ Trial",
    name: "Accused's Statement — Examination by Court",
    hindi: "अभियुक्त का बयान — धारा 352 BNSS",
    status: "pending", date: "TBD (after witness evidence closes)", time: "—", officer: "ASJ Sh. Arun Kumar Sharma",
    law: ["BNSS §352"],
    details: [
      { k: "Status",        v: "Pending — after prosecution closes evidence" },
      { k: "Purpose",       v: "Opportunity to explain prosecution evidence" },
      { k: "Questions by",  v: "Court (no oath, no cross-examination)" },
      { k: "A1 & A2",       v: "Both to be examined separately" },
    ],
    note: "After prosecution closes evidence, court examines each accused u/s 313 to give opportunity to explain prosecution circumstances. No oath. No cross-examination by defence or PP. Statement recorded by court.",
    docs: [],
  },
  {
    id: 19, phase: "⑦ Trial",
    name: "Defence Witness Examination",
    hindi: "बचाव साक्ष्य परीक्षण",
    status: "pending", date: "TBD", time: "—", officer: "Adv. R.K. Mehta (Defence Counsel A1)",
    law: ["BNSS §256", "BNSS §257"],
    details: [
      { k: "Status",                   v: "Not yet commenced" },
      { k: "Defence Witness 1 (A1)",   v: "Alibi witness for A1 — Proposed" },
      { k: "Defence Witness 2 (A2)",   v: "Alibi witness for A2 — Proposed" },
      { k: "Defence Witness 3",        v: "Character witness — Proposed" },
      { k: "PP Response",              v: "Sh. Vikram Singh will cross-examine all defence witnesses" },
    ],
    note: "Defence witness examination after accused's statement. Defence counsel has indicated 3 witnesses — primarily alibi witnesses for A1 (claiming A1 was at relative's wedding in another district on night of murder). PP will cross-examine all defence witnesses.",
    docs: [],
  },
  {
    id: 20, phase: "⑦ Trial",
    name: "Final Arguments & Judgment / Case Disposal",
    hindi: "अंतिम तर्क, निर्णय एवं दण्डादेश (मामला निपटान)",
    status: "pending", date: "TBD", time: "—", officer: "ASJ Sh. Arun Kumar Sharma",
    law: ["BNSS §353", "BNSS §392", "BNSS §393", "BNS §103"],
    details: [
      { k: "Arguments by PP",              v: "Pending" },
      { k: "Arguments by Defence",         v: "Pending" },
      { k: "Judgment",                     v: "Awaited after arguments" },
      { k: "If convicted u/s BNS §103",    v: "Death / Life Imprisonment + Fine" },
      { k: "If acquitted",                 v: "Both accused discharged — released from JC" },
      { k: "Case Disposal Type",           v: "Conviction / Acquittal / Discharge" },
    ],
    note: "Final stage. After defence witness examination closes, both sides present oral arguments. ASJ pronounces judgment. If convicted u/s BNS §103 r/w §3(5), maximum punishment is death or life imprisonment plus fine. Separate sentencing hearing for quantum of punishment if convicted.",
    docs: [],
  },

  // ─── ⑧ Appeal ─────────────────────────────────────────────────────────────
  {
    id: 21, phase: "⑧ Appeal",
    name: "Appeal — Punjab & Haryana High Court / Supreme Court",
    hindi: "उच्च न्यायालय / सर्वोच्च न्यायालय में अपील",
    status: "pending", date: "TBD (post judgment)", time: "—", officer: "State Counsel / Appellate Advocate",
    law: ["BNSS §413", "BNSS §415", "BNSS §437"],
    details: [
      { k: "Appeal Type",    v: "Criminal appeal against conviction / acquittal" },
      { k: "First Forum",    v: "Punjab & Haryana High Court, Chandigarh" },
      { k: "Grounds",        v: "Legal errors in trial / quantum of sentence" },
      { k: "Further Appeal", v: "Supreme Court of India — if required" },
      { k: "Status",         v: "Pending — awaiting trial judgment" },
    ],
    note: "If judgment challenged by either side, appeal to P&H High Court. Further appeal to Supreme Court if required. Case continues through appellate chain until final disposal. State may also appeal against acquittal or inadequate sentence.",
    docs: [],
  },
];

const PHASES_ORDERED = [...new Set(STAGES.map(s => s.phase))];
const TABS = ["All", "Completed", "In Progress", "Pending", "Case Diary"];

// Key milestone durations — measured from complaint date: 03 Apr 2024
const KEY_MILESTONES = [
  { id: 1,  label: "GD Entry",       sub: "Complaint Logged",      date: "03 Apr 2024",   day: 0,    gap: null,      status: "done",    note: "10:15 hrs",             hi: false },
  { id: 2,  label: "FIR + IIF-1",   sub: "CCTNS Registered",     date: "03 Apr 2024",   day: 0,    gap: "45 min",  status: "done",    note: "Same day — 11:00 hrs",  hi: false },
  { id: 3,  label: "Crime Scene",    sub: "IIF-II Filed",          date: "04 Apr 2024",   day: 1,    gap: "1 day",   status: "done",    note: "48 photos · panchnama", hi: false },
  { id: 4,  label: "PM / Inquest",  sub: "u/s BNSS §194",          date: "13 Apr 2024",   day: 10,   gap: "9 days",  status: "done",    note: "Bullet MK-004 seized",  hi: false },
  { id: 5,  label: "Arrest",         sub: "A1 & A2 — SIT Raid",   date: "18 Apr 2024",   day: 15,   gap: "5 days",  status: "done",    note: "A3 still absconding",   hi: true  },
  { id: 6,  label: "Seizure",        sub: "Weapon + Malkhana",     date: "13–22 Apr",     day: 19,   gap: "4 days",  status: "done",    note: "MK-001 to MK-010",     hi: false },
  { id: 7,  label: "Chargesheet",   sub: "u/s BNSS §193",         date: "11 Jun 2024",   day: 69,   gap: "50 days", status: "done",    note: "54d from arrest ✓",     hi: true  },
  { id: 8,  label: "Cognizance",    sub: "JMFC u/s BNSS §210",   date: "15 Jun 2024",   day: 73,   gap: "4 days",  status: "done",    note: "Prima facie found",     hi: false },
  { id: 9,  label: "Committal",     sub: "Sessions u/s BNSS §232", date: "28 Jun 2024", day: 86,   gap: "13 days", status: "done",    note: "CC No. 88/2024",        hi: false },
  { id: 10, label: "Charges Framed", sub: "u/s BNSS §251",        date: "22 Aug 2024",   day: 141,  gap: "55 days", status: "done",    note: "Discharge rejected",    hi: true  },
  { id: 11, label: "Trial Start",   sub: "Witness Examination",   date: "Sep 2024 →",    day: 160,  gap: "19 days", status: "active",  note: "18 / 34 witnesses done", hi: false },
  { id: 12, label: "Judgment",      sub: "Sessions Court",        date: "Awaited",       day: null, gap: "TBD",     status: "pending", note: "After DE + Arguments",  hi: false },
];

// IO Performance — HC Rajveer Singh
const IO_PROFILE = {
  name: "HC Rajveer Singh",
  bpNo: "3421",
  rank: "Head Constable",
  ps: "PS Sector-29, Gurugram",
  dist: "Gurugram, Haryana",
  joined: "15 Mar 2015",
  yearsService: 11,
  supervisor: "Insp. Hari Om Sharma (SHO)",
  reviewedBy: "DSP (HQ), Gurugram Range",
  lastACR: "2024–25 · Grade: Very Good",
  awards: [
    "SP Commendation — Life sentence secured, FIR 0315/2023",
    "Best IO Award 2022 — PS Sector-29, Gurugram",
  ],
};

const IO_CASES = [
  { fir:"0142/2024", year:2024, type:"Murder",       sections:"BNS §103/3(5)/61",  csFiledDays:54, status:"Under Trial",  outcome:null,        stage:"Witness examination ongoing — 18/34 done",   severity:"heinous" },
  { fir:"0201/2024", year:2024, type:"Att. Murder",  sections:"BNS §109/3(5)",     csFiledDays:48, status:"Under Trial",  outcome:null,        stage:"Charges Framed — Witness examination yet to start", severity:"heinous" },
  { fir:"0156/2024", year:2024, type:"Cheating/CBT", sections:"BNS §318/316",      csFiledDays:42, status:"CS Filed",     outcome:null,        stage:"JMFC Cognizance Pending",          severity:"normal"  },
  { fir:"0089/2024", year:2024, type:"Theft",        sections:"BNS §303/317",      csFiledDays:28, status:"Disposed",    outcome:"Convicted", stage:"6 months RI",                      severity:"normal"  },
  { fir:"0043/2024", year:2024, type:"NDPS",         sections:"NDPS §21/29",       csFiledDays:32, status:"Disposed",    outcome:"Convicted", stage:"10 years RI + Fine",               severity:"normal"  },
  { fir:"0315/2023", year:2023, type:"Murder",       sections:"BNS §103/3(5)",     csFiledDays:56, status:"Disposed",    outcome:"Convicted", stage:"Life Imprisonment",                severity:"heinous" },
  { fir:"0276/2023", year:2023, type:"Cheating/CBT", sections:"BNS §316/318",      csFiledDays:45, status:"Disposed",    outcome:"Acquitted", stage:"Acquitted — Evidence insufficient", severity:"normal", acquittalReason:"Key documents not seized in time — seizure delayed 12 days" },
  { fir:"0198/2023", year:2023, type:"Rape",         sections:"BNS §64/351",       csFiledDays:38, status:"Disposed",    outcome:"Convicted", stage:"7 years RI",                       severity:"heinous" },
  { fir:"0127/2023", year:2023, type:"Robbery",      sections:"BNS §309/311",      csFiledDays:41, status:"Disposed",    outcome:"Convicted", stage:"5 years RI",                       severity:"heinous" },
  { fir:"0089/2023", year:2023, type:"Traffic/CH",   sections:"BNS §281/106",      csFiledDays:22, status:"Disposed",    outcome:"Convicted", stage:"2 years RI",                       severity:"normal"  },
  { fir:"0411/2022", year:2022, type:"Murder",       sections:"BNS §103",          csFiledDays:58, status:"Disposed",    outcome:"Convicted", stage:"Life Imprisonment",                severity:"heinous" },
  { fir:"0203/2022", year:2022, type:"Rape",         sections:"BNS §64",           csFiledDays:44, status:"Under Trial", outcome:null,        stage:"Defence Witness Examination Stage", severity:"heinous" },
  { fir:"0156/2022", year:2022, type:"NDPS",         sections:"NDPS §20/29",       csFiledDays:29, status:"Disposed",    outcome:"Convicted", stage:"5 years RI + Fine",                severity:"normal"  },
  { fir:"0098/2022", year:2022, type:"Cheating",     sections:"BNS §318/61",       csFiledDays:52, status:"Disposed",    outcome:"Acquitted", stage:"Acquitted — Hostile witness", severity:"normal", acquittalReason:"Main witness turned hostile — witness examination delayed by 3 months" },
  { fir:"0312/2021", year:2021, type:"Murder",       sections:"BNS §103/3(5)",     csFiledDays:55, status:"Disposed",    outcome:"Convicted", stage:"Death → Life (HC modified)",       severity:"heinous" },
  { fir:"0178/2021", year:2021, type:"Att. Murder",  sections:"BNS §109/3(5)",     csFiledDays:47, status:"Disposed",    outcome:"Convicted", stage:"7 years RI",                       severity:"heinous" },
];

// ─────────────────────── Helper Components ────────────────────────────────

function Badge({ text, type }) {
  const styles = {
    section:  { background: "#eef3ff", color: "#1a56a8", border: "1px solid #b8ccf0" },
    done:     { background: "#e6f4ee", color: "#1a6e3c", border: "1px solid #7fcba4" },
    active:   { background: "#e8f0fc", color: "#1a56a8", border: "1px solid #7aadee" },
    pending:  { background: "#f4f5f7", color: "#666",    border: "1px solid #ccc" },
    delayed:  { background: "#fef2f2", color: "#b91c1c", border: "1px solid #f9a8a8" },
  };
  return (
    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, fontWeight: 600, whiteSpace: "nowrap", display: "inline-block", ...styles[type] }}>
      {text}
    </span>
  );
}

function DetailGrid({ details }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 24px" }}>
      {details.map((d, i) => d.k ? (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: ".4px" }}>{d.k}</span>
          <span style={{ fontSize: 12, color: "#0f1f3d", fontWeight: 500, lineHeight: 1.4 }}>{d.v}</span>
        </div>
      ) : null)}
    </div>
  );
}

function StageCard({ stage, isLast, isExpanded, onToggle }) {
  const st = STATUS[stage.status];
  const isPending = stage.status === "pending";
  return (
    <div style={{ display: "flex", borderBottom: isLast ? "none" : "1px solid #eef0f5", background: isExpanded ? "#f7f9ff" : "transparent", transition: "background .1s" }}>
      {/* Timeline stem */}
      <div style={{ width: 52, minWidth: 52, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0 0" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, border: `2px solid ${st.border}`, flexShrink: 0 }}>
          {st.dot}
        </div>
        {!isLast && <div style={{ width: 2, background: st.line, flex: 1, marginTop: 4, minHeight: 24, opacity: stage.status === "done" ? 0.5 : 0.2 }} />}
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "10px 14px 0 4px", paddingBottom: isExpanded ? 0 : 12 }}>
        <div style={{ display: "flex", gap: 6, cursor: "pointer", alignItems: "flex-start" }} onClick={onToggle}>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "monospace", minWidth: 20, paddingTop: 2 }}>{stage.id}.</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: isPending ? "#999" : "#0f1f3d", lineHeight: 1.3 }}>{stage.name}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 5 }}>{stage.hindi}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Badge text={st.label} type={stage.status} />
              {stage.law.map(l => <Badge key={l} text={l} type="section" />)}
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 140, flexShrink: 0 }}>
            <div style={{ fontSize: 11.5, fontFamily: "monospace", color: isPending ? "#ccc" : "#0f1f3d", fontWeight: 600 }}>{stage.date}</div>
            <div style={{ fontSize: 10, color: "#aaa" }}>{stage.time}</div>
            <div style={{ fontSize: 10.5, color: "#888", marginTop: 2, lineHeight: 1.4 }}>{stage.officer}</div>
          </div>
          <span style={{ fontSize: 11, color: "#ccc", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform .2s", marginTop: 3, flexShrink: 0, marginLeft: 4 }}>▾</span>
        </div>
        {isExpanded && (
          <div style={{ marginTop: 10, marginLeft: 20, padding: "12px 14px 14px", background: "#f7f9ff", borderTop: "1px solid #e8ecf2", borderRadius: "0 0 6px 6px" }}>
            <DetailGrid details={stage.details} />
            {stage.note && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: "#fffbe8", borderLeft: "3px solid #f0c060", borderRadius: "0 4px 4px 0", fontSize: 11.5, color: "#5a4100", lineHeight: 1.6 }}>
                <strong>IO / Court Note:</strong> {stage.note}
              </div>
            )}
            {stage.docs.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#888" }}>Enclosures / Documents:</span>
                {stage.docs.map(d => (
                  <span key={d} style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 3, border: "1px solid #dde2ea", background: "#fff", color: "#1a56a8", cursor: "pointer" }}>📄 {d}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PhaseHeader({ phase, stageCount }) {
  const cfg = PHASE_CONFIG[phase] || { bg: "#374151", text: "#d1d5db", bar: "#6b7280", desc: "" };
  return (
    <div style={{ background: cfg.bg, padding: "7px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid rgba(255,255,255,.08)" }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: cfg.text, letterSpacing: ".02em", whiteSpace: "nowrap" }}>{phase}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", flex: 1, paddingLeft: 4 }}>{cfg.desc}</span>
      <span style={{ fontSize: 9.5, fontWeight: 700, background: "rgba(255,255,255,.15)", color: cfg.text, padding: "2px 9px", borderRadius: 10, whiteSpace: "nowrap" }}>
        {stageCount} {stageCount === 1 ? "stage" : "stages"}
      </span>
    </div>
  );
}

function CaseDiaryTab() {
  const [expandedCD, setExpandedCD] = useState(new Set([0, 6, 11, 18]));
  const toggle = i => { setExpandedCD(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; }); };
  return (
    <div style={{ background: "var(--color-background-primary,#fff)", border: "1px solid #dde2ea", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
      <div style={{ padding: "10px 16px", background: "#f4f5f7", borderBottom: "1px solid #dde2ea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f1f3d" }}>Case Diary / रोज़नामचा</span>
          <span style={{ fontSize: 11, color: "#888", marginLeft: 10 }}>u/s BNSS §196 &nbsp;|&nbsp; IO: HC Rajveer Singh (BP 3421) &nbsp;|&nbsp; PS Sector-29, Gurugram</span>
        </div>
        <span style={{ fontSize: 11, color: "#1a56a8", fontWeight: 700 }}>Total: {CD_ENTRIES.length} entries</span>
      </div>
      <div style={{ padding: "6px 16px 4px", background: "#fafbff", borderBottom: "1px solid #eef0f5", display: "grid", gridTemplateColumns: "65px 105px 1fr", gap: 4 }}>
        {["Entry No.", "Date", "Summary"].map(h => (
          <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: ".5px" }}>{h}</span>
        ))}
      </div>
      {CD_ENTRIES.map((e, i) => {
        const entryText = e.entry || e.description || "";
        const enteredBy = e.by || e.category || "Investigation";
        return (
          <div key={e.key || i} style={{ borderBottom: i < CD_ENTRIES.length - 1 ? "1px solid #eef0f5" : "none" }}>
            <div onClick={() => toggle(i)} style={{ display: "grid", gridTemplateColumns: "65px 105px 1fr 20px", gap: 8, padding: "8px 16px", cursor: "pointer", alignItems: "flex-start", background: expandedCD.has(i) ? "#f0f5ff" : "transparent" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10.5, color: "#1a56a8", fontWeight: 700, paddingTop: 1 }}>{e.no || e.key}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#333", paddingTop: 1 }}>{e.date}</span>
              <span style={{ fontSize: 12, color: "#333", lineHeight: 1.5 }}>{entryText.substring(0, expandedCD.has(i) ? 9999 : 120)}{!expandedCD.has(i) && entryText.length > 120 ? "…" : ""}</span>
              <span style={{ fontSize: 10, color: "#bbb", paddingTop: 2 }}>{expandedCD.has(i) ? "▲" : "▾"}</span>
            </div>
            {expandedCD.has(i) && (
              <div style={{ padding: "4px 16px 12px", paddingLeft: 90, background: "#f7f9ff", borderTop: "1px solid #eef0f5" }}>
                <div style={{ fontSize: 11, color: "#555", lineHeight: 1.7, borderLeft: "2px solid #7aadee", paddingLeft: 10 }}>
                  <span style={{ display: "block", color: "#888", fontSize: 10, marginBottom: 4 }}>Entered by: <strong style={{ color: "#333" }}>{enteredBy}</strong> &nbsp;|&nbsp; Date: <strong style={{ color: "#333" }}>{e.date}</strong></span>
                  {entryText}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────── IO Performance Panel ────────────────────────────

function IOPerformancePanel({ onSelectFIR = () => {}, selectedFIR = null }) {
  const [open, setOpen]   = useState(true);
  const [filter, setFilter] = useState("All");

  const total   = IO_CASES.length;
  const disp    = IO_CASES.filter(c => c.status === "Disposed");
  const conv    = IO_CASES.filter(c => c.outcome === "Convicted");
  const acq     = IO_CASES.filter(c => c.outcome === "Acquitted");
  const utrial  = IO_CASES.filter(c => c.status === "Under Trial");
  const decided = conv.length + acq.length;
  const convRate  = decided > 0 ? Math.round(conv.length / decided * 100) : 0;
  const avgCS     = Math.round(IO_CASES.reduce((s, c) => s + c.csFiledDays, 0) / total);
  const within60  = IO_CASES.filter(c => c.csFiledDays <= 60).length;
  const compliance = Math.round(within60 / total * 100);
  const dispRate  = Math.round(disp.length / total * 100);
  const heinous   = IO_CASES.filter(c => c.severity === "heinous");
  const heinousDecided = heinous.filter(c => c.outcome);
  const heinousConv = heinous.filter(c => c.outcome === "Convicted").length;

  // Weighted performance score (conviction 40% + compliance 35% + disposal 25%)
  const score  = Math.round(convRate * 0.40 + compliance * 0.35 + dispRate * 0.25);
  const rating = score >= 85 ? "Outstanding" : score >= 75 ? "Very Good" : score >= 65 ? "Good" : "Average";
  const ratingColor = { Outstanding: "#166534", "Very Good": "#1d4ed8", Good: "#92400e", Average: "#991b1b" }[rating];
  const ratingBg    = { Outstanding: "#f0fdf4", "Very Good": "#eff6ff", Good: "#fffbeb",  Average: "#fef2f2" }[rating];

  // Case type counts
  const typeMap = {};
  IO_CASES.forEach(c => { typeMap[c.type] = (typeMap[c.type] || 0) + 1; });
  const typeEntries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);

  // Year-wise
  const yearMap = {};
  IO_CASES.forEach(c => {
    if (!yearMap[c.year]) yearMap[c.year] = { total: 0, conv: 0, acq: 0 };
    yearMap[c.year].total++;
    if (c.outcome === "Convicted") yearMap[c.year].conv++;
    if (c.outcome === "Acquitted") yearMap[c.year].acq++;
  });

  const filtered = filter === "Convicted"   ? IO_CASES.filter(c => c.outcome === "Convicted")
    : filter === "Acquitted"   ? IO_CASES.filter(c => c.outcome === "Acquitted")
    : filter === "Under Trial" ? IO_CASES.filter(c => c.status === "Under Trial")
    : filter === "Heinous"     ? IO_CASES.filter(c => c.severity === "heinous")
    : IO_CASES;

  const BARS = [
    { label: "Conviction Rate",              val: `${convRate}%`,    pct: convRate,  color: convRate>=80?"#15803d":convRate>=70?"#1d4ed8":"#b45309" },
    { label: "CS Compliance (within 60d)",   val: `${compliance}%`, pct: compliance, color: "#15803d" },
    { label: "Disposal Rate",                val: `${dispRate}%`,   pct: dispRate,  color: "#1d4ed8" },
    { label: "Heinous Conviction (decided)", val: heinousDecided.length > 0 ? `${Math.round(heinousConv/heinousDecided.length*100)}%` : "N/A", pct: heinousDecided.length > 0 ? Math.round(heinousConv/heinousDecided.length*100) : 0, color: "#166534" },
    { label: "Heinous Cases (% of total)",   val: `${Math.round(heinous.length/total*100)}%`, pct: Math.round(heinous.length/total*100), color: "#7f1d1d" },
  ];

  return (
    <div id="io-register-top" style={{ borderLeft: "1px solid #dde2ea", borderRight: "1px solid #dde2ea", borderBottom: "1px solid #dde2ea", background: "#fff" }}>

      {/* ── Toggle Header ── */}
      <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "10px 18px", background: open ? "linear-gradient(135deg,#0a1628,#1a3060)" : "linear-gradient(135deg,#1e3a8a,#1a56a8)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background .2s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>👮</span>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>
              IO Performance Report — {IO_PROFILE.name}
              <span style={{ fontSize: 10, fontWeight: 400, color: "#93c5fd", marginLeft: 8 }}>Supervisory Review Dashboard</span>
            </div>
            <div style={{ fontSize: 10, color: "#93c5fd", marginTop: 1 }}>
              {IO_PROFILE.rank} · BP {IO_PROFILE.bpNo} · {IO_PROFILE.ps} · {IO_PROFILE.yearsService} yrs service · Supervisor: {IO_PROFILE.supervisor}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "5px 14px", borderRadius: 20, background: ratingBg, color: ratingColor, fontSize: 11.5, fontWeight: 800, border: `1px solid ${ratingColor}55` }}>
            {rating} &nbsp; {score}/100
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{open ? "▲" : "▾ View Report"}</span>
        </div>
      </div>

      {open && (
        <>
          {/* ── 5 Primary Metrics ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderBottom: "1px solid #eef0f5" }}>
            {[
              { label: "Total Cases as IO",      val: total,            sub: `${heinous.length} heinous · ${total-heinous.length} others`,                 color: "#1a56a8" },
              { label: "Cases Disposed",          val: disp.length,      sub: `${dispRate}% disposal rate`,                                                color: "#1a6e3c" },
              { label: "Under Trial / Pending",   val: utrial.length + (total-disp.length-utrial.length), sub: `${utrial.length} under trial · ${total-disp.length-utrial.length} CS/cognizance`, color: "#92400e" },
              { label: "Conviction Rate",         val: `${convRate}%`,   sub: `${conv.length} convicted of ${decided} decided`,                            color: convRate>=80?"#1a6e3c":"#b45309" },
              { label: "Avg CS Filing Time",      val: `${avgCS} days`,  sub: `${within60}/${total} within 60-day limit (${compliance}%)`,                 color: avgCS<=45?"#1a6e3c":"#92400e" },
            ].map(({ label, val, sub, color }, i) => (
              <div key={label} style={{ padding: "12px 14px", borderRight: i===4?"none":"1px solid #eef0f5" }}>
                <div style={{ fontSize: 9.5, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1, marginBottom: 4, fontFamily: "monospace" }}>{val}</div>
                <div style={{ fontSize: 10, color: "#888", lineHeight: 1.4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* ── Perf Bars + Case Type Distribution ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #eef0f5" }}>
            <div style={{ padding: "14px 18px", borderRight: "1px solid #eef0f5" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f1f3d", marginBottom: 12 }}>Performance Indicators</div>
              {BARS.map(({ label, val, pct, color }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10.5, color: "#555" }}>{label}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color, fontFamily: "monospace" }}>{val}</span>
                  </div>
                  <div style={{ background: "#eef0f5", borderRadius: 3, height: 7, overflow: "hidden" }}>
                    <div style={{ width: Math.min(pct,100)+"%", height: "100%", background: color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0f1f3d", marginBottom: 12 }}>Case Type Distribution</div>
              {typeEntries.map(([type, count]) => (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 86, fontSize: 10.5, color: "#555", textAlign: "right", flexShrink: 0 }}>{type}</div>
                  <div style={{ flex: 1, background: "#eef0f5", borderRadius: 3, height: 16, overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(count/total*100)}%`, height: "100%", background: "#1a56a8", borderRadius: 3, minWidth: 2 }} />
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#333", fontFamily: "monospace", minWidth: 16, textAlign: "right" }}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Year-wise Summary ── */}
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #eef0f5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0f1f3d", marginBottom: 8 }}>Year-wise Performance</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.entries(yearMap).sort((a,b)=>b[0]-a[0]).map(([year, d]) => {
                const pending = d.total - d.conv - d.acq;
                const yr_rate = d.conv+d.acq > 0 ? Math.round(d.conv/(d.conv+d.acq)*100) : null;
                return (
                  <div key={year} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fafbff", minWidth: 120 }}>
                    <div style={{ fontSize: 9.5, color: "#888", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".04em" }}>{year}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f1f3d", fontFamily: "monospace" }}>{d.total} <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>cases</span></div>
                    <div style={{ fontSize: 9.5, marginTop: 5, display: "flex", flexDirection: "column", gap: 1 }}>
                      {d.conv  > 0 && <span style={{ color: "#166534" }}>✓ {d.conv} convicted</span>}
                      {d.acq   > 0 && <span style={{ color: "#991b1b" }}>✗ {d.acq} acquitted</span>}
                      {pending > 0 && <span style={{ color: "#1a56a8" }}>⏳ {pending} pending</span>}
                      {yr_rate !== null && <span style={{ color: "#888", marginTop: 2 }}>{yr_rate}% conv. rate</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Supervisory Observations ── */}
          <div style={{ padding: "12px 18px", background: "#fafbff", borderBottom: "1px solid #eef0f5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0f1f3d", marginBottom: 8 }}>Supervisory Observations</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ padding: "7px 12px", borderRadius: 6, background: "#f0fdf4", border: "1px solid #86efac", fontSize: 10.5, color: "#166534" }}>
                ✓ All {total} chargesheets filed within 60-day statutory limit
              </div>
              <div style={{ padding: "7px 12px", borderRadius: 6, background: "#f0fdf4", border: "1px solid #86efac", fontSize: 10.5, color: "#166534" }}>
                ✓ {heinousConv}/{heinousDecided.length} heinous cases decided — all convicted
              </div>
              <div style={{ padding: "7px 12px", borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 10.5, color: "#991b1b" }}>
                ⚠ 1 PO pending — A3 Bhola Singh (FIR 0142/2024) · Red Corner Notice active
              </div>
              {acq.map(c => (
                <div key={c.fir} style={{ padding: "7px 12px", borderRadius: 6, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 10.5, color: "#92400e" }}>
                  ⚑ FIR {c.fir} — Acquitted: {c.acquittalReason}
                </div>
              ))}
              <div style={{ padding: "7px 12px", borderRadius: 6, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 10.5, color: "#1d4ed8" }}>
                ℹ 3 adjournments in FIR 0142/2024 (IO leave ×1, PW absent ×2) — 1 court caution received
              </div>
            </div>
          </div>

          {/* ── Awards ── */}
          {IO_PROFILE.awards.length > 0 && (
            <div style={{ padding: "10px 18px", borderBottom: "1px solid #eef0f5", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: ".5px" }}>Awards / Recognition:</span>
              {IO_PROFILE.awards.map(a => (
                <span key={a} style={{ fontSize: 10.5, padding: "3px 10px", borderRadius: 3, background: "#fffbeb", border: "1px solid #fde68a", color: "#78350f" }}>🏅 {a}</span>
              ))}
            </div>
          )}

          {/* ── Case Register ── */}
          <div style={{ padding: "10px 18px 8px", background: "linear-gradient(135deg,#f8f9fb,#eef3ff)", borderTop: "1px solid #dde2ea", borderBottom: "1px solid #dde2ea" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0f1f3d" }}>Case Register</span>
                <span style={{ fontSize: 9.5, background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{total} FIRs</span>
                {!selectedFIR && <span style={{ fontSize: 10, color: "#1a56a8", fontStyle: "italic" }}>↓ Click any FIR row to view full investigation</span>}
                {selectedFIR && <span style={{ fontSize: 10, color: "#166534", fontWeight: 700 }}>✓ Viewing FIR {selectedFIR} — click row again to close</span>}
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["All","Convicted","Acquitted","Under Trial","Heinous"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: "3px 10px", fontSize: 9.5, borderRadius: 20, border: `1px solid ${filter===f?"#0f1f3d":"#dde2ea"}`, background: filter===f?"#0f1f3d":"#fff", color: filter===f?"#fff":"#555", cursor: "pointer", fontWeight: filter===f?700:400, transition: "all .15s" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <div style={{ maxHeight: 368, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ background: "#f0f2f7", position: "sticky", top: 0, zIndex: 2 }}>
                    {["", "FIR No.", "Year", "Offence", "Sections (BNS/NDPS)", "CS Days", "Status", "Outcome / Stage"].map((h, hi) => (
                      <th key={hi} style={{ padding: hi===0?"6px 6px":"7px 10px", textAlign: hi<=1?"center":"left", fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: ".4px", fontWeight: 700, borderBottom: "2px solid #dde2ea", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const isCur = c.fir === "0142/2024";
                    const isSelected = selectedFIR === c.fir;
                    const csColor = c.csFiledDays <= 40 ? "#166534" : c.csFiledDays <= 55 ? "#92400e" : "#991b1b";
                    const sBg  = c.status==="Disposed"?"#f0fdf4":c.status==="Under Trial"?"#eff6ff":"#f9fafb";
                    const sClr = c.status==="Disposed"?"#166534":c.status==="Under Trial"?"#1d4ed8":"#555";
                    const oBg  = c.outcome==="Convicted"?"#f0fdf4":c.outcome==="Acquitted"?"#fef2f2":"#f9fafb";
                    const oClr = c.outcome==="Convicted"?"#166534":c.outcome==="Acquitted"?"#991b1b":"#1a56a8";
                    const rowBg = isSelected ? "#dbeafe" : isCur ? "#f0f5ff" : i%2===0 ? "#fff" : "#fafbff";
                    return (
                      <tr key={c.fir} onClick={() => onSelectFIR(isSelected ? null : c.fir)}
                        style={{ background: rowBg, borderBottom: "1px solid #eef0f5", cursor: "pointer", borderLeft: isSelected?"3px solid #1d4ed8":"3px solid transparent", transition: "background .15s" }}>
                        <td style={{ padding: "7px 8px", textAlign: "center", width: 28 }}>
                          <span style={{ fontSize: 12, color: isSelected?"#1d4ed8":"#ccc" }}>{isSelected ? "▼" : "▶"}</span>
                        </td>
                        <td style={{ padding: "7px 10px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 800, color: isSelected?"#1d4ed8":"#1a56a8", fontSize: 11.5 }}>{c.fir}</div>
                          {isCur && <div style={{ fontSize: 8.5, background: "#dbeafe", color: "#1d4ed8", padding: "1px 5px", borderRadius: 3, marginTop: 2, display: "inline-block", fontWeight: 700 }}>Current Case</div>}
                          {isSelected && <div style={{ fontSize: 8.5, background: "#1d4ed8", color: "#fff", padding: "1px 5px", borderRadius: 3, marginTop: 2, display: "inline-block", fontWeight: 700 }}>Click to close ▲</div>}
                        </td>
                        <td style={{ padding: "7px 10px", fontFamily: "monospace", fontSize: 11, color: "#555" }}>{c.year}</td>
                        <td style={{ padding: "7px 10px" }}>
                          <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: c.severity==="heinous"?"#fff1f2":"#f4f5f7", color: c.severity==="heinous"?"#991b1b":"#555", border:`1px solid ${c.severity==="heinous"?"#fecaca":"#e5e7eb"}`, fontWeight: 600 }}>{c.type}</span>
                        </td>
                        <td style={{ padding: "7px 10px", fontFamily: "monospace", fontSize: 10, color: "#0f1f3d" }}>{c.sections}</td>
                        <td style={{ padding: "7px 10px", textAlign: "center" }}>
                          <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: csColor }}>{c.csFiledDays}d</span>
                        </td>
                        <td style={{ padding: "7px 10px" }}>
                          <span style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 10, background: sBg, color: sClr, fontWeight: 700 }}>{c.status}</span>
                        </td>
                        <td style={{ padding: "7px 10px", fontSize: 10.5, color: "#333" }}>
                          {c.outcome && <span style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 3, background: oBg, color: oClr, fontWeight: 700, marginRight: 5 }}>{c.outcome}</span>}
                          <span style={{ color: "#666" }}>{c.stage}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length > 10 && (
              <div style={{ padding: "5px 18px", background: "#f8f9fb", borderTop: "1px solid #eef0f5", fontSize: 9.5, color: "#888", textAlign: "center" }}>
                Scroll within table to see all {filtered.length} records
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────── Milestone Duration Tracker ──────────────────────

function MilestoneTimeline() {
  const CW = 90;   // cell width (each milestone column)
  const GW = 62;   // gap/connector width between cells

  const dotStyle = {
    done:    { bg: "#1f5836", border: "#7fcba4", icon: "✓", color: "#fff" },
    active:  { bg: "#1a56a8", border: "#7aadee", icon: "▶", color: "#fff" },
    pending: { bg: "#e9eaec", border: "#d1d5db", icon: "○", color: "#9ca3af" },
  };
  const dayStyle = {
    done:    { bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
    active:  { bg: "#dbeafe", border: "#93c5fd", color: "#1d4ed8" },
    pending: { bg: "#f9fafb", border: "#e5e7eb", color: "#9ca3af" },
  };
  const lineColor = { done: "#bbf7d0", active: "#bfdbfe", pending: "#e5e7eb" };

  // Flatten milestones into [node, connector, node, connector, ...] items
  const cells = KEY_MILESTONES.flatMap((m, i) => {
    const items = [{ type: "node", m }];
    if (i < KEY_MILESTONES.length - 1) {
      items.push({ type: "conn", m, next: KEY_MILESTONES[i + 1] });
    }
    return items;
  });

  return (
    <div style={{ background: "var(--color-background-primary,#fff)", borderLeft: "1px solid #dde2ea", borderRight: "1px solid #dde2ea", borderBottom: "1px solid #dde2ea" }}>
      {/* Header */}
      <div style={{ padding: "7px 18px", background: "#f8f9fb", borderBottom: "1px solid #eef0f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0f1f3d" }}>
          ⏱&nbsp; Case Duration Tracker
          <span style={{ fontWeight: 400, color: "#888", fontSize: 11 }}>&nbsp;— Key milestones from complaint date&nbsp;</span>
          <span style={{ fontFamily: "monospace", color: "#555", fontSize: 11 }}>03 Apr 2024</span>
        </span>
        <span style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>
          399 days elapsed &nbsp;·&nbsp; Trial ongoing (PE) &nbsp;·&nbsp; Judgment awaited
        </span>
      </div>

      <div style={{ overflowX: "auto", padding: "14px 18px 16px" }}>
        <div style={{ minWidth: "max-content" }}>

          {/* ── Row 1: Day badges ── */}
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 6 }}>
            {cells.map((c, j) => {
              if (c.type === "node") {
                const ds = dayStyle[c.m.status];
                return (
                  <div key={j} style={{ width: CW, display: "flex", justifyContent: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "monospace", padding: "2px 7px", borderRadius: 4, border: `1px solid ${ds.border}`, background: ds.bg, color: ds.color, whiteSpace: "nowrap" }}>
                      {c.m.day !== null ? `Day ${c.m.day}` : "TBD"}
                    </div>
                  </div>
                );
              }
              return <div key={j} style={{ width: GW }} />;
            })}
          </div>

          {/* ── Row 2: Dots + connector lines ── */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {cells.map((c, j) => {
              if (c.type === "node") {
                const ds = dotStyle[c.m.status];
                return (
                  <div key={j} style={{ width: CW, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: ds.bg, border: `2.5px solid ${ds.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: ds.color, fontWeight: 700, boxShadow: c.m.hi ? "0 0 0 4px rgba(26,86,168,.15)" : "none", flexShrink: 0 }}>
                      {ds.icon}
                    </div>
                  </div>
                );
              }
              // connector
              const lc = lineColor[c.m.status] || lineColor.pending;
              return (
                <div key={j} style={{ width: GW, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ fontSize: 8.5, color: "#9ca3af", fontFamily: "monospace", whiteSpace: "nowrap", background: "#f9fafb", padding: "1px 5px", borderRadius: 2, border: "1px solid #eee", letterSpacing: "-.01em" }}>
                    +{c.next.gap}
                  </div>
                  <div style={{ width: "100%", height: 2, background: lc, borderRadius: 1 }} />
                </div>
              );
            })}
          </div>

          {/* ── Row 3: Labels + date + note ── */}
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 7 }}>
            {cells.map((c, j) => {
              if (c.type === "conn") return <div key={j} style={{ width: GW }} />;
              const isPending = c.m.status === "pending";
              return (
                <div key={j} style={{ width: CW, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isPending ? "#9ca3af" : "#0f1f3d", textAlign: "center", lineHeight: 1.2 }}>{c.m.label}</div>
                  <div style={{ fontSize: 9.5, color: "#999", textAlign: "center", lineHeight: 1.2 }}>{c.m.sub}</div>
                  <div style={{ fontSize: 9.5, fontFamily: "monospace", color: isPending ? "#c4c4c4" : "#555", textAlign: "center" }}>{c.m.date}</div>
                  {c.m.note && (
                    <div style={{ fontSize: 9, textAlign: "center", padding: "1px 5px", borderRadius: 3, marginTop: 1, lineHeight: 1.3, background: c.m.hi ? "#eff6ff" : "#f9fafb", color: c.m.hi ? "#1d4ed8" : "#888", border: c.m.hi ? "1px solid #bfdbfe" : "1px solid #f0f0f0" }}>
                      {c.m.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────── Main Component ───────────────────────────────────

export default function CaseTimeline() {
  const [activeTab, setActiveTab] = useState("All");
  const [expanded, setExpanded] = useState(new Set([7, 10, 13, 16]));
  const [showAccused, setShowAccused] = useState(true);
  const [showFIR, setShowFIR] = useState(false);
  const [selectedFIR, setSelectedFIR] = useState(null);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    if (selectedFIR) {
      const t = setTimeout(() => scrollTo("case-detail-start"), 60);
      return () => clearTimeout(t);
    }
  }, [selectedFIR]);

  const closeFIR = () => { setSelectedFIR(null); setTimeout(() => scrollTo("io-register-top"), 40); };

  const toggle = id => { setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const filtered = STAGES.filter(s => {
    if (activeTab === "All") return true;
    if (activeTab === "Completed") return s.status === "done";
    if (activeTab === "In Progress") return s.status === "active";
    if (activeTab === "Pending") return s.status === "pending";
    return true;
  });

  const grouped = PHASES_ORDERED.map(ph => ({ phase: ph, stages: filtered.filter(s => s.phase === ph) })).filter(g => g.stages.length > 0);
  const doneCnt  = STAGES.filter(s => s.status === "done").length;
  const activeCnt = STAGES.filter(s => s.status === "active").length;
  const pendCnt  = STAGES.filter(s => s.status === "pending").length;
  const pct = Math.round((doneCnt / STAGES.length) * 100);
  const custodyCount = CASE_INFO.accused.filter(a => a.status === "Judicial Custody" || a.status === "Police Custody").length;
  const poCount      = CASE_INFO.accused.filter(a => a.status === "PO Declared").length;
  const tabCounts = { "All": STAGES.length, "Completed": doneCnt, "In Progress": activeCnt, "Pending": pendCnt, "Case Diary": CD_ENTRIES.length };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 960, margin: "0 auto", padding: "0 0 40px" }}>

      {/* ══════════════════ IO Performance Panel (always at top) ══════════════════ */}
      <IOPerformancePanel onSelectFIR={setSelectedFIR} selectedFIR={selectedFIR} />

      {/* ── No selection hint ── */}
      {!selectedFIR && (
        <div style={{ margin: "20px 0 0", padding: "22px 28px", borderRadius: 12, border: "1.5px dashed #bfdbfe", background: "linear-gradient(135deg,#eff6ff,#f8faff)", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👆</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>Select a FIR to view full case investigation</div>
          <div style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.7 }}>
            Click any row in the Case Register above to open the complete investigation trail —<br />
            FIR details · Milestone timeline · Accused · Stage-by-stage proceedings · Case Diary
          </div>
        </div>
      )}

      {selectedFIR && (<>

      {/* ── Case breadcrumb header ── */}
      <div style={{ marginTop: 20, padding: "10px 18px", borderRadius: "10px 10px 0 0", background: "linear-gradient(90deg,#0f1f3d,#1a3060)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={closeFIR} style={{ fontSize: 9.5, color: "#94a3b8", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>⬆ Register</button>
          <span style={{ fontSize: 10, color: "#475569" }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", fontFamily: "monospace" }}>FIR {selectedFIR}</span>
          <span style={{ fontSize: 9.5, background: "rgba(96,165,250,.2)", color: "#93c5fd", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
            {selectedFIR === "0142/2024" ? "State vs Suresh Kumar & Ors." : (IO_CASES.find(c=>c.fir===selectedFIR)?.type || "Case Details")}
          </span>
        </div>
        <button onClick={closeFIR} style={{ fontSize: 10.5, color: "#94a3b8", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
          ✕ Close
        </button>
      </div>

      {/* ── Sticky section nav (appears after scrolling, always stays visible) ── */}
      <div id="case-detail-start" style={{ position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "2px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,.07)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 14px" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { icon: "📋", label: "Overview",    id: "case-overview"  },
            { icon: "⏱",  label: "Timeline",    id: "case-duration"  },
            { icon: "📊",  label: "Stats",       id: "case-stats"     },
            { icon: "👤",  label: "Accused",     id: "case-accused"   },
            { icon: "📁",  label: "Stages",      id: "case-stages"    },
          ].map(({ icon, label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ fontSize: 10.5, color: "#374151", background: "#f4f5f7", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 11px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              {icon} {label}
            </button>
          ))}
        </div>
        <button onClick={closeFIR}
          style={{ fontSize: 10.5, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 14px", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap" }}>
          ⬆ Back to Register
        </button>
      </div>

      {selectedFIR !== "0142/2024" && (() => {
        const sc = IO_CASES.find(c => c.fir === selectedFIR) || {};
        const oBg = sc.outcome==="Convicted"?"#f0fdf4":sc.outcome==="Acquitted"?"#fef2f2":"#fffbeb";
        const oClr = sc.outcome==="Convicted"?"#166534":sc.outcome==="Acquitted"?"#991b1b":"#92400e";
        return (
          <div style={{ padding: "28px 24px", background: "#fafbff", border: "1px solid #dde2ea", borderTop: "none" }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>FIR Number</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f1f3d", fontFamily: "monospace" }}>{sc.fir}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{sc.year} · {sc.type}</div>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Sections</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1f3d", fontFamily: "monospace" }}>{sc.sections}</div>
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>CS Filed In</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: sc.csFiledDays<=60?"#166534":"#991b1b" }}>{sc.csFiledDays}d</div>
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Status</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>{sc.status}</div>
                {sc.outcome && <div style={{ marginTop: 4, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, display:"inline-block", background: oBg, color: oClr }}>{sc.outcome}</div>}
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11.5, color: "#555", lineHeight: 1.7 }}>
              <strong style={{ color: "#0f1f3d" }}>Stage:</strong> {sc.stage}
              {sc.acquittalReason && <div style={{ marginTop: 8, padding: "8px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, fontSize: 11, color: "#92400e" }}>⚑ Acquittal reason: {sc.acquittalReason}</div>}
            </div>
            <div style={{ marginTop: 16, padding: "10px 14px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe", fontSize: 11, color: "#1d4ed8", textAlign: "center" }}>
              ℹ Full investigation record (timeline · accused · FSL · chargesheet · trial stages) available for FIR 0142/2024 — click that row for complete 360° case view.
            </div>
          </div>
        );
      })()}

      {selectedFIR === "0142/2024" && (<>

      {/* ══════════════════ HEADER — Police Monitoring Sheet ══════════════════ */}
      <div id="case-overview" style={{ borderRadius: "12px 12px 0 0", overflow: "hidden", border: "2px solid #0f1f3d", boxShadow: "0 4px 24px rgba(15,31,61,.18)", scrollMarginTop: 56 }}>

        {/* Top strip — letterhead */}
        <div style={{ background: "#060e20", padding: "9px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #1a3a8f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🚔</span>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#60a5fa", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Haryana Police &nbsp;·&nbsp; District Gurugram
              </div>
              <div style={{ fontSize: 8.5, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>
                Case Monitoring &amp; Investigation Progress System &nbsp;·&nbsp; CCTNS Integrated
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10.5, color: "#60a5fa", fontFamily: "monospace", fontWeight: 700 }}>Ref: {CASE_INFO.ptn}</div>
            <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 1 }}>CNR: {CASE_INFO.cnr}</div>
          </div>
        </div>

        {/* Main header body */}
        <div style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #162847 60%, #1a3060 100%)", padding: "20px 22px" }}>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>

            {/* LEFT: Case details */}
            <div style={{ flex: "1 1 540px" }}>
              {/* Status tags */}
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ background: "#dc2626", color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "4px 11px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ● {CASE_INFO.priority}
                </span>
                <span style={{ background: "rgba(96,165,250,.18)", color: "#93c5fd", fontSize: 9.5, fontWeight: 700, padding: "4px 11px", borderRadius: 3, letterSpacing: "0.04em" }}>
                  {CASE_INFO.caseType}
                </span>
                <span style={{ background: "rgba(34,197,94,.15)", color: "#4ade80", fontSize: 9.5, fontWeight: 700, padding: "4px 11px", borderRadius: 3, letterSpacing: "0.04em" }}>
                  ◈ {CASE_INFO.statusTag}
                </span>
                <span style={{ background: "rgba(251,191,36,.12)", color: "#fbbf24", fontSize: 9.5, fontWeight: 600, padding: "4px 11px", borderRadius: 3 }}>
                  {CASE_INFO.offenceDesc}
                </span>
              </div>

              {/* Case title */}
              <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.1, letterSpacing: "-.01em" }}>
                {CASE_INFO.title}
              </h1>

              {/* FIR / PS line */}
              <div style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "monospace", marginBottom: 6, letterSpacing: ".02em" }}>
                FIR No.&nbsp;<strong style={{ color: "#60a5fa" }}>{CASE_INFO.firNo}</strong>
                &nbsp;·&nbsp;Dt.&nbsp;{CASE_INFO.firDate}
                &nbsp;·&nbsp;<strong style={{ color: "#e2e8f0" }}>{CASE_INFO.ps}</strong>
                &nbsp;·&nbsp;{CASE_INFO.dist}
              </div>

              {/* Offence line */}
              <div style={{ fontSize: 11.5, color: "#fbbf24", fontFamily: "monospace", marginBottom: 16 }}>
                U/S:&nbsp;<strong>{CASE_INFO.offence.join(" r/w ")}</strong>
                &nbsp;&nbsp;<span style={{ color: "#64748b" }}>|</span>&nbsp;&nbsp;
                <span style={{ color: "#94a3b8" }}>Victim:&nbsp;</span>
                <strong style={{ color: "#e2e8f0" }}>{CASE_INFO.victim}</strong>
              </div>

              {/* 4-column key details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9, marginBottom: 14 }}>
                {[
                  { label: "Sessions Court",  v1: CASE_INFO.court,       v2: CASE_INFO.ccNo },
                  { label: "Chargesheet",     v1: CASE_INFO.chargeSheetNo, v2: `Filed ${CASE_INFO.csDate}` },
                  { label: "Accused Status",  v1: `${custodyCount} Judicial Custody`, v2: `${poCount} PO — Bhola Singh` },
                  { label: "PP / Prosecutor", v1: CASE_INFO.pp,           v2: "Appearing for State" },
                ].map(({ label, v1, v2 }) => (
                  <div key={label} style={{ padding: "9px 11px", borderRadius: 7, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.11)" }}>
                    <div style={{ fontSize: 8.5, color: "#475569", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3 }}>{v1}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{v2}</div>
                  </div>
                ))}
              </div>

              {/* IO / SHO row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 11, color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 10 }}>
                <span>IO:&nbsp;<strong style={{ color: "#e2e8f0" }}>{CASE_INFO.io}</strong></span>
                <span>SHO:&nbsp;<strong style={{ color: "#e2e8f0" }}>{CASE_INFO.sho}</strong></span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "#334155", fontFamily: "monospace" }}>
                  {CASE_INFO.standardNote}
                </span>
              </div>
            </div>

            {/* RIGHT: Next hearing + alert */}
            <div style={{ minWidth: 200, maxWidth: 230, display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Next hearing box */}
              <div style={{ padding: "16px", borderRadius: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", flex: 1 }}>
                <div style={{ fontSize: 8.5, color: "#475569", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
                  ⚑ Next Court Date
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 8 }}>
                  {CASE_INFO.nextDate}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5, marginBottom: 10 }}>
                  {CASE_INFO.court}<br />
                  {CASE_INFO.ccNo}
                </div>
                <div style={{ padding: "7px 10px", borderRadius: 6, background: "rgba(251,191,36,.11)", border: "1px solid rgba(251,191,36,.28)", fontSize: 10, color: "#fbbf24", lineHeight: 1.5 }}>
                  📋 {CASE_INFO.nextHearingDetail}
                </div>
              </div>

              {/* Alert — PO */}
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.28)", fontSize: 10, color: "#fca5a5", lineHeight: 1.5 }}>
                ⚠ &nbsp;<strong>A3 Bhola Singh</strong> — PO Declared<br />
                <span style={{ color: "#64748b" }}>Red Corner Notice active.<br />Supp. CS pending on arrest.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar strip */}
        <div style={{ background: "#0a1628", padding: "10px 22px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 5, height: 8, overflow: "hidden", marginBottom: 5 }}>
            <div style={{ width: pct + "%", height: "100%", borderRadius: 5, background: "linear-gradient(90deg, #3b82f6 0%, #10b981 60%, #f59e0b 100%)", transition: "width .5s" }} />
          </div>
          <div style={{ fontSize: 10.5, color: "#475569", display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#334155" }}>Case Registration</span>
            <span style={{ fontWeight: 700, color: "#60a5fa" }}>
              {pct}% — {doneCnt} of {STAGES.length} milestones completed &nbsp;·&nbsp; {activeCnt} active &nbsp;·&nbsp; {pendCnt} pending
            </span>
            <span style={{ color: "#334155" }}>Final Disposal</span>
          </div>
        </div>
      </div>

      {/* ══════════════════ Milestone Duration Tracker ══════════════════ */}
      <div id="case-duration" style={{ scrollMarginTop: 56 }}><MilestoneTimeline /></div>

      {/* ══════════════════ Stats Strip ══════════════════ */}
      <div id="case-stats" style={{ scrollMarginTop: 56, background: "var(--color-background-primary,#fff)", border: "1px solid #dde2ea", display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
        {[
          ["Days Since FIR",   "399",       ""],
          ["Milestones Done",  `${doneCnt} / ${STAGES.length}`, ""],
          ["In Progress",      activeCnt,   "stage"],
          ["Case Diary",       CD_ENTRIES.length, "entries u/s 172"],
          ["CS Filed In",      "54 days",   "within 60-day limit ✓"],
        ].map(([l, v, u], i) => (
          <div key={l} style={{ padding: "10px 14px", borderRight: i === 4 ? "none" : "1px solid #dde2ea" }}>
            <div style={{ fontSize: 9.5, color: "#888", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: typeof v === "string" && v.length > 5 ? 14 : 20, fontWeight: 700, color: "#0f1f3d", fontFamily: "monospace" }}>{v}</div>
            {u && <div style={{ fontSize: 9.5, color: "#888" }}>{u}</div>}
          </div>
        ))}
      </div>

      {/* ══════════════════ FIR Quick Details (Expandable) ══════════════════ */}
      <div style={{ background: "var(--color-background-primary,#fff)", borderLeft: "1px solid #dde2ea", borderRight: "1px solid #dde2ea", borderBottom: "1px solid #dde2ea" }}>
        <div onClick={() => setShowFIR(!showFIR)} style={{ padding: "8px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f9fb", borderBottom: showFIR ? "1px solid #dde2ea" : "none" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0f1f3d" }}>
            📋 FIR Details — {CASE_INFO.firNo}&nbsp;&nbsp;<span style={{ color: "#1a56a8" }}>{CASE_INFO.offence.join(" · ")}</span>
          </span>
          <span style={{ fontSize: 11, color: "#aaa" }}>{showFIR ? "▲ Hide" : "▾ Expand"}</span>
        </div>
        {showFIR && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 24px", padding: "12px 18px", background: "#fafbff" }}>
            {[
              ["FIR No.", CASE_INFO.firNo], ["Date of FIR", CASE_INFO.firDate], ["Police Station", CASE_INFO.ps],
              ["District", CASE_INFO.dist], ["IO Assigned", CASE_INFO.io], ["SHO", CASE_INFO.sho],
              ["PTN", CASE_INFO.ptn], ["CNR", CASE_INFO.cnr], ["Victim", CASE_INFO.victim],
              ["Court", CASE_INFO.court], ["CC No.", CASE_INFO.ccNo], ["PP", CASE_INFO.pp],
              ["CS No.", CASE_INFO.chargeSheetNo], ["CS Date", CASE_INFO.csDate], ["Next Date", CASE_INFO.nextDate],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 9.5, color: "#888", textTransform: "uppercase", letterSpacing: ".4px" }}>{k}</span>
                <span style={{ fontSize: 12, color: "#0f1f3d", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════ Accused Persons — 360° Custody & Bail View ══════════════════ */}
      <div id="case-accused" style={{ scrollMarginTop: 56, background: "#fff", borderLeft: "1px solid #dde2ea", borderRight: "1px solid #dde2ea", borderBottom: "1px solid #dde2ea" }}>
        <div onClick={() => setShowAccused(!showAccused)} style={{ padding: "9px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f9fb", borderBottom: showAccused ? "1px solid #dde2ea" : "none" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0f1f3d" }}>
            👤 Accused — Custody &amp; Bail Tracker &nbsp;
            <span style={{ fontSize: 10, fontWeight: 400, color: "#888" }}>
              {custodyCount} Judicial Custody · {poCount} PO Absconding
            </span>
          </span>
          <span style={{ fontSize: 11, color: "#aaa" }}>{showAccused ? "▲ Hide" : "▾ Expand"}</span>
        </div>
        {showAccused && (
          <div style={{ padding: "14px 16px", background: "#fafbff", display: "flex", flexDirection: "column", gap: 14 }}>
            {CASE_INFO.accused.map((a, idx) => {
              const isPO = a.status === "PO Declared";
              const headerBg = isPO ? "linear-gradient(135deg,#7f1d1d,#991b1b)" : "linear-gradient(135deg,#1e3a8a,#1a56a8)";
              return (
                <div key={a.name} style={{ borderRadius: 10, border: `1px solid ${isPO?"#fecaca":"#bfdbfe"}`, overflow: "hidden", background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}>

                  {/* ── Card header ── */}
                  <div style={{ background: headerBg, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>A{idx+1}. {a.name}</div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.7)", marginTop: 2 }}>
                        Age {a.age} yrs &nbsp;·&nbsp; S/o {a.father} &nbsp;·&nbsp; {a.addr}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: isPO?"#dc2626":"#166534", color: "#fff", whiteSpace: "nowrap", alignSelf: "flex-start" }}>
                      {isPO ? "⚠ PO DECLARED — ABSCONDING" : "🔒 JUDICIAL CUSTODY"}
                    </span>
                  </div>

                  {!isPO ? (
                    <>
                      {/* ── Key custody metrics ── */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid #e5e7eb" }}>
                        {[
                          { label: "Arrested", val: a.arrestDate, sub: a.arrestTime },
                          { label: "Police Remand", val: `${a.pcDays} days`, sub: `${a.pcFrom} → ${a.pcTo}` },
                          { label: "Judicial Custody Since", val: a.jcFrom, sub: a.jailName },
                          { label: "Days in Custody", val: `${a.custodyDays}d`, sub: "as of today", highlight: true },
                        ].map(({ label, val, sub, highlight }, i) => (
                          <div key={label} style={{ padding: "10px 12px", borderRight: i===3?"none":"1px solid #e5e7eb", background: highlight?"#fef2f2":"transparent" }}>
                            <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{label}</div>
                            <div style={{ fontSize: highlight?20:13, fontWeight: 800, color: highlight?"#dc2626":"#0f1f3d", fontFamily: "monospace", lineHeight: 1.2 }}>{val}</div>
                            <div style={{ fontSize: 9.5, color: "#888", marginTop: 2 }}>{sub}</div>
                          </div>
                        ))}
                      </div>

                      {/* ── Custody timeline strip ── */}
                      <div style={{ padding: "10px 16px", background: "#f8f9fb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
                        {[
                          { dot: "#1a56a8", label: "Arrested",        date: a.arrestDate,  desc: "FIR 0142/2024" },
                          { dot: "#f59e0b", label: "PC (5 days)",     date: a.pcFrom,       desc: "Weapon recovery" },
                          { dot: "#dc2626", label: "Jail — JC Start", date: a.jcFrom,       desc: a.jailName },
                          { dot: "#dc2626", label: "JC Ongoing",      date: "Today",        desc: `${a.custodyDays} days` },
                        ].map((pt, pi, arr) => (
                          <div key={pi} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: pt.dot, flexShrink: 0 }} />
                              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#0f1f3d", marginTop: 3, textAlign: "center" }}>{pt.label}</div>
                              <div style={{ fontSize: 8.5, color: "#888", textAlign: "center" }}>{pt.date}</div>
                              <div style={{ fontSize: 8, color: "#aaa", textAlign: "center" }}>{pt.desc}</div>
                            </div>
                            {pi < arr.length-1 && <div style={{ width: 32, height: 2, background: "#e5e7eb", flexShrink: 0 }} />}
                          </div>
                        ))}
                      </div>

                      {/* ── Bail applications ── */}
                      <div style={{ padding: "10px 16px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>
                          Bail History — {a.bail.length} Application{a.bail.length!==1?"s":""} · All Rejected
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {a.bail.map(b => (
                            <div key={b.seq} style={{ padding: "10px 13px", borderRadius: 7, background: "#fff5f5", border: "1px solid #fecaca", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0 12px", alignItems: "start" }}>
                              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#888", paddingTop: 1 }}>#{b.seq}</div>
                              <div>
                                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#0f1f3d", marginBottom: 2 }}>{b.court}</div>
                                <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
                                  Applied: <strong style={{color:"#0f1f3d"}}>{b.applied}</strong> &nbsp;·&nbsp; Decided: <strong style={{color:"#0f1f3d"}}>{b.decided}</strong>
                                </div>
                                <div style={{ fontSize: 10.5, color: "#555", lineHeight: 1.5 }}>{b.reason}</div>
                              </div>
                              <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: "#dc2626", color: "#fff", whiteSpace: "nowrap" }}>REJECTED</span>
                            </div>
                          ))}
                          {a.bail.length === 0 && <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>No bail applications filed.</div>}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ── PO timeline ── */
                    <div style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>
                        Proclamation &amp; Abscondment Timeline
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {a.poTimeline.map((pt, pi) => (
                          <div key={pi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 16 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: pi===4?"#dc2626":"#f59e0b", marginTop: 3 }} />
                              {pi < a.poTimeline.length-1 && <div style={{ width: 2, height: 18, background: "#e5e7eb" }} />}
                            </div>
                            <div style={{ flex: 1, paddingBottom: 4 }}>
                              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0f1f3d" }}>{pt.event}</span>
                                <span style={{ fontSize: 9.5, color: "#888", fontFamily: "monospace" }}>{pt.date}</span>
                              </div>
                              <div style={{ fontSize: 10, color: "#666" }}>{pt.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 10, padding: "8px 12px", background: "#fef2f2", borderRadius: 6, border: "1px solid #fecaca", fontSize: 10.5, color: "#991b1b", fontWeight: 600 }}>
                        ⚠ A3 still at large — Supplementary Chargesheet pending after arrest. Red Corner Notice active.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* ══════════════════ Tabs ══════════════════ */}
      <div id="case-stages" style={{ scrollMarginTop: 56, background: "#eef0f4", border: "1px solid #dde2ea", borderTop: "none", display: "flex", gap: 2, padding: "6px 12px", flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "4px 12px", fontSize: 11.5, fontWeight: 600, border: "1px solid transparent", borderRadius: 4, background: activeTab === t ? "#0f1f3d" : "transparent", cursor: "pointer", color: activeTab === t ? "#fff" : "#666" }}>
            {t}&nbsp;<span style={{ fontSize: 10, background: activeTab === t ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.08)", borderRadius: 10, padding: "1px 5px", marginLeft: 2 }}>{tabCounts[t]}</span>
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setExpanded(new Set(STAGES.map(s => s.id)))} style={{ fontSize: 10.5, color: "#1a56a8", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>Expand All</button>
          <button onClick={() => setExpanded(new Set())} style={{ fontSize: 10.5, color: "#888", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>Collapse All</button>
        </div>
      </div>

      {/* ══════════════════ Timeline / Case Diary ══════════════════ */}
      {activeTab === "Case Diary" ? <CaseDiaryTab /> : (
        <div style={{ background: "var(--color-background-primary,#fff)", border: "1px solid #dde2ea", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
          {grouped.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#aaa", fontSize: 13 }}>No stages in this category.</div>}
          {grouped.map(g => (
            <div key={g.phase}>
              <PhaseHeader phase={g.phase} stageCount={g.stages.length} />
              {g.stages.map((stage, i) => (
                <StageCard key={stage.id} stage={stage} isLast={i === g.stages.length - 1} isExpanded={expanded.has(stage.id)} onToggle={() => toggle(stage.id)} />
              ))}
            </div>
          ))}
        </div>
      )}

      </>)}

      {/* ── Bottom nav bar ── */}
      <div style={{ marginTop: 2, padding: "10px 18px", background: "#f8f9fb", border: "1px solid #dde2ea", borderTop: "none", borderRadius: "0 0 10px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { icon: "📋", label: "Overview", id: "case-overview" },
            { icon: "⏱", label: "Timeline",  id: "case-duration" },
            { icon: "👤", label: "Accused",   id: "case-accused"  },
            { icon: "📁", label: "Stages",    id: "case-stages"   },
          ].map(({ icon, label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ fontSize: 10.5, color: "#374151", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 11px", cursor: "pointer", fontWeight: 600 }}>
              {icon} {label}
            </button>
          ))}
        </div>
        <button onClick={closeFIR}
          style={{ fontSize: 11, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "6px 18px", cursor: "pointer", fontWeight: 700 }}>
          ⬆ Back to IO Register
        </button>
      </div>

      </>)}
    </div>
  );
}
