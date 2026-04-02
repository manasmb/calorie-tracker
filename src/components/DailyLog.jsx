import { useState, useEffect, useCallback } from "react";
import VoiceInput from "./VoiceInput";
import ExerciseSection from "./ExerciseSection";
import { addLogEntry, getLogsByDate, deleteLogEntry, updateLogEntry, getGoals, getExercisesByDate, todayStr, getAllRecipes } from "../db";
import { searchFood, calcMacros, getMealTypeByTime } from "../foodDatabase";
import { getGlobalFoods } from "../globalFoods";

const MEALS = ["breakfast", "lunch", "snack", "dinner"];
const MEAL_ICONS   = { breakfast: "wb_sunny", lunch: "restaurant", snack: "nutrition", dinner: "nights_stay" };
const MEAL_LABELS  = { breakfast: "Breakfast", lunch: "Lunch", snack: "Snacks", dinner: "Dinner" };

const CIRCUMFERENCE = 2 * Math.PI * 100; // r=100 → ≈628.3

export default function DailyLog() {
  const [entries,    setEntries]    = useState([]);
  const [exercises,  setExercises]  = useState([]);
  const [goals,      setGoals]      = useState({ calories:2000, protein:60, carbs:250, fat:65, fiber:30, sugar:50, sodium:2300 });
  const [candidates, setCandidates] = useState(null);
  const [pendingMeal,setPendingMeal]= useState(null);
  const [pendingQty, setPendingQty] = useState(1);
  const [pendingGrams,setPendingGrams]=useState(null);

  // UI toggles
  const [showVoice,  setShowVoice]  = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Manual search
  const [manualQuery,   setManualQuery]   = useState("");
  const [manualResults, setManualResults] = useState([]);
  const [manualMeal,    setManualMeal]    = useState(getMealTypeByTime());
  const [manualQty,     setManualQty]     = useState(1);
  const [manualGrams,   setManualGrams]   = useState("");

  // Inline edit
  const [editingId,  setEditingId]  = useState(null);
  const [editQty,    setEditQty]    = useState(1);
  const [editGrams,  setEditGrams]  = useState(null);
  const [editMeal,   setEditMeal]   = useState("lunch");

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

  // ── Food logging ──────────────────────────────────────────
  async function handleFoodDetected({ food, candidates: cands, quantity, grams, meal }) {
    if (food) {
      await logFood(food, quantity, grams, meal);
      setShowVoice(false);
    } else if (cands) {
      setCandidates(cands); setPendingMeal(meal);
      setPendingQty(quantity); setPendingGrams(grams);
      setShowVoice(false);
    }
  }

  async function logFood(food, quantity, grams, meal) {
    const macros = calcMacros(food, { quantity, grams });
    await addLogEntry({ date: todayStr(), meal, foodId: food.id, foodName: food.name, serving: food.serving, quantity, grams, ...macros });
    setCandidates(null);
    load();
  }

  async function handleDelete(id) { await deleteLogEntry(id); load(); }

  // ── Inline edit ───────────────────────────────────────────
  function openEdit(entry) {
    setEditingId(entry.id); setEditMeal(entry.meal);
    if (entry.grams != null) { setEditGrams(entry.grams); setEditQty(1); }
    else { setEditQty(entry.quantity); setEditGrams(null); }
  }

  async function applyEdit(entry) {
    const scale = editGrams != null
      ? editGrams / (entry.grams || 100)
      : editQty   / (entry.quantity || 1);
    await updateLogEntry({
      ...entry, meal: editMeal,
      quantity: editGrams != null ? entry.quantity : editQty,
      grams: editGrams,
      cal:     Math.round(entry.cal     * scale),
      protein: Math.round(entry.protein * scale * 10) / 10,
      carbs:   Math.round(entry.carbs   * scale * 10) / 10,
      fat:     Math.round(entry.fat     * scale * 10) / 10,
      fiber:   Math.round((entry.fiber  || 0) * scale * 10) / 10,
      sugar:   Math.round((entry.sugar  || 0) * scale * 10) / 10,
      sodium:  Math.round((entry.sodium || 0) * scale),
    });
    setEditingId(null); load();
  }

  // ── Manual search ─────────────────────────────────────────
  async function handleManualSearch(q) {
    setManualQuery(q);
    if (q.length < 2) { setManualResults([]); return; }
    const [customs, globals] = await Promise.all([getAllRecipes(), getGlobalFoods()]);
    setManualResults(searchFood(q, [...customs, ...globals]));
  }

  async function handleManualAdd(food) {
    const grams = manualGrams ? parseFloat(manualGrams) : null;
    await logFood(food, manualQty, grams, manualMeal);
    setManualQuery(""); setManualResults([]); setManualQty(1); setManualGrams("");
    setShowSearch(false);
  }

  // ── Totals ────────────────────────────────────────────────
  const totals = entries.reduce(
    (acc, e) => ({
      cal:     acc.cal     + e.cal,
      protein: acc.protein + e.protein,
      carbs:   acc.carbs   + e.carbs,
      fat:     acc.fat     + e.fat,
      fiber:   acc.fiber   + (e.fiber  || 0),
      sugar:   acc.sugar   + (e.sugar  || 0),
      sodium:  acc.sodium  + (e.sodium || 0),
    }),
    { cal:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, sodium:0 }
  );

  // Round all totals for display
  const rt = {
    cal:     Math.round(totals.cal),
    protein: Math.round(totals.protein),
    carbs:   Math.round(totals.carbs),
    fat:     Math.round(totals.fat),
    fiber:   Math.round(totals.fiber),
    sugar:   Math.round(totals.sugar),
    sodium:  Math.round(totals.sodium),
  };

  const totalBurned = exercises.reduce((s, e) => s + e.calBurned, 0);
  const netCal      = rt.cal - totalBurned;
  const remaining   = goals.calories - netCal;
  const progress    = Math.min(Math.max(netCal / goals.calories, 0), 1);
  const dashOffset  = CIRCUMFERENCE * (1 - progress);
  const overGoal    = netCal > goals.calories;

  const grouped = MEALS.reduce((acc, m) => { acc[m] = entries.filter(e => e.meal === m); return acc; }, {});

  function servingLabel(e) {
    if (e.grams != null) return `${e.grams}g`;
    if (e.quantity !== 1) return `${e.quantity}× ${e.serving}`;
    return e.serving;
  }

  return (
    <div className="space-y-5">

      {/* ── Hero: Progress Ring ── */}
      <section className="relative bg-surface-container-low rounded-4xl p-8 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-center text-center">

          {/* Ring */}
          <div className="relative w-56 h-56">
            <svg className="w-full h-full" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" fill="none"
                stroke="#e1e3e2" strokeWidth="12" />
              <circle
                className="progress-ring-circle"
                cx="110" cy="110" r="100" fill="none"
                stroke={overGoal ? "#ba1a1a" : "#006d37"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-semibold">
                {overGoal ? "Over Goal" : "Remaining"}
              </span>
              <span className={`text-5xl font-headline font-extrabold leading-none ${overGoal ? "text-error" : "text-on-surface"}`}>
                {Math.abs(remaining)}
              </span>
              <span className="text-xs text-on-surface-variant mt-0.5">kcal</span>
            </div>
          </div>

          {/* Goal / Consumed / Remaining row */}
          <div className="mt-3 flex items-stretch gap-px bg-outline-variant/20 rounded-2xl overflow-hidden w-full max-w-xs">
            {[
              { label: "Goal",     value: goals.calories, color: "text-on-surface" },
              { label: "Consumed", value: rt.cal,         color: "text-primary" },
              ...(totalBurned > 0 ? [{ label: "Burned", value: totalBurned, color: "text-orange-500" }] : []),
              { label: overGoal ? "Over" : "Left", value: Math.abs(remaining), color: overGoal ? "text-error" : "text-on-surface-variant" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex-1 flex flex-col items-center py-3 bg-surface-container-low">
                <span className={`text-base font-headline font-bold ${color}`}>{value}</span>
                <span className="text-[9px] uppercase tracking-wider text-on-surface-variant mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          {/* Macro mini-bars */}
          <div className="mt-6 grid grid-cols-3 gap-8 w-full max-w-xs">
            {[
              { label: "Protein", value: rt.protein, goal: goals.protein, color: "bg-secondary" },
              { label: "Carbs",   value: rt.carbs,   goal: goals.carbs,   color: "bg-primary-container" },
              { label: "Fats",    value: rt.fat,     goal: goals.fat,     color: "bg-tertiary-container" },
            ].map(({ label, value, goal: g, color }) => {
              const pct = Math.min((value / g) * 100, 100);
              return (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-1.5 h-12 bg-surface-container-highest rounded-full overflow-hidden relative mb-2">
                    <div className={`absolute bottom-0 w-full rounded-full ${color}`} style={{ height: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-on-surface">{value}{label === "Protein" || label === "Carbs" || label === "Fats" ? "g" : ""}</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Extra macros */}
          <div className="mt-4 flex gap-6 text-xs text-on-surface-variant">
            <span>Fiber <strong className="text-on-surface">{rt.fiber}g</strong></span>
            <span>Sugar <strong className="text-on-surface">{rt.sugar}g</strong></span>
            <span>Sodium <strong className="text-on-surface">{rt.sodium}mg</strong></span>
          </div>
        </div>
      </section>

      {/* ── Quick Add ── */}
      <section className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setShowVoice(v => !v); setShowSearch(false); }}
          className={`flex flex-col items-center justify-center p-5 rounded-3xl transition-all duration-200 group ${
            showVoice ? "bg-secondary-container/30 ring-2 ring-secondary-container" : "bg-surface-container-lowest hover:bg-surface-container-low"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-2 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </div>
          <span className="font-headline font-semibold text-sm text-on-surface">Talk to Add</span>
        </button>

        <button
          onClick={() => { setShowSearch(s => !s); setShowVoice(false); }}
          className={`flex flex-col items-center justify-center p-5 rounded-3xl transition-all duration-200 group ${
            showSearch ? "bg-tertiary-container/30 ring-2 ring-tertiary-container" : "bg-surface-container-lowest hover:bg-surface-container-low"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container mb-2 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">search</span>
          </div>
          <span className="font-headline font-semibold text-sm text-on-surface">Search & Add</span>
        </button>
      </section>

      {/* ── Voice panel ── */}
      {showVoice && (
        <div className="bg-surface-container-lowest rounded-4xl p-6">
          <VoiceInput onFoodDetected={handleFoodDetected} />
        </div>
      )}

      {/* ── Search panel ── */}
      {showSearch && (
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <input
              className="flex-1 min-w-0 px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
              type="text" placeholder="Search food…"
              value={manualQuery} onChange={e => handleManualSearch(e.target.value)}
            />
            <select
              className="px-3 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm font-body focus:outline-none"
              value={manualMeal} onChange={e => setManualMeal(e.target.value)}
            >
              {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-on-surface-variant font-semibold">Qty</span>
            <input type="number" min="0.5" step="0.5" value={manualQty}
              onChange={e => setManualQty(parseFloat(e.target.value)||1)}
              className="w-16 text-center px-2 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="text-xs text-on-surface-variant">or</span>
            <input type="number" min="1" placeholder="grams" value={manualGrams}
              onChange={e => setManualGrams(e.target.value)}
              className="w-20 text-center px-2 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="text-xs text-on-surface-variant font-semibold">g</span>
          </div>
          {manualResults.length > 0 && (
            <div className="rounded-2xl overflow-hidden divide-y divide-outline-variant/30">
              {manualResults.map(f => (
                <button key={f.id} onClick={() => handleManualAdd(f)}
                  className="flex justify-between items-center w-full px-4 py-3 bg-surface-container-low hover:bg-surface-container text-left transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{f.name}</p>
                    <p className="text-xs text-on-surface-variant">{f.serving} · P:{Math.round(f.protein)}g C:{Math.round(f.carbs)}g F:{Math.round(f.fat)}g</p>
                  </div>
                  <span className="text-sm font-bold text-primary ml-3">{f.cal}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Candidate picker ── */}
      {candidates && (
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-2">
          <p className="font-headline font-bold text-on-surface">Which food did you mean?</p>
          {candidates.map(f => (
            <button key={f.id} onClick={() => logFood(f, pendingQty, pendingGrams, pendingMeal)}
              className="flex justify-between items-center w-full px-4 py-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-left">
              <span className="text-sm font-semibold text-on-surface">{f.name}</span>
              <span className="text-xs text-on-surface-variant">{f.serving} · {f.cal} kcal</span>
            </button>
          ))}
          <button onClick={() => setCandidates(null)}
            className="w-full py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
            Cancel
          </button>
        </div>
      )}

      {/* ── Exercise ── */}
      <ExerciseSection entries={exercises} onUpdate={load} />

      {/* ── Meal groups ── */}
      <div className="space-y-4">
        <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
          Daily Log
          <span className="h-px flex-1 bg-surface-container-high" />
        </h2>

        {MEALS.map(meal => {
          const mealEntries = grouped[meal];
          const mealCal = mealEntries.reduce((s, e) => s + e.cal, 0);
          const hasItems = mealEntries.length > 0;

          return (
            <div key={meal} className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
              {/* Meal header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hasItems ? "bg-tertiary-container/30 text-primary" : "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{MEAL_ICONS[meal]}</span>
                  </div>
                  <span className="font-headline font-bold text-base text-on-surface">{MEAL_LABELS[meal]}</span>
                </div>
                {hasItems
                  ? <span className="text-sm font-semibold text-on-surface-variant">{mealCal} kcal</span>
                  : <span className="text-xs font-bold text-primary">+ ADD</span>
                }
              </div>

              {/* Food items */}
              {hasItems ? (
                <div className="space-y-2">
                  {mealEntries.map(entry => {
                    const isEditing = editingId === entry.id;
                    const isGramBased = entry.grams != null;
                    const editScale = isEditing
                      ? (editGrams != null ? editGrams / (entry.grams || 100) : editQty / (entry.quantity || 1))
                      : 1;
                    const previewCal = isEditing ? Math.round(entry.cal * editScale) : entry.cal;

                    return (
                      <div key={entry.id}>
                        {isEditing ? (
                          /* ── Edit mode ── */
                          <div className="bg-emerald-50 border-2 border-primary/30 rounded-2xl p-4 space-y-3">
                            <p className="text-sm font-semibold text-on-surface">{entry.foodName}</p>

                            {/* Stepper */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => isGramBased
                                  ? setEditGrams(g => Math.max(10, (g||100)-25))
                                  : setEditQty(q => Math.max(0.5, q-0.5))}
                                className="w-10 h-10 rounded-full border-2 border-primary text-primary text-xl font-bold flex items-center justify-center active:bg-primary active:text-white transition-colors"
                              >−</button>

                              <input
                                type="number" autoFocus
                                value={isGramBased ? (editGrams ?? "") : editQty}
                                onChange={e => isGramBased
                                  ? setEditGrams(parseFloat(e.target.value)||0)
                                  : setEditQty(parseFloat(e.target.value)||0.5)}
                                className="w-16 text-center text-xl font-headline font-bold border-2 border-primary rounded-xl py-1 focus:outline-none bg-white"
                              />

                              <button
                                onClick={() => isGramBased
                                  ? setEditGrams(g => (g||100)+25)
                                  : setEditQty(q => q+0.5)}
                                className="w-10 h-10 rounded-full border-2 border-primary text-primary text-xl font-bold flex items-center justify-center active:bg-primary active:text-white transition-colors"
                              >+</button>

                              <span className="text-sm text-on-surface-variant">{isGramBased ? "g" : "×"}</span>
                              <span className="text-base font-bold text-primary ml-1">{previewCal} kcal</span>
                            </div>

                            {/* Meal + actions */}
                            <div className="flex items-center gap-2">
                              <select value={editMeal} onChange={e => setEditMeal(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:outline-none">
                                {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <button onClick={() => applyEdit(entry)}
                                className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold">✓ Save</button>
                              <button onClick={() => setEditingId(null)}
                                className="px-3 py-2 text-on-surface-variant rounded-xl text-sm">✕</button>
                            </div>
                          </div>
                        ) : (
                          /* ── Normal mode ── */
                          <div
                            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                            className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl cursor-pointer hover:bg-surface-container transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-on-surface truncate">{entry.foodName}</p>
                              <p className="text-xs text-on-surface-variant">{servingLabel(entry)}</p>
                            </div>
                            <span className="text-sm font-bold text-primary mx-3">{entry.cal}</span>
                            <div className="flex gap-1">
                              <button onClick={ev => { ev.stopPropagation(); openEdit(entry); }}
                                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button onClick={ev => { ev.stopPropagation(); handleDelete(entry.id); }}
                                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-error-container transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Expanded detail */}
                        {expandedId === entry.id && !isEditing && (
                          <div className="grid grid-cols-3 gap-2 mt-1 px-1">
                            {[
                              ["Protein", `${Math.round(entry.protein)}g`],
                              ["Carbs",   `${Math.round(entry.carbs)}g`],
                              ["Fat",     `${Math.round(entry.fat)}g`],
                              ["Fiber",   `${Math.round(entry.fiber||0)}g`],
                              ["Sugar",   `${Math.round(entry.sugar||0)}g`],
                              ["Sodium",  `${Math.round(entry.sodium||0)}mg`],
                            ].map(([k,v]) => (
                              <div key={k} className="bg-surface-container-low rounded-xl p-2 text-center">
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">{k}</p>
                                <p className="text-sm font-bold text-on-surface">{v}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-14 border-2 border-dashed border-outline-variant/40 rounded-2xl flex items-center justify-center text-on-surface-variant text-sm italic">
                  Nothing logged yet
                </div>
              )}
            </div>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p className="text-center text-on-surface-variant text-sm py-8">
          No food logged today. Tap <strong>Talk to Add</strong> or <strong>Search & Add</strong> above!
        </p>
      )}
    </div>
  );
}
