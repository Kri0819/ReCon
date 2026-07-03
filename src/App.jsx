import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F8F7F4;--surface:#FFFFFF;--surface2:#F4F3F0;
  --border:#E8E6E0;--border2:#D4D1CA;
  --text:#1E1C18;--text2:#3C3A34;--muted:#928F86;--faint:#C8C5BC;
  --red:#C0392B;--red-bg:#FDF0EF;
  --yellow:#B8860B;--yellow-bg:#FDF8EC;
  --green:#2D6A4F;--green-bg:#EDF5F1;
  --accent:#2C4A7C;--accent-lt:#EBF0F9;--accent-mid:#4A6FA0;
  --serif:'Noto Serif TC',serif;--sans:'Inter',system-ui,sans-serif;--r:12px;
}
[data-theme="dark"]{
  --bg:#0F1520;--surface:#1A2432;--surface2:#141C28;
  --border:#2C3A4C;--border2:#3A4A5E;
  --text:#FFFFFF;--text2:#D8E0EA;--muted:#9AACBE;--faint:#4A5A6E;
  --red:#FF6B6B;--red-bg:#2E1818;
  --yellow:#F0B840;--yellow-bg:#2A2008;
  --green:#5FC088;--green-bg:#0F241A;
  --accent:#7FB0E8;--accent-lt:#1E3248;--accent-mid:#6FA0D8;
}
html,body{height:100%;background:var(--bg);font-family:var(--sans);font-size:14px;line-height:1.55;color:var(--text);-webkit-font-smoothing:antialiased}
.shell{width:100%;height:100dvh;max-width:430px;margin:0 auto;background:var(--bg);display:flex;flex-direction:column;position:relative;overflow:hidden}
.screen{flex:1;overflow-y:auto;overflow-x:hidden}
.screen::-webkit-scrollbar{display:none}
.screen-pad{padding-bottom:24px}
.bnav{display:flex;background:var(--surface);border-top:1px solid var(--border);padding:10px 0 calc(env(safe-area-inset-bottom,0px) + 14px);flex-shrink:0;backdrop-filter:blur(12px);opacity:.97}
.bnav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;cursor:pointer;padding:4px 0;font-family:var(--sans)}
.bnav-icon{font-size:19px;opacity:.3;transition:opacity .12s}
.bnav-label{font-size:10px;letter-spacing:.04em;color:var(--muted);font-weight:500}
.bnav-btn.active .bnav-icon{opacity:1}
.bnav-btn.active .bnav-label{color:var(--accent);font-weight:600}
.ph{padding:calc(env(safe-area-inset-top,0px) + 20px) 22px 18px;display:flex;align-items:flex-end;justify-content:space-between;background:var(--bg)}
.ph-eyebrow{font-family:var(--serif);font-size:11px;font-weight:300;letter-spacing:.08em;color:var(--muted);margin-bottom:2px}
.ph-title{font-family:var(--serif);font-size:22px;font-weight:400;letter-spacing:-.01em;color:var(--text);line-height:1.2}
.ph-sub{font-size:12px;color:var(--muted);font-weight:400}
.ph-action{font-size:16px;color:var(--accent);font-weight:500;cursor:pointer;border:none;background:none;font-family:var(--sans);padding:8px 12px 8px 4px;min-height:44px;-webkit-tap-highlight-color:transparent}
.spill{display:inline-flex;align-items:center;gap:5px;padding:2px 8px 2px 6px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap;flex-shrink:0}
.spill .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.spill.red{background:var(--red-bg);color:var(--red)}.dot.red{background:var(--red)}
.spill.yellow{background:var(--yellow-bg);color:var(--yellow)}.dot.yellow{background:var(--yellow)}
.spill.green{background:var(--green-bg);color:var(--green)}.dot.green{background:var(--green)}
.spill.faint{background:var(--surface2);color:var(--muted)}.dot.faint{background:var(--faint)}
.lvl-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.03em;white-space:nowrap;flex-shrink:0}
.lvl-red{background:var(--red-bg);color:var(--red);border:1px solid #F5CECA}
.lvl-yellow{background:var(--yellow-bg);color:var(--yellow);border:1px solid #EDD9A0}
.lvl-green{background:var(--green-bg);color:var(--green);border:1px solid #A8D8BC}
.lvl-faint{background:var(--surface2);color:var(--muted);border:1px solid var(--border)}
/* Tracking progress */
.plan-block{margin:0 16px 10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.plan-block-hd{padding:10px 14px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.plan-row{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-bottom:1px solid var(--border)}
.plan-row:last-child{border-bottom:none}
.plan-name{font-size:13px;font-weight:500}
.plan-freq{font-size:11px;color:var(--muted);margin-top:1px}
.plan-prog{font-size:12px;font-weight:600}
.plan-prog.done{color:var(--green)}.plan-prog.todo{color:var(--yellow)}
/* Card rows */
.card-row{background:var(--surface);border-radius:var(--r);margin:0 22px 12px;padding:18px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;border:1px solid var(--border);transition:box-shadow .12s,border-color .12s}
.card-row:active{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-lt)}
.row-main{flex:1;min-width:0}
.row-nick{font-size:15px;font-weight:500;color:var(--text)}
.row-meta{font-size:12px;color:var(--muted);margin-top:3px}
.row-plans{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
.row-plan-chip{font-size:10px;font-weight:500;padding:2px 7px;border-radius:10px;white-space:nowrap}
.row-plan-chip.done{background:var(--green-bg);color:var(--green)}
.row-plan-chip.todo{background:var(--yellow-bg);color:var(--yellow)}
.row-plan-chip.idle{background:var(--surface2);color:var(--muted)}
.sec-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:18px 22px 8px}
.act-btn{font-size:12px;font-weight:500;font-family:var(--sans);padding:6px 14px;border-radius:8px;border:1px solid var(--border2);background:var(--surface);color:var(--text2);cursor:pointer;white-space:nowrap;transition:all .12s;letter-spacing:.01em}
.act-btn:active{opacity:.75}
.act-btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.act-btn.danger{color:var(--red);border-color:#EDCFCC;background:var(--red-bg)}
.act-btn:disabled{opacity:.3;cursor:default}
.back-btn{display:flex;align-items:center;gap:6px;font-size:16px;color:var(--accent);font-weight:500;cursor:pointer;border:none;background:none;font-family:var(--sans);padding:8px 12px 8px 4px;min-height:44px;-webkit-tap-highlight-color:transparent}
.det-title{font-family:var(--serif);font-size:20px;font-weight:400;margin-top:4px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 16px}
.info-cell{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px}
.info-cell.full{grid-column:1/-1}
.info-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:4px}
.info-val{font-size:14px;font-weight:500}
.det-actions{display:flex;gap:10px;padding:4px 16px 16px}
.det-actions .act-btn{flex:1;padding:11px 0;text-align:center;border-radius:10px;font-size:13px;font-weight:500}
.log-item{display:flex;gap:14px;padding:12px 22px}
.log-line{width:1px;background:var(--border);flex-shrink:0;margin-top:4px}
.log-body{flex:1}
.log-date{font-size:11px;color:var(--muted);margin-bottom:3px}
.log-note{font-size:13px;color:var(--text2)}
/* Calendar */
.cal-wrap{margin:0 18px;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;background:var(--surface)}
.cal-head{display:flex;border-bottom:1px solid var(--border)}
.cal-th{flex:1;text-align:center;font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 0 7px}
.cal-body{display:grid;grid-template-columns:repeat(7,1fr)}
.cal-td{overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);cursor:pointer;background:var(--surface);box-sizing:border-box;transition:background .1s;flex-shrink:0}
.cal-td:nth-child(7n){border-right:none}
.cal-td:nth-last-child(-n+7){border-bottom:none}
.cal-td:active{background:var(--accent-lt)}
.cal-td.empty{cursor:default;background:#ECEAE4;pointer-events:none}
.cal-td.today-cell{background:var(--surface)}
.cal-td.selected-cell{background:var(--accent-lt)}
.cal-num{font-size:11px;font-weight:400;color:var(--text2);line-height:1;display:flex;align-items:center;justify-content:center;width:24px;height:24px;flex-shrink:0}
.cal-td.today-cell .cal-num{background:var(--accent);color:#fff;border-radius:50%;font-weight:700;font-size:11px}
.cal-dots{display:flex;gap:2px;justify-content:center;overflow:hidden;flex-shrink:0}
.cal-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.cal-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 22px 12px}
.cal-month{font-family:var(--serif);font-size:17px;font-weight:400;letter-spacing:-.01em}
.cal-arrow{width:32px;height:32px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;color:var(--muted);font-family:var(--sans);transition:all .1s}
.cal-arrow:active{background:var(--accent-lt);color:var(--accent)}
.day-panel{margin:12px 18px 0;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.day-panel-hd{padding:12px 16px;border-bottom:1px solid var(--border);font-family:var(--serif);font-size:13px;color:var(--muted)}
.day-item{display:flex;align-items:center;gap:14px;padding:11px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .1s}
.day-item:last-child{border-bottom:none}
.day-item:active{background:var(--accent-lt)}
.day-time{font-size:12px;color:var(--muted);width:36px;flex-shrink:0;font-weight:500}
.day-nick{font-size:13px;font-weight:500;flex:1}
.day-meth{font-size:11px;color:var(--muted);flex-shrink:0}
/* Settings */
.settings-group{margin:0 16px 4px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--border);min-height:54px;cursor:pointer;transition:background .1s}
.settings-row:last-child{border-bottom:none}
.settings-row:active{background:var(--surface2)}
.settings-row.static{cursor:default}
.settings-row.static:active{background:var(--surface)}
.s-label{font-size:14px;font-weight:400;color:var(--text)}
.s-sub{font-size:12px;color:var(--text2);margin-top:1px}
.s-val{font-size:13px;color:var(--muted)}
.s-arrow{font-size:16px;color:var(--faint)}
/* Modals */
.overlay{position:absolute;inset:0;background:rgba(18,16,12,.48);display:flex;align-items:flex-end;z-index:100;animation:fi .15s;backdrop-filter:blur(3px)}
.overlay.center{align-items:center;justify-content:center}
.sheet{width:100%;background:var(--surface);border-radius:20px 20px 0 0;padding:14px 22px 40px;animation:su .22s cubic-bezier(.32,1.2,.45,1);max-height:88vh;overflow-y:auto}
.sheet.center{width:calc(100% - 48px);max-width:360px;border-radius:20px;padding:24px 22px 22px;animation:fp .18s cubic-bezier(.32,1.2,.45,1);max-height:80vh}
@keyframes fp{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
.sheet::-webkit-scrollbar{display:none}
.sheet-handle{width:36px;height:4px;border-radius:2px;background:var(--border);margin:0 auto 20px}
.sheet-title{font-family:var(--serif);font-size:18px;font-weight:400;margin-bottom:4px}
.sheet-sub{font-size:12px;color:var(--muted);margin-bottom:20px;line-height:1.5}
.inp{width:100%;border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-size:14px;font-family:var(--sans);color:var(--text);background:var(--bg);margin-bottom:14px;outline:none;transition:border-color .15s;-webkit-appearance:none;height:44px}
.inp:focus{border-color:var(--accent)}
select.inp{cursor:pointer;appearance:auto;height:44px}
.inp-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:5px;display:block}
.inp-hint{font-size:11px;color:var(--muted);margin-top:-10px;margin-bottom:14px}
.inp-err{font-size:11px;color:var(--red);margin-top:-10px;margin-bottom:14px;font-weight:500}
.opt-row{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.opt{flex:1;min-width:52px;height:40px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:10px;font-size:12px;font-weight:500;font-family:var(--sans);background:var(--bg);color:var(--muted);cursor:pointer;transition:all .12s}
.opt.active{border-color:var(--accent);background:var(--accent-lt);color:var(--accent)}
.step-bar{display:flex;gap:4px;margin-bottom:18px}
.step-seg{height:2px;flex:1;border-radius:1px;background:var(--border);transition:background .2s}
.step-seg.done{background:var(--accent)}
.btn-row{display:flex;gap:10px;margin-top:6px}
.btn-row .act-btn{flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:14px}
/* Task editor */
.task-item{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:10px;margin-bottom:8px}
/* Swipe */
.swipe-row{position:relative;overflow:hidden;margin:0 22px 12px;border-radius:var(--r)}
.swipe-card{display:flex;align-items:center;gap:14px;padding:18px 18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);cursor:pointer;position:relative;z-index:1;transform:translateX(0);transition:transform .25s ease;user-select:none;-webkit-user-select:none}
.swipe-card.swiped{transform:translateX(-152px)}
.swipe-actions{position:absolute;right:0;top:0;bottom:0;width:152px;display:flex;align-items:center;justify-content:center;gap:10px;padding-right:6px}
.swipe-btn{
  width:56px;height:56px;border-radius:50%;flex-shrink:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  border:none;cursor:pointer;font-family:var(--sans);font-size:10px;font-weight:600;
  box-shadow:0 2px 6px rgba(0,0,0,.08);
}
.swipe-btn:active{opacity:.8;transform:scale(.95)}
.swipe-btn.sb-archive{background:var(--yellow-bg);color:var(--yellow);border:1.5px solid #EDD9A0}
.swipe-btn.sb-delete{background:var(--red-bg);color:var(--red);border:1.5px solid #F5CECA}
.swipe-btn-icon{font-size:17px;line-height:1}
.del-confirm{padding:10px 14px;background:var(--red-bg);border:1px solid #F5CECA;border-top:none;border-radius:0 0 var(--r) var(--r)}
/* Log pick modal */
.plan-pick-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border);cursor:pointer}
.plan-pick-row:last-child{border-bottom:none}
.plan-pick-row:active{opacity:.7}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.toast{position:absolute;bottom:88px;left:50%;transform:translateX(-50%);background:rgba(18,16,12,.88);color:#fff;font-size:12px;font-weight:500;padding:9px 18px;border-radius:20px;z-index:200;white-space:nowrap;pointer-events:none;letter-spacing:.01em;animation:tin .18s ease,tout .28s ease 1.5s forwards}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes tout{from{opacity:1}to{opacity:0}}
.ring-uncompleted{
  width:16px;height:16px;border-radius:50%;flex-shrink:0;
  border:2px dashed #ABA690;background:transparent;
}
.ring-completed{
  width:16px;height:16px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,#2F4E6E 0%,#6BA7A1 100%);
  display:flex;align-items:center;justify-content:center;
}
.ring-completed::after{
  content:"";
  width:11px;height:11px;border-radius:50%;
  background:var(--surface);
}
.level-circle{
  width:40px;height:40px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:700;
  padding:2px;text-align:center;line-height:1.1;
  overflow:hidden;
}
.level-circle.lc-long{font-size:10px;letter-spacing:-.02em;}
.level-circle.lc-red{background:var(--red-bg);color:var(--red);border:1.5px solid #F5CECA}
.level-circle.lc-yellow{background:var(--yellow-bg);color:var(--yellow);border:1.5px solid #EDD9A0}
.level-circle.lc-green{background:var(--green-bg);color:var(--green);border:1.5px solid #A8D8BC}
.level-circle.lc-faint{background:var(--surface2);color:var(--muted);border:1.5px solid var(--border)}
.filter-row{display:flex;gap:8px;padding:0 16px 14px;overflow-x:auto;-webkit-overflow-scrolling:touch}
.filter-row::-webkit-scrollbar{display:none}
.filter-chip{flex-shrink:0;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid var(--border2);background:var(--surface);color:var(--text2);cursor:pointer;white-space:nowrap;transition:all .12s}
.filter-chip.active{background:var(--accent);border-color:var(--accent);color:#fff}
.empty{padding:52px 24px;text-align:center;color:var(--muted);font-size:13px;line-height:1.8;font-family:var(--serif);font-weight:300}
`;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_METHODS = ["電話", "LINE", "訪視", "學校訪談"];

const _d = new Date();
const TODAY = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,'0')}-${String(_d.getDate()).padStart(2,'0')}`;
const _mn = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
const _dn = {1:"一",2:"二",3:"三",4:"四",5:"五",6:"六",7:"七",8:"八",9:"九",10:"十",11:"十一",12:"十二",13:"十三",14:"十四",15:"十五",16:"十六",17:"十七",18:"十八",19:"十九",20:"二十",21:"二十一",22:"二十二",23:"二十三",24:"二十四",25:"二十五",26:"二十六",27:"二十七",28:"二十八",29:"二十九",30:"三十",31:"三十一"};
const TODAY_DISPLAY = `${_mn[_d.getMonth()]}月 ${_dn[_d.getDate()]}日`;

const INITIAL_LEVELS = {
  A:{ label:"A 級", days:7,  desc:"每週",     colorKey:"red"    },
  B:{ label:"B 級", days:14, desc:"每兩週",   colorKey:"yellow" },
  C:{ label:"C 級", days:30, desc:"每月",     colorKey:"green"  },
  E:{ label:"緊急",  days:7,  desc:"每週",     colorKey:"red"    },
};

// Frequency definitions
const FREQ_OPTIONS = [
  {key:"weekly",    label:"每週",   days:7  },
  {key:"biweekly",  label:"每兩週", days:14 },
  {key:"monthly",   label:"每月",   days:30 },
  {key:"quarterly", label:"每季",   days:90 },
];

const DOW_NAMES = ["日","一","二","三","四","五","六"];
const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

const LOGO_LIGHT = "/logo-light.png";
const LOGO_DARK  = "/logo-dark.png";

const LS = { cases:"rc_cases5", methods:"rc_methods3", levels:"rc_levels3", theme:"rc_theme1" };
const LS_DPLANS = "rc_default_plans3";
const LS_WEEKSTART = "rc_week_start_dow1";

// 取得使用者設定的週起始星期 (0=週日 ... 6=週六)，預設週日
function getWeekStartDow(){
  try{
    const v = localStorage.getItem(LS_WEEKSTART);
    const n = v!==null ? parseInt(v,10) : 0;
    return (n>=0 && n<=6) ? n : 0;
  }catch{ return 0; }
}
// 通用公式：無論 weekStartDow 是哪一天，都能正確算出「date 所在週期」的起始日
// 例如 weekStartDow=3(週三)：週三~下週二為一個週期
function getWeekStart(date){
  const dow = date.getDay();
  const startDow = getWeekStartDow();
  const diff = (dow - startDow + 7) % 7; // date 距離本週期起始日有幾天
  const d = new Date(date);
  d.setDate(date.getDate() - diff);
  return d;
}

const LEVEL_COLOR_OPTIONS = [
  {key:"red",    label:"紅", bg:"#FDECEA", color:"#C0392B"},
  {key:"yellow", label:"黃", bg:"#FDF8EE", color:"#B8860B"},
  {key:"green",  label:"綠", bg:"#EDF5F1", color:"#2D6A4F"},
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA MODEL
// ─────────────────────────────────────────────────────────────────────────────
/*
  Case {
    id, nick, note, level, archived, archivedAt, lastContact,
    trackingPlans: [
      {
        id,           // unique string
        name,         // display name e.g. "電話追蹤"
        method,       // e.g. "電話"
        freq,         // "weekly"|"biweekly"|"monthly"|"quarterly"
        anchorDay,    // null | 1-31 (for monthly)
        anchorDow,    // null | 0-6  (for weekly)
        timesPerPeriod, // integer
        nextDue,      // ISO date string — auto-calculated
      }
    ],
    logs: [{ date, method, note, planId? }]
  }
*/

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function lsGet(key, fallback){
  try{ const r=localStorage.getItem(key); if(!r)return fallback; const p=JSON.parse(r);
    if(key===LS.cases&&!Array.isArray(p))return fallback;
    if(key===LS.methods&&!Array.isArray(p))return fallback;
    if(key===LS.levels&&(typeof p!=="object"||Array.isArray(p)))return fallback;
    return p; }catch{ return fallback; }
}
function lsSet(key,val){ try{ localStorage.setItem(key,JSON.stringify(val)); }catch{} }

function dateStr(d){ return d.toISOString().slice(0,10); }
function addDays(s,n){ const d=new Date(s); d.setDate(d.getDate()+n); return dateStr(d); }
function daysBetween(a,b){ if(!a||!b)return 0; const ms=new Date(b)-new Date(a); return isNaN(ms)?0:Math.round(ms/86400000); }
function getMonthDays(y,m){ return{first:new Date(y,m,1).getDay(),total:new Date(y,m+1,0).getDate()}; }
function ymd(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

// Calculate next due date for a tracking plan after a completion date
function calcPlanNextDue(plan, fromDate) {
  const base = new Date(fromDate || TODAY);
  const {freq, anchorDay} = plan;

  // 核心邏輯：下次到期日 = 下一個「週期範圍」的起始日
  // 而不是「完成日 + 固定天數」。這樣不管本週哪天完成，
  // 下次提醒都對齊到下週日（或下個月1日等），週期範圍本身不會漂移。

  if(freq==="weekly"){
    // 本週期起始日 + 7 天 = 下週期起始日
    const weekStart = getWeekStart(base);
    const nextWeekStart = new Date(weekStart); nextWeekStart.setDate(weekStart.getDate()+7);
    return dateStr(nextWeekStart);
  }
  if(freq==="biweekly"){
    const weekStart = getWeekStart(base);
    const nextBiStart = new Date(weekStart); nextBiStart.setDate(weekStart.getDate()+14);
    return dateStr(nextBiStart);
  }
  if(freq==="quarterly"){
    const m=base.getMonth(); const q=Math.floor(m/3)*3;
    let nextQ=q+3, y=base.getFullYear();
    if(nextQ>11){nextQ=0;y+=1;}
    return `${y}-${String(nextQ+1).padStart(2,"0")}-01`;
  }
  // monthly：對齊到下個月1日，若有固定日期(anchorDay)則用該日
  let y=base.getFullYear(), m=base.getMonth()+1;
  m+=1; if(m>12){m=1;y+=1;}
  if(anchorDay){
    const last=new Date(y,m,0).getDate();
    return `${y}-${String(m).padStart(2,"0")}-${String(Math.min(anchorDay,last)).padStart(2,"0")}`;
  }
  return `${y}-${String(m).padStart(2,"0")}-01`;
}

// Get period start for a plan (for counting completions)
function getPeriodStart(freq){
  const now=new Date(TODAY);
  // 本週期起點：依使用者設定的起始星期計算
  const weekStart = getWeekStart(now);
  if(freq==="weekly") return dateStr(weekStart);
  if(freq==="biweekly"){
    // 本週期起始日算第1天，往後算14天
    return dateStr(weekStart);
  }
  if(freq==="quarterly"){
    const m=now.getMonth(); const q=Math.floor(m/3)*3;
    return `${now.getFullYear()}-${String(q+1).padStart(2,"0")}-01`;
  }
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-01`;
}
function getPeriodEnd(freq){
  const s=new Date(getPeriodStart(freq));
  if(freq==="weekly"){const e=new Date(s);e.setDate(s.getDate()+6);return dateStr(e);}
  if(freq==="biweekly"){const e=new Date(s);e.setDate(s.getDate()+13);return dateStr(e);}
  if(freq==="quarterly"){const e=new Date(s);e.setMonth(s.getMonth()+3);e.setDate(e.getDate()-1);return dateStr(e);}
  const y=s.getFullYear(),m=s.getMonth(); return dateStr(new Date(y,m+1,0));
}

function getFutureBookings(plan){
  // bookings[]: [{date, time, note}] 所有未來預約；若舊資料只有 nextDue，退回單筆陣列
  const list = Array.isArray(plan.bookings) ? plan.bookings.slice() : (plan.nextDue ? [{date:plan.nextDue,time:plan.visitTime||"",note:plan.visitNote||""}] : []);
  return list.filter(b=>b.date>=TODAY).sort((a,b)=>a.date>b.date?1:a.date<b.date?-1:0);
}
function periodLabel(freq){
  return {weekly:"本週", biweekly:"本兩週", monthly:"本月", quarterly:"本季"}[freq] || "本期";
}
function countPlanLogs(logs, plan){
  const s=getPeriodStart(plan.freq), e=getPeriodEnd(plan.freq);
  return (logs||[]).filter(l=>l.date>=s&&l.date<=e&&(l.planId===plan.id||l.method===plan.method)).length;
}

// Compute tracking status for a case
function getTrackStatus(c){
  const plans=c.trackingPlans||[];
  if(!plans.length) return null;
  const results=plans.map(p=>({
    ...p,
    done:countPlanLogs(c.logs,p),
    goal:p.timesPerPeriod||1,
    isDue: p.nextDue && p.nextDue<=TODAY,
  }));
  const allDone=results.every(r=>r.done>=r.goal);
  const anyDue=results.some(r=>r.isDue&&r.done<r.goal);
  return{results,allDone,anyDue};
}

// Derive case status from tracking plans
function getCaseStatus(c){
  if(c.archived) return "faint";
  const ts=getTrackStatus(c);
  if(ts){
    if(ts.allDone) return "green";
    if(ts.anyDue)  return "red";
    // has plans but none due yet
    const earliest=ts.results.filter(r=>r.done<r.goal&&r.nextDue).sort((a,b)=>a.nextDue>b.nextDue?1:-1)[0];
    if(earliest){
      const d=daysBetween(TODAY,earliest.nextDue);
      if(d<=2) return "yellow";
      return "faint";
    }
    return "green";
  }
  // legacy: no plans
  const d=daysBetween(TODAY,c.lastContact);
  return d>30?"red":d>14?"yellow":"faint";
}

function getCaseStatusLabel(c){
  const ts=getTrackStatus(c);
  if(ts){
    if(ts.allDone) return "本期已完成";
    const due=ts.results.filter(r=>r.isDue&&r.done<r.goal);
    if(due.length) return `${due[0].name||due[0].method} 待完成`;
    const next=ts.results.filter(r=>r.done<r.goal&&r.nextDue).sort((a,b)=>a.nextDue>b.nextDue?1:-1)[0];
    if(next){ const d=daysBetween(TODAY,next.nextDue); return d===0?"今日到期":d===1?"明日":d>0?`${d} 天後`:"待完成"; }
    return "追蹤中";
  }
  const d=daysBetween(TODAY,c.lastContact);
  return d>30?`${d} 天未聯絡`:d>14?`${d} 天前`:"近期聯絡";
}

function generateId(cases){ const n=cases.map(c=>parseInt(c.id.replace("C",""),10)).filter(n=>!isNaN(n)); return `C${String(n.length?Math.max(...n)+1:1).padStart(3,"0")}`; }
function genPlanId(){ return `tp${Date.now()}${Math.floor(Math.random()*1000)}`; }
function order2(s){ return{red:0,yellow:1,green:2,faint:3}[s]; }

function makeInitialCases(){
  const ds=n=>{ const d=new Date(); d.setDate(d.getDate()+n); return dateStr(d); };
  return [
    { id:"C001", nick:"阿明", level:"A", note:"情緒起伏大，需定期關心",
      archived:false, archivedAt:null, lastContact:ds(-14),
      trackingPlans:[
        {id:"tp1",name:"電話追蹤",method:"電話",freq:"monthly",anchorDay:null,anchorDow:null,timesPerPeriod:1,nextDue:TODAY},
        {id:"tp2",name:"面訪",method:"訪視",freq:"monthly",anchorDay:null,anchorDow:null,timesPerPeriod:1,nextDue:ds(5)},
      ],
      logs:[{date:ds(-14),method:"電話",note:"情況穩定，已確認回診",planId:"tp1"},{date:ds(-21),method:"電話",note:"略顯低落，持續追蹤",planId:"tp1"}] },
    { id:"C002", nick:"小芬", level:"E", note:"近期壓力大",
      archived:false, archivedAt:null, lastContact:ds(-22),
      trackingPlans:[
        {id:"tp3",name:"LINE 關懷",method:"LINE",freq:"weekly",anchorDay:null,anchorDow:5,timesPerPeriod:1,nextDue:TODAY},
      ],
      logs:[{date:ds(-22),method:"LINE",note:"回覆慢，情況待觀察",planId:"tp3"}] },
    { id:"C003", nick:"老王", level:"B", note:"",
      archived:false, archivedAt:null, lastContact:ds(-10),
      trackingPlans:[
        {id:"tp4",name:"電話追蹤",method:"電話",freq:"biweekly",anchorDay:null,anchorDow:null,timesPerPeriod:1,nextDue:ds(4)},
      ],
      logs:[{date:ds(-10),method:"電話",note:"良好，下次兩週後",planId:"tp4"}] },
    { id:"C004", nick:"淑惠", level:"C", note:"月底壓力較大",
      archived:false, archivedAt:null, lastContact:ds(-45),
      trackingPlans:[],
      logs:[] },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function StatusPill({status,label}){ return <span className={`spill ${status}`}><span className={`dot ${status}`}/>{label}</span>; }

function LevelBadge({levelKey,levels}){
  const l=levels[levelKey]; if(!l) return null;
  return <span className={`lvl-badge lvl-${l.colorKey||"faint"}`}>{l.label}</span>;
}

function Toast({msg}){ return <div className="toast">{msg}</div>; }
function StepBar({total,current}){
  return <div className="step-bar">{Array.from({length:total}).map((_,i)=><div key={i} className={`step-seg ${i<=current?"done":""}`}/>)}</div>;
}

// Inline plan chips for card rows
function PlanChips({c}){
  const ts=getTrackStatus(c);
  if(!ts||!ts.results.length) return null;
  // 只顯示聯絡方式名稱，不顯示進度數字
  const methods=[...new Set(ts.results.map(r=>r.method))];
  return (
    <div className="row-plans">
      {methods.map((m,i)=>(
        <span key={i} className="row-plan-chip idle">{m}</span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACKING PLAN EDITOR
// ─────────────────────────────────────────────────────────────────────────────

function TrackingPlanEditor({ plans, setPlans, methods }){
  const safe = methods.length>0?methods:["電話"];
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState({method:safe[0],freq:"monthly",anchorDay:null,anchorDow:null,timesPerPeriod:1});

  function add(){
    if(!form.method) return;
    const name = form.method; // 任務名稱直接用聯絡方式，不重複輸入
    const nextDue = calcPlanNextDue({...form}, TODAY);
    setPlans(prev=>[...prev,{...form, id:genPlanId(), name, nextDue}]);
    setAdding(false);
    setForm({name:"",method:safe[0],freq:"monthly",anchorDay:null,anchorDow:null,timesPerPeriod:1});
  }
  function remove(id){ setPlans(prev=>prev.filter(p=>p.id!==id)); }

  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <label className="inp-label" style={{margin:0}}>追蹤計畫</label>
        <button className="act-btn" style={{fontSize:11,padding:"3px 10px"}} onClick={()=>setAdding(v=>!v)}>
          {adding?"取消":"＋ 新增任務"}
        </button>
      </div>

      {!plans.length&&!adding&&<div style={{fontSize:12,color:"var(--muted)",padding:"6px 0"}}>尚無追蹤任務</div>}

      {plans.map(p=>(
        <div key={p.id} className="task-item">
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:500}}>{p.name||p.method}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>
              {p.method} · {FREQ_OPTIONS.find(f=>f.key===p.freq)?.label} · {p.timesPerPeriod}次
              {p.nextDue?` · 下次 ${p.nextDue.slice(5)}`:""}
            </div>
          </div>
          <button className="act-btn danger" style={{fontSize:11,padding:"3px 10px",flexShrink:0}} onClick={()=>remove(p.id)}>移除</button>
        </div>
      ))}

      {adding&&(
        <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px",marginTop:4}}>
          <label className="inp-label">聯絡方式</label>
          <select className="inp" value={form.method} onChange={e=>setForm(f=>({...f,method:e.target.value}))} autoFocus>
            {safe.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <label className="inp-label">頻率</label>
          <div className="opt-row">
            {FREQ_OPTIONS.map(fo=>(
              <div key={fo.key} className={`opt ${form.freq===fo.key?"active":""}`}
                onClick={()=>setForm(f=>({...f,freq:fo.key,anchorDay:null,anchorDow:null}))}>
                {fo.label}
              </div>
            ))}
          </div>
          <label className="inp-label">目標次數（每期）</label>
          <div className="opt-row">
            {[1,2,3,4].map(n=>(
              <div key={n} className={`opt ${form.timesPerPeriod===n?"active":""}`}
                onClick={()=>setForm(f=>({...f,timesPerPeriod:n}))}>
                {n}次
              </div>
            ))}
          </div>
          <button className="act-btn primary" style={{width:"100%",marginTop:4}} onClick={add}>加入此任務</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOG MODAL — with plan association
// ─────────────────────────────────────────────────────────────────────────────

function LogModal({ case_:c, methods, onClose, onSave }){
  const safe = methods.length>0?methods:["電話"];
  const plans = c.trackingPlans||[];
  const nowH = new Date();
  const defaultTime = `${String(nowH.getHours()).padStart(2,"0")}:${String(nowH.getMinutes()).padStart(2,"0")}`;
  // 初始值一致：若有追蹤任務，預設聯絡方式對應第一個任務的方式
  const [method, setMethod] = useState(plans[0]?.method || safe[0]);
  const [planId, setPlanId] = useState(plans[0]?.id||null);
  const [date,   setDate]   = useState(TODAY);
  const [time,   setTime]   = useState(defaultTime);
  const [note,   setNote]   = useState("");

  function onMethodChange(m){
    setMethod(m);
    // 切換聯絡方式時，自動對應到同方式的追蹤任務；若無對應任務則取消關聯
    const match = plans.find(p=>p.method===m);
    setPlanId(match ? match.id : null);
  }
  function onPlanChange(p){
    setPlanId(p?p.id:null);
    // 選追蹤任務時，自動同步聯絡方式
    if(p) setMethod(p.method);
  }

  return (
    <div className="overlay center" onClick={onClose}>
      <div className="sheet center" onClick={e=>e.stopPropagation()}>
        <div className="sheet-title">記錄聯絡</div>
        <div className="sheet-sub" style={{marginBottom:16}}>{c.nick}</div>

        <label className="inp-label">日期與時間</label>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <input type="date" className="inp" style={{flex:1,marginBottom:0}} value={date} max={TODAY} onChange={e=>setDate(e.target.value)}/>
          <input type="time" className="inp" style={{flex:1,marginBottom:0}} value={time} onChange={e=>setTime(e.target.value)}/>
        </div>

        <label className="inp-label">聯絡方式</label>
        <select className="inp" value={method} onChange={e=>onMethodChange(e.target.value)}>
          {safe.map(m=><option key={m} value={m}>{m}</option>)}
        </select>

        {plans.length>0&&(
          <>
            <label className="inp-label">關聯追蹤任務</label>
            <div style={{marginBottom:14}}>
              {plans.map(p=>(
                <div key={p.id} className="plan-pick-row"
                  onClick={()=>onPlanChange(p)}>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{p.name||p.method}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{p.method} · {FREQ_OPTIONS.find(f=>f.key===p.freq)?.label}</div>
                  </div>
                  <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${planId===p.id?"var(--accent)":"var(--border)"}`,background:planId===p.id?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {planId===p.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                  </div>
                </div>
              ))}
              <div className="plan-pick-row" onClick={()=>onPlanChange(null)}>
                <div style={{fontSize:13,color:"var(--muted)"}}>不關聯追蹤任務</div>
                <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${planId===null?"var(--accent)":"var(--border)"}`,background:planId===null?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {planId===null&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                </div>
              </div>
            </div>
          </>
        )}

        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="一兩句即可…" value={note} onChange={e=>setNote(e.target.value)} maxLength={120}/>
        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>取消</button>
          <button className="act-btn primary" onClick={()=>{onSave(c.id,method,note.trim(),planId,date,time);onClose();}}>儲存</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDIT CASE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function EditCaseModal({ case_:c, methods, levels, onClose, onSave, onDelete }){
  const safe = methods.length>0?methods:["電話"];
  const [nick,          setNick]    = useState(c.nick);
  const [note,          setNote]    = useState(c.note||"");
  const [level,         setLevel]   = useState(c.level);
  const [trackingPlans, setPlans]   = useState((c.trackingPlans||[]).map(p=>({...p})));
  const [err,           setErr]     = useState("");
  const [confirmDel,    setConfDel] = useState(false);

  function save(){
    if(!nick.trim()){setErr("暱稱不能空白");return;}
    onSave(c.id,{nick:nick.trim(),note:note.trim(),level,trackingPlans});
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
        {err&&<div className="inp-err">{err}</div>}
        <label className="inp-label">關懷等級</label>
        <div className="opt-row">
          {Object.entries(levels).map(([k,l])=>{
            const col=LEVEL_COLOR_OPTIONS.find(c=>c.key===l.colorKey)||LEVEL_COLOR_OPTIONS[1];
            return <div key={k} className={`opt ${level===k?"active":""}`}
              style={level===k?{background:col.bg,borderColor:col.color,color:col.color}:{}}
              onClick={()=>setLevel(k)}>{l.label}</div>;
          })}
        </div>
        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="簡短備忘…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>
        <TrackingPlanEditor plans={trackingPlans} setPlans={setPlans} methods={safe}/>
        {confirmDel?(
          <div style={{background:"var(--red-bg)",border:"1px solid #EDCFCC",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:13,color:"var(--red)",fontWeight:500,marginBottom:6}}>確認刪除「{c.nick}」？</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:10,lineHeight:1.6}}>此操作無法復原。若暫時不需聯絡，建議改用「封存個案」。</div>
            <div style={{display:"flex",gap:8}}>
              <button className="act-btn" style={{flex:1}} onClick={()=>setConfDel(false)}>取消</button>
              <button className="act-btn danger" style={{flex:1}} onClick={()=>{onDelete(c.id);onClose();}}>確認刪除</button>
            </div>
          </div>
        ):(
          <div className="btn-row">
            <button className="act-btn danger" style={{flex:"0 0 auto",padding:"0 16px"}} onClick={()=>setConfDel(true)}>刪除</button>
            <button className="act-btn" style={{flex:1}} onClick={onClose}>取消</button>
            <button className="act-btn primary" style={{flex:1}} onClick={save}>儲存</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD CASE MODAL
// ─────────────────────────────────────────────────────────────────────────────

function AddCaseModal({ existingCases, levels, methods, onClose, onSave }){
  const safe = methods.length>0?methods:["電話"];
  const [step,  setStep]  = useState(0);
  const [nick,  setNick]  = useState("");
  const [note,  setNote]  = useState("");
  const [level, setLevel] = useState(Object.keys(levels)[0]||"B");
  const [plans, setPlans] = useState([]);
  const [err,   setErr]   = useState("");
  const autoId = generateId(existingCases);

  function applyDefaultPlans(levelKey){
    setLevel(levelKey);
    try{
      const raw=localStorage.getItem(LS_DPLANS);
      const d=raw?JSON.parse(raw):{};
      if(d[levelKey]&&d[levelKey].length>0)
        setPlans(d[levelKey].map(p=>({...p,id:genPlanId(),nextDue:calcPlanNextDue(p,TODAY)})));
    }catch{}
  }

  function next(){ if(!nick.trim()){setErr("請輸入暱稱");return;} setErr(""); setStep(1); }
  function save(){
    onSave({id:autoId,nick:nick.trim(),note:note.trim(),level,archived:false,archivedAt:null,
      lastContact:TODAY,trackingPlans:plans,logs:[]});
    onClose();
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <StepBar total={2} current={step}/>
        <div className="sheet-title">{step===0?"新增個案":"追蹤設定"}</div>
        <div className="sheet-sub">{step===0?`編號：${autoId}`:"選擇等級並設定追蹤計畫"}</div>
        {step===0&&<>
          <label className="inp-label">暱稱（不可使用真實姓名）</label>
          <input className="inp" placeholder="例：阿明" value={nick} onChange={e=>{setNick(e.target.value);setErr("");}} maxLength={20} autoFocus/>
          {err&&<div className="inp-err">{err}</div>}
          <label className="inp-label">備註（選填）</label>
          <input className="inp" placeholder="簡短備忘…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>
          <div className="btn-row">
            <button className="act-btn" onClick={onClose}>取消</button>
            <button className="act-btn primary" onClick={next}>下一步</button>
          </div>
        </>}
        {step===1&&<>
          <label className="inp-label">關懷等級</label>
          <div className="opt-row">
            {Object.entries(levels).map(([k,l])=>{
              const col=LEVEL_COLOR_OPTIONS.find(c=>c.key===l.colorKey)||LEVEL_COLOR_OPTIONS[1];
              return <div key={k} className={`opt ${level===k?"active":""}`}
                style={level===k?{background:col.bg,borderColor:col.color,color:col.color}:{}}
                onClick={()=>applyDefaultPlans(k)}>{l.label}</div>;
            })}
          </div>
          <TrackingPlanEditor plans={plans} setPlans={setPlans} methods={safe}/>
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

function HomeScreen({ cases, methods, levels, updateCase, showToast }){
  const [logModal,  setLogModal]  = useState(null);

  const active = cases.filter(c=>!c.archived);
  // Show cases with due/overdue plans, or legacy cases without plans
  const tasks = active
    .map(c=>{
      const ts = getTrackStatus(c);
      // 逾期：有追蹤計畫且 nextDue < TODAY 且未完成
      const overdue = (ts?.results||[]).some(r=>r.nextDue&&r.nextDue<TODAY&&r.done<r.goal);
      return {...c, _status:getCaseStatus(c), _overdue:overdue};
    })
    .filter(c=>c._status==="red"||c._status==="yellow"||c._status==="green")
    .sort((a,b)=>{
      // 逾期排最前
      if(a._overdue&&!b._overdue) return -1;
      if(!a._overdue&&b._overdue) return 1;
      return order2(a._status)-order2(b._status);
    });

  function handleLogSave(id, method, note, planId, date, time){
    const logDate = date || TODAY;
    updateCase(id, prev=>{
      const newLog = {date:logDate, time:time||"", method, note:note||"已聯絡", planId:planId||undefined};
      const newLogs = [newLog, ...(prev.logs||[])].sort((a,b)=>b.date.localeCompare(a.date)||(b.time||"").localeCompare(a.time||""));
      // Update nextDue for the matched plan (based on the recorded date, not necessarily today)
      const newPlans = (prev.trackingPlans||[]).map(p=>{
        if(p.id!==planId) return p;
        return {...p, nextDue:calcPlanNextDue(p, logDate)};
      });
      return {lastContact: logDate>prev.lastContact||!prev.lastContact ? logDate : prev.lastContact, trackingPlans:newPlans, logs:newLogs};
    });
    showToast("已記錄");
  }

  const sections=[{key:"red",label:"需要聯絡"},{key:"yellow",label:"即將到期"},{key:"green",label:"已安排"}];

  return (
    <div className="screen-pad">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">{TODAY_DISPLAY}</div>
          <div className="ph-title">今天要做的事</div>
        </div>
        {tasks.length>0&&<span className="ph-sub">{tasks.length} 項</span>}
      </div>
      {tasks.length===0&&<div className="empty">今天沒有待辦<br/>好好休息</div>}
      {sections.map(s=>{
        const group=tasks.filter(c=>c._status===s.key);
        if(!group.length) return null;
        return (
          <div key={s.key}>
            <div className="sec-label">{s.label}</div>
            {group.map(c=>(
              <div className="card-row" key={c.id}
                style={{cursor:"pointer",alignItems:"center",gap:14}}
                onClick={()=>setLogModal(c)}>
                {/* 圓圈：未完成=淺灰小圓，完成=深藍→綠漸層實心圓（logo 色系） */}
                {(()=>{
                  const ts=getTrackStatus(c);
                  const done=ts?.allDone;
                  return <div className={done?"ring-completed":"ring-uncompleted"}/>;
                })()}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className="row-nick">{c.nick}</span>
                    <span style={{color:"var(--muted)",fontSize:13}}>·</span>
                    <span style={{fontSize:13,color:"var(--text2)"}}>
                      {(()=>{
                        const ts = getTrackStatus(c);
                        // 只顯示「今天到期且未完成」的任務方式；若無則退回顯示全部未完成任務的方式
                        const due = (ts?.results||[]).filter(r=>r.done<r.goal && r.nextDue && r.nextDue<=TODAY);
                        const pool = due.length>0 ? due : (ts?.results||[]).filter(r=>r.done<r.goal);
                        const list = pool.length>0 ? pool : (c.trackingPlans||[]);
                        const methodStr = list.map(p=>p.method).filter((v,i,a)=>a.indexOf(v)===i).join("、")||"—";
                        // 若這些任務中，最近的到期日有指定時間，附加顯示（例如 電話 16:37）
                        const withTime = list.find(p=>p.visitTime);
                        return withTime ? `${methodStr} ${withTime.visitTime}` : methodStr;
                      })()}
                    </span>
                  </div>
                </div>
                {/* 逾期紅點 */}
                {c._overdue && (
                  <div style={{width:8,height:8,borderRadius:"50%",background:"var(--red)",flexShrink:0}}/>
                )}
              </div>
            ))}
          </div>
        );
      })}
      {logModal&&<LogModal case_={logModal} methods={methods} onClose={()=>setLogModal(null)} onSave={handleLogSave}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASES SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function CasesScreen({ cases, methods, levels, onAdd, onOpen, updateCase, deleteCase, showToast }){
  const [swipedId,    setSwipedId]    = useState(null);
  const [delConfId,   setDelConfId]   = useState(null);
  const [levelFilter, setLevelFilter] = useState(null); // null = 全部
  const touchStartX = useRef(0);
  const active   = cases.filter(c=>!c.archived);
  const filtered = levelFilter ? active.filter(c=>c.level===levelFilter) : active;
  const sorted   = [...filtered].sort((a,b)=>order2(getCaseStatus(a))-order2(getCaseStatus(b)));

  return (
    <div className="screen-pad">
      <div className="ph">
        <div><div className="ph-eyebrow">追蹤中的個案</div><div className="ph-title">個案列表</div></div>
        <button className="ph-action" onClick={onAdd}>＋ 新增</button>
      </div>
      <div className="filter-row">
        <div className={`filter-chip ${levelFilter===null?"active":""}`}
          onClick={()=>setLevelFilter(null)}>全部</div>
        {Object.entries(levels).map(([k,l])=>{
          const cnt = active.filter(c=>c.level===k).length;
          if(cnt===0) return null;
          return (
            <div key={k} className={`filter-chip ${levelFilter===k?"active":""}`}
              onClick={()=>setLevelFilter(levelFilter===k?null:k)}>
              {l.label}
            </div>
          );
        })}
      </div>
      {filtered.length===0&&<div className="empty">{levelFilter?`沒有${levels[levelFilter]?.label}的個案`:"目前沒有聯絡中的個案"}<br/>{levelFilter?"":"點右上角新增"}</div>}
      {sorted.map(c=>{
        const st=getCaseStatus(c);
        const isSwiped=swipedId===c.id, isDelConf=delConfId===c.id;
        return (
          <div className="swipe-row" key={c.id}>
            <div className="swipe-actions">
              <button className="swipe-btn sb-archive"
                onClick={()=>{updateCase(c.id,()=>({archived:true,archivedAt:new Date().toISOString()}));setSwipedId(null);showToast("已封存個案");}}>
                <span className="swipe-btn-icon">↓</span>封存
              </button>
              <button className="swipe-btn sb-delete" onClick={()=>{setDelConfId(c.id);setSwipedId(null);}}>
                <span className="swipe-btn-icon">✕</span>刪除
              </button>
            </div>
            <div className={`swipe-card${isSwiped?" swiped":""}`}
              onClick={()=>{if(isSwiped){setSwipedId(null);return;}onOpen(c.id);}}
              onTouchStart={e=>{touchStartX.current=e.touches[0].clientX;}}
              onTouchEnd={e=>{const dx=touchStartX.current-e.changedTouches[0].clientX;if(dx>40)setSwipedId(c.id);else if(dx<-20)setSwipedId(null);}}>
              {/* 左側：等級圓圈 — 顯示完整等級名稱（1個字維持原大小，2字以上縮小字級） */}
              {(()=>{
                const label = levels[c.level]?.label || c.level;
                const isShort = label.length<=1;
                return (
                  <div className={`level-circle lc-${levels[c.level]?.colorKey||"faint"}${isShort?"":" lc-long"}`}>
                    {label}
                  </div>
                );
              })()}
              {/* 中間：姓名 + 下次聯繫 */}
              <div className="row-main">
                <div className="row-nick">{c.nick}</div>
                <div className="row-meta" style={{marginTop:4}}>
                  {(()=>{
                    const ts=getTrackStatus(c);
                    const nextPlan=ts?.results.filter(r=>r.done<r.goal&&r.nextDue).sort((a,b)=>a.nextDue>b.nextDue?1:-1)[0];
                    const nextDate=nextPlan?.nextDue||c.lastContact;
                    return <span>下次：{nextDate?nextDate.slice(5):"—"}</span>;
                  })()}
                </div>
              </div>
              {/* 右側：本月進度 */}
              {(()=>{
                const ts=getTrackStatus(c);
                if(!ts||!ts.results.length) return null;
                if(ts.results.length===1){
                  // 只有一個計畫：直接顯示該計畫的週期與進度
                  const r=ts.results[0];
                  return (
                    <div style={{flexShrink:0,textAlign:"right"}}>
                      <div style={{fontSize:10,color:"var(--muted)",fontWeight:600,letterSpacing:".03em"}}>{periodLabel(r.freq)}</div>
                      <div style={{fontSize:15,fontWeight:700,color:r.done>=r.goal?"var(--green)":"var(--yellow)"}}>
                        {r.done}/{r.goal}
                      </div>
                    </div>
                  );
                }
                // 多個計畫：顯示尚未完成中最緊迫（nextDue 最近）的那個週期標籤；進度為彙總
                const total=ts.results.reduce((s,r)=>s+r.goal,0);
                const done=ts.results.reduce((s,r)=>s+Math.min(r.done,r.goal),0);
                const urgent=ts.results.filter(r=>r.done<r.goal&&r.nextDue).sort((a,b)=>a.nextDue>b.nextDue?1:-1)[0]||ts.results[0];
                return (
                  <div style={{flexShrink:0,textAlign:"right"}}>
                    <div style={{fontSize:10,color:"var(--muted)",fontWeight:600,letterSpacing:".03em"}}>{periodLabel(urgent.freq)}</div>
                    <div style={{fontSize:15,fontWeight:700,color:done>=total?"var(--green)":"var(--yellow)"}}>
                      {done}/{total}
                    </div>
                  </div>
                );
              })()}
            </div>
            {isDelConf&&(
              <div className="del-confirm">
                <div style={{fontSize:13,color:"var(--red)",fontWeight:500,marginBottom:4}}>確認刪除「{c.nick}」？</div>
                <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.6,marginBottom:8}}>此操作無法復原。若暫時不需聯絡，建議改用「封存個案」。</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="act-btn" style={{flex:1,fontSize:12}} onClick={()=>setDelConfId(null)}>取消</button>
                  <button className="act-btn" style={{flex:1,fontSize:12,color:"var(--yellow)",borderColor:"#EDD9A0",background:"var(--yellow-bg)"}}
                    onClick={()=>{updateCase(c.id,()=>({archived:true,archivedAt:new Date().toISOString()}));showToast("已封存個案");setDelConfId(null);}}>改為封存</button>
                  <button className="act-btn danger" style={{flex:1,fontSize:12}} onClick={()=>{deleteCase(c.id);setDelConfId(null);}}>確認刪除</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL SCREEN
// ─────────────────────────────────────────────────────────────────────────────


function EditLogPanel({ log, methods, onClose, onSave, onDelete }) {
  const [date,       setDate]   = useState(log.date||TODAY);
  const [time,       setTime]   = useState(log.time||"");
  const [method,     setMethod] = useState(log.method||(methods[0]||"電話"));
  const [note,       setNote]   = useState(log.note||"");
  const [confirmDel, setConfirmDel] = useState(false);
  return (
    <div style={{margin:"-4px 22px 8px 50px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"0 0 var(--r) var(--r)",padding:"12px 14px"}}>
      {confirmDel ? (
        <>
          <div style={{fontSize:12,color:"var(--red)",marginBottom:8}}>確認刪除這筆紀錄？</div>
          <div style={{display:"flex",gap:6}}>
            <button className="act-btn" style={{flex:1,fontSize:12}} onClick={()=>setConfirmDel(false)}>取消</button>
            <button className="act-btn danger" style={{flex:1,fontSize:12}} onClick={onDelete}>確認刪除</button>
          </div>
        </>
      ) : (
        <>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input type="date" className="inp" style={{flex:1,marginBottom:0,height:36,padding:"0 10px",fontSize:12}}
              value={date} onChange={e=>setDate(e.target.value)}/>
            <select className="inp" style={{flex:1,marginBottom:0,height:36,padding:"0 8px",fontSize:12}}
              value={method} onChange={e=>setMethod(e.target.value)}>
              {(methods||["電話"]).map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <input type="time" className="inp" style={{marginBottom:8,height:36,padding:"0 10px",fontSize:12}}
            value={time} onChange={e=>setTime(e.target.value)} placeholder="時間（選填）"/>
          <input className="inp" style={{marginBottom:8,height:36,padding:"0 10px",fontSize:12}}
            value={note} onChange={e=>setNote(e.target.value)} placeholder="備註（選填）" maxLength={120}/>
          <div style={{display:"flex",gap:6}}>
            <button className="act-btn danger" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>setConfirmDel(true)}>刪除</button>
            <button className="act-btn" style={{flex:1,fontSize:12}} onClick={onClose}>取消</button>
            <button className="act-btn primary" style={{flex:1,fontSize:12}}
              onClick={()=>onSave({...log,date,time,method,note})}>儲存</button>
          </div>
        </>
      )}
    </div>
  );
}

function DetailScreen({ case_:c, methods, levels, onBack, updateCase, showToast }){
  const [logModal,       setLogModal]       = useState(false);
  const [visitModal,     setVisitModal]     = useState(false);
  const [editVisitPlan,  setEditVisitPlan]  = useState(null);
  const [bookingsModal,  setBookingsModal]  = useState(false);
  const [editLogIdx,     setEditLogIdx]     = useState(null); // index of log being edited
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [editModal,      setEditModal]      = useState(false);
  const ts = getTrackStatus(c);
  const thisMonth = TODAY.slice(0,7);
  const monthVisitDone = (c.logs||[]).some(l=>l.date?.startsWith(thisMonth)&&(l.method==="訪視"||l.method==="家訪"));
  const hasMonthVisit = monthVisitDone;

  function handleLogSave(id, method, note, planId, date, time){
    const logDate = date || TODAY;
    updateCase(id, prev=>{
      const newLog={date:logDate,time:time||"",method,note:note||"已聯絡",planId:planId||undefined};
      const newPlans=(prev.trackingPlans||[]).map(p=>{
        if(p.id!==planId) return p;
        return {...p,nextDue:calcPlanNextDue(p,logDate)};
      });
      const newLogs=[newLog,...(prev.logs||[])].sort((a,b)=>b.date.localeCompare(a.date)||(b.time||"").localeCompare(a.time||""));
      return{lastContact: logDate>prev.lastContact||!prev.lastContact ? logDate : prev.lastContact, trackingPlans:newPlans, logs:newLogs};
    });
    showToast("已記錄");
  }
  function handleEditSave(id,patch){ updateCase(id,()=>patch); showToast("已更新"); }

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
        <div style={{display:"flex",gap:8}}>
          <button className="ph-action" style={{color:"var(--yellow)"}} onClick={()=>setArchiveConfirm(v=>!v)}>封存</button>
          <button className="ph-action" onClick={()=>setEditModal(true)}>編輯</button>
        </div>
      </div>

      {/* 本期追蹤進度 */}
      {ts&&(
        <div className="plan-block">
          <div className="plan-block-hd">
            <span>{ts.allDone?"✓ 本期追蹤計畫已完成":"本期追蹤進度"}</span>
            <span style={{fontSize:11,color:"var(--muted)",fontWeight:500}}>
              {(()=>{
                // 若所有任務頻率相同，顯示共用區間；否則顯示第一個任務的區間
                const freqs=[...new Set(ts.results.map(r=>r.freq))];
                const f=freqs.length===1?freqs[0]:ts.results[0]?.freq;
                if(!f) return "";
                return `${getPeriodStart(f).slice(5).replace("-","/")} – ${getPeriodEnd(f).slice(5).replace("-","/")}`;
              })()}
            </span>
          </div>
          {ts.results.map((r,i)=>(
            <div key={i} className="plan-row" style={{flexDirection:"column",alignItems:"stretch",gap:8}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div className="plan-name">{r.name||r.method}</div>
                  <div className="plan-freq">{r.method} · {FREQ_OPTIONS.find(f=>f.key===r.freq)?.label}</div>
                </div>
                <div className={`plan-prog ${r.done>=r.goal?"done":"todo"}`}>
                  {r.done}/{r.goal} {r.done>=r.goal?"✓":"⚠"}
                </div>
              </div>
              {r.nextDue&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                  <span style={{
                    fontSize:12,color:"var(--accent)",fontWeight:500,
                    border:"1px solid var(--accent)",borderRadius:8,
                    padding:"3px 10px",display:"inline-block",cursor:"pointer"
                  }}
                  onClick={()=>setEditVisitPlan(r)}>
                    下次 {r.nextDue.slice(5)}{r.visitTime?" "+r.visitTime:""}
                  </span>
                  <button className="act-btn danger" style={{fontSize:11,padding:"3px 8px",flexShrink:0}}
                    onClick={()=>{
                      updateCase(c.id,prev=>({
                        trackingPlans:(prev.trackingPlans||[]).map(p=>{
                          if(p.id!==r.id) return p;
                          const existing = Array.isArray(p.bookings)?p.bookings:(p.nextDue?[{date:p.nextDue,time:p.visitTime||"",note:p.visitNote||""}]:[]);
                          const remaining = existing.filter(b=>!(b.date===r.nextDue && (b.time||"")===(r.visitTime||"")));
                          const sorted = remaining.sort((a,b)=>a.date>b.date?1:a.date<b.date?-1:0);
                          const nearest = sorted.find(b=>b.date>=TODAY) || sorted[0];
                          return {...p, bookings:sorted, nextDue:nearest?.date||null, visitTime:nearest?.time||"", visitNote:nearest?.note||""};
                        })
                      }));
                      showToast("已取消該筆預約");
                    }}>取消預約</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="info-grid">
        <div className="info-cell"><div className="info-label">上次聯絡</div><div className="info-val">{c.lastContact?c.lastContact.slice(5).replace("-","/"):"—"}</div></div>
        <div className="info-cell" style={{cursor:"pointer"}} onClick={()=>setBookingsModal(true)}>
          <div className="info-label">下次聯絡</div>
          <div className="info-val" style={{color:"var(--accent)"}}>
            {(()=>{
              const allBookings = (c.trackingPlans||[]).flatMap(p=>getFutureBookings(p));
              if(allBookings.length===0) return "—";
              return allBookings[0].date.slice(5).replace("-","/");
            })()}
          </div>
        </div>
        {c.note&&<div className="info-cell full"><div className="info-label">備註</div><div className="info-val" style={{fontWeight:400,fontSize:13,lineHeight:1.5}}>{c.note}</div></div>}
      </div>

      <div className="det-actions">
        <button className="act-btn primary" onClick={()=>setLogModal(true)}>記錄聯絡</button>
        <button className="act-btn" onClick={()=>setVisitModal(true)}
          style={hasMonthVisit?{opacity:.5}:{}}>
          {hasMonthVisit?"本月已訪視":"預約訪視"}
        </button>
      </div>

      {archiveConfirm&&(
        <div style={{margin:"0 16px 12px",background:"var(--yellow-bg)",border:"1px solid #EDD9A0",borderRadius:"var(--r)",padding:"14px 16px"}}>
          <div style={{fontSize:14,fontWeight:500,marginBottom:6}}>封存此個案？</div>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.7,marginBottom:12}}>
            封存後不會出現在首頁及個案管理，所有聯絡紀錄完整保留。
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="act-btn" style={{flex:1}} onClick={()=>setArchiveConfirm(false)}>取消</button>
            <button className="act-btn primary" style={{flex:1}} onClick={()=>{updateCase(c.id,()=>({archived:true,archivedAt:new Date().toISOString()}));showToast("已封存個案");onBack();}}>確認封存</button>
          </div>
        </div>
      )}

      <div className="sec-label" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>聯絡紀錄</span>
        {c.logs&&c.logs.length>0&&<span style={{fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:11}}>{c.logs.length} 筆</span>}
      </div>
      {(!c.logs||c.logs.length===0)&&<div style={{margin:"0 16px 12px",padding:"12px 14px",background:"var(--surface2)",borderRadius:"var(--r)",fontSize:12,color:"var(--muted)"}}>尚無聯絡紀錄，點「記錄聯絡」開始記錄。</div>}
      {(c.logs||[]).map((log,i)=>(
        <div key={i}>
          <div className="log-item" style={{cursor:"pointer"}} onClick={()=>setEditLogIdx(editLogIdx===i?null:i)}>
            <div className="log-line"/>
            <div className="log-body" style={{flex:1}}>
              <div className="log-date">
                {log.date}{log.time?` ${log.time}`:""} · <span style={{background:"var(--surface2)",padding:"1px 7px",borderRadius:4,fontSize:11}}>{log.method}</span>
                {log.planId&&(()=>{const p=c.trackingPlans?.find(p=>p.id===log.planId);return p?<span style={{marginLeft:4,fontSize:10,color:"var(--accent-mid)"}}>{p.name||p.method}</span>:null;})()}
              </div>
              <div className="log-note" style={{marginTop:3}}>{log.note}</div>
            </div>
            <div style={{fontSize:11,color:"var(--muted)",flexShrink:0,alignSelf:"center"}}>⋯</div>
          </div>
          {editLogIdx===i&&(
            <EditLogPanel log={log} idx={i} onClose={()=>setEditLogIdx(null)}
              methods={methods}
              onSave={(newLog)=>{
                updateCase(c.id,prev=>({
                  logs:prev.logs.map((l,j)=>j===i?newLog:l)
                }));
                setEditLogIdx(null); showToast("已更新");
              }}
              onDelete={()=>{
                updateCase(c.id,prev=>({
                  logs:prev.logs.filter((_,j)=>j!==i)
                }));
                setEditLogIdx(null); showToast("已刪除");
              }}/>
          )}
        </div>
      ))}

      {logModal&&<LogModal case_={c} methods={methods} onClose={()=>setLogModal(false)} onSave={handleLogSave}/>}
      {visitModal&&<VisitModal case_={c} methods={methods}
        onClose={()=>setVisitModal(false)}
        onSave={(id,planId,date,time,note)=>{
          updateCase(id,prev=>({
            trackingPlans:(prev.trackingPlans||[]).map(p=>{
              if(p.id!==planId) return p;
              const existing = Array.isArray(p.bookings)?p.bookings:(p.nextDue?[{date:p.nextDue,time:p.visitTime||"",note:p.visitNote||""}]:[]);
              const newBookings = [...existing, {date,time:time||"",note:note||""}].sort((a,b)=>a.date>b.date?1:a.date<b.date?-1:0);
              const nearest = newBookings.find(b=>b.date>=TODAY) || newBookings[0];
              return {...p, bookings:newBookings, nextDue:nearest?.date||null, visitTime:nearest?.time||"", visitNote:nearest?.note||""};
            }),
          }));
          showToast(`已新增預約 ${date.slice(5)}${time?" "+time:""}`);
        }}/>}
      {editVisitPlan&&<VisitModal case_={c} methods={methods} editPlan={editVisitPlan} lockMethod onClose={()=>setEditVisitPlan(null)}
        onSave={(id,planId,date,time,note)=>{
          updateCase(id,prev=>({
            trackingPlans:(prev.trackingPlans||[]).map(p=>{
              if(p.id!==editVisitPlan.id) return p;
              const existing = Array.isArray(p.bookings)?p.bookings:(p.nextDue?[{date:p.nextDue,time:p.visitTime||"",note:p.visitNote||""}]:[]);
              const idx = existing.findIndex(b=>b.date===editVisitPlan.nextDue && (b.time||"")===(editVisitPlan.visitTime||""));
              const newBookings = idx>=0
                ? existing.map((b,i)=>i===idx?{date,time:time||"",note:note||""}:b)
                : [...existing, {date,time:time||"",note:note||""}];
              const sorted = newBookings.sort((a,b)=>a.date>b.date?1:a.date<b.date?-1:0);
              const nearest = sorted.find(b=>b.date>=TODAY) || sorted[0];
              return {...p, bookings:sorted, nextDue:nearest?.date||null, visitTime:nearest?.time||"", visitNote:nearest?.note||""};
            }),
          }));
          showToast(`已更新預約 ${date.slice(5)}${time?" "+time:""}`);
        }}
        onCancel={()=>{
          updateCase(c.id,prev=>({
            trackingPlans:(prev.trackingPlans||[]).map(p=>{
              if(p.id!==editVisitPlan.id) return p;
              const existing = Array.isArray(p.bookings)?p.bookings:(p.nextDue?[{date:p.nextDue,time:p.visitTime||"",note:p.visitNote||""}]:[]);
              const remaining = existing.filter(b=>!(b.date===editVisitPlan.nextDue && (b.time||"")===(editVisitPlan.visitTime||"")));
              const sorted = remaining.sort((a,b)=>a.date>b.date?1:a.date<b.date?-1:0);
              const nearest = sorted.find(b=>b.date>=TODAY) || sorted[0];
              return {...p, bookings:sorted, nextDue:nearest?.date||null, visitTime:nearest?.time||"", visitNote:nearest?.note||""};
            })
          }));
          showToast("已取消該筆預約");
        }}/>}
      {bookingsModal&&<BookingsModal case_={c} onClose={()=>setBookingsModal(false)}
        onAddNew={()=>{
          setBookingsModal(false);
          setVisitModal(true);
        }}
        onEditBooking={(plan,booking)=>{
          setBookingsModal(false);
          setEditVisitPlan({...plan, nextDue:booking.date, visitTime:booking.time, visitNote:booking.note});
        }}/>}
      {editModal&&<EditCaseModal case_={c} methods={methods} levels={levels}
        onClose={()=>setEditModal(false)} onSave={handleEditSave}
        onDelete={(id)=>{updateCase(id,()=>null);onBack();}}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR SCREEN
// ─────────────────────────────────────────────────────────────────────────────


function BookingsModal({ case_:c, onClose, onAddNew, onEditBooking }){
  const plans = c.trackingPlans||[];
  // 攤平所有計畫的所有未來預約，附帶所屬計畫資訊
  const allBookings = plans.flatMap(p=>
    getFutureBookings(p).map(b=>({...b, plan:p}))
  ).sort((a,b)=>a.date>b.date?1:a.date<b.date?-1:(a.time||"").localeCompare(b.time||""));

  return (
    <div className="overlay center" onClick={onClose}>
      <div className="sheet center" onClick={e=>e.stopPropagation()}>
        <div className="sheet-title">未來預約</div>
        <div className="sheet-sub" style={{marginBottom:16}}>{c.nick}</div>

        {allBookings.length===0 && (
          <div style={{padding:"16px 0",textAlign:"center",fontSize:13,color:"var(--muted)"}}>目前沒有預約</div>
        )}

        {allBookings.length>0 && (
          <div style={{marginBottom:16}}>
            {allBookings.map((b,i)=>(
              <div key={i} className="plan-pick-row" style={{cursor:"pointer"}}
                onClick={()=>onEditBooking(b.plan,b)}>
                <div>
                  <div style={{fontSize:13,fontWeight:500}}>{b.plan.name||b.plan.method}</div>
                  <div style={{fontSize:11,color:"var(--muted)"}}>{b.plan.method}{b.note?` · ${b.note}`:""}</div>
                </div>
                <div style={{fontSize:13,fontWeight:600,color:"var(--accent)",flexShrink:0}}>
                  {b.date.slice(5).replace("-","/")}{b.time?` ${b.time}`:""}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>關閉</button>
          <button className="act-btn primary" onClick={onAddNew}>＋ 新增預約</button>
        </div>
      </div>
    </div>
  );
}


function VisitModal({ case_:c, methods, editPlan, lockMethod, onClose, onSave, onCancel }) {
  const d7 = new Date(TODAY); d7.setDate(d7.getDate()+7);
  const plans = c.trackingPlans||[];
  const isEdit = !!editPlan;
  // 新增流程：先選要預約哪個追蹤任務（若只有一個直接鎖定）
  const [planId, setPlanId] = useState(editPlan?.id || plans[0]?.id || null);
  const selectedPlan = plans.find(p=>p.id===planId) || editPlan;
  const [date, setDate]     = useState(editPlan?.nextDue || d7.toISOString().slice(0,10));
  const [time, setTime]     = useState(editPlan?.visitTime || "");
  const [note, setNote]     = useState(editPlan?.visitNote || "");

  return (
    <div className="overlay center" onClick={onClose}>
      <div className="sheet center" onClick={e=>e.stopPropagation()}>
        <div className="sheet-title">{isEdit?"編輯預約":"預約訪視"}</div>
        <div className="sheet-sub" style={{marginBottom:16}}>{c.nick}{isEdit?` · ${editPlan.name||editPlan.method}`:""}</div>

        <label className="inp-label">日期與時間</label>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <input type="date" className="inp" style={{flex:1,marginBottom:0}} value={date} min={TODAY} onChange={e=>setDate(e.target.value)}/>
          <input type="time" className="inp" style={{flex:1,marginBottom:0}} value={time} onChange={e=>setTime(e.target.value)} placeholder="選填，不填視為全天"/>
        </div>

        {!isEdit && plans.length>0 && (
          <>
            <label className="inp-label">追蹤任務</label>
            <select className="inp" value={planId||""} onChange={e=>setPlanId(e.target.value)}>
              {plans.map(p=><option key={p.id} value={p.id}>{p.name||p.method}（{p.method}）</option>)}
            </select>
          </>
        )}
        {!isEdit && plans.length===0 && (
          <div className="inp-hint" style={{marginTop:-4}}>此個案尚未設定追蹤任務，請先於「編輯」中新增。</div>
        )}

        <label className="inp-label">備註（選填）</label>
        <input className="inp" placeholder="地點或注意事項…" value={note} onChange={e=>setNote(e.target.value)} maxLength={60}/>

        <div className="btn-row">
          <button className="act-btn" onClick={onClose}>{isEdit?"返回":"取消"}</button>
          <button className="act-btn primary" disabled={!date||!selectedPlan}
            onClick={()=>{onSave(c.id,planId,date,time,note.trim());onClose();}}>{isEdit?"儲存變更":"確認預約"}</button>
        </div>
        {isEdit&&(
          <button className="act-btn danger" style={{width:"100%",marginTop:8,padding:"10px 0"}}
            onClick={()=>{onCancel();onClose();}}>取消此預約</button>
        )}
      </div>
    </div>
  );
}

function CalendarScreen({ cases, onOpen }){
  const tp=TODAY.split("-").map(Number);
  const [year,setYear]   = useState(tp[0]);
  const [month,setMonth] = useState(tp[1]-1);
  const [sel,setSel]     = useState(TODAY);
  const wrapRef = useRef(null);

  useEffect(()=>{
    function apply(){
      if(!wrapRef.current) return;
      const w=wrapRef.current.offsetWidth;
      if(w>0) wrapRef.current.style.setProperty("--csz",Math.floor(w/7)+"px");
    }
    apply(); window.addEventListener("resize",apply);
    return ()=>window.removeEventListener("resize",apply);
  },[]);

  function prev(){ if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); }
  function next(){ if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); }

  const {first,total}=getMonthDays(year,month);
  const cells=[]; for(let i=0;i<first;i++)cells.push(null); for(let d=1;d<=total;d++)cells.push(d); while(cells.length%7)cells.push(null);

  // Build event map from trackingPlans nextDue dates
  const eventMap={};
  cases.filter(c=>!c.archived).forEach(c=>{
    (c.trackingPlans||[]).forEach(p=>{
      if(p.nextDue){
        if(!eventMap[p.nextDue])eventMap[p.nextDue]=[];
        eventMap[p.nextDue].push({nick:c.nick,time:p.visitTime||"",type:p.name||p.method,id:c.id});
      }
    });
    // No tracking plans = not shown on calendar
  });
  const selEvts=eventMap[sel]||[];

  return (
    <div className="screen-pad">
      <div className="cal-nav">
        <button className="cal-arrow" onClick={prev}>‹</button>
        <div className="cal-month">{year}年 {MONTH_NAMES[month]}</div>
        <button className="cal-arrow" onClick={next}>›</button>
      </div>
      <div className="cal-wrap" ref={wrapRef} style={{"--csz":"44px"}}>
        <div className="cal-head">{DOW_NAMES.map(d=><div key={d} className="cal-th">{d}</div>)}</div>
        <div className="cal-body" style={{gridTemplateRows:`repeat(${cells.length/7},var(--csz,44px))`,height:`calc(var(--csz,44px)*${cells.length/7})`}}>
          {cells.map((d,i)=>{
            if(d===null) return <div key={i} className="cal-td empty" style={{width:"var(--csz,44px)",height:"var(--csz,44px)"}}/>;
            const ds=ymd(year,month,d), evts=eventMap[ds]||[];
            const cls=["cal-td",ds===TODAY?"today-cell":"",ds===sel&&ds!==TODAY?"selected-cell":""].filter(Boolean).join(" ");
            return (
              <div key={ds} className={cls} style={{width:"var(--csz,44px)",height:"var(--csz,44px)"}} onClick={()=>setSel(ds)}>
                <div className="cal-num">{d}</div>
                {evts.length>0&&<div className="cal-dots">{evts.slice(0,3).map((e,j)=><div key={j} className="cal-dot" style={{background:"var(--accent)"}}/>)}</div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="day-panel">
        <div className="day-panel-hd">{sel.slice(5).replace("-","/")} · {selEvts.length===0?"無行程":`${selEvts.length} 項`}</div>
        {selEvts.length===0&&<div style={{padding:"16px",fontSize:13,color:"var(--muted)"}}>這天沒有排定追蹤</div>}
        {[...selEvts].sort((a,b)=>(!a.time?-1:!b.time?1:a.time.localeCompare(b.time))).map((e,i)=>(
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

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGES
// ─────────────────────────────────────────────────────────────────────────────

function MethodsPage({ methods, setMethods, onBack }){
  const [editing,setEditing]=useState(null); const [editVal,setEditVal]=useState(""); const [adding,setAdding]=useState(false); const [newVal,setNewVal]=useState("");
  function startEdit(i){setEditing(i);setEditVal(methods[i]);setAdding(false);}
  function saveEdit(){const v=editVal.trim();if(!v){setEditing(null);return;}setMethods(prev=>prev.map((m,i)=>i===editing?v:m));setEditing(null);}
  function del(i){if(methods.length<=1)return;setMethods(prev=>prev.filter((_,j)=>j!==i));setEditing(null);}
  function addM(){const v=newVal.trim();if(!v||methods.includes(v))return;setMethods(prev=>[...prev,v]);setNewVal("");setAdding(false);}
  return (
    <div className="screen-pad">
      <div className="ph"><div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">聯絡方式</div></div><button className="ph-action" onClick={()=>{setAdding(true);setEditing(null);}}>＋</button></div>
      <div className="settings-group">
        {methods.map((m,i)=>editing===i?(
          <div key={i} className="settings-row" style={{gap:8,cursor:"default"}}>
            <input className="inp" style={{flex:1,marginBottom:0,height:36,padding:"0 12px",fontSize:13}} value={editVal} onChange={e=>setEditVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} autoFocus/>
            <button className="act-btn primary" style={{padding:"6px 12px",fontSize:12}} onClick={saveEdit}>存</button>
            <button className="act-btn danger" style={{padding:"6px 10px",fontSize:12}} onClick={()=>del(i)} disabled={methods.length<=1}>刪</button>
          </div>
        ):(
          <div key={i} className="settings-row" onClick={()=>startEdit(i)}>
            <span className="s-label">{m}</span><span style={{fontSize:12,color:"var(--accent-mid)"}}>編輯</span>
          </div>
        ))}
        {adding&&(
          <div className="settings-row" style={{gap:8,cursor:"default"}}>
            <input className="inp" style={{flex:1,marginBottom:0,height:36,padding:"0 12px",fontSize:13}} placeholder="新聯絡方式…" value={newVal} onChange={e=>setNewVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addM();if(e.key==="Escape")setAdding(false);}} autoFocus/>
            <button className="act-btn primary" style={{padding:"6px 12px",fontSize:12}} onClick={addM}>加入</button>
            <button className="act-btn" style={{padding:"6px 10px",fontSize:12}} onClick={()=>setAdding(false)}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

function LevelsPage({ levels, setLevels, methods, onBack }){
  const safe=methods.length>0?methods:["電話"];
  const [editKey,setEditKey]=useState(null); const [form,setForm]=useState({}); const [planEdit,setPlanEdit]=useState([]); const [editErr,setEditErr]=useState("");
  const [adding,setAdding]=useState(false); const [newForm,setNewForm]=useState({key:"",label:"",days:14,desc:"",colorKey:"yellow"}); const [newPlans,setNewPlans]=useState([]); const [err,setErr]=useState("");
  const colorOf=k=>LEVEL_COLOR_OPTIONS.find(c=>c.key===k)||LEVEL_COLOR_OPTIONS[1];
  function loadPlans(k){ try{const r=localStorage.getItem(LS_DPLANS);if(r){const d=JSON.parse(r);return d[k]||[];}}catch{}return[]; }
  function savePlans(k,t){ try{const r=localStorage.getItem(LS_DPLANS);const d=r?JSON.parse(r):{};d[k]=t;localStorage.setItem(LS_DPLANS,JSON.stringify(d));}catch{} }
  function startEdit(k){setEditKey(k);setAdding(false);setEditErr("");setForm({label:levels[k].label,days:levels[k].days,desc:levels[k].desc||"",colorKey:levels[k].colorKey||"yellow"});setPlanEdit(loadPlans(k));}
  function saveEdit(){
    if(!form.label?.trim())return;
    if(planEdit.length===0){ setEditErr("每個等級至少需要一個追蹤任務"); return; }
    setEditErr("");
    setLevels(prev=>({...prev,[editKey]:{...prev[editKey],label:form.label.trim(),days:Math.max(1,Number(form.days)||7),desc:(form.desc||"").trim(),colorKey:form.colorKey}}));
    savePlans(editKey,planEdit);
    setEditKey(null);
  }
  function delLevel(k){if(Object.keys(levels).length<=1)return;setLevels(prev=>{const n={...prev};delete n[k];return n;});setEditKey(null);}
  function startAdd(){setAdding(true);setEditKey(null);setNewForm({key:"",label:"",days:14,desc:"",colorKey:"yellow"});setNewPlans([]);setErr("");}
  function saveAdd(){
    const k=newForm.key.trim().toUpperCase();
    if(!k||!newForm.label.trim()){setErr("請填寫 ID 和名稱");return;}
    if(levels[k]){setErr(`ID「${k}」已存在`);return;}
    if(newPlans.length===0){setErr("每個等級至少需要一個追蹤任務");return;}
    setLevels(prev=>({...prev,[k]:{label:newForm.label.trim(),days:Math.max(1,Number(newForm.days)||14),desc:(newForm.desc||"").trim(),colorKey:newForm.colorKey}}));
    savePlans(k,newPlans);
    setAdding(false);
    setErr("");
  }
  return (
    <div className="screen-pad">
      <div className="ph"><div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">關懷等級管理</div></div><button className="ph-action" onClick={startAdd}>＋</button></div>
      <div className="settings-group">
        {Object.entries(levels).map(([k,l])=>{
          const col=colorOf(l.colorKey||"yellow"); const plans=loadPlans(k);
          if(editKey===k) return (
            <div key={k} style={{background:"var(--bg)",padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
              <label className="inp-label">名稱</label><input className="inp" value={form.label} onChange={e=>setForm(x=>({...x,label:e.target.value}))} autoFocus/>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1}}>
                  <label className="inp-label">頻率說明</label>
                  <input className="inp" value={form.desc} placeholder="例：每週一次" onChange={e=>setForm(x=>({...x,desc:e.target.value}))}/>
                </div>
                <div style={{flex:1}}>
                  <label className="inp-label">間隔天數</label>
                  <input className="inp" type="number" min={1} value={form.days} onChange={e=>setForm(x=>({...x,days:e.target.value}))}/>
                </div>
              </div>
              <label className="inp-label">顏色</label>
              <div className="opt-row" style={{marginBottom:12}}>
                {LEVEL_COLOR_OPTIONS.map(c=><div key={c.key} className={`opt ${form.colorKey===c.key?"active":""}`} style={form.colorKey===c.key?{background:c.bg,borderColor:c.color,color:c.color}:{}} onClick={()=>setForm(x=>({...x,colorKey:c.key}))}>{c.label}</div>)}
              </div>
              <div style={{borderTop:"1px solid var(--border)",marginBottom:12,paddingTop:12}}>
                <TrackingPlanEditor plans={planEdit} setPlans={setPlanEdit} methods={safe}/>
              </div>
              {editErr&&<div className="inp-err">{editErr}</div>}
              <div style={{display:"flex",gap:6}}>
                <button className="act-btn primary" style={{flex:2,padding:"8px 0",fontSize:13}} onClick={saveEdit}>儲存</button>
                {Object.keys(levels).length>1&&<button className="act-btn danger" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={()=>delLevel(k)}>刪除</button>}
                <button className="act-btn" style={{flex:1,padding:"8px 0",fontSize:13}} onClick={()=>setEditKey(null)}>取消</button>
              </div>
            </div>
          );
          return (
            <div key={k} className="settings-row" onClick={()=>startEdit(k)}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:col.bg,color:col.color,letterSpacing:".02em"}}>{l.label}</span>
                <div>
                  <div className="s-label">{l.desc||l.label}</div>
                  <div className="s-sub">每 {l.days} 天{plans.length>0?" · "+plans.map(p=>`${p.name||p.method}`).join("、"):""}</div>
                </div>
              </div>
              <span style={{fontSize:12,color:"var(--accent-mid)"}}>編輯</span>
            </div>
          );
        })}
        {adding&&(
          <div style={{background:"var(--bg)",padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
            <label className="inp-label">名稱</label><input className="inp" placeholder="例：高風險" value={newForm.label} onChange={e=>setNewForm(f=>({...f,label:e.target.value}))} autoFocus/>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1}}>
                <label className="inp-label">頻率說明</label>
                <input className="inp" placeholder="例：每月兩次" value={newForm.desc} onChange={e=>setNewForm(f=>({...f,desc:e.target.value}))}/>
              </div>
              <div style={{flex:1}}>
                <label className="inp-label">間隔天數</label>
                <input className="inp" type="number" min={1} value={newForm.days} onChange={e=>setNewForm(f=>({...f,days:e.target.value}))}/>
              </div>
            </div>
            <label className="inp-label">顏色</label>
            <div className="opt-row" style={{marginBottom:8}}>
              {LEVEL_COLOR_OPTIONS.map(c=><div key={c.key} className={`opt ${newForm.colorKey===c.key?"active":""}`} style={newForm.colorKey===c.key?{background:c.bg,borderColor:c.color,color:c.color}:{}} onClick={()=>setNewForm(f=>({...f,colorKey:c.key}))}>{c.label}</div>)}
            </div>
            <label className="inp-label">識別碼（英文，如 A / B）</label><input className="inp" placeholder="例：H" value={newForm.key} onChange={e=>setNewForm(f=>({...f,key:e.target.value}))} maxLength={4}/>
            <div style={{borderTop:"1px solid var(--border)",marginBottom:12,paddingTop:12}}>
              <TrackingPlanEditor plans={newPlans} setPlans={setNewPlans} methods={safe}/>
            </div>
            {err&&<div className="inp-err">{err}</div>}
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

function ReminderPage({ onBack }){
  const PRESETS=["08:00","09:00","12:00","13:00","18:00","20:00"];
  const [times,setTimes]=useState(["09:00"]); const [adding,setAdding]=useState(false); const [custom,setCustom]=useState("09:00");
  function addTime(t){if(!times.includes(t))setTimes(prev=>[...prev,t].sort());setAdding(false);}
  function removeTime(t){if(times.length>1)setTimes(prev=>prev.filter(x=>x!==t));}
  return (
    <div className="screen-pad">
      <div className="ph"><div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">提醒設定</div></div></div>
      <div className="settings-group">
        {times.map(t=>(
          <div key={t} className="settings-row">
            <span className="s-label" style={{fontVariantNumeric:"tabular-nums"}}>{t}</span>
            <button className="act-btn danger" style={{padding:"4px 10px",fontSize:12}} onClick={()=>removeTime(t)} disabled={times.length<=1}>移除</button>
          </div>
        ))}
        <div className="settings-row" style={{cursor:"default"}}>
          <button className="act-btn" style={{width:"100%",padding:"9px 0",textAlign:"center",fontSize:13}} onClick={()=>setAdding(!adding)}>{adding?"取消":"＋ 新增提醒時間"}</button>
        </div>
        {adding&&(
          <div style={{padding:"12px 16px",background:"var(--bg)",borderTop:"1px solid var(--border)"}}>
            <div className="opt-row" style={{marginBottom:10}}>
              {PRESETS.filter(p=>!times.includes(p)).map(p=><div key={p} className="opt" style={{minWidth:60}} onClick={()=>addTime(p)}>{p}</div>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input type="time" className="inp" style={{flex:1,marginBottom:0}} value={custom} onChange={e=>setCustom(e.target.value)}/>
              <button className="act-btn primary" style={{padding:"0 16px"}} onClick={()=>addTime(custom)}>加入</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArchivedPage({ cases, updateCase, onBack, showToast }){
  const [uid,setUid]=useState(null);
  const archived=[...cases].filter(c=>c.archived).sort((a,b)=>new Date(b.archivedAt||0)-new Date(a.archivedAt||0));
  return (
    <div className="screen-pad">
      <div className="ph"><div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">封存的個案</div></div></div>
      {archived.length===0&&<div className="empty">目前沒有封存的個案</div>}
      {archived.map(c=>(
        <div key={c.id}>
          <div className="card-row" style={{cursor:"default"}}>
            <div className="row-main">
              <div className="row-nick">{c.nick}</div>
              <div className="row-meta">最後聯絡：{c.lastContact?.slice(5)||"—"} · 封存：{c.archivedAt?new Date(c.archivedAt).toLocaleDateString("zh-TW"):"—"}</div>
            </div>
            <button className="act-btn" style={{fontSize:12,padding:"5px 12px",flexShrink:0}} onClick={()=>setUid(uid===c.id?null:c.id)}>解除封存</button>
          </div>
          {uid===c.id&&(
            <div style={{margin:"-8px 16px 10px",background:"var(--green-bg)",border:"1px solid #A8D8BC",borderRadius:"0 0 var(--r) var(--r)",padding:"12px 14px"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>解除封存「{c.nick}」？</div>
              <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:10}}>解除後將重新出現在個案管理，並恢復追蹤提醒。</div>
              <div style={{display:"flex",gap:6}}>
                <button className="act-btn" style={{flex:1}} onClick={()=>setUid(null)}>取消</button>
                <button className="act-btn primary" style={{flex:1}} onClick={()=>{updateCase(c.id,()=>({archived:false,archivedAt:null}));setUid(null);showToast(`已解除封存 ${c.nick}`);}}>解除封存</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ExportCenterPage({ cases, levels, methods, onBack, showToast }){
  function dl(content,filename,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
  function exportCSV(){
    const header=["暱稱","編號","等級","上次聯絡","備註","追蹤計畫"];
    const rows=cases.map(c=>[c.nick??"",c.id??"",levels[c.level]?.label||c.level||"",c.lastContact??"",c.note??"",(c.trackingPlans||[]).map(p=>`${p.name||p.method}/${FREQ_OPTIONS.find(f=>f.key===p.freq)?.label||p.freq}/${p.timesPerPeriod}次`).join("; ")]);
    dl("\uFEFF"+[header,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n"),"ReCon_export.csv","text/csv;charset=utf-8;");
    showToast("已匯出 CSV");
  }
  function exportCanWe(){
    const payload={version:"1.0",source:"ReCon",exportedAt:new Date().toISOString(),contacts:cases.map(c=>({name:c.nick??"",phone:"",level:levels[c.level]?.label??c.level??"",nextContactDate:c.trackingPlans?.[0]?.nextDue??"",notes:c.note??"",trackingPlans:(c.trackingPlans||[]),history:(c.logs??[]).map(l=>({date:l.date??"",method:l.method??"",note:l.note??""}))}))};
    dl(JSON.stringify(payload,null,2),"recon_canwe_export.json","application/json;charset=utf-8;");
    showToast("已匯出 CanWe 相容檔案");
  }
  function exportBackup(){
    const payload={version:"15.0",source:"ReCon",exportedAt:new Date().toISOString(),cases,levels,methods};
    dl(JSON.stringify(payload,null,2),`ReCon_backup_${new Date().toISOString().slice(0,10)}.json`,"application/json;charset=utf-8;");
    showToast("已匯出完整備份");
  }
  return (
    <div className="screen-pad">
      <div className="ph"><div><button className="back-btn" onClick={onBack}>‹ 設定</button><div className="ph-title">資料匯出中心</div></div></div>
      <div className="settings-group">
        <div className="settings-row" onClick={exportCSV}><div><div className="s-label">匯出 CSV</div><div className="s-sub">個案列表，可用 Excel 開啟</div></div><span className="s-arrow">↓</span></div>
        <div className="settings-row" onClick={exportCanWe}><div><div className="s-label">匯出 CanWe 格式</div><div className="s-sub">JSON，可於 CanWe 匯入使用</div></div><span className="s-arrow">↓</span></div>
        <div className="settings-row" onClick={exportBackup}><div><div className="s-label">完整資料備份</div><div className="s-sub">個案、追蹤計畫、設定，JSON 格式</div></div><span className="s-arrow">↓</span></div>
      </div>
      <div style={{padding:"12px 22px",fontSize:12,color:"var(--muted)",lineHeight:1.7}}>未來將陸續支援 Excel、PDF、Google Calendar 等格式。</div>
    </div>
  );
}

function SettingsScreen({ cases, methods, setMethods, levels, setLevels, updateCase, showToast, theme, setTheme, weekStartDow, setWeekStartDow }){
  const [page,setPage]=useState("hub");
  if(page==="methods")  return <MethodsPage  methods={methods} setMethods={setMethods} onBack={()=>setPage("hub")}/>;
  if(page==="levels")   return <LevelsPage   levels={levels}   setLevels={setLevels}   methods={methods} onBack={()=>setPage("hub")}/>;
  if(page==="reminder") return <ReminderPage onBack={()=>setPage("hub")}/>;
  if(page==="archived") return <ArchivedPage cases={cases} updateCase={updateCase} onBack={()=>setPage("hub")} showToast={showToast}/>;
  if(page==="export")   return <ExportCenterPage cases={cases} levels={levels} methods={methods} onBack={()=>setPage("hub")} showToast={showToast}/>;
  return (
    <div className="screen-pad">
      <div className="ph"><div><div className="ph-eyebrow">ReCon｜再聯絡</div><div className="ph-title">設定</div></div></div>
      <div className="sec-label">個案</div>
      <div className="settings-group">
        <div className="settings-row" onClick={()=>setPage("archived")}>
          <div><div className="s-label">封存的個案</div><div className="s-sub">{cases.filter(c=>c.archived).length} 個</div></div>
          <span className="s-arrow">›</span>
        </div>
      </div>
      <div className="sec-label">管理</div>
      <div className="settings-group">
        <div className="settings-row" onClick={()=>setPage("methods")}><div><div className="s-label">聯絡方式管理</div><div className="s-sub">{methods.length} 種方式</div></div><span className="s-arrow">›</span></div>
        <div className="settings-row" onClick={()=>setPage("levels")}><div><div className="s-label">關懷等級管理</div><div className="s-sub">{Object.keys(levels).length} 個等級（含預設追蹤計畫）</div></div><span className="s-arrow">›</span></div>
        <div className="settings-row" onClick={()=>setPage("reminder")}><div className="s-label">提醒設定</div><span className="s-arrow">›</span></div>
      </div>
      <div className="sec-label">資料</div>
      <div className="settings-group">
        <div className="settings-row" onClick={()=>setPage("export")}><div className="s-label">資料匯出中心</div><span className="s-arrow">›</span></div>
      </div>
      <div className="sec-label">顯示</div>
      <div className="settings-group">
        <div className="settings-row static">
          <div><div className="s-label">外觀模式</div><div className="s-sub">{theme==="dark"?"深色":"淺色"}</div></div>
          <div style={{display:"flex",gap:8}}>
            <button className={`act-btn ${theme!=="dark"?"primary":""}`} style={{padding:"5px 14px",fontSize:12}} onClick={()=>setTheme("light")}>淺色</button>
            <button className={`act-btn ${theme==="dark"?"primary":""}`} style={{padding:"5px 14px",fontSize:12}} onClick={()=>setTheme("dark")}>深色</button>
          </div>
        </div>
        <div className="settings-row static" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
          <div>
            <div className="s-label">週期起始日</div>
            <div className="s-sub">追蹤計畫「每週／每兩週」的週期範圍從哪天開始算</div>
          </div>
          <div className="opt-row" style={{marginBottom:0,flexWrap:"wrap"}}>
            {DOW_NAMES.map((name,i)=>(
              <div key={i} className={`opt ${weekStartDow===i?"active":""}`}
                style={{minWidth:44,flex:"0 0 auto"}}
                onClick={()=>setWeekStartDow(i)}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sec-label">關於</div>
      <div className="settings-group">
        <div className="settings-row static">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src={theme==="dark"?LOGO_DARK:LOGO_LIGHT} width="44" height="44" style={{objectFit:"contain"}}/>
            <span className="s-label">ReCon｜再聯絡</span>
          </div>
          <span className="s-val">v15.38</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App(){
  const [cases,   setCases]   = useState(()=>lsGet(LS.cases,   makeInitialCases()));
  const [methods, setMethods] = useState(()=>lsGet(LS.methods, INITIAL_METHODS));
  const [levels,  setLevels]  = useState(()=>lsGet(LS.levels,  INITIAL_LEVELS));
  const [theme,   setThemeRaw]= useState(()=>{ try{return localStorage.getItem(LS.theme)||"light"}catch{return "light"} });
  function setTheme(t){ setThemeRaw(t); try{localStorage.setItem(LS.theme,t)}catch{} }
  const [weekStartDow, setWeekStartDowRaw] = useState(()=>getWeekStartDow());
  function setWeekStartDow(d){
    setWeekStartDowRaw(d);
    try{ localStorage.setItem(LS_WEEKSTART, String(d)); }catch{}
    // 立即重算所有個案的 trackingPlans.nextDue，讓新的週期起始日馬上生效，不會讓程式因舊資料而算錯
    setCases(prev=>prev.map(c=>({
      ...c,
      trackingPlans:(c.trackingPlans||[]).map(p=>{
        // 若尚未有預約(bookings)，重新對齊 nextDue 到新的週期範圍；已手動預約的日期不受影響
        if(Array.isArray(p.bookings) && p.bookings.length>0) return p;
        if(!p.nextDue) return p;
        return {...p, nextDue: calcPlanNextDue(p, TODAY)};
      })
    })));
  }
  const [tab,     setTab]     = useState("home");
  const [detailId,setDetailId]= useState(null);
  const [toast,   setToast]   = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const toastTimer = useRef(null);

  useEffect(()=>{ lsSet(LS.cases,   cases);   },[cases]);
  useEffect(()=>{ lsSet(LS.methods, methods); },[methods]);
  useEffect(()=>{ lsSet(LS.levels,  levels);  },[levels]);
  useEffect(()=>{ document.title="ReCon｜再聯絡"; },[]);

  function updateCase(id, patchFn){
    setCases(prev=>{
      const next=prev.map(c=>{
        if(c.id!==id) return c;
        try{
          const patch=patchFn(c);
          if(patch===null) return null;
          return {
            ...c, ...patch,
            lastContact:  patch.lastContact  || c.lastContact  || TODAY,
            logs:         Array.isArray(patch.logs) ? patch.logs : (c.logs||[]),
            trackingPlans: patch.hasOwnProperty("trackingPlans") ? patch.trackingPlans : (c.trackingPlans||[]),
          };
        }catch(e){console.error(e);return c;}
      });
      return next.filter(Boolean);
    });
  }

  function addCase(nc){ setCases(prev=>[...prev,nc]); showToast(`已新增 ${nc.nick}`); }
  function deleteCase(id){ setCases(prev=>prev.filter(c=>c.id!==id)); showToast("已刪除"); if(detailId===id){setDetailId(null);setTab("cases");} }
  function showToast(msg){ setToast(msg); clearTimeout(toastTimer.current); toastTimer.current=setTimeout(()=>setToast(null),1900); }
  function openCase(id){ setDetailId(id); setTab("detail"); }
  function closeDetail(){ setDetailId(null); setTab("cases"); }

  const detailCase=cases.find(c=>c.id===detailId)??null;
  const NAV=[{key:"home",icon:"◦",label:"今日"},{key:"cases",icon:"≡",label:"個案"},{key:"calendar",icon:"□",label:"行事曆"},{key:"settings",icon:"⊙",label:"設定"}];

  return (
    <>
      <style>{css}</style>
      <div className="shell" data-theme={theme}>
        <div className="screen">
          {tab==="home"     &&<HomeScreen     cases={cases} methods={methods} levels={levels} updateCase={updateCase} showToast={showToast} theme={theme} setTheme={setTheme}/>}
          {tab==="cases"    &&<CasesScreen    cases={cases} methods={methods} levels={levels} onAdd={()=>setAddOpen(true)} onOpen={openCase} updateCase={updateCase} deleteCase={deleteCase} showToast={showToast}/>}
          {tab==="detail"   &&detailCase&&<DetailScreen case_={detailCase} methods={methods} levels={levels} onBack={closeDetail} updateCase={updateCase} showToast={showToast}/>}
          {tab==="calendar" &&<CalendarScreen cases={cases} onOpen={openCase}/>}
          {tab==="settings" &&<SettingsScreen cases={cases} methods={methods} setMethods={setMethods} levels={levels} setLevels={setLevels} updateCase={updateCase} showToast={showToast} theme={theme} setTheme={setTheme} weekStartDow={weekStartDow} setWeekStartDow={setWeekStartDow}/>}
        </div>
        {addOpen&&<AddCaseModal existingCases={cases} levels={levels} methods={methods} onClose={()=>setAddOpen(false)} onSave={nc=>{addCase(nc);setAddOpen(false);}}/>}
        {toast&&<Toast msg={toast}/>}
        <div className="bnav">
          {NAV.map(n=>(
            <button key={n.key} className={`bnav-btn ${(tab===n.key||(tab==="detail"&&n.key==="cases"))?"active":""}`}
              onClick={()=>{setTab(n.key);setDetailId(null);}}>
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
