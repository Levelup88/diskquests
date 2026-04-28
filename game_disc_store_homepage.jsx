import React, { useMemo, useState } from "react";

const SATS_RATE_THB = 0.02;
const SERVICE_FEE_THB = 30;
const LIGHTNING_SERVICE_FEE_SATS = Math.round(SERVICE_FEE_THB / SATS_RATE_THB);
const NODE_PROVIDER = "BTCPay Server + LND";
const API_BASE_URL = "/api";
const ENABLE_DEMO_INVOICE_FALLBACK = true;

function thbToSats(thb) {
  return Math.round(Number(thb || 0) / SATS_RATE_THB);
}

function satsToThb(sats) {
  return Math.round(Number(sats || 0) * SATS_RATE_THB);
}

function formatSats(value) {
  return `${Math.round(Number(value || 0)).toLocaleString()} sats`;
}

function formatFee() {
  return `${SERVICE_FEE_THB} บาท / ดีล`;
}

function createItemCode(title, count) {
  const slug = String(title || "GAME")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");
  return `${slug}-${String(count + 1).padStart(3, "0")}`;
}

function getStatusTone(status) {
  const text = String(status || "");
  if (text.includes("รอ")) return "orange";
  if (text.includes("กำลัง")) return "blue";
  if (text.includes("ยกเลิก")) return "red";
  return "green";
}

function SvgIcon({ name, size = 22, strokeWidth = 2.4 }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    home: (
      <>
        <path {...common} d="M3 11.5 12 4l9 7.5" />
        <path {...common} d="M5.5 10.5V20h13v-9.5" />
        <path {...common} d="M9.5 20v-6h5v6" />
      </>
    ),
    zap: <path {...common} d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />,
    gamepad: (
      <>
        <path {...common} d="M7.5 9h9A5.5 5.5 0 0 1 22 14.5v1A3.5 3.5 0 0 1 18.5 19c-1.2 0-2.1-.6-2.8-1.5h-7.4A3.4 3.4 0 0 1 5.5 19 3.5 3.5 0 0 1 2 15.5v-1A5.5 5.5 0 0 1 7.5 9Z" />
        <path {...common} d="M7 14h4" />
        <path {...common} d="M9 12v4" />
        <path {...common} d="M16.5 13.5h.01" />
        <path {...common} d="M19 15.5h.01" />
      </>
    ),
    search: (
      <>
        <circle {...common} cx="10.5" cy="10.5" r="6.5" />
        <path {...common} d="m16 16 5 5" />
        <path {...common} d="m8.5 10.5 1.5 1.5 3-3" />
      </>
    ),
    coins: (
      <>
        <ellipse {...common} cx="12" cy="6" rx="7" ry="3" />
        <path {...common} d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path {...common} d="M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      </>
    ),
    user: (
      <>
        <circle {...common} cx="12" cy="8" r="4" />
        <path {...common} d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    chart: (
      <>
        <path {...common} d="M4 19V5" />
        <path {...common} d="M4 19h16" />
        <path {...common} d="M8 16v-5" />
        <path {...common} d="M12 16V8" />
        <path {...common} d="M16 16v-9" />
      </>
    ),
    message: (
      <>
        <path {...common} d="M4 5h16v11H8l-4 4V5Z" />
        <path {...common} d="M8 9h8" />
        <path {...common} d="M8 12h5" />
      </>
    ),
    settings: (
      <>
        <circle {...common} cx="12" cy="12" r="3" />
        <path {...common} d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v3.2h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
    help: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <path {...common} d="M9.5 9a2.7 2.7 0 0 1 5 1.4c0 2-2.5 2.2-2.5 4" />
        <path {...common} d="M12 18h.01" />
      </>
    ),
    bell: (
      <>
        <path {...common} d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path {...common} d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    checklist: (
      <>
        <path {...common} d="M9 5h11" />
        <path {...common} d="M9 12h11" />
        <path {...common} d="M9 19h11" />
        <path {...common} d="M4 5.5 5.2 7 7.5 4" />
        <path {...common} d="M4 12.5 5.2 14 7.5 11" />
        <path {...common} d="M4 19.5 5.2 21 7.5 18" />
      </>
    ),
    shield: (
      <>
        <path {...common} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path {...common} d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] || paths.gamepad}
    </svg>
  );
}

async function createLightningInvoice(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/btcpay/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`BTCPay API failed with status ${response.status}`);
    return await response.json();
  } catch (error) {
    if (!ENABLE_DEMO_INVOICE_FALLBACK) throw error;
    const invoiceId = `demo-ln-${Date.now()}`;
    return {
      invoiceId,
      status: "invoice_created",
      checkoutUrl: "#demo-btcpay-checkout",
      paymentRequest: `lnbc${payload.amountSats}n1pdiskquestdemo${String(invoiceId).replace(/[^a-z0-9]/gi, "").toLowerCase()}`,
      demo: true,
    };
  }
}

const initialItems = [
  {
    title: "God of War Ragnarök",
    platform: "PS5",
    type: "มือ 1",
    owner: "Narin P.",
    code: "GOWR-001",
    priceThb: 1890,
    priceSats: thbToSats(1890),
    lightningFeeSats: LIGHTNING_SERVICE_FEE_SATS,
    status: "รอตรวจสภาพ",
    grade: "A",
    date: "28 เม.ย. 2567",
    views: 428,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Elden Ring",
    platform: "PS4",
    type: "มือ 2",
    owner: "Beam S.",
    code: "ELDR-002",
    priceThb: 1290,
    priceSats: thbToSats(1290),
    lightningFeeSats: LIGHTNING_SERVICE_FEE_SATS,
    status: "กำลังตรวจสภาพ",
    grade: "B+",
    date: "28 เม.ย. 2567",
    views: 315,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Zelda Tears of the Kingdom",
    platform: "Switch",
    type: "มือ 1",
    owner: "Mild K.",
    code: "ZELD-003",
    priceThb: 1790,
    priceSats: thbToSats(1790),
    lightningFeeSats: LIGHTNING_SERVICE_FEE_SATS,
    status: "พร้อมขาย",
    grade: "Seal",
    date: "28 เม.ย. 2567",
    views: 612,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Marvel's Spider-Man 2",
    platform: "PS5",
    type: "มือ 2",
    owner: "Krit T.",
    code: "SPDR-004",
    priceThb: 1290,
    priceSats: thbToSats(1290),
    lightningFeeSats: LIGHTNING_SERVICE_FEE_SATS,
    status: "พร้อมขาย",
    grade: "A",
    date: "27 เม.ย. 2567",
    views: 790,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600&auto=format&fit=crop",
  },
];

const navItems = [
  { icon: "home", label: "หน้าหลัก" },
  { icon: "zap", label: "เปิดดีล Lightning" },
  { icon: "gamepad", label: "คลังดีล Lightning" },
  { icon: "search", label: "ตรวจสภาพ" },
  { icon: "coins", label: "การปล่อยเงิน" },
  { icon: "user", label: "ผู้ใช้บริการ" },
  { icon: "chart", label: "รายงาน" },
  { icon: "message", label: "ข้อความ", badge: 3 },
  { icon: "settings", label: "ตั้งค่า" },
  { icon: "help", label: "ช่วยเหลือ" },
];

const platformData = [
  { month: "ม.ค.", ps5: 36, sw: 22 },
  { month: "ก.พ.", ps5: 29, sw: 18 },
  { month: "มี.ค.", ps5: 42, sw: 30 },
  { month: "เม.ย.", ps5: 58, sw: 38 },
  { month: "พ.ค.", ps5: 40, sw: 26 },
  { month: "มิ.ย.", ps5: 45, sw: 31 },
  { month: "ก.ค.", ps5: 39, sw: 28 },
  { month: "ส.ค.", ps5: 52, sw: 35 },
  { month: "ก.ย.", ps5: 56, sw: 33 },
  { month: "ต.ค.", ps5: 44, sw: 29 },
  { month: "พ.ย.", ps5: 35, sw: 24 },
  { month: "ธ.ค.", ps5: 48, sw: 34 },
];

const releases = [
  { id: "DQ-LN-001", game: "Zelda TOTK", receiver: "Tan", sender: "Mild K.", invoiceSats: thbToSats(1790), releaseSats: thbToSats(1790) - LIGHTNING_SERVICE_FEE_SATS, status: "รอปล่อยเงิน" },
  { id: "DQ-LN-002", game: "Spider-Man 2", receiver: "Arm", sender: "Krit T.", invoiceSats: thbToSats(1290), releaseSats: thbToSats(1290) - LIGHTNING_SERVICE_FEE_SATS, status: "จัดส่งแล้ว" },
  { id: "DQ-LN-003", game: "God of War Ragnarök", receiver: "View", sender: "Narin P.", invoiceSats: thbToSats(1890), releaseSats: thbToSats(1890) - LIGHTNING_SERVICE_FEE_SATS, status: "ชำระแล้ว" },
];

const users = [
  { name: "Narin P.", tier: "Pro Trader", items: 12, completed: 8, releaseSats: thbToSats(18600) },
  { name: "Beam S.", tier: "Verified", items: 6, completed: 3, releaseSats: thbToSats(7400) },
  { name: "Mild K.", tier: "Collector", items: 9, completed: 7, releaseSats: thbToSats(12890) },
  { name: "Krit T.", tier: "New", items: 3, completed: 1, releaseSats: thbToSats(890) },
];

const colors = {
  green900: "#064E3B",
  green700: "#047857",
  green600: "#059669",
  green500: "#10B981",
  red500: "#F43F5E",
  orange: "#F59E0B",
  blue: "#3B82F6",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E7EBF0",
  bg: "#F3F6F5",
};

function runSelfTests() {
  console.assert(initialItems.length === 4, "Expected 4 initial Lightning exchange items");
  console.assert(platformData[3].ps5 === 58, "Expected April PS5 count to be 58");
  console.assert(releases[0].releaseSats === thbToSats(1790) - LIGHTNING_SERVICE_FEE_SATS, "Expected first release sats to subtract fee");
  console.assert(createItemCode("Elden Ring", 4) === "ELDE-005", "Expected generated code ELDE-005");
  console.assert(getStatusTone("รอตรวจสภาพ") === "orange", "Waiting status should be orange");
  console.assert(thbToSats(100) === 5000, "100 THB should equal 5,000 sats at mock rate");
  console.assert(satsToThb(5000) === 100, "5,000 sats should equal 100 THB at mock rate");
  console.assert(SERVICE_FEE_THB === 30, "Service fee should be 30 THB per deal");
  console.assert(LIGHTNING_SERVICE_FEE_SATS === 1500, "Lightning service fee should be 1,500 sats at mock rate");
  console.assert(formatSats(3500) === "3,500 sats", "Sats formatting should use separators");
  console.assert(formatFee() === "30 บาท / ดีล", "Fee text should be 30 baht per deal");
  console.assert(NODE_PROVIDER === "BTCPay Server + LND", "Node provider should be BTCPay Server + LND");
  console.assert(API_BASE_URL === "/api", "API base URL should target the backend API route");
  console.assert(Number.isFinite(thbToSats(1890)), "Converted sats should be numeric");
  console.assert(typeof navItems[0].icon === "string", "Navigation icons should be local SVG icon names, not external imports");
}

try {
  runSelfTests();
} catch (error) {
  console.warn("Self tests skipped", error);
}

const styles = {
  page: { minHeight: "100vh", color: colors.text, fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif", background: "linear-gradient(135deg, #F3F6F5 0%, #FFFFFF 42%, #EEF8F4 100%)" },
  appShell: { display: "grid", gridTemplateColumns: "292px minmax(0, 1fr)", minHeight: "100vh" },
  sidebar: { position: "sticky", top: 0, height: "100vh", overflowY: "auto", background: "radial-gradient(circle at 20% 0%, rgba(16,185,129,0.25), transparent 32%), linear-gradient(180deg, #064E3B 0%, #043527 100%)", color: "white", padding: 24, boxSizing: "border-box", display: "flex", flexDirection: "column" },
  brand: { display: "flex", alignItems: "center", gap: 12, marginBottom: 32 },
  logoMark: { width: 46, height: 46, borderRadius: "50%", background: "conic-gradient(from 0deg, #FFFFFF 0 22%, #10B981 22% 28%, #FFFFFF 28% 48%, #10B981 48% 54%, #FFFFFF 54% 74%, #10B981 74% 80%, #FFFFFF 80% 100%)", border: "3px solid rgba(255,255,255,0.35)", boxShadow: "0 14px 28px rgba(0,0,0,0.2)", flexShrink: 0 },
  navButton: { width: "100%", border: 0, background: "transparent", color: "rgba(255,255,255,0.86)", borderRadius: 14, padding: "13px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 800, cursor: "pointer", marginBottom: 7, fontSize: 15, textAlign: "left", transition: "transform 180ms ease, background 180ms ease, box-shadow 180ms ease, color 180ms ease" },
  navButtonActive: { background: "white", color: colors.green700, boxShadow: "0 16px 34px rgba(0,0,0,0.18)", transform: "translateX(6px)" },
  navButtonHover: { background: "rgba(255,255,255,0.12)", transform: "translateX(4px)", boxShadow: "0 10px 22px rgba(0,0,0,0.12)" },
  serviceCard: { marginTop: "auto", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", borderRadius: 18, padding: 18 },
  main: { minWidth: 0 },
  topbar: { minHeight: 92, background: "white", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "18px 38px", boxSizing: "border-box" },
  content: { padding: "30px 38px 38px" },
  card: { background: "white", border: `1px solid ${colors.border}`, borderRadius: 22, boxShadow: "0 14px 34px rgba(15, 23, 42, 0.07)" },
  h1: { margin: 0, fontSize: 22, fontWeight: 950, color: colors.text },
  subtitle: { margin: "4px 0 0", color: colors.muted, fontSize: 13, fontWeight: 600 },
  heroWelcome: { position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #064E3B 0%, #047857 62%, #10B981 100%)", borderRadius: 26, padding: 28, color: "white", boxShadow: "0 18px 42px rgba(4,120,87,0.22)", marginBottom: 22 },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22, marginBottom: 22 },
  dashboardGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 350px)", gap: 22 },
  chartCard: { background: "white", border: `1px solid ${colors.border}`, borderRadius: 22, padding: 24, boxShadow: "0 14px 34px rgba(15, 23, 42, 0.07)" },
  panelTitle: { margin: 0, fontSize: 18, fontWeight: 950, color: colors.text },
  chip: { border: `1px solid ${colors.border}`, borderRadius: 999, padding: "7px 11px", background: "white", color: colors.muted, fontSize: 12, fontWeight: 800 },
  primaryButton: { border: 0, borderRadius: 14, background: "linear-gradient(135deg, #10B981, #047857)", color: "white", padding: "13px 18px", fontWeight: 950, cursor: "pointer", boxShadow: "0 14px 28px rgba(4,120,87,0.22)" },
  fab: { position: "fixed", right: 34, bottom: 34, border: 0, borderRadius: 999, background: "linear-gradient(135deg, #10B981, #047857)", color: "white", padding: "15px 22px", display: "flex", alignItems: "center", gap: 10, fontWeight: 950, boxShadow: "0 18px 38px rgba(4,120,87,0.32)", cursor: "pointer" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 760 },
  tableCell: { padding: "15px 14px", borderBottom: `1px solid ${colors.border}`, color: colors.muted, textAlign: "left", verticalAlign: "middle" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 },
  input: { border: `1px solid ${colors.border}`, borderRadius: 12, padding: 13, outline: 0, fontSize: 14, boxSizing: "border-box", width: "100%" },
};

function IconBubble({ icon, active = false, tone = "green" }) {
  const color = tone === "red" ? colors.red500 : tone === "blue" ? colors.blue : colors.green600;
  return (
    <span style={{ width: 44, height: 44, borderRadius: 16, background: active ? "rgba(255,255,255,0.18)" : `${color}18`, color: active ? "white" : color, display: "grid", placeItems: "center", boxShadow: active ? "0 12px 24px rgba(0,0,0,0.16)" : "none" }}>
      <SvgIcon name={icon} size={22} strokeWidth={2.5} />
    </span>
  );
}

function StatusBadge({ children, tone = "green" }) {
  const palette = {
    green: { bg: "#DCFCE7", color: "#047857" },
    orange: { bg: "#FEF3C7", color: "#D97706" },
    blue: { bg: "#DBEAFE", color: "#2563EB" },
    red: { bg: "#FFE4E6", color: "#E11D48" },
  };
  const active = palette[tone] || palette.green;
  return <span style={{ borderRadius: 999, padding: "7px 12px", background: active.bg, color: active.color, fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>{children}</span>;
}

function EmptyState({ title, description = "ยังไม่มีข้อมูลสำหรับส่วนนี้" }) {
  return <div style={{ padding: 28, textAlign: "center", color: colors.muted }}><div style={{ fontSize: 30 }}>▢</div><strong style={{ color: colors.text }}>{title}</strong><p>{description}</p></div>;
}

function PageHeader({ activePage }) {
  return (
    <header style={styles.topbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <button type="button" aria-label="เปิดเมนู" style={{ border: 0, background: "transparent", fontSize: 25, cursor: "pointer", color: colors.text }}>☰</button>
        <div>
          <h1 style={styles.h1}>{activePage === "หน้าหลัก" ? "ยินดีต้อนรับกลับมา, Admin" : activePage}</h1>
          <p style={styles.subtitle}>Disk Quest ระบบแลกเปลี่ยนแผ่นเกมผ่าน BTC Lightning โดยใช้ BTCPay Server + LND Node ของร้านเอง</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 42, height: 42, borderRadius: 16, background: "#F8FAFC", display: "grid", placeItems: "center", color: colors.green700 }}><SvgIcon name="bell" size={21} strokeWidth={2.5} /><span style={{ position: "absolute", top: -8, right: -10, width: 20, height: 20, borderRadius: "50%", background: colors.red500, color: "white", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 900 }}>3</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: colors.green700, color: "white", display: "grid", placeItems: "center" }}><SvgIcon name="user" size={21} strokeWidth={2.6} /></div>
          <div><div style={{ fontWeight: 950 }}>Admin</div><div style={{ fontSize: 12, color: colors.muted }}>เจ้าของร้าน</div></div>
        </div>
      </div>
    </header>
  );
}

function SummaryCards({ items }) {
  const ready = items.filter((item) => item.status === "พร้อมขาย").length;
  const waiting = items.length - ready;
  const totalEscrowSats = items.reduce((sum, item) => sum + Number(item.priceSats || thbToSats(item.priceThb)), 0);
  const summary = [
    { label: "มูลค่า Lightning Escrow", value: formatSats(totalEscrowSats), helper: "มูลค่า invoice Lightning ในระบบ", tone: "green", icon: "zap" },
    { label: "เกมพร้อมแลก", value: `${ready} แผ่น`, helper: "พร้อมสร้าง invoice", tone: "green", icon: "gamepad" },
    { label: "รอตรวจสภาพ", value: `${waiting} แผ่น`, helper: "รอตรวจแผ่น / กล่อง", tone: "red", icon: "checklist" },
  ];
  return (
    <section style={styles.summaryGrid}>
      {summary.map((item, index) => {
        const featured = index === 0;
        const isRed = item.tone === "red";
        return (
          <div key={item.label} style={{ ...styles.card, padding: 24, border: featured ? "none" : `1px solid ${colors.border}`, background: featured ? "linear-gradient(135deg, #064E3B, #047857)" : "white", color: featured ? "white" : colors.text, position: "relative", overflow: "hidden" }}>
            {featured && <div style={{ position: "absolute", right: -24, top: -24, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />}
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
              <div>
                <div style={{ color: featured ? "rgba(255,255,255,0.78)" : colors.muted, fontSize: 14, fontWeight: 850 }}>{item.label}</div>
                <div style={{ marginTop: 12, fontSize: 31, fontWeight: 950, color: featured ? "white" : isRed ? colors.red500 : colors.green600 }}>{item.value}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 850, color: featured ? "rgba(255,255,255,0.82)" : isRed ? colors.red500 : colors.green600 }}>{item.helper}</div>
              </div>
              <IconBubble icon={item.icon} active={featured} tone={isRed ? "red" : "green"} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function HeroWelcome({ setActivePage }) {
  return (
    <section style={styles.heroWelcome}>
      <div style={{ position: "absolute", right: -36, top: -42, width: 230, height: 230, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", right: 72, bottom: -70, width: 180, height: 180, borderRadius: "50%", border: "28px solid rgba(255,255,255,0.10)" }} />
      <div style={{ position: "relative", zIndex: 2, marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg, #F43F5E, #DC2626)", padding: "10px 16px", borderRadius: 999, fontWeight: 950, fontSize: 14, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}>🚨 การันตี: โดนโกง = ร้านคืนเงิน 100%</div>
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(255,255,255,0.14)", fontSize: 12, fontWeight: 900, marginBottom: 14 }}><SvgIcon name="zap" size={15} /> DISK QUEST LIGHTNING NODE</div>
          <h2 style={{ margin: 0, fontSize: 36, lineHeight: 1.08, letterSpacing: -1.2 }}>แลกเปลี่ยนแผ่นเกมมือ 1 / มือ 2 ผ่าน BTC Lightning</h2>
          <div style={{ marginTop: 14, fontSize: 20, fontWeight: 900, color: "#FDE68A" }}>✔ ปลอดภัย 100% • มีคนกลาง • ไม่มีโกง</div>
          <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.82)", maxWidth: 680, lineHeight: 1.7 }}>ผู้รับแผ่นจ่าย Lightning Invoice ผ่าน BTCPay Server เงินเข้า LND Node ของร้านก่อน ผู้ส่งแผ่นเกมจัดส่งสินค้า หลังยืนยันรับสินค้า ร้านจึงปล่อยเงินให้ผู้ส่งแผ่น พร้อมค่าบริการ {formatFee()} ต่อรายการ</p>
        </div>
        <button type="button" style={{ border: 0, borderRadius: 16, padding: "15px 20px", background: "white", color: colors.green700, fontWeight: 950, cursor: "pointer", boxShadow: "0 14px 30px rgba(0,0,0,0.16)" }} onClick={() => setActivePage("เปิดดีล Lightning")}>+ เปิดดีล Lightning ใหม่</button>
      </div>
    </section>
  );
}

function PlatformChart() {
  const max = 70;
  return (
    <div style={styles.chartCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12 }}>
        <h2 style={styles.panelTitle}>▦ จำนวนดีล Lightning แยกตามแพลตฟอร์ม</h2>
        <button type="button" style={styles.chip}>ปีนี้ ⌄</button>
      </div>
      <div style={{ height: 300, display: "grid", gridTemplateColumns: "58px 1fr", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", color: colors.muted, fontSize: 13, textAlign: "right", paddingRight: 8 }}>
          {[70, 60, 50, 40, 30, 20, 10, 0].map((v) => <span key={v}>{v}</span>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${platformData.length}, 1fr)`, alignItems: "end", gap: 13, borderLeft: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, background: "repeating-linear-gradient(to bottom, transparent 0, transparent 42px, #EAEFF4 43px)", overflow: "hidden" }}>
          {platformData.map((item) => (
            <div key={item.month} style={{ display: "flex", alignItems: "end", justifyContent: "center", gap: 5, height: "100%" }}>
              <div title="PS5" style={{ width: 16, height: `${(item.ps5 / max) * 100}%`, background: colors.green500, borderRadius: "5px 5px 0 0" }} />
              <div title="Switch" style={{ width: 16, height: `${(item.sw / max) * 100}%`, background: colors.red500, borderRadius: "5px 5px 0 0" }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `58px repeat(${platformData.length}, 1fr)`, gap: 10, marginTop: 10, color: colors.muted, fontSize: 13, textAlign: "center" }}>
        <span />{platformData.map((m) => <span key={m.month}>{m.month}</span>)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 18, color: colors.muted, fontWeight: 800, fontSize: 13, flexWrap: "wrap" }}>
        <span><b style={{ display: "inline-block", width: 44, height: 12, background: colors.green500, borderRadius: 3, marginRight: 8 }} />PS5</span>
        <span><b style={{ display: "inline-block", width: 44, height: 12, background: colors.red500, borderRadius: 3, marginRight: 8 }} />Nintendo Switch</span>
      </div>
    </div>
  );
}

function RecentItems({ items }) {
  return (
    <div style={{ ...styles.card, padding: 24, marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <h2 style={styles.panelTitle}>ดีล Lightning ล่าสุด</h2>
        <button type="button" style={{ border: 0, background: "transparent", color: colors.green700, fontWeight: 900, cursor: "pointer" }}>ดูทั้งหมด</button>
      </div>
      {items.length === 0 ? <EmptyState title="ยังไม่มีดีล Lightning" /> : items.map((item) => (
        <div key={item.code} style={{ display: "grid", gridTemplateColumns: "54px 1fr auto", gap: 14, alignItems: "center", padding: "13px 0", borderTop: `1px solid ${colors.border}` }}>
          <img src={item.image} alt={item.title} style={{ width: 54, height: 60, borderRadius: 8, objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 950, color: colors.text }}>{item.title} ({item.platform})</div>
            <div style={{ color: colors.muted, fontSize: 13, marginTop: 3 }}>รหัสสินค้า: {item.code} • {formatSats(item.priceSats)}</div>
            <div style={{ color: colors.muted, fontSize: 13 }}>วันที่เปิดดีล: {item.date}</div>
          </div>
          <StatusBadge tone={getStatusTone(item.status)}>{item.status}</StatusBadge>
        </div>
      ))}
    </div>
  );
}

function TodayOverview({ items }) {
  const ready = items.filter((item) => item.status === "พร้อมขาย").length;
  const waiting = items.length - ready;
  const rows = [
    ["gamepad", "เกมพร้อมแลก", `${ready} แผ่น`, "green"],
    ["zap", "ดีล Lightning ใหม่", "8 ดีล", "green"],
    ["checklist", "รอตรวจสภาพ", `${waiting} แผ่น`, "orange"],
    ["coins", "ค่าบริการ Node", formatFee(), "red"],
  ];
  return (
    <div style={{ ...styles.card, padding: 24 }}>
      <h2 style={styles.panelTitle}>ภาพรวมเกมวันนี้</h2>
      <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
        {rows.map(([icon, label, value, tone]) => {
          const color = tone === "red" ? colors.red500 : tone === "orange" ? colors.orange : colors.green500;
          return <div key={label} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, alignItems: "center" }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: `${color}18`, color, display: "grid", placeItems: "center", fontWeight: 950, fontSize: 20 }}><SvgIcon name={icon} size={21} /></div><div style={{ fontWeight: 900 }}>{label}</div><div style={{ fontWeight: 950 }}>{value}</div></div>;
        })}
      </div>
    </div>
  );
}

function TrendingPanel({ items }) {
  const topItem = [...items].sort((a, b) => b.views - a.views)[0];
  return (
    <div style={{ ...styles.card, padding: 22, marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><h2 style={styles.panelTitle}>เกมเข้าชมสูงสุด</h2><button type="button" style={{ border: 0, background: "transparent", color: colors.green700, fontWeight: 900 }}>ดูทั้งหมด</button></div>
      <div style={{ color: colors.green700, fontSize: 25, fontWeight: 950, marginTop: 12 }}>{topItem ? topItem.title : "ยังไม่มีข้อมูล"}</div>
      <svg viewBox="0 0 100 54" style={{ width: "100%", height: 150, marginTop: 10, overflow: "visible" }} role="img" aria-label="กราฟแนวโน้มการเข้าชม">
        <defs><linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#10B981" stopOpacity="0.28" /><stop offset="1" stopColor="#10B981" stopOpacity="0" /></linearGradient></defs>
        <polyline points="0,54 0,42 14,28 28,32 42,24 56,14 70,22 84,9 100,18 100,54" fill="url(#trendGradient)" stroke="none" />
        <polyline points="0,42 14,28 28,32 42,24 56,14 70,22 84,9 100,18" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ContactPanel() {
  return <div style={{ ...styles.card, padding: 22, marginTop: 18 }}><h2 style={styles.panelTitle}>ช่องทางการติดต่อ</h2><div style={{ display: "grid", gap: 14, marginTop: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: colors.green600, fontWeight: 950 }}>LINE</span><span style={{ color: colors.muted }}>@diskquest ›</span></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: colors.blue, fontWeight: 950 }}>Lightning</span><span style={{ color: colors.muted }}>BTCPay + LND ›</span></div></div></div>;
}

function DashboardPage({ setActivePage, items }) {
  return (
    <>
      <HeroWelcome setActivePage={setActivePage} />
      <SummaryCards items={items} />
      <div style={styles.dashboardGrid}>
        <div>
          <PlatformChart />
          <RecentItems items={items} />
        </div>
        <div>
          <TodayOverview items={items} />
          <TrendingPanel items={items} />
          <ContactPanel />
        </div>
      </div>
      <button type="button" style={styles.fab} onClick={() => setActivePage("เปิดดีล Lightning")}>ดีล Lightning ใหม่ <span style={{ fontSize: 24, lineHeight: 1 }}>+</span></button>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "grid", gap: 7, fontWeight: 850 }}>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder || label} type={type} style={styles.input} />
    </label>
  );
}

function DepositPage({ onAddItem }) {
  const [form, setForm] = useState({ title: "", platform: "", type: "", price: "", owner: "", phone: "" });
  const [message, setMessage] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const required = [form.title, form.platform, form.type, form.price, form.owner];
    if (required.some((value) => !String(value).trim())) {
      setMessage("กรุณากรอกข้อมูลให้ครบก่อนสร้าง Lightning Invoice");
      return;
    }
    const numericSats = Number(String(form.price).replace(/,/g, ""));
    if (!Number.isFinite(numericSats) || numericSats <= 0) {
      setMessage("กรุณากรอกจำนวน sats เป็นตัวเลขที่ถูกต้อง");
      return;
    }
    setIsSubmitting(true);
    setMessage("กำลังสร้าง Lightning Invoice ผ่าน BTCPay Server...");
    try {
      const createdInvoice = await createLightningInvoice({
        amountSats: Math.round(numericSats),
        title: form.title.trim(),
        platform: form.platform.trim(),
        owner: form.owner.trim(),
        serviceFeeThb: SERVICE_FEE_THB,
        serviceFeeSats: LIGHTNING_SERVICE_FEE_SATS,
      });
      setInvoice(createdInvoice);
      onAddItem({ ...form, priceSats: Math.round(numericSats), invoice: createdInvoice });
      setMessage(createdInvoice.demo ? "สร้าง Demo Invoice แล้ว — ต่อ backend จริงที่ /api/btcpay/invoices" : "สร้าง Lightning Invoice สำเร็จแล้ว");
      setForm({ title: "", platform: "", type: "", price: "", owner: "", phone: "" });
    } catch (error) {
      setMessage(`สร้าง invoice ไม่สำเร็จ: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...styles.card, padding: 28 }}>
      <h2 style={{ marginTop: 0, fontSize: 30 }}>เปิดดีล Lightning Invoice</h2>
      <p style={{ color: colors.muted, lineHeight: 1.8 }}>ฟอร์มเปิดดีลแลกเปลี่ยนแผ่นเกมผ่าน BTC Lightning ระบบจะเรียก backend <strong>/api/btcpay/invoices</strong> เพื่อสร้าง invoice จาก BTCPay Server และตรวจสถานะจ่ายเงินจาก LND Node ของร้าน</p>
      <div style={styles.formGrid}>
        <Field label="ชื่อเกม" value={form.title} onChange={(value) => update("title", value)} placeholder="เช่น God of War Ragnarök" />
        <Field label="แพลตฟอร์ม" value={form.platform} onChange={(value) => update("platform", value)} placeholder="PS5 / PS4 / Switch / Xbox" />
        <Field label="ประเภทสินค้า" value={form.type} onChange={(value) => update("type", value)} placeholder="มือ 1 / มือ 2" />
        <Field label="มูลค่าที่ต้องการรับ (sats)" value={form.price} onChange={(value) => update("price", value)} placeholder="50000" type="text" />
        <Field label="ชื่อผู้ใช้บริการ" value={form.owner} onChange={(value) => update("owner", value)} placeholder="ชื่อผู้ส่งแผ่น / ผู้เปิดดีล" />
        <Field label="เบอร์ติดต่อ" value={form.phone} onChange={(value) => update("phone", value)} placeholder="095-123-4567" />
      </div>
      {message && <div style={{ marginTop: 16, color: message.includes("ไม่สำเร็จ") ? colors.red500 : colors.green700, fontWeight: 900 }}>{message}</div>}
      {invoice && (
        <div style={{ marginTop: 18, border: `1px solid ${colors.border}`, borderRadius: 18, padding: 18, background: "#F8FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <strong>Lightning Invoice</strong>
              <div style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Invoice ID: {invoice.invoiceId}</div>
            </div>
            <StatusBadge tone="blue">{invoice.demo ? "Demo Mode" : "BTCPay"}</StatusBadge>
          </div>
          <textarea readOnly value={invoice.paymentRequest || ""} style={{ ...styles.input, minHeight: 92, marginTop: 14, fontFamily: "monospace", resize: "vertical" }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <a href={invoice.checkoutUrl || "#"} style={{ ...styles.primaryButton, textDecoration: "none", display: "inline-flex" }}>เปิดหน้า Checkout</a>
            <span style={{ ...styles.chip, display: "inline-flex", alignItems: "center" }}>ค่าบริการ {formatFee()}</span>
          </div>
        </div>
      )}
      <button disabled={isSubmitting} type="submit" style={{ ...styles.primaryButton, marginTop: 20, opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? "กำลังสร้าง Invoice..." : "สร้าง Lightning Invoice +"}</button>
    </form>
  );
}

function InventoryPage({ items }) {
  return <div style={{ ...styles.card, padding: 24 }}><h2 style={{ marginTop: 0, fontSize: 30 }}>คลังดีล Lightning</h2>{items.length === 0 ? <EmptyState title="ยังไม่มีดีล Lightning" /> : items.map((item) => <div key={item.code} style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 130px", gap: 14, alignItems: "center", padding: 14, border: `1px solid ${colors.border}`, borderRadius: 14, marginTop: 12 }}><img src={item.image} alt={item.title} style={{ width: 64, height: 70, borderRadius: 10, objectFit: "cover" }} /><div><div style={{ fontWeight: 950 }}>{item.title}</div><div style={{ color: colors.muted, fontSize: 13 }}>{item.code} • {item.platform} • {item.owner}</div></div><div style={{ fontWeight: 950, color: colors.green700 }}>{formatSats(item.priceSats)}</div><StatusBadge tone={getStatusTone(item.status)}>{item.status}</StatusBadge></div>)}</div>;
}

function InspectionPage({ items }) {
  const pending = items.filter((item) => item.status !== "พร้อมขาย");
  return <div style={{ ...styles.card, padding: 24 }}><h2 style={{ marginTop: 0, fontSize: 30 }}>ตรวจสภาพ</h2>{pending.length === 0 ? <EmptyState title="ไม่มีรายการรอตรวจสภาพ" /> : pending.map((item) => <div key={item.code} style={{ padding: 16, border: `1px solid ${colors.border}`, borderRadius: 16, marginTop: 14 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><strong>{item.title}</strong><StatusBadge tone={getStatusTone(item.status)}>{item.status}</StatusBadge></div><div style={{ color: colors.muted, marginTop: 8 }}>{item.platform} • Grade {item.grade} • {item.owner}</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>{["ตรวจรอยแผ่น", "ทดสอบอ่านแผ่น", "เช็คกล่อง", "ตรวจโซนเกม"].map((check) => <span key={check} style={styles.chip}>☑ {check}</span>)}</div></div>)}</div>;
}

function ReleasesPage() {
  return <div style={{ ...styles.card, padding: 24 }}><h2 style={{ marginTop: 0, fontSize: 30 }}>ดีล Lightning และการปล่อยเงิน</h2><div style={styles.tableWrap}><table style={styles.table}><thead><tr>{["Deal ID", "เกม", "ผู้รับแผ่น", "ผู้ส่งแผ่น", "Invoice", "ยอดปล่อยเงิน", "สถานะ"].map((h) => <th key={h} style={{ ...styles.tableCell, color: colors.green700, fontWeight: 950 }}>{h}</th>)}</tr></thead><tbody>{releases.map((s) => <tr key={s.id}><td style={styles.tableCell}>{s.id}</td><td style={styles.tableCell}>{s.game}</td><td style={styles.tableCell}>{s.receiver}</td><td style={styles.tableCell}>{s.sender}</td><td style={styles.tableCell}>{formatSats(s.invoiceSats)}</td><td style={{ ...styles.tableCell, color: colors.green700, fontWeight: 950 }}>{formatSats(s.releaseSats)}</td><td style={styles.tableCell}><StatusBadge tone={getStatusTone(s.status)}>{s.status}</StatusBadge></td></tr>)}</tbody></table></div></div>;
}

function UsersPage() {
  return <div style={styles.summaryGrid}>{users.map((s) => <div key={s.name} style={{ ...styles.card, padding: 24 }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: "#DCFCE7", color: colors.green700, display: "grid", placeItems: "center", fontWeight: 950 }}><SvgIcon name="user" size={22} /></div><h3 style={{ fontSize: 23, marginBottom: 4 }}>{s.name}</h3><StatusBadge>{s.tier}</StatusBadge><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}><div style={styles.chip}>ดีล {s.items}</div><div style={styles.chip}>สำเร็จ {s.completed}</div></div><div style={{ marginTop: 16, color: colors.green700, fontSize: 25, fontWeight: 950 }}>{formatSats(s.releaseSats)}</div></div>)}</div>;
}

function ReportsPage({ items }) {
  return <><SummaryCards items={items} /><div style={styles.dashboardGrid}><PlatformChart /><div style={{ ...styles.card, padding: 24 }}><h2 style={styles.panelTitle}>รายงานสรุป</h2>{["PS5 เป็นแพลตฟอร์มที่มีดีล Lightning สูงสุด", "Nintendo Switch มียอดเข้าชมเติบโตต่อเนื่อง", "เกมมือ 2 เกรด A แลกเปลี่ยนเร็วที่สุด", "ร้านใช้ BTCPay Server เชื่อม LND Node ของตัวเองเพื่อสร้าง invoice และตรวจสถานะการชำระเงิน"].map((x) => <p key={x} style={{ color: colors.muted, lineHeight: 1.7 }}>• {x}</p>)}</div></div></>;
}

function MessagesPage() {
  return <div style={{ ...styles.card, padding: 24 }}><h2 style={{ marginTop: 0, fontSize: 30 }}>ข้อความ</h2>{[["Beam S.", "สอบถามสถานะตรวจสภาพ Spider-Man 2", "ใหม่"], ["Mild K.", "แจ้ง Lightning Address / Invoice สำหรับรับเงิน", "รอตอบ"], ["Tan", "สนใจซื้อ Zelda ขอรูปเพิ่ม", "ใหม่"]].map(([name, text, status]) => <div key={text} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 14, alignItems: "center", padding: 16, borderTop: `1px solid ${colors.border}` }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: colors.green700, color: "white", display: "grid", placeItems: "center" }}><SvgIcon name="message" size={20} /></div><div><strong>{name}</strong><div style={{ color: colors.muted }}>{text}</div></div><StatusBadge tone={status === "ใหม่" ? "green" : "orange"}>{status}</StatusBadge></div>)}</div>;
}

function SettingsPage() {
  const settingCards = [["ค่าบริการ Node", `คิดค่าบริการ ${formatFee()} ต่อดีล`], ["Payment Stack", `${NODE_PROVIDER} สำหรับสร้าง invoice และติดตาม payment settled`], ["การปล่อยเงิน", "ปล่อยเงินให้ผู้ส่งแผ่นหลังผู้รับแผ่นยืนยันรับสินค้าเรียบร้อย"]];
  return <div style={styles.summaryGrid}>{settingCards.map(([title, desc]) => <div key={title} style={{ ...styles.card, padding: 24 }}><h3 style={{ marginTop: 0, fontSize: 24 }}>{title}</h3><p style={{ color: colors.muted, lineHeight: 1.7 }}>{desc}</p><button type="button" style={styles.chip}>แก้ไข</button></div>)}</div>;
}

function HelpPage() {
  return <div style={{ ...styles.card, padding: 28 }}><h2 style={{ marginTop: 0, fontSize: 30 }}>ช่วยเหลือ</h2>{["วิธีเปิดดีลและจ่ายผ่าน BTC Lightning", `ค่าบริการ ${formatFee()}`, "มาตรฐานการตรวจสภาพ", "ขั้นตอนการปล่อยเงินหลังยืนยันรับแผ่นเกม", "ติดต่อทีมงาน Disk Quest"].map((x) => <div key={x} style={{ padding: 16, borderTop: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 850 }}>{x}</span><span style={{ color: colors.muted }}>›</span></div>)}</div>;
}

export default function DiskQuestApp() {
  const [activePage, setActivePage] = useState("หน้าหลัก");
  const [items, setItems] = useState(initialItems);
  const [hoveredNav, setHoveredNav] = useState(null);

  const handleAddItem = (form) => {
    const priceSats = Number(form.priceSats || form.price || 0);
    const item = {
      title: form.title.trim(),
      platform: form.platform.trim(),
      type: form.type.trim(),
      owner: form.owner.trim(),
      code: createItemCode(form.title, items.length),
      priceThb: satsToThb(priceSats),
      priceSats,
      lightningFeeThb: SERVICE_FEE_THB,
      lightningFeeSats: LIGHTNING_SERVICE_FEE_SATS,
      status: form.invoice?.demo ? "รอชำระ invoice demo" : "รอชำระ invoice",
      invoiceId: form.invoice?.invoiceId || "",
      paymentRequest: form.invoice?.paymentRequest || "",
      checkoutUrl: form.invoice?.checkoutUrl || "",
      grade: "รอตรวจ",
      date: new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" }),
      views: 0,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop",
    };
    setItems((prev) => [item, ...prev]);
    setActivePage("คลังดีล Lightning");
  };

  const page = useMemo(() => {
    if (activePage === "หน้าหลัก") return <DashboardPage setActivePage={setActivePage} items={items} />;
    if (activePage === "เปิดดีล Lightning") return <DepositPage onAddItem={handleAddItem} />;
    if (activePage === "คลังดีล Lightning") return <InventoryPage items={items} />;
    if (activePage === "ตรวจสภาพ") return <InspectionPage items={items} />;
    if (activePage === "การปล่อยเงิน") return <ReleasesPage />;
    if (activePage === "ผู้ใช้บริการ") return <UsersPage />;
    if (activePage === "รายงาน") return <ReportsPage items={items} />;
    if (activePage === "ข้อความ") return <MessagesPage />;
    if (activePage === "ตั้งค่า") return <SettingsPage />;
    return <HelpPage />;
  }, [activePage, items]);

  return (
    <div style={styles.page}>
      <div style={styles.appShell}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.logoMark} />
            <div><div style={{ fontSize: 25, fontWeight: 950, letterSpacing: -1 }}>DISK QUEST</div><div style={{ fontSize: 11, letterSpacing: 1.1, fontWeight: 800, opacity: 0.82 }}>BTC LIGHTNING GAME EXCHANGE</div></div>
          </div>
          <nav>
            {navItems.map((item) => {
              const active = activePage === item.label;
              const hovered = hoveredNav === item.label;
              return (
                <button
                  type="button"
                  key={item.label}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                  onClick={() => setActivePage(item.label)}
                  style={{ ...styles.navButton, ...(hovered && !active ? styles.navButtonHover : {}), ...(active ? styles.navButtonActive : {}) }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 10, background: active ? "rgba(4,120,87,0.10)" : hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", transition: "transform 180ms ease, background 180ms ease", transform: hovered ? "scale(1.08) rotate(-2deg)" : "scale(1)" }}>
                      <SvgIcon name={item.icon} size={19} strokeWidth={2.5} />
                    </span>
                    {item.label}
                  </span>
                  {item.badge && <span style={{ width: 25, height: 25, borderRadius: "50%", background: colors.red500, display: "grid", placeItems: "center", color: "white", fontSize: 12 }}>{item.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div style={styles.serviceCard}>
            <div style={{ marginBottom: 10 }}><IconBubble icon="gamepad" active /></div>
            <h3 style={{ margin: "0 0 14px", fontSize: 18 }}>บริการของเรา</h3>
            {["แลกแผ่นเกมผ่าน Lightning", "BTCPay + LND Node ของร้าน", "🚨 โดนโกง = ร้านคืนเงิน", "ทีมงานมืออาชีพ"].map((text) => <div key={text} style={{ display: "flex", gap: 10, alignItems: "center", margin: "12px 0", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}><span>✓</span>{text}</div>)}
            <button type="button" style={{ marginTop: 12, width: "100%", border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "white", borderRadius: 12, padding: "11px 14px", fontWeight: 900, cursor: "pointer" }}>ดูรายละเอียด</button>
          </div>
        </aside>
        <main style={styles.main}>
          <PageHeader activePage={activePage} />
          <div style={styles.content}>{page}</div>
          <footer style={{ padding: "0 38px 22px", display: "flex", justifyContent: "space-between", color: colors.muted, fontSize: 12, gap: 12, flexWrap: "wrap" }}><span>© 2024 Disk Quest. All rights reserved.</span><span>เวอร์ชั่น 1.0.0</span></footer>
        </main>
      </div>
    </div>
  );
}
