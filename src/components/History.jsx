import { useState, useEffect } from "react";
import { getAllDates, getLogsByDate, getGoals, formatDate } from "../db";
import MacroBar from "./MacroBar";

export default function History() {
  const [dates,    setDates]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [entries,  setEntries]  = useState([]);
  const [goals,    setGoals]    = useState({ calories:2000, protein:60, carbs:250, fat:65 });

  useEffect(() => {
    async function load() {
      const [d, g] = await Promise.all([getAllDates(), getGoals()]);
      setDates(d); setGoals(g);
      if (d.length > 0 && !selected) setSelected(d[0]);
    }
    load();
  }, []);

  useEffect(() => { if (selected) getLogsByDate(selected).then(setEntries); }, [selected]);

  const totals = entries.reduce(
    (acc, e) => ({ cal: acc.cal+e.cal, protein: acc.protein+e.protein, carbs: acc.carbs+e.carbs, fat: acc.fat+e.fat }),
    { cal:0, protein:0, carbs:0, fat:0 }
  );

  if (dates.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
      <span className="material-symbols-outlined text-[48px] mb-3">history</span>
      <p className="text-sm">No history yet. Start logging food today!</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Date list */}
      <div className="space-y-2">
        {dates.map(d => (
          <button key={d} onClick={() => setSelected(d)}
            className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              selected === d
                ? "bg-primary text-white shadow-md"
                : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
            }`}
          >
            {formatDate(d)}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-headline font-extrabold text-primary">{totals.cal}</span>
              <span className="text-on-surface-variant text-sm">kcal</span>
            </div>
            <MacroBar label="Protein" value={totals.protein} goal={goals.protein} unit="g"  color="#006d37" />
            <MacroBar label="Carbs"   value={totals.carbs}   goal={goals.carbs}   unit="g"  color="#2ecc71" />
            <MacroBar label="Fat"     value={totals.fat}     goal={goals.fat}     unit="g"  color="#4bca78" />
          </div>

          {/* Meal groups */}
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
                    <span className="text-sm font-bold text-primary">{e.cal}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
