import { useState, useEffect, useCallback } from "react";
import VoiceInput from "./VoiceInput";
import MacroBar from "./MacroBar";
import ExerciseSection from "./ExerciseSection";
import { addLogEntry, getLogsByDate, deleteLogEntry, updateLogEntry, getGoals, getExercisesByDate, todayStr, getAllRecipes } from "../db";
// getAllRecipes used only for manual search
import { searchFood, calcMacros, getMealTypeByTime } from "../foodDatabase";

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
  const [editQty, setEditQty]     = useState(1);
  const [editGrams, setEditGrams] = useState(null);
  const [editMeal, setEditMeal]   = useState("lunch");
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

  function openEdit(entry) {
    setEditingId(entry.id);
    setEditMeal(entry.meal);
    if (entry.grams != null) {
      setEditGrams(entry.grams);
      setEditQty(1);
    } else {
      setEditQty(entry.quantity);
      setEditGrams(null);
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function applyEdit(entry) {
    const scale = editGrams != null
      ? editGrams / (entry.grams || 100)
      : editQty   / (entry.quantity || 1);
    await updateLogEntry({
      ...entry,
      meal:    editMeal,
      quantity: editGrams != null ? entry.quantity : editQty,
      grams:   editGrams,
      cal:     Math.round(entry.cal     * scale),
      protein: Math.round(entry.protein * scale * 10) / 10,
      carbs:   Math.round(entry.carbs   * scale * 10) / 10,
      fat:     Math.round(entry.fat     * scale * 10) / 10,
      fiber:   Math.round((entry.fiber  || 0) * scale * 10) / 10,
      sugar:   Math.round((entry.sugar  || 0) * scale * 10) / 10,
      sodium:  Math.round((entry.sodium || 0) * scale),
    });
    setEditingId(null);
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
          {grouped[meal].map(entry => {
            const isEditing = editingId === entry.id;
            const editScale = isEditing
              ? (editGrams != null ? editGrams / (entry.grams || 100) : editQty / (entry.quantity || 1))
              : 1;
            const previewCal = isEditing ? Math.round(entry.cal * editScale) : entry.cal;
            const isGramBased = entry.grams != null;

            return (
            <div key={entry.id} className="log-entry-wrap">
              {isEditing ? (
                <div className="log-entry log-entry-editing">
                  <div className="entry-info">
                    <span className="entry-name">{entry.foodName}</span>
                    <span className="entry-serving-edit">
                      {isGramBased ? "grams" : entry.serving}
                    </span>
                  </div>

                  <div className="inline-edit-controls">
                    {isGramBased ? (
                      <div className="stepper-row">
                        <button className="stepper-btn" onClick={() => setEditGrams(g => Math.max(10, (g || 100) - 25))}>−</button>
                        <input
                          className="stepper-input"
                          type="number" min="1"
                          value={editGrams ?? ""}
                          onChange={e => setEditGrams(parseFloat(e.target.value) || 0)}
                          autoFocus
                        />
                        <button className="stepper-btn" onClick={() => setEditGrams(g => (g || 100) + 25)}>+</button>
                        <span className="stepper-unit">g</span>
                      </div>
                    ) : (
                      <div className="stepper-row">
                        <button className="stepper-btn" onClick={() => setEditQty(q => Math.max(0.5, q - 0.5))}>−</button>
                        <input
                          className="stepper-input"
                          type="number" min="0.5" step="0.5"
                          value={editQty}
                          onChange={e => setEditQty(parseFloat(e.target.value) || 0.5)}
                          autoFocus
                        />
                        <button className="stepper-btn" onClick={() => setEditQty(q => q + 0.5)}>+</button>
                        <span className="stepper-unit">×</span>
                      </div>
                    )}
                    <span className="stepper-preview">{previewCal} kcal</span>
                  </div>

                  <div className="inline-edit-actions">
                    <select className="edit-meal-select" value={editMeal} onChange={e => setEditMeal(e.target.value)}>
                      {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <button className="save-btn" onClick={() => applyEdit(entry)}>✓</button>
                    <button className="cancel-btn" onClick={cancelEdit}>✕</button>
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
                    <button className="edit-btn" onClick={ev => { ev.stopPropagation(); openEdit(entry); }}>✏️</button>
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
            );
          })}
        </div>
      ))}

      {entries.length === 0 && <p className="empty-state">No food logged today. Use the mic or search above!</p>}
    </div>
  );
}
