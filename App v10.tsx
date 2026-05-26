import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS  — cleaner, tool-feel palette
// white bg, dark ink, accent = slate-blue, status = R/Y/G only
// ─────────────────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Design tokens ── */
:root {
  /* surfaces */
  --bg:        #F5F5F3;
  --surface:   #FFFFFF;
  --surface2:  #F9F9F8;
  --border:    #E6E6E2;
  --border2:   #D4D4CE;

  /* type */
  --text:      #141412;
  --text2:     #4A4A46;
  --muted:     #8C8C86;
  --faint:     #C4C4BC;

  /* status */
  --red:       #C94035;
  --red-bg:    #FEF2F1;
  --red-border:#F5C9C6;
  --yellow:    #B88A20;
  --yellow-bg: #FEF9EE;
  --yellow-border:#EDD9A0;
  --green:     #2E7050;
  --green-bg:  #EEF7F2;
  --green-border:#A8D8BC;

  /* accent */
  --accent:    #3755A3;
  --accent-dim:#4E6DB8;
  --accent-lt: #EDF0FA;
  --accent-border:#B8C4E8;

  /* type scale */
  --sans: 'Inter', system-ui, sans-serif;

  /* radii */
  --r-sm:  8px;
  --r-md:  12px;
  --r-lg:  16px;

  /* elevation */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
}

body {
  background: #E8E8E4;
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Phone shell ── */
.shell {
  width: 390px;
  height: 844px;
  background: var(--bg);
  border-radius: 48px;
  box-shadow: 0 48px 96px rgba(0,0,0,.24), 0 0 0 1px rgba(0,0,0,.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── Screen scroll ── */
.screen { flex: 1; overflow-y: auto; overflow-x: hidden; }
.screen::-webkit-scrollbar { display: none; }
.screen-pad { padding-bottom: 20px; }

/* ── Bottom nav ── */
.bnav {
  display: flex;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 10px 0 24px;
  flex-shrink: 0;
}
.bnav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 0;
  font-family: var(--sans);
  transition: opacity .12s;
}
.bnav-icon  { font-size: 19px; opacity: .35; transition: opacity .12s; }
.bnav-label { font-size: 9px; letter-spacing: .05em; color: var(--muted); text-transform: uppercase; font-weight: 600; }
.bnav-btn.active .bnav-icon  { opacity: 1; }
.bnav-btn.active .bnav-label { color: var(--accent); }

/* ── Page header ── */
.ph {
  padding: 20px 20px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
}
.ph-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -.02em;
  color: var(--text);
}
.ph-sub {
  font-size: 12px;
  color: var(--muted);
  font-weight: 400;
  margin-top: 1px;
}
.ph-action {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: none;
  font-family: var(--sans);
  padding: 6px 12px;
  border-radius: var(--r-sm);
  transition: background .1s;
}
.ph-action:active { background: var(--accent-lt); }

/* ── Status square ── */
.sq {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  flex-shrink: 0;
}
.sq.red    { background: var(--red); }
.sq.yellow { background: var(--yellow); }
.sq.green  { background: var(--green); }
.sq.faint  { background: var(--faint); }

/* ── CARD ROW — replaces flat list-row ── */
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 6px 16px 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: box-shadow .15s, border-color .15s;
  min-height: 56px;
}
.list-row:active {
  box-shadow: none;
  border-color: var(--accent-border);
  background: var(--accent-lt);
}

.row-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; }
.row-nick { font-size: 14px; font-weight: 600; white-space: nowrap; color: var(--text); }
.row-date { font-size: 11px; color: var(--muted); white-space: nowrap; margin-left: auto; }
.row-method {
  font-size: 10px;
  font-weight: 600;
  color: var(--text2);
  background: var(--surface2);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: .01em;
}
.row-actions { display: flex; gap: 6px; flex-shrink: 0; }

/* ── Level tag ── */
.ltag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  letter-spacing: .02em;
  flex-shrink: 0;
}
.ltag-A { background: var(--red-bg);    color: var(--red);    border: 1px solid var(--red-border); }
.ltag-B { background: var(--accent-lt); color: var(--accent); border: 1px solid var(--accent-border); }
.ltag-C { background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-border); }
.ltag-E { background: var(--red-bg);    color: var(--red);    border: 1px solid var(--red-border); }

/* ── Section label ── */
.sec-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 16px 20px 6px;
}

/* ── Buttons: 3-tier system ── */

/* PRIMARY — confirm / save actions only */
.act-btn {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--sans);
  padding: 6px 14px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border2);
  background: var(--surface);
  color: var(--text2);
  cursor: pointer;
  white-space: nowrap;
  transition: all .12s;
  letter-spacing: .01em;
}
.act-btn:active { background: var(--surface2); transform: scale(.98); }
.act-btn:disabled { opacity: .3; cursor: default; }

/* PRIMARY variant */
.act-btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 1px 4px rgba(55,85,163,.3);
}
.act-btn.primary:active { background: var(--accent-dim); box-shadow: none; }

/* GHOST/DANGER variant */
.act-btn.danger {
  color: var(--red);
  border-color: var(--red-border);
  background: var(--red-bg);
}
.act-btn.danger:active { opacity: .8; }

/* ── Detail screen ── */
.det-header {
  padding: 16px 20px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.det-back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  cursor: pointer;
  color: var(--accent);
  font-family: var(--sans);
  flex-shrink: 0;
  transition: background .1s;
}
.det-back:active { background: var(--accent-lt); }
.det-nick { font-size: 16px; font-weight: 700; letter-spacing: -.01em; }
.det-id   { font-size: 11px; color: var(--muted); margin-top: 2px; letter-spacing: .02em; }

/* detail info grid — card style */
.det-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg);
}
.det-cell {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 12px 14px;
  box-shadow: var(--shadow-sm);
}
.det-cell.full { grid-column: 1 / -1; }
.det-clabel {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--muted);
  margin-bottom: 4px;
}
.det-cval { font-size: 14px; font-weight: 600; }

.det-actions {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg);
  border-top: 1px solid var(--border);
}
.det-actions .act-btn {
  flex: 1;
  padding: 11px 0;
  text-align: center;
  border-radius: var(--r-md);
  font-size: 13px;
  font-weight: 600;
}

/* log timeline */
.log-item {
  display: flex;
  gap: 12px;
  padding: 11px 16px;
  margin: 0 16px 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}
.log-bar { width: 2px; background: var(--border2); border-radius: 1px; flex-shrink: 0; margin: 2px 0; }
.log-body { flex: 1; }
.log-date { font-size: 11px; color: var(--muted); margin-bottom: 3px; font-weight: 500; }
.log-tag  {
  display: inline-block;
  font-size: 10px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text2);
  margin-bottom: 4px;
  letter-spacing: .02em;
}
.log-note { font-size: 13px; color: var(--text); line-height: 1.45; }

/* ── Calendar ── */
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.cal-month { font-size: 16px; font-weight: 700; letter-spacing: -.01em; }
.cal-arrow {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--surface2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  color: var(--text2);
  font-family: var(--sans);
  transition: background .1s;
}
.cal-arrow:active { background: var(--accent-lt); }

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.cal-dow {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 10px 0 7px;
}
.cal-cell {
  min-height: 46px;
  padding: 6px 4px 4px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  transition: background .1s;
}
.cal-cell:nth-child(7n) { border-right: none; }
.cal-cell:active { background: var(--accent-lt); }
.cal-cell.empty  { cursor: default; background: var(--bg); }
.cal-cell.today-cell .cal-num {
  background: var(--accent);
  color: #fff;
  border-radius: 50%;
  width: 24px; height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.cal-cell.selected-cell { background: var(--accent-lt); }
.cal-num  { font-size: 12px; font-weight: 500; line-height: 24px; }
.cal-dots { display: flex; gap: 2px; justify-content: center; }
.cal-dot  { width: 5px; height: 5px; border-radius: 1px; }

.day-panel { padding: 14px 16px; }
.day-panel-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}
.day-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  margin-bottom: 6px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: border-color .12s;
}
.day-item:active { border-color: var(--accent-border); background: var(--accent-lt); }
.day-time { font-size: 12px; color: var(--muted); width: 38px; flex-shrink: 0; font-weight: 500; }
.day-nick { font-size: 13px; font-weight: 600; }
.day-meth { font-size: 11px; color: var(--muted); margin-left: auto; flex-shrink: 0; }

/* ── Settings ── */
.set-group {
  margin: 0 16px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.set-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  min-height: 52px;
  transition: background .1s;
}
.set-row:last-child { border-bottom: none; }
.set-row[style*="cursor:pointer"]:active,
.set-row[style*="cursor: pointer"]:active { background: var(--surface2); }
.set-label { font-size: 14px; font-weight: 500; }
.set-val   { font-size: 13px; color: var(--muted); }

/* method chip in settings */
.method-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  transition: background .1s;
}
.method-chip-label { flex: 1; font-size: 14px; font-weight: 500; }
.method-del {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--red-bg);
  border: 1px solid var(--red-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--red);
  cursor: pointer;
  font-family: var(--sans);
  line-height: 1;
  transition: opacity .1s;
}
.method-del:active { opacity: .7; }
.method-add {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  cursor: pointer;
  transition: background .1s;
}
.method-add:active { background: var(--accent-lt); }
.method-add-label { font-size: 14px; color: var(--accent); font-weight: 600; }

/* toggle */
.tog {
  width: 44px; height: 26px;
  border-radius: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 3px;
  transition: background .2s;
  flex-shrink: 0;
}
.tog.on  { background: var(--green); }
.tog.off { background: var(--faint); }
.tog-k {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.22);
  transition: transform .2s;
}
.tog.on .tog-k { transform: translateX(18px); }

/* ── Modal / Bottom Sheet ── */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(14,14,12,.52);
  display: flex;
  align-items: flex-end;
  z-index: 100;
  animation: fi .15s;
  backdrop-filter: blur(2px);
}
.sheet {
  width: 100%;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 16px 20px 40px;
  animation: su .22s cubic-bezier(.32,1.2,.45,1);
  max-height: 82vh;
  overflow-y: auto;
}
.sheet::-webkit-scrollbar { display: none; }
.sheet-handle {
  width: 36px; height: 4px;
  border-radius: 2px;
  background: var(--border2);
  margin: 0 auto 18px;
}
.sheet-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -.01em;
  margin-bottom: 4px;
}
.sheet-sub {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 20px;
  line-height: 1.5;
}

/* ── Input system (44px height, r=10) ── */
.inp-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--muted);
  margin-bottom: 6px;
  display: block;
}
.inp {
  width: 100%;
  height: 44px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0 13px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--text);
  background: var(--bg);
  margin-bottom: 14px;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
  -webkit-appearance: none;
}
.inp:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(55,85,163,.12);
  background: var(--surface);
}
/* textarea-like inputs (no fixed height) */
input[type="date"].inp,
input[type="time"].inp { height: 44px; }

.inp-hint { font-size: 11px; color: var(--muted); margin-top: -10px; margin-bottom: 14px; line-height: 1.5; }
.inp-err  { font-size: 11px; color: var(--red);   margin-top: -10px; margin-bottom: 14px; font-weight: 500; }

/* Segmented option picker */
.opt-row { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
.opt {
  flex: 1;
  min-width: 52px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--sans);
  background: var(--bg);
  color: var(--muted);
  cursor: pointer;
  text-align: center;
  transition: all .12s;
  letter-spacing: .01em;
}
.opt.active {
  border-color: var(--accent);
  background: var(--accent-lt);
  color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-border);
}

/* Step progress bar */
.step-bar { display: flex; gap: 4px; margin-bottom: 18px; }
.step-seg {
  height: 3px; flex: 1; border-radius: 2px;
  background: var(--border);
  transition: background .2s;
}
.step-seg.done { background: var(--accent); }

/* Button row in modals */
.btn-row { display: flex; gap: 10px; margin-top: 6px; }
.btn-row .act-btn {
  flex: 1;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
}

@keyframes fi { from { opacity:0 } to { opacity:1 } }
@keyframes su { from { transform: translateY(100%) } to { transform: translateY(0) } }

/* ── Toast ── */
.toast {
  position: absolute;
  bottom: 96px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(14,14,12,.9);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 20px;
  z-index: 200;
  white-space: nowrap;
  pointer-events: none;
  letter-spacing: .01em;
  animation: tin .18s ease, tout .28s ease 1.5s forwards;
}
@keyframes tin  { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes tout { from{opacity:1}to{opacity:0} }

/* ── Empty state ── */
.empty {
  padding: 48px 24px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}
`; 
// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS = {
  A: { label: "A 級", days: 7,  desc: "每週一次" },
  B: { label: "B 級", days: 14, desc: "每兩週一次" },
  C: { label: "C 級", days: 30, desc: "每月一次" },
  E: { label: "緊急",  days: 7,  desc: "每週" },
};

const INITIAL_METHODS = ["電話", "LINE", "訪視", "學校訪談"];

const TODAY = "2026-05-23";
const TODAY_DISPLAY = "2026年5月23日";

const INITIAL_CASES = [
  {
    id: "C001", nick: "阿明", level: "A",
    note: "情緒起伏大，需定期關心",
    lastContact: "2026-05-15", nextContact: "2026-05-22",
    scheduled: { date: "2026-05-23", time: "09:00", type: "訪視", note: "家訪確認藥物服用情況" },
    logs: [
      { date: "2026-05-15", method: "電話", note: "情況穩定，已確認回診" },
      { date: "2026-05-08", method: "電話", note: "略顯低落，持續追蹤" },
    ],
  },
  {
    id: "C002", nick: "小芬", level: "E",
    note: "近期壓力大",
    lastContact: "2026-05-10", nextContact: "2026-05-17",
    scheduled: null,
    logs: [
      { date: "2026-05-10", method: "LINE", note: "回覆慢，情況待觀察" },
    ],
  },
  {
    id: "C003", nick: "老王", level: "B",
    note: "",
    lastContact: "2026-05-09", nextContact: "2026-05-23",
    scheduled: { date: "2026-05-27", time: "14:00", type: "電話", note: "例行電訪" },
    logs: [
      { date: "2026-05-09", method: "電話", note: "良好，下次兩週後" },
    ],
  },
  {
    id: "C004", nick: "淑惠", level: "C",
    note: "月底壓力較大",
    lastContact: "2026-04-25", nextContact: "2026-05-25",
    scheduled: null,
    logs: [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function daysBetween(a, b) {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  if (isNaN(ms)) return 0;
  return Math.round(ms / 86400000);
}
function addDays(s, n) {
  if (!s) return TODAY;
  const d = new Date(s);
  if (isNaN(d.getTime())) return TODAY;
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function calcNext(level, from, levelsMap) {
  const map = levelsMap || LEVELS;
  const days = map[level]?.days ?? LEVELS[level]?.days ?? 30;
  return addDays(from, Math.max(1, days));
}
function getStatus(c) {
  if (c.scheduled) return "green";
  const d = daysBetween(TODAY, c.nextContact);
  if (d < 0) return "red";
  if (d <= 1) return "yellow";
  return "faint";
}
function getStatusLabel(c) {
  if (c.scheduled) return c.scheduled?.type || '聯絡';
  const d = daysBetween(TODAY, c.nextContact);
  if (d < 0) return `逾期 ${Math.abs(d)} 天`;
  if (d === 0) return "今日到期";
  if (d === 1) return "明日到期";
  return `${d} 天後`;
}
function generateId(cases) {
  const nums = cases.map(c => parseInt(c.id.replace("C",""),10)).filter(n=>!isNaN(n));
  const next = nums.length ? Math.max(...nums)+1 : 1;
  return `C${String(next).padStart(3,"0")}`;
}

// calendar helpers
function getMonthDays(year, month) {
  const first = new Date(year, month, 1).getDay(); // 0=Sun
  const total = new Date(year, month+1, 0).getDate();
  return { first, total };
}
function ymd(y, m, d) {
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function Sq({ status }) {
  return <div className={`sq ${status}`} />;
}

function LTag({ level }) {
  return <span className={`ltag ltag-${level}`}>{LEVELS[level]?.label ?? level}</span>;
}

function Toggle({ on, onToggle }) {
  return (
    <div className={`tog ${on?"on":"off"}`} onClick={onToggle}>
      <div className="tog-k" />
    </div>
  );
}

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

function StepBar({ total, current }) {
  return (
    <div className="step-bar">
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} className={`step-seg ${i<=current?"done":""}`} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 記錄聯絡
// ─────────────────────────────────────────────────────────────────────────────

function LogModal({ case_:c, methods, onClose, onSave }) {
  const safeMethods = methods.length > 0 ? methods : ["電話"];
  const [method, setMethod] = useState(safeMethods[0]);
  const [note, setNote] = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">記錄聯絡</div>
        <div className="sheet-sub">{c.nick} · {TODAY}</div>

        <label className="inp-label">聯絡方式</label>
        <div className="opt-row">
          {safeMethods.map(m=>(
            <div key={m} className={`opt ${method===m?"active":""}`} onClick={()=>setMethod(m)}>{m}</div>
          ))}
        </div>

        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="一兩句即可…" value={note} onChange={e=>setNote(e.target.value)} maxLength={80}/>

        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          <button className="act-btn primary" onClick={()=>{onSave(c.id,method,note.trim());onClose();}}>
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 排定聯絡
// ─────────────────────────────────────────────────────────────────────────────

function ScheduleModal({ case_:c, methods, onClose, onSave }) {
  const safeMethods = methods.length > 0 ? methods : ["電話"];
  const [type, setType] = useState(safeMethods[0]);
  const [date, setDate] = useState(addDays(TODAY, 3));
  const [time, setTime] = useState("09:00");
  const [note, setNote] = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">排定聯絡</div>
        <div className="sheet-sub">{c.nick}</div>

        <label className="inp-label">聯絡方式</label>
        <div className="opt-row">
          {safeMethods.map(m=>(
            <div key={m} className={`opt ${type===m?"active":""}`} onClick={()=>setType(m)}>{m}</div>
          ))}
        </div>

        <label className="inp-label">日期</label>
        <input type="date" className="inp" value={date} min={TODAY} onChange={e=>setDate(e.target.value)}/>

        <label className="inp-label">時間（選填）</label>
        <input type="time" className="inp" value={time} onChange={e=>setTime(e.target.value)}/>

        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="目的或提醒…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>

        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          {!date && <div style={{fontSize:11,color:'var(--red)',marginBottom:4}}>請選擇日期</div>}
          <button className="act-btn primary" onClick={()=>{
            if(!date) return;
            onSave(c.id,{date,time,type,note:note.trim()||`${type}聯絡`});
            onClose();
          }} disabled={!date}>確認排定</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 延後
// ─────────────────────────────────────────────────────────────────────────────

function PostponeModal({ case_:c, onClose, onSave }) {
  const [days, setDays] = useState(1);
  const [note, setNote] = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">延後聯絡</div>
        <div className="sheet-sub">{c.nick}</div>

        <label className="inp-label">延後天數</label>
        <div className="opt-row">
          {[1,2,3,7].map(d=>(
            <div key={d} className={`opt ${days===d?"active":""}`} onClick={()=>setDays(d)}>{d} 天</div>
          ))}
        </div>

        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="延後原因…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>

        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          <button className="act-btn primary" onClick={()=>{onSave(c.id,days,note.trim());onClose();}}>確認延後</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 新增個案 (2 steps)
// ─────────────────────────────────────────────────────────────────────────────

function AddCaseModal({ existingCases, onClose, onSave, levels: levelsMap }) {
  const [step,setStep]         = useState(0);
  const [nick,setNick]         = useState("");
  const [note,setNote]         = useState("");
  const [level,setLevel]       = useState("B");
  const [last,setLast]         = useState(TODAY);
  const [err,setErr]           = useState("");
  const autoId = generateId(existingCases);

  function next() {
    if (!nick.trim()) { setErr("請輸入暱稱"); return; }
    setErr(""); setStep(1);
  }
  function save() {
    const safeDate = last || TODAY;
    onSave({ id:autoId, nick:nick.trim(), note:note.trim(), level,
      lastContact:safeDate, nextContact:calcNext(level,safeDate), scheduled:null, logs:[] });
    onClose();
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <StepBar total={2} current={step}/>
        <div className="sheet-title">{step===0?"新增個案":"關懷設定"}</div>
        <div className="sheet-sub">{step===0?`ID 自動指定：${autoId}`:"等級與上次聯絡日期"}</div>

        {step===0 && <>
          <label className="inp-label">暱稱（不可使用真實姓名）</label>
          <input className="inp" placeholder="例：阿明…" value={nick}
            onChange={e=>{setNick(e.target.value);setErr("");}} maxLength={20} autoFocus/>
          {err && <div className="inp-err">{err}</div>}

          <label className="inp-label">備註（選填）</label>
          <input className="inp" placeholder="簡短備忘…" value={note}
            onChange={e=>setNote(e.target.value)} maxLength={60}/>

          <div className="btn-row">
            <button className="act-btn" onClick={onClose}>取消</button>
            <button className="act-btn primary" onClick={next}>下一步</button>
          </div>
        </>}

        {step===1 && <>
          <label className="inp-label">關懷等級</label>
          <div className="opt-row">
            {Object.entries(levelsMap||LEVELS).map(([k,l])=>(
              <div key={k} className={`opt ${level===k?"active":""}`} onClick={()=>setLevel(k)}>
                {l.label}
              </div>
            ))}
          </div>
          <div className="inp-hint">{(levelsMap||LEVELS)[level]?.desc||''}，每 {(levelsMap||LEVELS)[level]?.days||'?'} 天</div>

          <label className="inp-label">上次聯絡日期</label>
          <input type="date" className="inp" value={last} onChange={e=>setLast(e.target.value)}/>
          <div className="inp-hint">下次聯絡：{calcNext(level,last).slice(5)}</div>

          <div className="btn-row">
            <button className="act-btn" onClick={()=>setStep(0)}>上一步</button>
            <button className="act-btn primary" onClick={save}>建立個案</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN — flat list
// ─────────────────────────────────────────────────────────────────────────────

function HomeScreen({ cases, methods, onOpen, updateCase, showToast }) {
  const [logModal,setLogModal]         = useState(null);
  const [postponeModal,setPostponeModal] = useState(null);

  // tasks: overdue + today(diff<=1) + scheduled(green)
  const tasks = cases
    .map(c=>({...c,status:getStatus(c)}))
    .filter(c=>c.status!=="faint");

  const order = {red:0,yellow:1,green:2};
  const sorted = [...tasks].sort((a,b)=>order[a.status]-order[b.status]);

  function handleLogSave(id,method,note) {
    updateCase(id,prev=>({
      lastContact:TODAY,
      nextContact:calcNext(prev.level,TODAY),
      scheduled: null, // always clear on contact log; cycle restarts
      logs:[{date:TODAY,method,note:note||"已聯絡"},...prev.logs],
    }));
    showToast("已記錄，週期重新計算");
  }
  function handlePostponeSave(id,days,note) {
    updateCase(id,prev=>({
      nextContact:addDays(prev.nextContact,days),
      logs:[{date:TODAY,method:"備註",note:note||`延後 ${days} 天`},...prev.logs],
    }));
    showToast(`已延後 ${days} 天`);
  }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:"var(--accent)",marginBottom:2}}>ReCon｜再聯絡</div>
          <div className="ph-title">今日待聯絡</div>
          <div className="ph-sub">{TODAY_DISPLAY}</div>
        </div>
        <span className="ph-sub">{sorted.length} 項</span>
      </div>

      {/* section labels */}
      {["red","yellow","green"].map(s=>{
        const group = sorted.filter(c=>c.status===s);
        if (!group.length) return null;
        const label = s==="red"?"已逾期":s==="yellow"?"今明到期":"已排定";
        return (
          <div key={s}>
            <div className="sec-label">{label}</div>
            {group.map(c=>(
              <div className="list-row" key={c.id} onClick={()=>onOpen(c.id)}>
                <Sq status={c.status}/>
                <div className="row-main">
                  <span className="row-nick">{c.nick}</span>
                  <LTag level={c.level}/>
                </div>
                <span className="row-date">
                  {c.scheduled ? (c.scheduled?.date?.slice(5)||'—') : (c.nextContact?.slice(5)||'—')}
                </span>
                <span className="row-method">{getStatusLabel(c)}</span>
                <div className="row-actions" onClick={e=>e.stopPropagation()}>
                  <button className="act-btn primary" onClick={e=>{e.stopPropagation();setLogModal(c);}}>完成</button>
                  <button className="act-btn" onClick={e=>{e.stopPropagation();setPostponeModal(c);}}>延後</button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {sorted.length===0 && (
        <div className="empty">今天沒有待辦事項<br/>好好休息</div>
      )}

      {logModal && (
        <LogModal case_={logModal} methods={methods}
          onClose={()=>setLogModal(null)} onSave={handleLogSave}/>
      )}
      {postponeModal && (
        <PostponeModal case_={postponeModal}
          onClose={()=>setPostponeModal(null)} onSave={handlePostponeSave}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASES SCREEN — flat list
// ─────────────────────────────────────────────────────────────────────────────

function CasesScreen({ cases, onOpen, onAdd, deleteCase }) {
  const SORT_OPTIONS=[{key:"status",label:"狀態"},{key:"nick",label:"名稱"},{key:"next",label:"到期"},{key:"level",label:"等級"}];
  const [sortBy,setSortBy]=useState("status");
  const [confirmDel,setConfirmDel]=useState(null);
  function sortedCases(){
    const arr=[...cases];
    if(sortBy==="status") return arr.sort((a,b)=>order2(getStatus(a))-order2(getStatus(b)));
    if(sortBy==="nick")   return arr.sort((a,b)=>a.nick.localeCompare(b.nick,"zh-TW"));
    if(sortBy==="next")   return arr.sort((a,b)=>new Date(a.nextContact)-new Date(b.nextContact));
    if(sortBy==="level")  return arr.sort((a,b)=>a.level.localeCompare(b.level));
    return arr;
  }
  return (
    <div className="screen-pad" style={{position:"relative"}}>
      <div className="ph">
        <div>
          <div className="ph-title">個案列表</div>
          <div className="ph-sub">{cases.length} 位個案</div>
        </div>
        <button className="ph-action" onClick={onAdd}>＋ 新增</button>
      </div>
      <div style={{display:"flex",gap:6,padding:"10px 16px 4px",overflowX:"auto"}}>
        {SORT_OPTIONS.map(s=>(
          <button key={s.key} onClick={()=>setSortBy(s.key)} style={{
            flexShrink:0,padding:"5px 12px",borderRadius:20,border:"1px solid",
            fontSize:12,fontWeight:500,fontFamily:"var(--sans)",cursor:"pointer",
            background:sortBy===s.key?"var(--accent)":"var(--surface)",
            borderColor:sortBy===s.key?"var(--accent)":"var(--border)",
            color:sortBy===s.key?"#fff":"var(--muted)",
          }}>{s.label}</button>
        ))}
      </div>
      {cases.length===0 && <div className="empty">尚無個案<br/>點右上角新增</div>}
      {sortedCases().map(c=>{
        const diff=daysBetween(TODAY,c.nextContact);
        const isPendingDel=confirmDel===c.id;
        return (
          <div key={c.id}>
            <div className="list-row" onClick={()=>{ if(!isPendingDel) onOpen(c.id); }}>
              <Sq status={getStatus(c)}/>
              <div className="row-main">
                <span className="row-nick">{c.nick}</span>
                <LTag level={c.level}/>
                <span style={{fontSize:11,color:"var(--muted)",marginLeft:2}}>{c.id}</span>
              </div>
              <span className="row-date">
                {c.scheduled
                  ? `${c.scheduled?.date?.slice(5)||""} ${c.scheduled?.type||""}`
                  : diff<0?`逾期 ${Math.abs(diff)}天`:diff===0?"今日":`${diff}天後`}
              </span>
              <button onClick={e=>{e.stopPropagation();setConfirmDel(isPendingDel?null:c.id);}}
                style={{marginLeft:4,width:28,height:28,borderRadius:"50%",
                  border:"1px solid var(--border)",background:"var(--surface2)",
                  fontSize:14,color:"var(--muted)",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"var(--sans)",flexShrink:0,letterSpacing:1}}>
                ···
              </button>
            </div>
            {isPendingDel && (
              <div style={{margin:"0 16px 6px",padding:"10px 14px",
                background:"var(--red-bg)",border:"1px solid var(--red-border)",
                borderRadius:"0 0 var(--r-md) var(--r-md)",
                display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                <span style={{fontSize:12,color:"var(--red)",fontWeight:500,flex:1}}>
                  確認刪除「{c.nick}」？此操作無法復原
                </span>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button className="act-btn" style={{padding:"5px 10px",fontSize:12}}
                    onClick={()=>setConfirmDel(null)}>取消</button>
                  <button className="act-btn danger" style={{padding:"5px 10px",fontSize:12}}
                    onClick={()=>{deleteCase(c.id);setConfirmDel(null);}}>刪除</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function order2(s){return{red:0,yellow:1,green:2,faint:3}[s];}

// ─────────────────────────────────────────────────────────────────────────────
// CASE DETAIL SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function DetailScreen({ case_:c, methods, onBack, updateCase, showToast }) {
  const [logModal,setLogModal]         = useState(false);
  const [schedModal,setSchedModal]     = useState(false);

  const diff = daysBetween(TODAY,c.nextContact);
  const urgColor = diff<0?"var(--red)":diff<=1?"var(--yellow)":"var(--green)";
  const urgLabel = diff<0?`逾期 ${Math.abs(diff)} 天`:diff===0?"今日到期":diff===1?"明日到期":`${diff} 天後`;

  function handleLogSave(id,method,note){
    updateCase(id,prev=>({
      lastContact:TODAY,
      nextContact:calcNext(prev.level,TODAY),
      scheduled:null,
      logs:[{date:TODAY,method,note:note||"已聯絡"},...prev.logs],
    }));
    showToast("已記錄");
  }
  function handleSchedSave(id,sched){
    updateCase(id,()=>({scheduled:sched}));
    showToast(`已排定 ${sched.type} · ${sched.date.slice(5)}`);
  }
  function cancelSched(){
    updateCase(c.id,()=>({scheduled:null}));
    showToast("已取消排程");
  }

  return (
    <div className="screen-pad">
      <div className="det-header">
        <button className="det-back" onClick={onBack}>‹</button>
        <div>
          <div className="det-nick">{c.nick} <LTag level={c.level}/></div>
          <div className="det-id">{c.id}</div>
        </div>
      </div>

      <div className="det-meta">
        <div className="det-cell">
          <div className="det-clabel">上次聯絡</div>
          <div className="det-cval">{c.lastContact?.slice(5)||'—'}</div>
        </div>
        <div className="det-cell">
          <div className="det-clabel">下次聯絡</div>
          <div className="det-cval" style={{color:urgColor}}>{c.nextContact?.slice(5)||'—'}</div>
        </div>
        <div className="det-cell">
          <div className="det-clabel">狀態</div>
          <div className="det-cval" style={{color:urgColor}}>{urgLabel}</div>
        </div>
        <div className="det-cell">
          <div className="det-clabel">等級規則</div>
          <div className="det-cval">{LEVELS[c.level]?.desc}</div>
        </div>
        {c.note && (
          <div className="det-cell full">
            <div className="det-clabel">備註</div>
            <div className="det-cval" style={{fontWeight:400,fontSize:13}}>{c.note}</div>
          </div>
        )}
        {c.scheduled && (
          <div className="det-cell full" style={{background:"var(--green-bg)"}}>
            <div className="det-clabel" style={{color:"var(--green)"}}>已排定</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div className="det-cval" style={{color:"var(--green)",fontWeight:400,fontSize:13}}>
                {c.scheduled.date} {c.scheduled.time} · {c.scheduled.type}
                {c.scheduled.note ? ` · ${c.scheduled.note}` : ""}
              </div>
              <button className="act-btn danger" style={{fontSize:11}}
                onClick={cancelSched}>取消</button>
            </div>
          </div>
        )}
      </div>

      <div className="det-actions">
        <button className="act-btn primary" onClick={()=>setLogModal(true)}>記錄聯絡</button>
        <button className="act-btn" onClick={()=>setSchedModal(true)} disabled={!!c.scheduled}>
          {c.scheduled?"已排定":"排定聯絡"}
        </button>
      </div>

      <div className="sec-label">聯絡紀錄</div>
      {c.logs.length===0 && <div className="empty" style={{padding:"20px 24px"}}>尚無紀錄</div>}
      {c.logs.map((log,i)=>(
        <div className="log-item" key={i}>
          <div className="log-bar"/>
          <div className="log-body">
            <div className="log-date">{log.date}</div>
            <span className="log-tag">{log.method}</span>
            <div className="log-note">{log.note}</div>
          </div>
        </div>
      ))}

      {logModal && <LogModal case_={c} methods={methods} onClose={()=>setLogModal(false)} onSave={handleLogSave}/>}
      {schedModal && <ScheduleModal case_={c} methods={methods} onClose={()=>setSchedModal(false)} onSave={handleSchedSave}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR SCREEN — monthly grid
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const DOW = ["日","一","二","三","四","五","六"];

function CalendarScreen({ cases, onOpen }) {
  const todayParts = TODAY.split("-").map(Number); // [2026,5,23]
  const [year,  setYear]  = useState(todayParts[0]);
  const [month, setMonth] = useState(todayParts[1]-1); // 0-indexed
  const [selected, setSelected] = useState(TODAY);

  function prev(){ if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); }
  function next(){ if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); }

  const {first, total} = getMonthDays(year, month);

  // build event map: date → [{nick,time,type}]
  const eventMap = {};
  cases.forEach(c=>{
    if (c.scheduled) {
      const d = c.scheduled?.date;
      if (d) {
        if (!eventMap[d]) eventMap[d] = [];
        eventMap[d].push({nick:c.nick||'?', time:c.scheduled.time||"", type:c.scheduled?.type||'聯絡', id:c.id});
      }
    }
    // also show nextContact as a dot if no scheduled
    if (!c.scheduled) {
      const d = c.nextContact;
      if (d) {
        if (!eventMap[d]) eventMap[d] = [];
        eventMap[d].push({nick:c.nick||'?', time:"", type:getStatusLabel(c), id:c.id, auto:true});
      }
    }
  });

  const selectedEvents = eventMap[selected] || [];

  // cells: blanks + days
  const cells = [];
  for (let i=0;i<first;i++) cells.push(null);
  for (let d=1;d<=total;d++) cells.push(d);

  const todayStr = TODAY;

  return (
    <div className="screen-pad">
      <div className="cal-nav">
        <button className="cal-arrow" onClick={prev}>‹</button>
        <div className="cal-month">{year}年 {MONTH_NAMES[month]}</div>
        <button className="cal-arrow" onClick={next}>›</button>
      </div>

      <div className="cal-grid">
        {DOW.map(d=><div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d,i)=>{
          if (d===null) return <div key={`e${i}`} className="cal-cell empty"/>;
          const dateStr = ymd(year,month,d);
          const evts = eventMap[dateStr]||[];
          const isToday = dateStr===todayStr;
          const isSel   = dateStr===selected;
          return (
            <div key={dateStr}
              className={`cal-cell${isToday?" today-cell":""}${isSel&&!isToday?" selected-cell":""}`}
              onClick={()=>setSelected(dateStr)}
            >
              <div className="cal-num">{d}</div>
              {evts.length>0 && (
                <div className="cal-dots">
                  {evts.slice(0,3).map((e,j)=>(
                    <div key={j} className="cal-dot"
                      style={{background: e.auto ? "var(--yellow)" : "var(--green)"}}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day panel */}
      <div className="day-panel">
        <div className="day-panel-title">
          {selected.slice(5).replace("-","/")} 的行程
        </div>
        {selectedEvents.length===0 && (
          <div style={{fontSize:13,color:"var(--muted)",paddingTop:8}}>這天沒有排定事項</div>
        )}
        {selectedEvents.map((e,i)=>(
          <div className="day-item" key={i} onClick={()=>onOpen(e.id)} style={{cursor:"pointer"}}>
            <div className="day-time">{e.time||"—"}</div>
            <div className="day-nick">{e.nick}</div>
            <div className="day-meth">{e.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS — v5: hub → sub-page navigation
// ─────────────────────────────────────────────────────────────────────────────

// ── Sub-page: 聯絡方式管理 ────────────────────────────────────────────────────

function MethodsPage({ methods, setMethods, onBack }) {
  const [editing, setEditing] = useState(null); // index being renamed
  const [editVal, setEditVal] = useState("");
  const [adding,  setAdding]  = useState(false);
  const [newVal,  setNewVal]  = useState("");

  function startEdit(i) { setEditing(i); setEditVal(methods[i]); setAdding(false); }
  function saveEdit() {
    const v = editVal.trim();
    if (!v) { setEditing(null); return; }
    setMethods(prev => prev.map((m,i) => i===editing ? v : m));
    setEditing(null);
  }
  function del(i) {
    if (methods.length <= 1) { setEditing(null); return; } // always keep at least 1
    setMethods(prev => prev.filter((_,j) => j!==i));
    setEditing(null);
  }
  function addMethod() {
    const v = newVal.trim();
    if (!v || methods.includes(v)) return;
    setMethods(prev => [...prev, v]);
    setNewVal(""); setAdding(false);
  }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="det-back" onClick={onBack}>‹</button>
          <div className="ph-title">聯絡方式</div>
        </div>
        <button className="ph-action" onClick={()=>{setAdding(true);setEditing(null);}}>＋ 新增</button>
      </div>

      <div style={{padding:"8px 0 4px"}}>
        <div className="sec-label">已設定的方式</div>
        <div className="set-group">
          {methods.map((m,i) => (
            editing===i ? (
              <div key={i} className="set-row" style={{gap:8}}>
                <input
                  className="inp"
                  style={{flex:1,marginBottom:0,padding:"7px 10px",fontSize:13}}
                  value={editVal}
                  onChange={e=>setEditVal(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}}
                  autoFocus
                />
                <button className="act-btn primary" style={{padding:"6px 12px",fontSize:12}} onClick={saveEdit}>儲存</button>
                <button className="act-btn danger" style={{padding:"6px 10px",fontSize:12}} onClick={()=>del(i)} disabled={methods.length<=1} title={methods.length<=1?"至少保留一種聯絡方式":""}>刪除</button>
              </div>
            ) : (
              <div key={i} className="set-row" style={{cursor:"pointer"}} onClick={()=>startEdit(i)}>
                <span className="set-label">{m}</span>
                <span style={{fontSize:12,color:"var(--accent)"}}>編輯</span>
              </div>
            )
          ))}
          {adding && (
            <div className="set-row" style={{gap:8}}>
              <input
                className="inp"
                style={{flex:1,marginBottom:0,padding:"7px 10px",fontSize:13}}
                placeholder="新方式名稱…"
                value={newVal}
                onChange={e=>setNewVal(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")addMethod();if(e.key==="Escape")setAdding(false);}}
                autoFocus
              />
              <button className="act-btn primary" style={{padding:"6px 12px",fontSize:12}} onClick={addMethod}>加入</button>
              <button className="act-btn" style={{padding:"6px 10px",fontSize:12}} onClick={()=>setAdding(false)}>✕</button>
            </div>
          )}
        </div>

        <div style={{padding:"16px 20px"}}>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
            這裡設定的方式會出現在「記錄聯絡」和「排定聯絡」的選項中。<br/>
            點任一項可修改名稱或刪除。
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-page: 關懷等級管理 ────────────────────────────────────────────────────

const LEVEL_COLOR_OPTIONS = [
  {key:"red",    label:"紅", bg:"#FDECEA", color:"#C0392B"},
  {key:"yellow", label:"黃", bg:"#FDF8EE", color:"#C99B2A"},
  {key:"green",  label:"綠", bg:"#EEF6F1", color:"#3A7D55"},
];

function LevelsPage({ levels, setLevels, onBack }) {
  const [editKey, setEditKey] = useState(null); // which level key is open
  const [form, setForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({key:"",label:"",days:14,desc:"",colorKey:"yellow"});
  const [err, setErr] = useState("");

  function startEdit(k) {
    setEditKey(k); setAdding(false);
    setForm({label:levels[k].label, days:levels[k].days, desc:levels[k].desc, colorKey:levels[k].colorKey||"yellow"});
  }
  function saveEdit() {
    if (!form.label?.trim()) return;
    setLevels(prev=>({...prev,[editKey]:{...prev[editKey],label:form.label.trim(),days:Math.max(1,Number(form.days)||7),desc:(form.desc||'').trim(),colorKey:form.colorKey}}));
    setEditKey(null);
  }
  function delLevel(k) {
    if (Object.keys(levels).length <= 1) { setEditKey(null); return; } // always keep at least 1
    setLevels(prev=>{const n={...prev};delete n[k];return n;});
    setEditKey(null);
  }
  function startAdd() { setAdding(true); setEditKey(null); setNewForm({key:"",label:"",days:14,desc:"",colorKey:"yellow"}); setErr(""); }
  function saveAdd() {
    const k = newForm.key.trim().toUpperCase();
    if (!k || !newForm.label.trim()) { setErr("請填寫 ID 和名稱"); return; }
    if (levels[k]) { setErr(`ID「${k}」已存在`); return; }
    setLevels(prev=>({...prev,[k]:{label:newForm.label.trim(),days:Math.max(1,Number(newForm.days)||14),desc:(newForm.desc||'').trim(),colorKey:newForm.colorKey}}));
    setAdding(false); setErr("");
  }

  const colorOf = (colorKey) => LEVEL_COLOR_OPTIONS.find(c=>c.key===colorKey) || LEVEL_COLOR_OPTIONS[1];

  return (
    <div className="screen-pad">
      <div className="ph">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="det-back" onClick={onBack}>‹</button>
          <div className="ph-title">關懷等級</div>
        </div>
        <button className="ph-action" onClick={startAdd}>＋ 新增</button>
      </div>

      <div style={{padding:"8px 0 4px"}}>
        <div className="sec-label">已設定等級</div>
        <div className="set-group">
          {Object.entries(levels).map(([k,l]) => {
            const col = colorOf(l.colorKey||"yellow");
            return editKey===k ? (
              <div key={k} style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"14px 16px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <label className="inp-label">名稱</label>
                    <input className="inp" style={{marginBottom:0}} value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} autoFocus/>
                  </div>
                  <div>
                    <label className="inp-label">天數</label>
                    <input className="inp" style={{marginBottom:0}} type="number" min={1} value={form.days} onChange={e=>setForm(f=>({...f,days:e.target.value}))}/>
                  </div>
                </div>
                <label className="inp-label">頻率說明</label>
                <input className="inp" value={form.desc} placeholder="例：每週一次電訪" onChange={e=>setForm(f=>({...f,desc:e.target.value}))} style={{marginBottom:8}}/>
                <label className="inp-label">顏色</label>
                <div className="opt-row" style={{marginBottom:10}}>
                  {LEVEL_COLOR_OPTIONS.map(c=>(
                    <div key={c.key} className={`opt ${form.colorKey===c.key?"active":""}`}
                      style={form.colorKey===c.key?{background:c.bg,borderColor:c.color,color:c.color}:{}}
                      onClick={()=>setForm(f=>({...f,colorKey:c.key}))}>
                      {c.label}
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button className="act-btn primary" style={{flex:2,padding:"8px 0",fontSize:13}} onClick={saveEdit}>儲存</button>
                  <button className="act-btn danger" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={()=>delLevel(k)} disabled={Object.keys(levels).length<=1} title={Object.keys(levels).length<=1?"至少保留一個等級":""}>刪除</button>
                  <button className="act-btn" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={()=>setEditKey(null)}>取消</button>
                </div>
              </div>
            ) : (
              <div key={k} className="set-row" style={{cursor:"pointer"}} onClick={()=>startEdit(k)}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:col.bg,color:col.color,letterSpacing:".02em"}}>{l.label}</span>
                  <span className="set-label">{l.desc||"—"}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="set-val">{l.days} 天</span>
                  <span style={{fontSize:12,color:"var(--accent)"}}>編輯</span>
                </div>
              </div>
            );
          })}

          {adding && (
            <div style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"14px 16px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div>
                  <label className="inp-label">ID（英文）</label>
                  <input className="inp" style={{marginBottom:0}} placeholder="例：H" value={newForm.key} onChange={e=>setNewForm(f=>({...f,key:e.target.value}))} autoFocus maxLength={4}/>
                </div>
                <div>
                  <label className="inp-label">名稱</label>
                  <input className="inp" style={{marginBottom:0}} placeholder="例：高風險" value={newForm.label} onChange={e=>setNewForm(f=>({...f,label:e.target.value}))}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div>
                  <label className="inp-label">天數</label>
                  <input className="inp" style={{marginBottom:0}} type="number" min={1} value={newForm.days} onChange={e=>setNewForm(f=>({...f,days:e.target.value}))}/>
                </div>
                <div>
                  <label className="inp-label">頻率說明</label>
                  <input className="inp" style={{marginBottom:0}} placeholder="每週一次" value={newForm.desc} onChange={e=>setNewForm(f=>({...f,desc:e.target.value}))}/>
                </div>
              </div>
              <label className="inp-label">顏色</label>
              <div className="opt-row" style={{marginBottom:8}}>
                {LEVEL_COLOR_OPTIONS.map(c=>(
                  <div key={c.key} className={`opt ${newForm.colorKey===c.key?"active":""}`}
                    style={newForm.colorKey===c.key?{background:c.bg,borderColor:c.color,color:c.color}:{}}
                    onClick={()=>setNewForm(f=>({...f,colorKey:c.key}))}>
                    {c.label}
                  </div>
                ))}
              </div>
              {err && <div className="inp-err">{err}</div>}
              <div style={{display:"flex",gap:6}}>
                <button className="act-btn primary" style={{flex:2,padding:"8px 0",fontSize:13}} onClick={saveAdd}>建立等級</button>
                <button className="act-btn" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={()=>{setAdding(false);setErr("");}}>取消</button>
              </div>
            </div>
          )}
        </div>

        <div style={{padding:"16px 20px"}}>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
            天數決定系統自動計算下次聯絡時間的間隔。<br/>
            刪除等級不會影響已建立的個案。
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings HUB ─────────────────────────────────────────────────────────────

function SettingsScreen({ methods, setMethods, levels, setLevels }) {
  const [page, setPage] = useState("hub"); // hub | methods | levels
  const [notif,   setNotif]   = useState(true);
  const [morning, setMorning] = useState(true);

  if (page==="methods") return <MethodsPage methods={methods} setMethods={setMethods} onBack={()=>setPage("hub")}/>;
  if (page==="levels")  return <LevelsPage  levels={levels}   setLevels={setLevels}   onBack={()=>setPage("hub")}/>;

  // ── Hub ──
  return (
    <div className="screen-pad">
      <div className="ph">
        <div className="ph-title">設定</div>
      </div>

      {/* 通知 — stays inline, it's just toggles */}
      <div className="sec-label">通知</div>
      <div className="set-group">
        <div className="set-row">
          <span className="set-label">提醒通知</span>
          <Toggle on={notif} onToggle={()=>setNotif(!notif)}/>
        </div>
        <div className="set-row">
          <span className="set-label">每日早晨摘要</span>
          <Toggle on={morning} onToggle={()=>setMorning(!morning)}/>
        </div>
        <div className="set-row">
          <span className="set-label">提醒時間</span>
          <span className="set-val">08:30 ›</span>
        </div>
      </div>

      {/* 管理入口 */}
      <div className="sec-label">管理</div>
      <div className="set-group">
        <div className="set-row" style={{cursor:"pointer"}} onClick={()=>setPage("methods")}>
          <div>
            <div className="set-label">聯絡方式管理</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{methods.length} 種方式</div>
          </div>
          <span style={{color:"var(--muted)",fontSize:17}}>›</span>
        </div>
        <div className="set-row" style={{cursor:"pointer"}} onClick={()=>setPage("levels")}>
          <div>
            <div className="set-label">關懷等級管理</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{Object.keys(levels).length} 個等級</div>
          </div>
          <span style={{color:"var(--muted)",fontSize:17}}>›</span>
        </div>
      </div>

      {/* 資料 */}
      <div className="sec-label">資料</div>
      <div className="set-group">
        <div className="set-row" style={{cursor:"pointer"}}>
          <span className="set-label">匯出 Excel</span>
          <span style={{color:"var(--muted)",fontSize:17}}>›</span>
        </div>
        <div className="set-row">
          <span className="set-label">版本</span>
          <span className="set-val">v10.0</span>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_LEVELS = {
  A: { label: "A 級", days: 7,  desc: "每週一次",   colorKey: "red"    },
  B: { label: "B 級", days: 14, desc: "每兩週一次", colorKey: "yellow" },
  C: { label: "C 級", days: 30, desc: "每月一次",   colorKey: "green"  },
  E: { label: "緊急",  days: 7,  desc: "每週",       colorKey: "red"    },
};

// ── localStorage helpers ──────────────────────────────────────────
const LS = { cases:"rc_cases", methods:"rc_methods", levels:"rc_levels" };
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const p = JSON.parse(raw);
    if (key===LS.cases   && !Array.isArray(p)) return fallback;
    if (key===LS.methods && !Array.isArray(p)) return fallback;
    if (key===LS.levels  && (typeof p!=="object"||Array.isArray(p))) return fallback;
    return p;
  } catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export default function App() {
  const [cases,    setCases]    = useState(()=>lsGet(LS.cases,   INITIAL_CASES));
  const [methods,  setMethods]  = useState(()=>lsGet(LS.methods, INITIAL_METHODS));
  const [levels,   setLevels]   = useState(()=>lsGet(LS.levels,  INITIAL_LEVELS));
  const [tab,      setTab]      = useState("home");
  const [detailId, setDetailId] = useState(null);
  const [toast,    setToast]    = useState(null);
  const [addOpen,  setAddOpen]  = useState(false);
  const toastTimer = useRef(null);
  useEffect(()=>{ lsSet(LS.cases,   cases);   }, [cases]);
  useEffect(()=>{ lsSet(LS.methods, methods); }, [methods]);
  useEffect(()=>{ lsSet(LS.levels,  levels);  }, [levels]);
  useEffect(()=>{ document.title="ReCon｜再聯絡"; }, []);

  function updateCase(id, patchFn) {
    setCases(prev => prev.map(c => {
      if (c.id !== id) return c;
      try {
        const patch = patchFn(c);
        // Sanitise patch: ensure no undefined sneaks into critical fields
        return {
          ...c,
          ...patch,
          lastContact:  patch.lastContact  || c.lastContact  || TODAY,
          nextContact:  patch.nextContact  || c.nextContact  || TODAY,
          logs:         Array.isArray(patch.logs) ? patch.logs : c.logs,
          scheduled:    patch.hasOwnProperty('scheduled') ? patch.scheduled : c.scheduled,
        };
      } catch(e) {
        console.error('updateCase patchFn error:', e);
        return c; // leave case unchanged on error
      }
    }));
  }
  function addCase(nc) {
    setCases(prev=>[...prev,nc]);
    showToast(`已新增 ${nc.nick}`);
  }
  function deleteCase(id) {
    setCases(prev=>prev.filter(c=>c.id!==id));
    showToast("已刪除個案");
    if (detailId===id) { setDetailId(null); setTab("cases"); }
  }
  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(null), 1900);
  }
  function openCase(id) { setDetailId(id); setTab("detail"); }
  function closeDetail() { setDetailId(null); setTab("cases"); }

  const detailCase = cases.find(c=>c.id===detailId)??null;

  const NAV = [
    {key:"home",     icon:"≡", label:"今日"},
    {key:"cases",    icon:"□", label:"個案"},
    {key:"calendar", icon:"▦", label:"行事曆"},
    {key:"settings", icon:"◈", label:"設定"},
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#D8D8D4"}}>
        <div className="shell">
          <div className="screen">
            {tab==="home" && (
              <HomeScreen cases={cases} methods={methods} onOpen={openCase}
                updateCase={updateCase} showToast={showToast}/>
            )}
            {tab==="cases" && (
              <CasesScreen cases={cases} onOpen={openCase} onAdd={()=>setAddOpen(true)} deleteCase={deleteCase}/>
            )}
            {tab==="detail" && detailCase && (
              <DetailScreen case_={detailCase} methods={methods} onBack={closeDetail}
                updateCase={updateCase} showToast={showToast}/>
            )}
            {tab==="calendar" && (
              <CalendarScreen cases={cases} onOpen={openCase}/>
            )}
            {tab==="settings" && (
              <SettingsScreen
                methods={methods} setMethods={setMethods}
                levels={levels}   setLevels={setLevels}
              />
            )}
          </div>

          {addOpen && (
            <AddCaseModal existingCases={cases} levels={levels} onClose={()=>setAddOpen(false)}
              onSave={nc=>{addCase(nc);setAddOpen(false);}}/>
          )}

          {toast && <Toast msg={toast}/>}

          <div className="bnav">
            {NAV.map(n=>(
              <button key={n.key}
                className={`bnav-btn ${(tab===n.key||(tab==="detail"&&n.key==="cases"))?"active":""}`}
                onClick={()=>{setTab(n.key);setDetailId(null);}}>
                <span className="bnav-icon">{n.icon}</span>
                <span className="bnav-label">{n.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
