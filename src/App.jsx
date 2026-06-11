import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #F8F7F4;
  --surface:   #FFFFFF;
  --surface2:  #F4F3F0;
  --border:    #E8E6E0;
  --border2:   #D4D1CA;
  --text:      #1E1C18;
  --text2:     #3C3A34;
  --muted:     #928F86;
  --faint:     #C8C5BC;
  --red:       #C0392B;
  --red-bg:    #FDF0EF;
  --yellow:    #B8860B;
  --yellow-bg: #FDF8EC;
  --green:     #2D6A4F;
  --green-bg:  #EDF5F1;
  --accent:    #2C4A7C;
  --accent-lt: #EBF0F9;
  --accent-mid:#4A6FA0;
  --serif: 'Noto Serif TC', serif;
  --sans:  'Inter', system-ui, sans-serif;
  --r:     12px;
}

html, body {
  height: 100%;
  background: var(--bg);
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.55;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

.shell {
  width: 100%; min-height: 100dvh; max-width: 430px;
  margin: 0 auto; background: var(--bg);
  display: flex; flex-direction: column; position: relative;
}
.screen { flex: 1; overflow-y: auto; overflow-x: hidden; }
.screen::-webkit-scrollbar { display: none; }
.screen-pad { padding-bottom: 24px; }

.bnav {
  display: flex;
  background: rgba(255,255,255,0.94);
  border-top: 1px solid var(--border);
  padding: 10px 0 calc(env(safe-area-inset-bottom,0px) + 14px);
  flex-shrink: 0;
  backdrop-filter: blur(12px);
}
.bnav-btn {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px; border: none;
  background: none; cursor: pointer; padding: 4px 0;
  font-family: var(--sans);
}
.bnav-icon  { font-size: 19px; opacity: .3; transition: opacity .12s; }
.bnav-label { font-size: 10px; letter-spacing: .04em; color: var(--muted); font-weight: 500; }
.bnav-btn.active .bnav-icon  { opacity: 1; }
.bnav-btn.active .bnav-label { color: var(--accent); font-weight: 600; }

.ph {
  padding: calc(env(safe-area-inset-top,0px) + 20px) 22px 16px;
  display: flex; align-items: flex-end; justify-content: space-between;
  background: var(--bg);
}
.ph-eyebrow {
  font-family: var(--serif); font-size: 11px; font-weight: 300;
  letter-spacing: .08em; color: var(--muted); margin-bottom: 2px;
}
.ph-title {
  font-family: var(--serif); font-size: 22px; font-weight: 400;
  letter-spacing: -.01em; color: var(--text); line-height: 1.2;
}
.ph-sub   { font-size: 12px; color: var(--muted); font-weight: 400; }
.ph-action {
  font-size: 13px; color: var(--accent); font-weight: 500;
  cursor: pointer; border: none; background: none;
  font-family: var(--sans); padding: 6px 0; letter-spacing: .01em;
}

/* Status pill */
.spill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 2px 8px 2px 6px; border-radius: 20px;
  font-size: 11px; font-weight: 500; white-space: nowrap; flex-shrink: 0;
}
.spill .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.spill.red    { background: var(--red-bg);    color: var(--red);    }
.spill.yellow { background: var(--yellow-bg); color: var(--yellow); }
.spill.green  { background: var(--green-bg);  color: var(--green);  }
.spill.faint  { background: var(--surface2);  color: var(--muted);  }
.dot.red    { background: var(--red);    }
.dot.yellow { background: var(--yellow); }
.dot.green  { background: var(--green);  }
.dot.faint  { background: var(--faint);  }

/* Level badge — small, colour-coded */
.lvl-badge {
  display: inline-flex; align-items: center;
  padding: 2px 7px; border-radius: 6px;
  font-size: 10px; font-weight: 700;
  letter-spacing: .03em; white-space: nowrap; flex-shrink: 0;
}
.lvl-red    { background: var(--red-bg);    color: var(--red);    border: 1px solid #F5CECA; }
.lvl-yellow { background: var(--yellow-bg); color: var(--yellow); border: 1px solid #EDD9A0; }
.lvl-green  { background: var(--green-bg);  color: var(--green);  border: 1px solid #A8D8BC; }
.lvl-faint  { background: var(--surface2);  color: var(--muted);  border: 1px solid var(--border); }

.mtag {
  font-size: 10px; font-weight: 500; color: var(--muted);
  background: var(--surface2); border: 1px solid var(--border);
  padding: 2px 8px; border-radius: 20px;
  white-space: nowrap; flex-shrink: 0; letter-spacing: .01em;
}

/* Card row */
.card-row {
  background: var(--surface); border-radius: var(--r);
  margin: 0 16px 10px; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  cursor: pointer; border: 1px solid var(--border);
  transition: box-shadow .12s, border-color .12s;
}
.card-row:active { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-lt); }
.row-main { flex: 1; min-width: 0; }
.row-nick { font-size: 15px; font-weight: 500; color: var(--text); }
.row-meta { font-size: 12px; color: var(--muted); margin-top: 3px; }
.row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }

.sec-label {
  font-size: 10px; font-weight: 600; letter-spacing: .1em;
  text-transform: uppercase; color: var(--muted); padding: 18px 22px 8px;
}
.divider { height: 1px; background: var(--border); margin: 6px 22px; }

.act-btn {
  font-size: 12px; font-weight: 500; font-family: var(--sans);
  padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border2);
  background: var(--surface); color: var(--text2); cursor: pointer;
  white-space: nowrap; transition: all .12s; letter-spacing: .01em;
}
.act-btn:active { opacity: .75; }
.act-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.act-btn.danger  { color: var(--red); border-color: #EDCFCC; background: var(--red-bg); }
.act-btn:disabled { opacity: .3; cursor: default; }

/* Detail */
.back-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 16px; color: var(--accent); font-weight: 500;
  cursor: pointer; border: none; background: none;
  font-family: var(--sans);
  padding: 8px 12px 8px 4px;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}
.det-title { font-family: var(--serif); font-size: 20px; font-weight: 400; margin-top: 4px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px 16px; }
.info-cell { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 14px; }
.info-cell.full { grid-column: 1 / -1; }
.info-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); margin-bottom: 4px; }
.info-val   { font-size: 14px; font-weight: 500; }
.det-actions { display: flex; gap: 10px; padding: 4px 16px 16px; }
.det-actions .act-btn { flex: 1; padding: 11px 0; text-align: center; border-radius: 10px; font-size: 13px; font-weight: 500; }

.log-item { display: flex; gap: 14px; padding: 12px 22px; }
.log-line { width: 1px; background: var(--border); flex-shrink: 0; margin-top: 4px; }
.log-body { flex: 1; }
.log-date { font-size: 11px; color: var(--muted); margin-bottom: 3px; letter-spacing: .02em; }
.log-note { font-size: 13px; color: var(--text2); }

/* Calendar */
.cal-nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px 12px; }
.cal-month { font-family: var(--serif); font-size: 17px; font-weight: 400; letter-spacing: -.01em; }
.cal-arrow {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer; color: var(--muted);
  font-family: var(--sans); transition: all .1s;
}
.cal-arrow:active { background: var(--accent-lt); color: var(--accent); }
/* ── Calendar ── */
.cal-wrap {
  margin: 0 10px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  overflow: hidden;
  background: var(--surface);
}
.cal-head {
  display: flex;
  border-bottom: 1px solid var(--border);
}
.cal-th {
  flex: 1;
  text-align: center;
  font-size: 9px; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
  color: var(--muted);
  padding: 8px 0 7px;
}
/* 6 rows × 7 cols of absolutely-sized divs */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, var(--csz, 44px));
  grid-template-rows:    repeat(6, var(--csz, 44px));
  width:  calc(var(--csz, 44px) * 7);
  height: calc(var(--csz, 44px) * 6);
  overflow: hidden;
}
.cal-td {
  width:  var(--csz, 44px);
  height: var(--csz, 44px);
  min-width:  var(--csz, 44px);
  min-height: var(--csz, 44px);
  max-width:  var(--csz, 44px);
  max-height: var(--csz, 44px);
  border-right:  1px solid var(--border);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  background: var(--surface);
  box-sizing: border-box;
  transition: background .1s;
}
.cal-td:nth-child(7n)        { border-right: none; }
.cal-td:nth-child(n+37)      { border-bottom: none; }
.cal-td:active      { background: var(--accent-lt); }
.cal-td.empty       { cursor: default; background: #ECEAE4; pointer-events: none; }
.cal-td.today-cell  { background: var(--surface); }
.cal-td.selected-cell { background: var(--accent-lt); }
.cal-num {
  font-size: 11px; font-weight: 400;
  color: var(--text2); line-height: 1;
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; flex-shrink: 0;
}
.cal-td.today-cell .cal-num {
  background: var(--accent); color: #fff;
  border-radius: 50%; font-weight: 700; font-size: 11px;
}
.cal-dots { display: flex; gap: 2px; justify-content: center; flex-shrink: 0; }
.cal-dot  { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
.day-panel { margin: 12px 10px 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
.day-panel-header { padding: 12px 16px; border-bottom: 1px solid var(--border); font-family: var(--serif); font-size: 13px; font-weight: 400; color: var(--muted); }
.day-item { display: flex; align-items: center; gap: 14px; padding: 11px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background .1s; }
.day-item:last-child { border-bottom: none; }
.day-item:active { background: var(--accent-lt); }
.day-time { font-size: 12px; color: var(--muted); width: 36px; flex-shrink: 0; font-weight: 500; }
.day-nick { font-size: 13px; font-weight: 500; flex: 1; }
.day-meth { font-size: 11px; color: var(--muted); flex-shrink: 0; }

/* Settings */
.settings-group { margin: 0 16px 4px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 15px 18px; border-bottom: 1px solid var(--border); min-height: 54px; cursor: pointer; transition: background .1s; }
.settings-row:last-child { border-bottom: none; }
.settings-row:active { background: var(--surface2); }
.settings-row.static { cursor: default; }
.settings-row.static:active { background: var(--surface); }
.s-label { font-size: 14px; font-weight: 400; }
.s-sub   { font-size: 12px; color: var(--muted); margin-top: 1px; }
.s-val   { font-size: 13px; color: var(--muted); }
.s-arrow { font-size: 16px; color: var(--faint); }

.tog { width: 44px; height: 26px; border-radius: 13px; cursor: pointer; display: flex; align-items: center; padding: 3px; transition: background .2s; flex-shrink: 0; }
.tog.on  { background: var(--green); }
.tog.off { background: var(--faint); }
.tog-k { width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.2); transition: transform .2s; }
.tog.on .tog-k { transform: translateX(18px); }

/* Modals */
.overlay { position: absolute; inset: 0; background: rgba(18,16,12,.48); display: flex; align-items: flex-end; z-index: 100; animation: fi .15s; backdrop-filter: blur(3px); }
.sheet { width: 100%; background: var(--surface); border-radius: 20px 20px 0 0; padding: 14px 22px 40px; animation: su .22s cubic-bezier(.32,1.2,.45,1); max-height: 88vh; overflow-y: auto; }
.sheet::-webkit-scrollbar { display: none; }
.sheet-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--border); margin: 0 auto 20px; }
.sheet-title { font-family: var(--serif); font-size: 18px; font-weight: 400; margin-bottom: 4px; }
.sheet-sub { font-size: 12px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }

.inp { width: 100%; border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; font-size: 14px; font-family: var(--sans); color: var(--text); background: var(--bg); margin-bottom: 14px; outline: none; transition: border-color .15s; -webkit-appearance: none; height: 44px; }
.inp:focus { border-color: var(--accent); }
select.inp { cursor: pointer; appearance: auto; height: 44px; }
.inp-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-bottom: 5px; display: block; }
.inp-hint  { font-size: 11px; color: var(--muted); margin-top: -10px; margin-bottom: 14px; }
.inp-err   { font-size: 11px; color: var(--red); margin-top: -10px; margin-bottom: 14px; font-weight: 500; }

.opt-row { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
.opt { flex: 1; min-width: 52px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 10px; font-size: 12px; font-weight: 500; font-family: var(--sans); background: var(--bg); color: var(--muted); cursor: pointer; transition: all .12s; }
.opt.active { border-color: var(--accent); background: var(--accent-lt); color: var(--accent); }

.step-bar { display: flex; gap: 4px; margin-bottom: 18px; }
.step-seg { height: 2px; flex: 1; border-radius: 1px; background: var(--border); transition: background .2s; }
.step-seg.done { background: var(--accent); }

.btn-row { display: flex; gap: 10px; margin-top: 6px; }
.btn-row .act-btn { flex: 1; height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 14px; }

@keyframes fi { from { opacity:0 } to { opacity:1 } }
@keyframes su { from { transform: translateY(100%) } to { transform: translateY(0) } }

.toast { position: absolute; bottom: 88px; left: 50%; transform: translateX(-50%); background: rgba(18,16,12,.88); color: #fff; font-size: 12px; font-weight: 500; padding: 9px 18px; border-radius: 20px; z-index: 200; white-space: nowrap; pointer-events: none; letter-spacing: .01em; animation: tin .18s ease, tout .28s ease 1.5s forwards; }
@keyframes tin  { from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes tout { from{opacity:1}to{opacity:0} }

.empty { padding: 52px 24px; text-align: center; color: var(--muted); font-size: 13px; line-height: 1.8; font-family: var(--serif); font-weight: 300; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_METHODS = ["電話", "LINE", "訪視", "學校訪談"];
const TODAY = "2026-05-31";
const TODAY_DISPLAY = "五月 三十一日";

const INITIAL_LEVELS = {
  A: { label: "A 級", days: 7,  desc: "每週一次",   colorKey: "red"    },
  B: { label: "B 級", days: 14, desc: "每兩週一次", colorKey: "yellow" },
  C: { label: "C 級", days: 30, desc: "每月一次",   colorKey: "green"  },
  E: { label: "緊急",  days: 7,  desc: "每週",       colorKey: "red"    },
};

const INITIAL_CASES = [
  { id:"C001", nick:"阿明",  level:"A", note:"情緒起伏大，需定期關心",
    lastContact:"2026-05-15", nextContact:"2026-05-22",
    scheduled:{ date:"2026-05-31", time:"09:00", type:"訪視", note:"家訪確認藥物服用情況" },
    logs:[{date:"2026-05-15",method:"電話",note:"情況穩定，已確認回診"},{date:"2026-05-08",method:"電話",note:"略顯低落，持續追蹤"}] },
  { id:"C002", nick:"小芬",  level:"E", note:"近期壓力大",
    lastContact:"2026-05-10", nextContact:"2026-05-17", scheduled:null,
    logs:[{date:"2026-05-10",method:"LINE",note:"回覆慢，情況待觀察"}] },
  { id:"C003", nick:"老王",  level:"B", note:"",
    lastContact:"2026-05-09", nextContact:"2026-05-31",
    scheduled:{ date:"2026-06-04", time:"14:00", type:"電話", note:"例行電訪" },
    logs:[{date:"2026-05-09",method:"電話",note:"良好，下次兩週後"}] },
  { id:"C004", nick:"淑惠", level:"C", note:"月底壓力較大",
    lastContact:"2026-04-25", nextContact:"2026-05-25", scheduled:null, logs:[] },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const LS = { cases:"rc_cases3", methods:"rc_methods3", levels:"rc_levels3" };
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
function lsSet(key,val){ try{ localStorage.setItem(key,JSON.stringify(val)); }catch{} }

function daysBetween(a,b){ if(!a||!b)return 0; const ms=new Date(b)-new Date(a); return isNaN(ms)?0:Math.round(ms/86400000); }
function addDays(s,n){ if(!s)return TODAY; const d=new Date(s); if(isNaN(d.getTime()))return TODAY; d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
function calcNext(level,from,levelsMap){ const map=levelsMap||INITIAL_LEVELS; const days=map[level]?.days??30; return addDays(from||TODAY,Math.max(1,days)); }
function getStatus(c){ if(c.scheduled)return "green"; const d=daysBetween(TODAY,c.nextContact); if(d<0)return "red"; if(d<=2)return "yellow"; return "faint"; }
function getStatusLabel(c){ if(c.scheduled)return c.scheduled?.type||"已排定"; const d=daysBetween(TODAY,c.nextContact); if(d<0)return `逾期 ${Math.abs(d)} 天`; if(d===0)return "今日"; if(d===1)return "明日"; return `${d} 天後`; }
function generateId(cases){ const nums=cases.map(c=>parseInt(c.id.replace("C",""),10)).filter(n=>!isNaN(n)); return `C${String(nums.length?Math.max(...nums)+1:1).padStart(3,"0")}`; }
function getMonthDays(year,month){ return {first:new Date(year,month,1).getDay(),total:new Date(year,month+1,0).getDate()}; }
function ymd(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function order2(s){ return {red:0,yellow:1,green:2,faint:3}[s]; }

const LEVEL_COLOR_OPTIONS = [
  {key:"red",    label:"紅", bg:"#FDECEA", color:"#C0392B"},
  {key:"yellow", label:"黃", bg:"#FDF8EE", color:"#B8860B"},
  {key:"green",  label:"綠", bg:"#EDF5F1", color:"#2D6A4F"},
];

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function StatusPill({ status, label }) {
  return <span className={`spill ${status}`}><span className={`dot ${status}`}/>{label}</span>;
}

function LevelBadge({ levelKey, levels }) {
  const l = levels[levelKey];
  if (!l) return null;
  const colorKey = l.colorKey || "faint";
  const cls = `lvl-badge lvl-${colorKey}`;
  return <span className={cls}>{l.label}</span>;
}

function MTag({ text }) { return <span className="mtag">{text}</span>; }

function Toggle({ on, onToggle }) {
  return <div className={`tog ${on?"on":"off"}`} onClick={onToggle}><div className="tog-k"/></div>;
}
function Toast({ msg }) { return <div className="toast">{msg}</div>; }
function StepBar({ total, current }) {
  return <div className="step-bar">{Array.from({length:total}).map((_,i)=><div key={i} className={`step-seg ${i<=current?"done":""}`}/>)}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 編輯個案 (NEW in v7 — replaces "tap opens detail")
// ─────────────────────────────────────────────────────────────────────────────

function EditCaseModal({ case_:c, methods, levels, onClose, onSave, onDelete }) {
  const safe = methods.length>0 ? methods : ["電話"];
  const [nick,    setNick]    = useState(c.nick);
  const [note,    setNote]    = useState(c.note||"");
  const [level,   setLevel]   = useState(c.level);
  // nextContact: allow manual override
  const [nextDate, setNextDate] = useState(c.nextContact||TODAY);
  const [err, setErr] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  function save() {
    if (!nick.trim()) { setErr("暱稱不能空白"); return; }
    const safeDate = nextDate || calcNext(level, c.lastContact||TODAY, levels);
    onSave(c.id, {
      nick: nick.trim(),
      note: note.trim(),
      level,
      nextContact: safeDate,
    });
    onClose();
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">編輯個案</div>
        <div className="sheet-sub">{c.id}</div>

        <label className="inp-label">暱稱／代號</label>
        <input className="inp" value={nick} onChange={e=>{setNick(e.target.value);setErr("");}} maxLength={20} autoFocus/>
        {err && <div className="inp-err">{err}</div>}

        <label className="inp-label">關懷等級</label>
        <div className="opt-row">
          {Object.entries(levels).map(([k,l])=>{
            const col = LEVEL_COLOR_OPTIONS.find(c=>c.key===l.colorKey)||LEVEL_COLOR_OPTIONS[1];
            return (
              <div key={k} className={`opt ${level===k?"active":""}`}
                style={level===k?{background:col.bg,borderColor:col.color,color:col.color}:{}}
                onClick={()=>{
                  setLevel(k);
                  setNextDate(calcNext(k, c.lastContact||TODAY, levels));
                }}>
                {l.label}
              </div>
            );
          })}
        </div>
        <div className="inp-hint">{levels[level]?.desc} · 每 {levels[level]?.days} 天</div>

        <label className="inp-label">下次提醒日期</label>
        <input type="date" className="inp" value={nextDate} onChange={e=>setNextDate(e.target.value)}/>

        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="簡短備忘…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>

        {/* 刪除確認 */}
        {confirmDel ? (
          <div style={{background:"var(--red-bg)",border:"1px solid #EDCFCC",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:13,color:"var(--red)",fontWeight:500,marginBottom:10}}>確認刪除「{c.nick}」？此操作無法復原。</div>
            <div style={{display:"flex",gap:8}}>
              <button className="act-btn" style={{flex:1}} onClick={()=>setConfirmDel(false)}>取消</button>
              <button className="act-btn danger" style={{flex:1}} onClick={()=>{onDelete(c.id);onClose();}}>確認刪除</button>
            </div>
          </div>
        ) : (
          <div className="btn-row">
            <button className="act-btn danger" style={{flex:"0 0 auto",padding:"0 16px"}} onClick={()=>setConfirmDel(true)}>刪除</button>
            <button className="act-btn" style={{flex:1}} onClick={onClose}>取消</button>
            <button className="act-btn primary" style={{flex:1}} onClick={save}>儲存</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 記錄聯絡
// ─────────────────────────────────────────────────────────────────────────────

function LogModal({ case_:c, methods, onClose, onSave }) {
  const safe = methods.length>0 ? methods : ["電話"];
  const [method,setMethod] = useState(safe[0]);
  const [note,setNote]     = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">記錄聯絡</div>
        <div className="sheet-sub">{c.nick} · {TODAY}</div>
        <label className="inp-label">聯絡方式</label>
        <select className="inp" value={method} onChange={e=>setMethod(e.target.value)}>
          {safe.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="一兩句即可…" value={note} onChange={e=>setNote(e.target.value)} maxLength={80}/>
        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          <button className="act-btn primary" onClick={()=>{onSave(c.id,method,note.trim());onClose();}}>儲存</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 排定聯絡
// ─────────────────────────────────────────────────────────────────────────────

function ScheduleModal({ case_:c, methods, onClose, onSave }) {
  const safe = methods.length>0 ? methods : ["電話"];
  const [type,setType] = useState(safe[0]);
  const [date,setDate] = useState(addDays(TODAY,3));
  const [time,setTime] = useState("09:00");
  const [note,setNote] = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">排定聯絡</div>
        <div className="sheet-sub">{c.nick}</div>
        <label className="inp-label">聯絡方式</label>
        <select className="inp" value={type} onChange={e=>setType(e.target.value)}>
          {safe.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <label className="inp-label">日期</label>
        <input type="date" className="inp" value={date} min={TODAY} onChange={e=>setDate(e.target.value)}/>
        <label className="inp-label">時間（選填）</label>
        <input type="time" className="inp" value={time} onChange={e=>setTime(e.target.value)}/>
        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="目的或提醒…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>
        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          <button className="act-btn primary" onClick={()=>{ if(!date)return; onSave(c.id,{date,time,type,note:note.trim()||`${type}聯絡`}); onClose(); }} disabled={!date}>確認排定</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 延後
// ─────────────────────────────────────────────────────────────────────────────

function PostponeModal({ case_:c, onClose, onSave }) {
  const [days,setDays] = useState(1);
  const [note,setNote] = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">延後聯絡</div>
        <div className="sheet-sub">{c.nick}</div>
        <label className="inp-label">延後天數</label>
        <div className="opt-row">
          {[1,2,3,7].map(d=><div key={d} className={`opt ${days===d?"active":""}`} onClick={()=>setDays(d)}>{d} 天</div>)}
        </div>
        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="延後原因…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>
        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          <button className="act-btn primary" onClick={()=>{onSave(c.id,days,note.trim());onClose();}}>確認</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: 新增個案
// ─────────────────────────────────────────────────────────────────────────────

function AddCaseModal({ existingCases, levels, onClose, onSave }) {
  const [step,setStep]   = useState(0);
  const [nick,setNick]   = useState("");
  const [note,setNote]   = useState("");
  const [level,setLevel] = useState(Object.keys(levels)[0]||"B");
  const [last,setLast]   = useState(TODAY);
  const [err,setErr]     = useState("");
  const autoId = generateId(existingCases);

  function next(){ if(!nick.trim()){setErr("請輸入暱稱");return;} setErr(""); setStep(1); }
  function save(){
    const safeDate = last||TODAY;
    onSave({ id:autoId, nick:nick.trim(), note:note.trim(), level,
      lastContact:safeDate, nextContact:calcNext(level,safeDate,levels), scheduled:null, logs:[] });
    onClose();
  }
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <StepBar total={2} current={step}/>
        <div className="sheet-title">{step===0?"新增個案":"關懷設定"}</div>
        <div className="sheet-sub">{step===0?`編號：${autoId}`:"等級與上次聯絡日期"}</div>
        {step===0 && <>
          <label className="inp-label">暱稱（不可使用真實姓名）</label>
          <input className="inp" placeholder="例：阿明" value={nick} onChange={e=>{setNick(e.target.value);setErr("");}} maxLength={20} autoFocus/>
          {err && <div className="inp-err">{err}</div>}
          <label className="inp-label">備註（選填）</label>
          <input className="inp" placeholder="簡短備忘…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>
          <div className="btn-row">
            <button className="act-btn" onClick={onClose}>取消</button>
            <button className="act-btn primary" onClick={next}>下一步</button>
          </div>
        </>}
        {step===1 && <>
          <label className="inp-label">關懷等級</label>
          <div className="opt-row">
            {Object.entries(levels).map(([k,l])=>{
              const col=LEVEL_COLOR_OPTIONS.find(c=>c.key===l.colorKey)||LEVEL_COLOR_OPTIONS[1];
              return <div key={k} className={`opt ${level===k?"active":""}`}
                style={level===k?{background:col.bg,borderColor:col.color,color:col.color}:{}}
                onClick={()=>setLevel(k)}>{l.label}</div>;
            })}
          </div>
          <div className="inp-hint">{levels[level]?.desc}，每 {levels[level]?.days} 天</div>
          <label className="inp-label">上次聯絡日期</label>
          <input type="date" className="inp" value={last} onChange={e=>setLast(e.target.value)}/>
          <div className="inp-hint">下次聯絡：{calcNext(level,last||TODAY,levels).slice(5)}</div>
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
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function HomeScreen({ cases, methods, levels, updateCase, showToast }) {
  const [logModal,      setLogModal]      = useState(null);
  const [postponeModal, setPostponeModal] = useState(null);

  const tasks = cases
    .map(c=>({...c, status:getStatus(c)}))
    .filter(c=>c.status!=="faint")
    .sort((a,b)=>order2(a.status)-order2(b.status));

  function handleLogSave(id,method,note){
    updateCase(id,prev=>({ lastContact:TODAY, nextContact:calcNext(prev.level,TODAY,levels), scheduled:null, logs:[{date:TODAY,method,note:note||"已聯絡"},...prev.logs] }));
    showToast("已記錄");
  }
  function handlePostponeSave(id,days,note){
    updateCase(id,prev=>({ nextContact:addDays(prev.nextContact,days), logs:[{date:TODAY,method:"備註",note:note||`延後 ${days} 天`},...prev.logs] }));
    showToast(`已延後 ${days} 天`);
  }
  const sections = [
    {key:"red",    label:"需要聯絡"},
    {key:"yellow", label:"即將到期"},
    {key:"green",  label:"已排定"},
  ];

  return (
    <div className="screen-pad">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">{TODAY_DISPLAY}</div>
          <div className="ph-title">今天要做的事</div>
        </div>
        {tasks.length>0 && <span className="ph-sub">{tasks.length} 項</span>}
      </div>

      {tasks.length===0 && <div className="empty">今天沒有待辦<br/>好好休息</div>}

      {sections.map(s=>{
        const group = tasks.filter(c=>c.status===s.key);
        if(!group.length) return null;
        return (
          <div key={s.key}>
            <div className="sec-label">{s.label}</div>
            {group.map(c=>(
              <div className="card-row" key={c.id} style={{cursor:"default"}}>
                <div className="row-main">
                  <div>
                    <span className="row-nick">{c.nick}</span>
                  </div>
                  <div className="row-meta">
                    {c.scheduled
                      ? `${c.scheduled.date.slice(5)} · ${c.scheduled.time||""}`
                      : c.nextContact.slice(5)}
                  </div>
                </div>
                <div className="row-right">
                  <StatusPill status={c.status} label={getStatusLabel(c)}/>
                </div>
                <div style={{display:"flex",flexDirection:"row",gap:8}} onClick={e=>e.stopPropagation()}>
                  <button className="act-btn primary" style={{padding:"5px 12px",fontSize:12}}
                    onClick={e=>{e.stopPropagation();setLogModal(c);}}>已聯繫</button>
                  <button className="act-btn" style={{padding:"5px 12px",fontSize:12}}
                    onClick={e=>{e.stopPropagation();setPostponeModal(c);}}>延後</button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {logModal      && <LogModal      case_={logModal}      methods={methods} onClose={()=>setLogModal(null)}      onSave={handleLogSave}/>}
      {postponeModal && <PostponeModal case_={postponeModal}                   onClose={()=>setPostponeModal(null)} onSave={handlePostponeSave}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASES SCREEN — tap card → edit modal
// ─────────────────────────────────────────────────────────────────────────────

function CasesScreen({ cases, methods, levels, onAdd, updateCase, deleteCase, showToast }) {
  const [editModal, setEditModal] = useState(null);
  const sorted = [...cases].sort((a,b)=>order2(getStatus(a))-order2(getStatus(b)));

  function handleEditSave(id,patch){
    updateCase(id,()=>patch);
    showToast("已更新");
  }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">個案管理</div>
          <div className="ph-title">所有個案</div>
        </div>
        <button className="ph-action" onClick={onAdd}>＋ 新增</button>
      </div>

      {cases.length===0 && <div className="empty">尚無個案<br/>點右上角新增</div>}

      {sorted.map(c=>{
        const diff = daysBetween(TODAY,c.nextContact);
        return (
          <div className="card-row" key={c.id} onClick={()=>setEditModal(c)}>
            <div className="row-main">
              <div>
                <span className="row-nick">{c.nick}</span>
              </div>
              <div className="row-meta">
                {c.id} · {c.scheduled
                  ? `${c.scheduled.date.slice(5)} ${c.scheduled.type}`
                  : diff<0 ? `逾期 ${Math.abs(diff)}天`
                  : diff===0 ? "今日到期"
                  : `${diff} 天後`}
              </div>
            </div>
            <LevelBadge levelKey={c.level} levels={levels}/>
          </div>
        );
      })}

      {editModal && (
        <EditCaseModal case_={editModal} methods={methods} levels={levels}
          onClose={()=>setEditModal(null)}
          onSave={handleEditSave}
          onDelete={(id)=>{deleteCase(id);setEditModal(null);}}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL SCREEN — kept for log history, accessed from calendar day-items
// ─────────────────────────────────────────────────────────────────────────────

function DetailScreen({ case_:c, methods, levels, onBack, updateCase, showToast }) {
  const [logModal,  setLogModal]  = useState(false);
  const [schedModal,setSchedModal]= useState(false);
  const [editModal, setEditModal] = useState(false);

  const diff = daysBetween(TODAY,c.nextContact);
  const urgColor = diff<0?"var(--red)":diff<=2?"var(--yellow)":"var(--green)";
  const urgLabel = diff<0?`逾期 ${Math.abs(diff)} 天`:diff===0?"今日到期":diff===1?"明日到期":`${diff} 天後`;

  function handleLogSave(id,method,note){
    updateCase(id,prev=>({ lastContact:TODAY, nextContact:calcNext(prev.level,TODAY,levels), scheduled:null, logs:[{date:TODAY,method,note:note||"已聯絡"},...prev.logs] }));
    showToast("已記錄");
  }
  function handleSchedSave(id,sched){
    updateCase(id,()=>({scheduled:sched}));
    showToast(`已排定 ${sched.type} · ${sched.date.slice(5)}`);
  }
  function handleEditSave(id,patch){
    updateCase(id,()=>patch);
    showToast("已更新");
  }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div>
          <button className="back-btn" onClick={onBack}>‹ 返回</button>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <div className="det-title">{c.nick}</div>
            <LevelBadge levelKey={c.level} levels={levels}/>
          </div>
        </div>
        <button className="ph-action" onClick={()=>setEditModal(true)}>編輯</button>
      </div>

      <div className="info-grid">
        <div className="info-cell">
          <div className="info-label">上次聯絡</div>
          <div className="info-val">{c.lastContact?.slice(5)||"—"}</div>
        </div>
        <div className="info-cell">
          <div className="info-label">下次聯絡</div>
          <div className="info-val" style={{color:urgColor}}>{c.nextContact?.slice(5)||"—"}</div>
        </div>
        <div className="info-cell full">
          <div className="info-label">狀態</div>
          <div className="info-val" style={{color:urgColor}}>{urgLabel}</div>
        </div>
        {c.note && (
          <div className="info-cell full">
            <div className="info-label">備註</div>
            <div className="info-val" style={{fontWeight:400,fontSize:13,lineHeight:1.5}}>{c.note}</div>
          </div>
        )}
        {c.scheduled && (
          <div className="info-cell full" style={{background:"var(--green-bg)",borderColor:"#B8D9C8"}}>
            <div className="info-label" style={{color:"var(--green)"}}>已排定</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div className="info-val" style={{color:"var(--green)",fontWeight:400,fontSize:13}}>
                {c.scheduled.date} {c.scheduled.time} · {c.scheduled.type}
                {c.scheduled.note?` · ${c.scheduled.note}`:""}
              </div>
              <button className="act-btn danger" style={{fontSize:11,padding:"4px 10px",marginLeft:8}}
                onClick={()=>{updateCase(c.id,()=>({scheduled:null}));showToast("已取消排程");}}>取消</button>
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
      {c.logs.length===0 && <div className="empty" style={{padding:"24px"}}>尚無紀錄</div>}
      {c.logs.map((log,i)=>(
        <div className="log-item" key={i}>
          <div className="log-line"/>
          <div className="log-body">
            <div className="log-date">{log.date} · <span style={{background:"var(--surface2)",padding:"1px 7px",borderRadius:4,fontSize:11}}>{log.method}</span></div>
            <div className="log-note" style={{marginTop:3}}>{log.note}</div>
          </div>
        </div>
      ))}

      {logModal   && <LogModal      case_={c} methods={methods} onClose={()=>setLogModal(false)}   onSave={handleLogSave}/>}
      {schedModal && <ScheduleModal case_={c} methods={methods} onClose={()=>setSchedModal(false)} onSave={handleSchedSave}/>}
      {editModal  && <EditCaseModal case_={c} methods={methods} levels={levels}
        onClose={()=>setEditModal(false)} onSave={handleEditSave}
        onDelete={(id)=>{updateCase(id,()=>null);onBack();}}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR SCREEN
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const DOW = ["日","一","二","三","四","五","六"];

function CalendarScreen({ cases, onOpen }) {
  const tp = TODAY.split("-").map(Number);
  const [year,setYear]   = useState(tp[0]);
  const [month,setMonth] = useState(tp[1]-1);
  const [selected,setSel]= useState(TODAY);
  const wrapRef = useRef(null);

  // Set --csz CSS variable once after mount (and on resize)
  useEffect(() => {
    function apply() {
      if (!wrapRef.current) return;
      const w = wrapRef.current.offsetWidth;
      if (w > 0) {
        const sz = Math.floor(w / 7);
        wrapRef.current.style.setProperty('--csz', sz + 'px');
      }
    }
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  function prev(){ if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); }
  function next(){ if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); }

  const {first,total} = getMonthDays(year,month);
  const cells = [];
  for(let i=0;i<first;i++) cells.push(null);
  for(let d=1;d<=total;d++) cells.push(d);
  while(cells.length<42) cells.push(null);

  const eventMap = {};
  cases.forEach(c=>{
    const d = c.scheduled?.date;
    if(d){ if(!eventMap[d])eventMap[d]=[]; eventMap[d].push({nick:c.nick,time:c.scheduled.time||"",type:c.scheduled?.type||"聯絡",id:c.id}); }
    else { const d2=c.nextContact; if(d2){if(!eventMap[d2])eventMap[d2]=[]; eventMap[d2].push({nick:c.nick,time:"",type:getStatusLabel(c),id:c.id,auto:true});} }
  });
  const selEvts = eventMap[selected]||[];

  return (
    <div className="screen-pad">
      <div className="cal-nav">
        <button className="cal-arrow" onClick={prev}>‹</button>
        <div className="cal-month">{year}年 {MONTH_NAMES[month]}</div>
        <button className="cal-arrow" onClick={next}>›</button>
      </div>

      <div className="cal-wrap" ref={wrapRef}>
        {/* DOW header */}
        <div className="cal-head">
          {DOW.map(d=><div key={d} className="cal-th">{d}</div>)}
        </div>
        {/* 42 cells locked to --csz × --csz each */}
        <div className="cal-grid">
          {cells.map((d,i)=>{
            if(d===null) return <div key={i} className="cal-td empty"/>;
            const ds = ymd(year,month,d);
            const evts = eventMap[ds]||[];
            const cls = ["cal-td",
              ds===TODAY?"today-cell":"",
              ds===selected&&ds!==TODAY?"selected-cell":"",
            ].filter(Boolean).join(" ");
            return (
              <div key={ds} className={cls} onClick={()=>setSel(ds)}>
                <div className="cal-num">{d}</div>
                {evts.length>0&&(
                  <div className="cal-dots">
                    {evts.slice(0,3).map((ev,j)=>(
                      <div key={j} className="cal-dot"
                        style={{background:ev.auto?"var(--yellow)":"var(--green)"}}/>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="day-panel">
        <div className="day-panel-header">
          {selected.slice(5).replace("-","/")} · {selEvts.length===0?"無行程":`${selEvts.length} 項`}
        </div>
        {selEvts.length===0 && <div style={{padding:"16px",fontSize:13,color:"var(--muted)"}}>這天沒有排定事項</div>}
        {selEvts.map((e,i)=>(
          <div className="day-item" key={i} onClick={()=>onOpen(e.id)}>
            <div className="day-time">{e.time||"—"}</div>
            <div className="day-nick">{e.nick}</div>
            <div className="day-meth">{e.type}</div>
          </div>
        ))}
      </div>
    </div>

  );
}

function MethodsPage({ methods, setMethods, onBack }) {
  const [editing,setEditing] = useState(null);
  const [editVal,setEditVal] = useState("");
  const [adding,setAdding]   = useState(false);
  const [newVal,setNewVal]   = useState("");

  function startEdit(i){ setEditing(i); setEditVal(methods[i]); setAdding(false); }
  function saveEdit(){ const v=editVal.trim(); if(!v){setEditing(null);return;} setMethods(prev=>prev.map((m,i)=>i===editing?v:m)); setEditing(null); }
  function del(i){ if(methods.length<=1)return; setMethods(prev=>prev.filter((_,j)=>j!==i)); setEditing(null); }
  function addM(){ const v=newVal.trim(); if(!v||methods.includes(v))return; setMethods(prev=>[...prev,v]); setNewVal(""); setAdding(false); }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">聯絡方式</div></div>
        <button className="ph-action" onClick={()=>{setAdding(true);setEditing(null);}}>＋</button>
      </div>
      <div className="settings-group">
        {methods.map((m,i)=>(
          editing===i ? (
            <div key={i} className="settings-row" style={{gap:8,cursor:"default"}}>
              <input className="inp" style={{flex:1,marginBottom:0,height:36,padding:"0 12px",fontSize:13}}
                value={editVal} onChange={e=>setEditVal(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} autoFocus/>
              <button className="act-btn primary" style={{padding:"6px 12px",fontSize:12}} onClick={saveEdit}>存</button>
              <button className="act-btn danger"  style={{padding:"6px 10px",fontSize:12}} onClick={()=>del(i)} disabled={methods.length<=1}>刪</button>
            </div>
          ) : (
            <div key={i} className="settings-row" onClick={()=>startEdit(i)}>
              <span className="s-label">{m}</span>
              <span style={{fontSize:12,color:"var(--accent-mid)"}}>編輯</span>
            </div>
          )
        ))}
        {adding && (
          <div className="settings-row" style={{gap:8,cursor:"default"}}>
            <input className="inp" style={{flex:1,marginBottom:0,height:36,padding:"0 12px",fontSize:13}}
              placeholder="新聯絡方式…" value={newVal} onChange={e=>setNewVal(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")addM();if(e.key==="Escape")setAdding(false);}} autoFocus/>
            <button className="act-btn primary" style={{padding:"6px 12px",fontSize:12}} onClick={addM}>加入</button>
            <button className="act-btn" style={{padding:"6px 10px",fontSize:12}} onClick={()=>setAdding(false)}>✕</button>
          </div>
        )}
      </div>
      <div style={{padding:"12px 22px",fontSize:12,color:"var(--muted)",lineHeight:1.7}}>此處設定的方式會出現在聯絡記錄與排定聯絡的選項中。</div>
    </div>
  );
}

function LevelsPage({ levels, setLevels, onBack }) {
  const [editKey,setEditKey] = useState(null);
  const [form,setForm]       = useState({});
  const [adding,setAdding]   = useState(false);
  const [newForm,setNewForm] = useState({key:"",label:"",days:14,desc:"",colorKey:"yellow"});
  const [err,setErr]         = useState("");

  const colorOf = k => LEVEL_COLOR_OPTIONS.find(c=>c.key===k)||LEVEL_COLOR_OPTIONS[1];

  function startEdit(k){ setEditKey(k); setAdding(false); setForm({label:levels[k].label,days:levels[k].days,desc:levels[k].desc||"",colorKey:levels[k].colorKey||"yellow"}); }
  function saveEdit(){ if(!form.label?.trim())return; setLevels(prev=>({...prev,[editKey]:{...prev[editKey],label:form.label.trim(),days:Math.max(1,Number(form.days)||7),desc:(form.desc||"").trim(),colorKey:form.colorKey}})); setEditKey(null); }
  function delLevel(k){ if(Object.keys(levels).length<=1)return; setLevels(prev=>{const n={...prev};delete n[k];return n;}); setEditKey(null); }
  function startAdd(){ setAdding(true); setEditKey(null); setNewForm({key:"",label:"",days:14,desc:"",colorKey:"yellow"}); setErr(""); }
  function saveAdd(){ const k=newForm.key.trim().toUpperCase(); if(!k||!newForm.label.trim()){setErr("請填寫 ID 和名稱");return;} if(levels[k]){setErr(`ID「${k}」已存在`);return;} setLevels(prev=>({...prev,[k]:{label:newForm.label.trim(),days:Math.max(1,Number(newForm.days)||14),desc:(newForm.desc||"").trim(),colorKey:newForm.colorKey}})); setAdding(false); setErr(""); }

  const EditForm = ({f,setF,onSave,onCancel,onDel,canDel}) => (
    <div style={{background:"var(--bg)",padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
      <label className="inp-label">名稱</label>
      <input className="inp" value={f.label} onChange={e=>setF(x=>({...x,label:e.target.value}))} autoFocus/>
      <label className="inp-label">頻率說明</label>
      <input className="inp" value={f.desc} placeholder="例：每週一次" onChange={e=>setF(x=>({...x,desc:e.target.value}))}/>
      <label className="inp-label">間隔天數</label>
      <input className="inp" type="number" min={1} value={f.days} onChange={e=>setF(x=>({...x,days:e.target.value}))}/>
      <label className="inp-label">顏色</label>
      <div className="opt-row" style={{marginBottom:12}}>
        {LEVEL_COLOR_OPTIONS.map(c=>(
          <div key={c.key} className={`opt ${f.colorKey===c.key?"active":""}`}
            style={f.colorKey===c.key?{background:c.bg,borderColor:c.color,color:c.color}:{}}
            onClick={()=>setF(x=>({...x,colorKey:c.key}))}>{c.label}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="act-btn primary" style={{flex:2,padding:"8px 0",fontSize:13}} onClick={onSave}>儲存</button>
        {canDel && <button className="act-btn danger" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={onDel}>刪除</button>}
        <button className="act-btn" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={onCancel}>取消</button>
      </div>
    </div>
  );

  return (
    <div className="screen-pad">
      <div className="ph">
        <div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">關懷等級</div></div>
        <button className="ph-action" onClick={startAdd}>＋</button>
      </div>
      <div className="settings-group">
        {Object.entries(levels).map(([k,l])=>{
          const col = colorOf(l.colorKey||"yellow");
          return editKey===k ? (
            <EditForm key={k} f={form} setF={setForm} onSave={saveEdit} onCancel={()=>setEditKey(null)} onDel={()=>delLevel(k)} canDel={Object.keys(levels).length>1}/>
          ) : (
            <div key={k} className="settings-row" onClick={()=>startEdit(k)}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:col.bg,color:col.color,letterSpacing:".02em"}}>{l.label}</span>
                <div><div className="s-label">{l.desc||"—"}</div><div className="s-sub">每 {l.days} 天</div></div>
              </div>
              <span style={{fontSize:12,color:"var(--accent-mid)"}}>編輯</span>
            </div>
          );
        })}
        {adding && (
          <div style={{background:"var(--bg)",padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
            <label className="inp-label">名稱</label>
            <input className="inp" placeholder="例：高風險" value={newForm.label} onChange={e=>setNewForm(f=>({...f,label:e.target.value}))} autoFocus/>
            <label className="inp-label">頻率說明</label>
            <input className="inp" placeholder="例：每月兩次" value={newForm.desc} onChange={e=>setNewForm(f=>({...f,desc:e.target.value}))}/>
            <label className="inp-label">間隔天數</label>
            <input className="inp" type="number" min={1} value={newForm.days} onChange={e=>setNewForm(f=>({...f,days:e.target.value}))}/>
            <label className="inp-label">識別碼（英文，如 A / B）</label>
            <input className="inp" placeholder="例：H" value={newForm.key} onChange={e=>setNewForm(f=>({...f,key:e.target.value}))} maxLength={4}/>
            <label className="inp-label">顏色</label>
            <div className="opt-row" style={{marginBottom:12}}>
              {LEVEL_COLOR_OPTIONS.map(c=>(
                <div key={c.key} className={`opt ${newForm.colorKey===c.key?"active":""}`}
                  style={newForm.colorKey===c.key?{background:c.bg,borderColor:c.color,color:c.color}:{}}
                  onClick={()=>setNewForm(f=>({...f,colorKey:c.key}))}>{c.label}</div>
              ))}
            </div>
            {err && <div className="inp-err">{err}</div>}
            <div style={{display:"flex",gap:6}}>
              <button className="act-btn primary" style={{flex:2,padding:"8px 0",fontSize:13}} onClick={saveAdd}>建立</button>
              <button className="act-btn" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={()=>{setAdding(false);setErr("");}}>取消</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReminderPage({ onBack }) {
  const PRESETS = ["08:00","09:00","12:00","13:00","18:00","20:00"];
  const [times,setTimes]   = useState(["09:00"]);
  const [adding,setAdding] = useState(false);
  const [custom,setCustom] = useState("09:00");

  function addTime(t){ if(!times.includes(t)) setTimes(prev=>[...prev,t].sort()); setAdding(false); }
  function removeTime(t){ if(times.length>1) setTimes(prev=>prev.filter(x=>x!==t)); }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">提醒設定</div></div>
      </div>
      <div className="settings-group">
        {times.map(t=>(
          <div key={t} className="settings-row">
            <span className="s-label" style={{fontVariantNumeric:"tabular-nums"}}>{t}</span>
            <button className="act-btn danger" style={{padding:"4px 10px",fontSize:12}} onClick={()=>removeTime(t)} disabled={times.length<=1}>移除</button>
          </div>
        ))}
        <div className="settings-row" style={{cursor:"default"}}>
          <button className="act-btn" style={{width:"100%",padding:"9px 0",textAlign:"center",fontSize:13}} onClick={()=>setAdding(!adding)}>
            {adding?"取消":"＋ 新增提醒時間"}
          </button>
        </div>
        {adding && (
          <div style={{padding:"12px 16px",background:"var(--bg)",borderTop:"1px solid var(--border)"}}>
            <div className="opt-row" style={{marginBottom:10}}>
              {PRESETS.filter(p=>!times.includes(p)).map(p=>(
                <div key={p} className="opt" style={{minWidth:60}} onClick={()=>addTime(p)}>{p}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input type="time" className="inp" style={{flex:1,marginBottom:0}} value={custom} onChange={e=>setCustom(e.target.value)}/>
              <button className="act-btn primary" style={{padding:"0 16px"}} onClick={()=>addTime(custom)}>加入</button>
            </div>
          </div>
        )}
      </div>
      <div style={{padding:"12px 22px",fontSize:12,color:"var(--muted)",lineHeight:1.7}}>每到提醒時間，若有待辦事項，系統會發送通知。</div>
    </div>
  );
}

function SettingsScreen({ cases, methods, setMethods, levels, setLevels, showToast }) {
  const [page,setPage] = useState("hub");

  if(page==="methods")  return <MethodsPage  methods={methods} setMethods={setMethods} onBack={()=>setPage("hub")}/>;
  if(page==="levels")   return <LevelsPage   levels={levels}   setLevels={setLevels}   onBack={()=>setPage("hub")}/>;
  if(page==="reminder") return <ReminderPage onBack={()=>setPage("hub")}/>;

  // ── 匯出 CSV ──────────────────────────────────────────────────────────────
  function exportCSV(){
    const header = ["暱稱","編號","等級","下次聯絡","已排定","備註"];
    const rows = cases.map(c=>[
      c.nick??'', c.id??'',
      levels[c.level]?.label||c.level||'',
      c.nextContact??'',
      c.scheduled?`${c.scheduled.date} ${c.scheduled.type}`:'',
      c.note??''
    ]);
    const csv = [header,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="ReCon_export.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("已匯出 CSV");
  }

  // ── 匯出 CanWe 相容格式（JSON）────────────────────────────────────────────
  function exportCanWe(){
    const payload = {
      version: "1.0",
      source: "ReCon",
      exportedAt: new Date().toISOString(),
      contacts: cases.map(c=>({
        name:              c.nick            ?? "",
        phone:             "",
        level:             levels[c.level]?.label ?? c.level ?? "",
        preferredMethod:   c.scheduled?.type ?? (c.logs?.[0]?.method ?? ""),
        nextContactDate:   c.nextContact     ?? "",
        notes:             c.note            ?? "",
        history: (c.logs ?? []).map(l=>({
          date:   l.date   ?? "",
          method: l.method ?? "",
          note:   l.note   ?? "",
        })),
      })),
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], {type:"application/json;charset=utf-8;"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download="recon_canwe_export.json"; a.click();
    URL.revokeObjectURL(url);
    showToast("已匯出 CanWe 相容檔案，可於 CanWe 匯入使用");
  }

  return (
    <div className="screen-pad">
      <div className="ph">
        <div><div className="ph-eyebrow">ReCon｜再聯絡</div><div className="ph-title">設定</div></div>
      </div>
      <div className="sec-label">管理</div>
      <div className="settings-group">
        <div className="settings-row" onClick={()=>setPage("methods")}>
          <div><div className="s-label">聯絡方式管理</div><div className="s-sub">{methods.length} 種方式</div></div>
          <span className="s-arrow">›</span>
        </div>
        <div className="settings-row" onClick={()=>setPage("levels")}>
          <div><div className="s-label">關懷等級管理</div><div className="s-sub">{Object.keys(levels).length} 個等級</div></div>
          <span className="s-arrow">›</span>
        </div>
        <div className="settings-row" onClick={()=>setPage("reminder")}>
          <div className="s-label">提醒設定</div>
          <span className="s-arrow">›</span>
        </div>
      </div>
      <div className="sec-label">匯出資料</div>
      <div className="settings-group">
        <div className="settings-row" onClick={exportCSV}>
          <div>
            <div className="s-label">匯出 CSV</div>
            <div className="s-sub">個案列表，可用 Excel 開啟</div>
          </div>
          <span className="s-arrow">↓</span>
        </div>
        <div className="settings-row" onClick={exportCanWe}>
          <div>
            <div className="s-label">匯出 CanWe 格式</div>
            <div className="s-sub">JSON 格式，可於 CanWe 匯入使用</div>
          </div>
          <span className="s-arrow">↓</span>
        </div>
      </div>
      <div className="sec-label">關於</div>
      <div className="settings-group">
        <div className="settings-row static">
          <span className="s-label">版本</span><span className="s-val">v7.0</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [cases,   setCases]   = useState(()=>lsGet(LS.cases,   INITIAL_CASES));
  const [methods, setMethods] = useState(()=>lsGet(LS.methods, INITIAL_METHODS));
  const [levels,  setLevels]  = useState(()=>lsGet(LS.levels,  INITIAL_LEVELS));
  const [tab,     setTab]     = useState("home");
  const [detailId,setDetailId]= useState(null);
  const [toast,   setToast]   = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const toastTimer = useRef(null);

  useEffect(()=>{ lsSet(LS.cases,   cases);   },[cases]);
  useEffect(()=>{ lsSet(LS.methods, methods); },[methods]);
  useEffect(()=>{ lsSet(LS.levels,  levels);  },[levels]);
  useEffect(()=>{ document.title="ReCon｜再聯絡"; },[]);

  function updateCase(id, patchFn) {
    setCases(prev=>{
      const next = prev.map(c=>{
        if(c.id!==id) return c;
        try {
          const patch = patchFn(c);
          if(patch===null) return null; // signal deletion
          return {
            ...c, ...patch,
            lastContact: patch.lastContact||c.lastContact||TODAY,
            nextContact: patch.nextContact||c.nextContact||TODAY,
            logs: Array.isArray(patch.logs)?patch.logs:c.logs,
            scheduled: patch.hasOwnProperty("scheduled")?patch.scheduled:c.scheduled,
          };
        } catch(e){ console.error(e); return c; }
      });
      return next.filter(Boolean); // remove nulls (deleted)
    });
  }

  function addCase(nc){ setCases(prev=>[...prev,nc]); showToast(`已新增 ${nc.nick}`); }
  function deleteCase(id){
    setCases(prev=>prev.filter(c=>c.id!==id));
    showToast("已刪除");
    if(detailId===id){ setDetailId(null); setTab("cases"); }
  }
  function showToast(msg){
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(null),1900);
  }
  function openCase(id){ setDetailId(id); setTab("detail"); }
  function closeDetail(){ setDetailId(null); setTab("cases"); }

  const detailCase = cases.find(c=>c.id===detailId)??null;

  const NAV = [
    {key:"home",     icon:"◦", label:"今日"},
    {key:"cases",    icon:"≡", label:"個案"},
    {key:"calendar", icon:"□", label:"行事曆"},
    {key:"settings", icon:"⊙", label:"設定"},
  ];

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <div className="screen">
          {tab==="home" && (
            <HomeScreen cases={cases} methods={methods} levels={levels}
              updateCase={updateCase} showToast={showToast}/>
          )}
          {tab==="cases" && (
            <CasesScreen cases={cases} methods={methods} levels={levels}
              onAdd={()=>setAddOpen(true)} updateCase={updateCase}
              deleteCase={deleteCase} showToast={showToast}/>
          )}
          {tab==="detail" && detailCase && (
            <DetailScreen case_={detailCase} methods={methods} levels={levels}
              onBack={closeDetail} updateCase={updateCase} showToast={showToast}/>
          )}
          {tab==="calendar" && (
            <CalendarScreen cases={cases} onOpen={openCase}/>
          )}
          {tab==="settings" && (
            <SettingsScreen cases={cases} methods={methods} setMethods={setMethods}
              levels={levels} setLevels={setLevels} showToast={showToast}/>
          )}
        </div>

        {addOpen && (
          <AddCaseModal existingCases={cases} levels={levels}
            onClose={()=>setAddOpen(false)}
            onSave={nc=>{addCase(nc);setAddOpen(false);}}/>
        )}
        {toast && <Toast msg={toast}/>}

        <div className="bnav">
          {NAV.map(n=>(
            <button key={n.key}
              className={`bnav-btn ${(tab===n.key||(tab==="detail"&&n.key==="cases"))?"active":""}`}
              onClick={()=>{ setTab(n.key); setDetailId(null); }}>
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
