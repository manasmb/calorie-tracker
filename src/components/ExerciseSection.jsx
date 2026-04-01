import { useState } from "react";
import { searchExercise, calcExerciseCal } from "../exerciseDatabase";
import { addExerciseEntry, deleteExerciseEntry, todayStr } from "../db";

const EMPTY_CUSTOM = { name: "", duration: "", cal: "" };

export default function ExerciseSection({ entries, onUpdate }) {
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [duration,    setDuration]    = useState(30);
  const [customMode,  setCustomMode]  = useState(false);
  const [customForm,  setCustomForm]  = useState(EMPTY_CUSTOM);

  function handleSearch(q) { setQuery(q); setSelected(null); setResults(q.length >= 1 ? searchExercise(q) : []); }
  function pickExercise(ex) { setSelected(ex); setQuery(ex.name); setResults([]); }

  async function handleAdd() {
    if (!selected) return;
    await addExerciseEntry({ date: todayStr(), exerciseId: selected.id, exerciseName: selected.name, category: selected.category, duration, calBurned: calcExerciseCal(selected, duration) });
    setQuery(""); setSelected(null); setDuration(30); onUpdate();
  }

  async function handleCustomAdd() {
    if (!customForm.name || !customForm.cal) return;
    await addExerciseEntry({ date: todayStr(), exerciseId: "custom_" + Date.now(), exerciseName: customForm.name.trim(), category: "Custom", duration: parseFloat(customForm.duration)||0, calBurned: parseFloat(customForm.cal) });
    setCustomForm(EMPTY_CUSTOM); setCustomMode(false); onUpdate();
  }

  const previewCal = selected ? calcExerciseCal(selected, duration) : null;

  return (
    <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">fitness_center</span>
          </div>
          <span className="font-headline font-bold text-base text-on-surface">Exercise</span>
        </div>
        <button
          onClick={() => { setCustomMode(m => !m); setSelected(null); setQuery(""); setResults([]); }}
          className="text-xs font-bold text-primary px-3 py-1.5 rounded-xl border border-primary/30 hover:bg-emerald-50 transition-colors"
        >
          {customMode ? "✕ Cancel" : "+ Manual"}
        </button>
      </div>

      {customMode ? (
        <div className="space-y-2">
          <input placeholder="Exercise name *" value={customForm.name}
            onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex gap-2">
            <input type="number" placeholder="Duration (min)" value={customForm.duration}
              onChange={e => setCustomForm(f => ({ ...f, duration: e.target.value }))}
              className="flex-1 px-3 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
            />
            <input type="number" placeholder="Calories *" value={customForm.cal}
              onChange={e => setCustomForm(f => ({ ...f, cal: e.target.value }))}
              className="flex-1 px-3 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
            />
          </div>
          <button onClick={handleCustomAdd} disabled={!customForm.name || !customForm.cal}
            className="w-full py-2.5 bg-primary text-white rounded-2xl text-sm font-bold disabled:opacity-40">
            Add Exercise
          </button>
        </div>
      ) : (
        <div className="relative space-y-3">
          <input
            className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Search exercise (yoga, running, cricket…)"
            value={query} onChange={e => handleSearch(e.target.value)}
          />
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-outline-variant shadow-lg z-10 overflow-hidden">
              {results.map(ex => (
                <button key={ex.id} onClick={() => pickExercise(ex)}
                  className="flex justify-between items-center w-full px-4 py-3 hover:bg-surface-container-low text-left border-b border-outline-variant/20 last:border-0 transition-colors">
                  <span className="text-sm font-semibold text-on-surface">{ex.name}</span>
                  <span className="text-xs text-on-surface-variant">{ex.category} · ~{ex.calPerMin} kcal/min</span>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-on-surface-variant">Duration</span>
              <input type="number" min="1" step="1" value={duration}
                onChange={e => setDuration(Math.max(1, parseInt(e.target.value)||1))}
                className="w-16 text-center px-2 py-2 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <span className="text-sm text-on-surface-variant">min</span>
              {previewCal !== null && (
                <span className="text-sm font-bold text-primary">≈ −{previewCal} kcal</span>
              )}
              <button onClick={handleAdd}
                className="ml-auto px-5 py-2 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-colors">
                Add
              </button>
            </div>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <div className="space-y-2 pt-1">
          {entries.map(e => (
            <div key={e.id} className="flex items-center gap-3 bg-emerald-50 rounded-2xl px-4 py-3">
              <span className="material-symbols-outlined text-[18px] text-primary">exercise</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">{e.exerciseName}</p>
                <p className="text-xs text-on-surface-variant">{e.duration ? `${e.duration} min` : ""}</p>
              </div>
              <span className="text-sm font-bold text-primary">−{e.calBurned} kcal</span>
              <button onClick={() => { deleteExerciseEntry(e.id).then(onUpdate); }}
                className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-error-container transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !customMode && !selected && !query && (
        <p className="text-xs text-on-surface-variant text-center pb-1">No exercise logged today</p>
      )}
    </div>
  );
}
