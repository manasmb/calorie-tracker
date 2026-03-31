import { useState, useEffect } from "react";
import { getAllDates, getLogsByDate, getGoals, formatDate } from "../db";
import MacroBar from "./MacroBar";

export default function History() {
  const [dates, setDates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 60, carbs: 250, fat: 65 });

  useEffect(() => {
    async function load() {
      const [d, g] = await Promise.all([getAllDates(), getGoals()]);
      setDates(d);
      setGoals(g);
      if (d.length > 0 && !selected) setSelected(d[0]);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    getLogsByDate(selected).then(setEntries);
  }, [selected]);

  const totals = entries.reduce(
    (acc, e) => ({ cal: acc.cal + e.cal, protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (dates.length === 0) {
    return <p className="empty-state">No history yet. Start logging food today!</p>;
  }

  return (
    <div className="history">
      <div className="date-tabs">
        {dates.map(d => (
          <button
            key={d}
            className={`date-tab ${selected === d ? "active" : ""}`}
            onClick={() => setSelected(d)}
          >
            {formatDate(d)}
          </button>
        ))}
      </div>

      {selected && (
        <div className="history-detail">
          <div className="summary-card">
            <div className="summary-cal">
              <span className="cal-num">{totals.cal}</span>
              <span className="cal-label"> kcal</span>
            </div>
            <MacroBar label="Protein" value={totals.protein} goal={goals.protein} unit="g" color="#4CAF50" />
            <MacroBar label="Carbs"   value={totals.carbs}   goal={goals.carbs}   unit="g" color="#FF9800" />
            <MacroBar label="Fat"     value={totals.fat}     goal={goals.fat}     unit="g" color="#F44336" />
          </div>

          <div className="history-entries">
            {["breakfast","lunch","snack","dinner"].map(meal => {
              const mealEntries = entries.filter(e => e.meal === meal);
              if (!mealEntries.length) return null;
              return (
                <div key={meal} className="meal-group">
                  <h3 className="meal-title">{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                  {mealEntries.map(e => (
                    <div key={e.id} className="log-entry">
                      <div className="entry-info">
                        <span className="entry-name">{e.quantity > 1 ? `${e.quantity}x ` : ""}{e.foodName}</span>
                        <span className="entry-serving">{e.serving}</span>
                      </div>
                      <div className="entry-macros">
                        <span className="entry-cal">{e.cal} kcal</span>
                        <span className="entry-detail">P:{e.protein}g C:{e.carbs}g F:{e.fat}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
