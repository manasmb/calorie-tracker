import { useState, useEffect, useCallback } from "react";
import VoiceInput from "./VoiceInput";
import MacroBar from "./MacroBar";
import { addLogEntry, getLogsByDate, deleteLogEntry, updateLogEntry, getGoals, todayStr } from "../db";
import { searchFood, parseQuantityFromText, parseMealTypeFromText, getMealTypeByTime } from "../foodDatabase";
import { getAllRecipes } from "../db";

const MEALS = ["breakfast", "lunch", "snack", "dinner"];
const MEAL_ICONS = { breakfast: "☀️", lunch: "🌤️", snack: "🍎", dinner: "🌙" };

export default function DailyLog() {
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 60, carbs: 250, fat: 65 });
  const [candidates, setCandidates] = useState(null); // multiple matches from voice
  const [pendingMeal, setPendingMeal] = useState(null);
  const [pendingQty, setPendingQty] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editTranscript, setEditTranscript] = useState("");
  const [manualQuery, setManualQuery] = useState("");
  const [manualResults, setManualResults] = useState([]);
  const [manualMeal, setManualMeal] = useState(getMealTypeByTime());
  const [manualQty, setManualQty] = useState(1);

  const load = useCallback(async () => {
    const [data, g] = await Promise.all([getLogsByDate(todayStr()), getGoals()]);
    setEntries(data);
    setGoals(g);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Voice handler ──────────────────────────────────────────
  async function handleFoodDetected({ food, candidates: cands, quantity, meal }) {
    if (food) {
      await logFood(food, quantity, meal);
    } else if (cands) {
      setCandidates(cands);
      setPendingMeal(meal);
      setPendingQty(quantity);
    }
  }

  async function logFood(food, quantity, meal) {
    const entry = {
      date: todayStr(),
      meal,
      foodId: food.id,
      foodName: food.name,
      serving: food.serving,
      quantity,
      cal: Math.round(food.cal * quantity),
      protein: Math.round(food.protein * quantity * 10) / 10,
      carbs: Math.round(food.carbs * quantity * 10) / 10,
      fat: Math.round(food.fat * quantity * 10) / 10,
    };
    await addLogEntry(entry);
    setCandidates(null);
    load();
  }

  async function handleDelete(id) {
    await deleteLogEntry(id);
    load();
  }

  // ── Edit by voice ──────────────────────────────────────────
  async function handleEditVoice(entry) {
    setEditingId(entry.id);
  }

  async function applyEdit(entry, text) {
    const qty = parseQuantityFromText(text);
    const meal = parseMealTypeFromText(text) || entry.meal;
    const results = searchFood(text);
    const food = results[0];
    if (food) {
      const updated = {
        ...entry,
        meal,
        foodId: food.id,
        foodName: food.name,
        serving: food.serving,
        quantity: qty,
        cal: Math.round(food.cal * qty),
        protein: Math.round(food.protein * qty * 10) / 10,
        carbs: Math.round(food.carbs * qty * 10) / 10,
        fat: Math.round(food.fat * qty * 10) / 10,
      };
      await updateLogEntry(updated);
    } else {
      // Only quantity/meal changed
      const updated = {
        ...entry,
        meal,
        quantity: qty,
        cal: Math.round((entry.cal / entry.quantity) * qty),
        protein: Math.round((entry.protein / entry.quantity) * qty * 10) / 10,
        carbs: Math.round((entry.carbs / entry.quantity) * qty * 10) / 10,
        fat: Math.round((entry.fat / entry.quantity) * qty * 10) / 10,
      };
      await updateLogEntry(updated);
    }
    setEditingId(null);
    setEditTranscript("");
    load();
  }

  // ── Manual search ──────────────────────────────────────────
  async function handleManualSearch(q) {
    setManualQuery(q);
    if (q.length < 2) { setManualResults([]); return; }
    const dbResults = searchFood(q);
    const customs = await getAllRecipes();
    const customMatches = customs.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
    setManualResults([...customMatches, ...dbResults]);
  }

  async function handleManualAdd(food) {
    await logFood(food, manualQty, manualMeal);
    setManualQuery("");
    setManualResults([]);
    setManualQty(1);
  }

  // ── Totals ─────────────────────────────────────────────────
  const totals = entries.reduce(
    (acc, e) => ({ cal: acc.cal + e.cal, protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const grouped = MEALS.reduce((acc, m) => {
    acc[m] = entries.filter(e => e.meal === m);
    return acc;
  }, {});

  return (
    <div className="daily-log">
      {/* Summary card */}
      <div className="summary-card">
        <div className="summary-cal">
          <span className="cal-num">{totals.cal}</span>
          <span className="cal-label"> / {goals.calories} kcal</span>
        </div>
        <div className="cal-remaining">
          {goals.calories - totals.cal > 0
            ? `${goals.calories - totals.cal} kcal remaining`
            : `${totals.cal - goals.calories} kcal over goal`}
        </div>
        <MacroBar label="Protein" value={totals.protein} goal={goals.protein} unit="g" color="#4CAF50" />
        <MacroBar label="Carbs"   value={totals.carbs}   goal={goals.carbs}   unit="g" color="#FF9800" />
        <MacroBar label="Fat"     value={totals.fat}     goal={goals.fat}     unit="g" color="#F44336" />
      </div>

      {/* Voice input */}
      <VoiceInput onFoodDetected={handleFoodDetected} />

      {/* Candidate picker (multiple voice matches) */}
      {candidates && (
        <div className="candidate-picker">
          <p className="candidate-title">Which food did you mean?</p>
          {candidates.map(f => (
            <button key={f.id} className="candidate-btn" onClick={() => logFood(f, pendingQty, pendingMeal)}>
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
          <input
            className="manual-input"
            type="text"
            placeholder="Search food..."
            value={manualQuery}
            onChange={e => handleManualSearch(e.target.value)}
          />
          <select className="meal-select" value={manualMeal} onChange={e => setManualMeal(e.target.value)}>
            {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            className="qty-input"
            type="number"
            min="0.5"
            step="0.5"
            value={manualQty}
            onChange={e => setManualQty(parseFloat(e.target.value) || 1)}
          />
        </div>
        {manualResults.length > 0 && (
          <div className="manual-results">
            {manualResults.map(f => (
              <button key={f.id} className="manual-result-btn" onClick={() => handleManualAdd(f)}>
                <span className="result-name">{f.name}</span>
                <span className="result-meta">{f.serving} · {f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Meals grouped */}
      {MEALS.map(meal => grouped[meal].length > 0 && (
        <div key={meal} className="meal-group">
          <h3 className="meal-title">{MEAL_ICONS[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
          {grouped[meal].map(entry => (
            <div key={entry.id} className="log-entry">
              {editingId === entry.id ? (
                <div className="edit-row">
                  <input
                    className="edit-input"
                    placeholder="Say or type what to change..."
                    value={editTranscript}
                    onChange={e => setEditTranscript(e.target.value)}
                    autoFocus
                  />
                  <button className="edit-voice-btn" onClick={() => {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (!SpeechRecognition) return;
                    const r = new SpeechRecognition();
                    r.lang = "en-IN";
                    r.onresult = ev => setEditTranscript(ev.results[0][0].transcript);
                    r.start();
                  }}>🎤</button>
                  <button className="save-btn" onClick={() => applyEdit(entry, editTranscript)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditingId(null)}>✕</button>
                </div>
              ) : (
                <>
                  <div className="entry-info">
                    <span className="entry-name">{entry.quantity > 1 ? `${entry.quantity}x ` : ""}{entry.foodName}</span>
                    <span className="entry-serving">{entry.serving}</span>
                  </div>
                  <div className="entry-macros">
                    <span className="entry-cal">{entry.cal} kcal</span>
                    <span className="entry-detail">P:{entry.protein}g C:{entry.carbs}g F:{entry.fat}g</span>
                  </div>
                  <div className="entry-actions">
                    <button className="edit-btn" onClick={() => handleEditVoice(entry)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(entry.id)}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      {entries.length === 0 && (
        <p className="empty-state">No food logged today. Use the mic or search above!</p>
      )}
    </div>
  );
}
