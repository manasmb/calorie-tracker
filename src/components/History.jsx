import { useState, useEffect } from "react";
import { getAllDates, getLogsByDate, getGoals, formatDate, todayStr } from "../db";
import MacroBar from "./MacroBar";

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function monthKey(dateStr) { return dateStr.slice(0, 7); } // "2025-04"

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }

export default function History() {
  const [allDates,  setAllDates]  = useState(new Set());
  const [selected,  setSelected]  = useState(todayStr());
  const [entries,   setEntries]   = useState([]);
  const [goals,     setGoals]     = useState({ calories:2000, protein:60, carbs:250, fat:65 });
  const [showCal,   setShowCal]   = useState(false);
  // Calendar view month: "YYYY-MM"
  const [calMonth,  setCalMonth]  = useState(todayStr().slice(0, 7));

  const today = todayStr();

  useEffect(() => {
    async function load() {
      const [d, g] = await Promise.all([getAllDates(), getGoals()]);
      setAllDates(new Set(d));
      setGoals(g);
    }
    load();
  }, []);

  useEffect(() => {
    getLogsByDate(selected).then(setEntries);
  }, [selected]);

  const totals = entries.reduce(
    (acc, e) => ({ cal: acc.cal+e.cal, protein: acc.protein+e.protein, carbs: acc.carbs+e.carbs, fat: acc.fat+e.fat }),
    { cal:0, protein:0, carbs:0, fat:0 }
  );
  const rt = { cal: Math.round(totals.cal), protein: Math.round(totals.protein), carbs: Math.round(totals.carbs), fat: Math.round(totals.fat) };

  function goBack()    { setSelected(d => addDays(d, -1)); }
  function goForward() { if (selected < today) setSelected(d => addDays(d, +1)); }

  // Calendar helpers
  const [calYear, calMonthNum] = calMonth.split("-").map(Number);
  const firstWeekday = new Date(calYear, calMonthNum - 1, 1).getDay(); // 0=Sun
  const totalDays    = daysInMonth(calYear, calMonthNum - 1);

  function prevCalMonth() {
    const d = new Date(calYear, calMonthNum - 2, 1);
    setCalMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
  }
  function nextCalMonth() {
    const d = new Date(calYear, calMonthNum, 1);
    setCalMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
  }

  function calDayStr(day) {
    return `${calYear}-${String(calMonthNum).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }

  return (
    <div className="space-y-5">
      {/* ── Date navigator ── */}
      <div className="flex items-center justify-between bg-surface-container-lowest rounded-3xl px-4 py-3">
        <button onClick={goBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <button onClick={() => { setCalMonth(selected.slice(0,7)); setShowCal(c => !c); }}
          className="flex flex-col items-center">
          <span className="font-headline font-bold text-on-surface text-base">{formatDate(selected)}</span>
          {selected === today && <span className="text-[10px] text-primary font-semibold uppercase tracking-widest">Today</span>}
        </button>

        <button onClick={goForward} disabled={selected >= today}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant disabled:opacity-30">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* ── Calendar popup ── */}
      {showCal && (
        <div className="bg-surface-container-lowest rounded-4xl p-5 shadow-lg">
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevCalMonth}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="font-headline font-bold text-on-surface">
              {new Date(calYear, calMonthNum-1).toLocaleString("en-IN", { month:"long", year:"numeric" })}
            </span>
            <button onClick={nextCalMonth} disabled={calMonth >= today.slice(0,7)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-30">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-on-surface-variant py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e${i}`} />)}

            {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
              const ds      = calDayStr(day);
              const isToday = ds === today;
              const isSel   = ds === selected;
              const hasData = allDates.has(ds);
              const isFuture= ds > today;

              return (
                <button key={day}
                  disabled={isFuture}
                  onClick={() => { setSelected(ds); setShowCal(false); }}
                  className={`mx-auto w-9 h-9 flex flex-col items-center justify-center rounded-full text-sm font-semibold transition-all
                    ${isSel   ? "bg-primary text-white shadow-md" :
                      isToday ? "ring-2 ring-primary text-primary" :
                      hasData ? "bg-primary-container/40 text-on-surface" :
                                "text-on-surface-variant"}
                    ${isFuture ? "opacity-25 cursor-not-allowed" : "hover:bg-surface-container-low"}
                  `}
                >
                  {day}
                  {hasData && !isSel && (
                    <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Day summary ── */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-headline font-extrabold text-primary">{rt.cal}</span>
              <span className="text-on-surface-variant text-sm">kcal</span>
            </div>
            <MacroBar label="Protein" value={rt.protein} goal={goals.protein} unit="g"  color="#006d37" />
            <MacroBar label="Carbs"   value={rt.carbs}   goal={goals.carbs}   unit="g"  color="#2ecc71" />
            <MacroBar label="Fat"     value={rt.fat}     goal={goals.fat}     unit="g"  color="#4bca78" />
          </div>

          {["breakfast","lunch","snack","dinner"].map(meal => {
            const mealEntries = entries.filter(e => e.meal === meal);
            if (!mealEntries.length) return null;
            return (
              <div key={meal} className="bg-surface-container-lowest rounded-4xl p-5 space-y-2">
                <p className="font-headline font-bold text-base text-on-surface capitalize mb-3">{meal}</p>
                {mealEntries.map(e => (
                  <div key={e.id} className="flex justify-between items-center bg-surface-container-low px-4 py-3 rounded-2xl">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{e.quantity > 1 ? `${e.quantity}× ` : ""}{e.foodName}</p>
                      <p className="text-xs text-on-surface-variant">{e.serving}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{Math.round(e.cal)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] mb-3">no_meals</span>
          <p className="text-sm">Nothing logged for this day.</p>
        </div>
      )}
    </div>
  );
}
