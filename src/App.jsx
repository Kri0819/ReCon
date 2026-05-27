import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. 全域常數與輔助函式宣告 (防呆與模擬數據)
// ─────────────────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().slice(0, 10); // 取得今天日期 YYYY-MM-DD

// 防止你的專案漏掉基本函式而報錯，這裡提供基礎的模擬邏輯（若你原本有寫在別處，可自行調整）
const daysBetween = (date1, date2) => {
  if (!date1 || !date2) return 0;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
};

const calcNext = (level, fromDate, levelsMap) => {
  const days = levelsMap[level]?.days || 7; // 預設 7 天聯絡一次
  const d = new Date(fromDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. 子組件宣告 (彈出視窗骨架，防止噴 Component is not defined)
// ─────────────────────────────────────────────────────────────────────────────
const LTag = ({ level }) => <span className={`ltag l-${level}`}>{level}</span>;

const LogModal = ({ case_, methods, onClose, onSave }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>記錄聯絡: {case_.nick}</h3>
      <button onClick={() => onSave(case_.id, "電話", "已順利聯絡")}>模擬儲存</button>
      <button onClick={onClose}>關閉</button>
    </div>
  </div>
);

const ScheduleModal = ({ case_, methods, onClose, onSave }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>排定聯絡: {case_.nick}</h3>
      <button onClick={() => onSave(case_.id, { type: "訪視", date: TODAY, time: "14:00" })} >模擬排定</button>
      <button onClick={onClose}>關閉</button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASE DETAIL SCREEN (你核心修改的畫面)
// ─────────────────────────────────────────────────────────────────────────────
const DetailScreen = ({ case_: c, methods, levels: levelsMap, onBack, updateCase, showToast }) => {
  const [logModal, setLogModal] = useState(false);
  const [schedModal, setSchedModal] = useState(false);

  const diff = daysBetween(TODAY, c.nextContact);
  const urgColor = diff < 0 ? "var(--red)" : diff <= 1 ? "var(--yellow)" : "var(--green)";
  const urgLabel = diff < 0 ? `逾期 ${Math.abs(diff)} 天` : diff === 0 ? "今日到期" : diff === 1 ? "明日到期" : `${diff} 天後`;

  const handleLogSave = (id, method, note) => {
    updateCase(id, prev => ({
      ...prev,
      lastContact: TODAY,
      nextContact: calcNext(c.level, TODAY, levelsMap),
      scheduled: null,
      logs: [{ date: TODAY, method, note: note || "已聯絡" }, ...prev.logs]
    }));
    setLogModal(false);
    showToast("已記錄");
  };

  const handleSchedSave = (id, sched) => {
    updateCase(id, prev => ({ ...prev, scheduled: sched }));
    setSchedModal(false);
    showToast(`已排定 ${sched.type} · ${sched.date.slice(5)}`);
  };

  const cancelSched = () => {
    updateCase(c.id, prev => ({ ...prev, scheduled: null }));
    showToast("已取消排程");
  };

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
          <div className="det-cval">{c.lastContact?.slice(5) || '—'}</div>
        </div>
        <div className="det-cell">
          <div className="det-clabel">下次聯絡</div>
          <div className="det-cval" style={{ color: urgColor }}>{c.nextContact?.slice(5) || '—'}</div>
        </div>
        <div className="det-cell">
          <div className="det-clabel">狀態</div>
          <div className="det-cval" style={{ color: urgColor }}>{urgLabel}</div>
        </div>
        <div className="det-cell">
          <div className="det-clabel">等級規則</div>
          <div className="det-cval">{levelsMap[c.level]?.desc || "無規則"}</div>
        </div>
        {c.note && (
          <div className="det-cell full">
            <div className="det-clabel">備註</div>
            <div className="det-cval" style={{ fontWeight: 400, fontSize: 13 }}>{c.note}</div>
          </div>
        )}
        {c.scheduled && (
          <div className="det-cell full" style={{ background: "var(--green-bg)" }}>
            <div className="det-clabel" style={{ color: "var(--green)" }}>已排定</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="det-cval" style={{ color: "var(--green)", fontWeight: 400, fontSize: 13 }}>
                {c.scheduled.date} {c.scheduled.time} · {c.scheduled.type}
                {c.scheduled.note ? ` · ${c.scheduled.note}` : ""}
              </div>
              <button className="act-btn danger" style={{ fontSize: 11 }}
                onClick={() => cancelSched()}>取消</button>
            </div>
          </div>
        )}
      </div>

      <div className="det-actions">
        <button className="act-btn primary" onClick={() => setLogModal(true)}>記錄聯絡</button>
        <button className="act-btn" onClick={() => setSchedModal(true)} disabled={!!c.scheduled}>
          {c.scheduled ? "已排定" : "排定聯絡"}
        </button>
      </div>

      <div className="sec-label">聯絡紀錄</div>
      {c.logs.length === 0 && <div className="empty" style={{ padding: "20px 24px" }}>尚無紀錄</div>}
      {c.logs.map((log, i) => (
        <div className="log-item" key={i}>
          <div className="log-bar"/>
          <div className="log-body">
            <div className="log-date">{log.date}</div>
            <span className="log-tag">{log.method}</span>
            <div className="log-note">{log.note}</div>
          </div>
        </div>
      ))}

      {logModal && <LogModal case_={c} methods={methods} onClose={() => setLogModal(false)} onSave={handleLogSave}/>}
      {schedModal && <ScheduleModal case_={c} methods={methods} onClose={() => setSchedModal(false)} onSave={handleSchedSave}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. 主入口組件 (App) - 確保 Vercel 找得到入口，並提供展示用資料
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // 建立一份模擬的個案資料
  const [currentCase, setCurrentCase] = useState({
    id: "CASE-2026-001",
    nick: "小雨",
    level: "A",
    lastContact: "2026-05-20",
    nextContact: "2026-05-27",
    note: "需要定期追蹤關懷",
    scheduled: null,
    logs: [
      { date: "2026-05-20", method: "電話", note: "學生狀況穩定" }
    ]
  });

  const levelsMap = {
    A: { desc: "每週聯絡一次", days: 7 },
    B: { desc: "每兩週聯絡一次", days: 14 }
  };

  const methods = ["電話", "面談", "通訊軟體"];

  const handleUpdateCase = (id, updateFn) => {
    setCurrentCase(prev => updateFn(prev));
  };

  const handleShowToast = (msg) => {
    alert(`[提示]: ${msg}`); // 暫時用 alert 代替，可自行改為你的 toast 系統
  };

  return (
    <div className="app-container">
      {/* 呼叫你寫的 DetailScreen 元件 */}
      <DetailScreen 
        case_{currentCase}
        methods={methods}
        levels={levelsMap}
        onBack={() => alert("點擊了返回按鈕")}
        updateCase={handleUpdateCase}
        showToast={handleShowToast}
      />
    </div>
  );
}
