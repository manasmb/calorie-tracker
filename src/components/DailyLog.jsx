import { useState, useEffect, useCallback } from "react";
import VoiceInput from "./VoiceInput";
import MacroBar from "./MacroBar";
import ExerciseSection from "./ExerciseSection";
import { addLogEntry, getLogsByDate, deleteLogEntry, updateLogEntry, getGoals, getExercisesByDate, todayStr, getAllRecipes } from "../db";
import { searchFood, calcMacros, parseAmountFromText, parseMealTypeFromText, getMealTypeByTime } from "../foodDatabase";

const MEALS = ["breakfast", "lunch", "snack", "dinner"];
const MEAL_ICONS = { breakfast: "☀️", lunch: "🌤️", snack: "🍎", dinner: "🌙" };

export default function DailyLog() {
  const [entries, setEntries]   = useState([]);
  const [exercises, setExercises] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 60, carbs: 250, fat: 65, fiber: 30, sugar: 50, sodium: 2300 });
  const [candidates, setCandidates] = useState(null);
  const [pendingMeal, setPendingMeal] = useState(null);
  const [pendingQty, setPendingQty] = useState(1);
  const [pendingGrams, setPendingGrams] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [manualQuery, setManualQuery] = useState("");
  const [manualResults, setManualResults] = useState([]);
  const [manualMeal, setManualMeal] = useState(getMealTypeByTime());
  const [manualQty, setManualQty] = useState(1);
  const [manualGrams, setManualGrams] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    const [data, g, exData] = await Promise.all([
      getLogsByDate(todayStr()),
      getGoals(),
      getExercisesByDate(todayStr()),
    ]);
    setEntries(data);
    setGoals(g);
    setExercises(exData);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleFoodDetected({ food, candidates: cands, quantity, grams, meal }) {
    if (food) {
      await logFood(food, quantity, grams, meal);
    } else if (cands) {
      setCandidates(cands);
      setPendingMeal(meal);
      setPendingQty(quantity);
      setPendingGrams(grams);
    }
  }

  async function logFood(food, quantity, grams, meal) {
    const macros = calcMacros(food, { quantity, grams });
    const entry = {
      date: todayStr(), meal,
      foodId: food.id, foodName: food.name, serving: food.serving,
      quantity, grams,
      ...macros,
    };
    await addLogEntry(entry);
    setCandidates(null);
    load();
  }

  async function handleDelete(id) {
    await deleteLogEntry(id);
    load();
  }

  async function applyEdit(entry) {
    const text = editText;
    const { quantity, grams } = parseAmountFromText(text);
    const meal = parseMealTypeFromText(text) || entry.meal;
    const customs = await getAllRecipes();
    const results = searchFood(text, customs);
    const food = results[0];

    if (food) {
      const macros = calcMacros(food, { quantity, grams });
      await updateLogEntry({ ...entry, meal, foodId: food.id, foodName: food.name, serving: food.serving, quantity, grams, ...macros });
    } else {
      // Only quantity/meal changed — recalculate proportionally from original
      const origQty = entry.grams != null ? 1 : entry.quantity;
      const origGrams = entry.grams;
      const scale = grams != null
        ? grams / (origGrams || entry.quantity * (entry.cal / (entry.cal / entry.quantity)))
        : quantity / (origGrams != null ? 1 : entry.quantity);
      await updateLogEntry({
        ...entry, meal, quantity, grams,
        cal:     Math.round(entry.cal     * scale),
        protein: Math.round(entry.protein * scale * 10) / 10,
        carbs:   Math.round(entry.carbs   * scale * 10) / 10,
        fat:     Math.round(entry.fat     * scale * 10) / 10,
        fiber:   Math.round((entry.fiber  || 0) * scale * 10) / 10,
        sugar:   Math.round((entry.sugar  || 0) * scale * 10) / 10,
        sodium:  Math.round((entry.sodium || 0) * scale),
      });
    }
    setEditingId(null);
    setEditText("");
    load();
  }

  async function handleManualSearch(q) {
    setManualQuery(q);
    if (q.length < 2) { setManualResults([]); return; }
    const customs = await getAllRecipes();
    setManualResults(searchFood(q, customs));
  }

  async function handleManualAdd(food) {
    const grams = manualGrams ? parseFloat(manualGrams) : null;
    await logFood(food, manualQty, grams, manualMeal);
    setManualQuery(""); setManualResults([]); setManualQty(1); setManualGrams("");
  }

  const totals = entries.reduce(
    (acc, e) => ({
      cal: acc.cal + e.cal, protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat,
      fiber: acc.fiber + (e.fiber || 0), sugar: acc.sugar + (e.sugar || 0),
      sodium: acc.sodium + (e.sodium || 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const totalBurned = exercises.reduce((sum, e) => sum + e.calBurned, 0);
  const netCal = totals.cal - totalBurned;

  const grouped = MEALS.reduce((acc, m) => { acc[m] = entries.filter(e => e.meal === m); return acc; }, {});

  function servingLabel(e) {
    if (e.grams != null) return `${e.grams}g`;
    if (e.quantity !== 1) return `${e.quantity}x ${e.serving}`;
    return e.serving;
  }

  return (
    <div className="daily-log">
      {/* Summary */}
      <div className="summary-card">
        <div className="summary-cal">
          <span className="cal-num">{netCal}</span>
          <span className="cal-label"> / {goals.calories} kcal</span>
        </div>
        {totalBurned > 0 && (
          <div className="cal-breakdown">
            <span className="cal-eaten">🍽 {totals.cal} eaten</span>
            <span className="cal-burned">🔥 −{totalBurned} burned</span>
          </div>
        )}
        <div className="cal-remaining">
          {goals.calories - netCal > 0
            ? `${goals.calories - netCal} kcal remaining`
            : `${netCal - goals.calories} kcal over goal`}
        </div>
        <MacroBar label="Protein" value={totals.protein} goal={goals.protein} unit="g"  color="#4CAF50" />
        <MacroBar label="Carbs"   value={totals.carbs}   goal={goals.carbs}   unit="g"  color="#FF9800" />
        <MacroBar label="Fat"     value={totals.fat}     goal={goals.fat}     unit="g"  color="#F44336" />
        <MacroBar label="Fiber"   value={totals.fiber}   goal={goals.fiber}   unit="g"  color="#8BC34A" />
        <MacroBar label="Sugar"   value={totals.sugar}   goal={goals.sugar}   unit="g"  color="#E91E63" />
        <MacroBar label="Sodium"  value={totals.sodium}  goal={goals.sodium}  unit="mg" color="#9C27B0" />
      </div>

      <VoiceInput onFoodDetected={handleFoodDetected} />

      {/* Candidate picker */}
      {candidates && (
        <div className="candidate-picker">
          <p className="candidate-title">Which food did you mean?</p>
          {candidates.map(f => (
            <button key={f.id} className="candidate-btn" onClick={() => logFood(f, pendingQty, pendingGrams, pendingMeal)}>
              {f.name} <span className="candidate-meta">{f.serving} · {f.cal} kcal</span>
            </button>
          ))}
          <button className="candidate-cancel" onClick={() => setCandidates(null)}>Cancel</button>
        </div>
      )}

      {/* Manual search */}
      <div className="manual-section">
        <p className="section-title">Or search manually</p>
        <div className="manual-controls">
          <input className="manual-input" type="text" placeholder="Search food..." value={manualQuery} onChange={e => handleManualSearch(e.target.value)} />
          <select className="meal-select" value={manualMeal} onChange={e => setManualMeal(e.target.value)}>
            {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="manual-amount-row">
          <label className="amount-label">Qty</label>
          <input className="qty-input" type="number" min="0.5" step="0.5" value={manualQty} onChange={e => setManualQty(parseFloat(e.target.value) || 1)} />
          <span className="amount-or">or</span>
          <input className="grams-input" type="number" min="1" placeholder="grams" value={manualGrams} onChange={e => setManualGrams(e.target.value)} />
          <label className="amount-label">g</label>
        </div>
        {manualResults.length > 0 && (
          <div className="manual-results">
            {manualResults.map(f => (
              <button key={f.id} className="manual-result-btn" onClick={() => handleManualAdd(f)}>
                <span className="result-name">{f.name}</span>
                <span className="result-meta">{f.serving} ({f.gramsPerServing}g) · {f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g · Fiber:{f.fiber}g Sugar:{f.sugar}g Na:{f.sodium}mg</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercise */}
      <ExerciseSection entries={exercises} onUpdate={load} />

      {/* Meal groups */}
      {MEALS.map(meal => grouped[meal].length > 0 && (
        <div key={meal} className="meal-group">
          <h3 className="meal-title">{MEAL_ICONS[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
          {grouped[meal].map(entry => (
            <div key={entry.id} className="log-entry-wrap">
              {editingId === entry.id ? (
                <div className="log-entry">
                  <div className="edit-row">
                    <input className="edit-input" placeholder='e.g. "200 grams" or "2 rotis for breakfast"'
                      value={editText} onChange={e => setEditText(e.target.value)} autoFocus />
                    <button className="edit-voice-btn" title="Voice edit" onClick={() => {
                      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                      if (!SR) return;
                      const r = new SR(); r.lang = "en-IN";
                      r.onresult = ev => setEditText(ev.results[0][0].transcript);
                      r.start();
                    }}>🎤</button>
                    <button className="save-btn" onClick={() => applyEdit(entry)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                </div>
              ) : (
                <div className="log-entry" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                  <div className="entry-info">
                    <span className="entry-name">{entry.foodName}</span>
                    <span className="entry-serving">{servingLabel(entry)}</span>
                  </div>
                  <div className="entry-macros">
                    <span className="entry-cal">{entry.cal} kcal</span>
                    <span className="entry-detail">P:{entry.protein}g C:{entry.carbs}g F:{entry.fat}g</span>
                  </div>
                  <div className="entry-actions">
                    <button className="edit-btn" onClick={ev => { ev.stopPropagation(); setEditingId(entry.id); setEditText(""); }}>✏️</button>
                    <button className="delete-btn" onClick={ev => { ev.stopPropagation(); handleDelete(entry.id); }}>🗑️</button>
                  </div>
                </div>
              )}
              {expandedId === entry.id && editingId !== entry.id && (
                <div className="entry-expanded">
                  <div className="expanded-grid">
                    <div className="expanded-item"><span>Fiber</span><strong>{entry.fiber || 0}g</strong></div>
                    <div className="expanded-item"><span>Sugar</span><strong>{entry.sugar || 0}g</strong></div>
                    <div className="expanded-item"><span>Sodium</span><strong>{entry.sodium || 0}mg</strong></div>
                    <div className="expanded-item"><span>Protein</span><strong>{entry.protein}g</strong></div>
                    <div className="expanded-item"><span>Carbs</span><strong>{entry.carbs}g</strong></div>
                    <div className="expanded-item"><span>Fat</span><strong>{entry.fat}g</strong></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {entries.length === 0 && <p className="empty-state">No food logged today. Use the mic or search above!</p>}
    </div>
  );
}
