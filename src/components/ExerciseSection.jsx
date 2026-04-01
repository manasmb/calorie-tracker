import { useState } from "react";
import { searchExercise, calcExerciseCal } from "../exerciseDatabase";
import { addExerciseEntry, deleteExerciseEntry, todayStr } from "../db";

const EMPTY_CUSTOM = { name: "", duration: "", cal: "" };

export default function ExerciseSection({ entries, onUpdate }) {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [selected, setSelected]     = useState(null);  // exercise from DB
  const [duration, setDuration]     = useState(30);
  const [customMode, setCustomMode] = useState(false);
  const [customForm, setCustomForm] = useState(EMPTY_CUSTOM);

  function handleSearch(q) {
    setQuery(q);
    setSelected(null);
    setResults(q.length >= 1 ? searchExercise(q) : []);
  }

  function pickExercise(ex) {
    setSelected(ex);
    setQuery(ex.name);
    setResults([]);
  }

  async function handleAdd() {
    if (!selected) return;
    const calBurned = calcExerciseCal(selected, duration);
    await addExerciseEntry({
      date: todayStr(),
      exerciseId:   selected.id,
      exerciseName: selected.name,
      category:     selected.category,
      duration,
      calBurned,
    });
    setQuery(""); setSelected(null); setDuration(30);
    onUpdate();
  }

  async function handleCustomAdd() {
    if (!customForm.name || !customForm.cal) return;
    await addExerciseEntry({
      date: todayStr(),
      exerciseId:   "custom_" + Date.now(),
      exerciseName: customForm.name.trim(),
      category:     "Custom",
      duration:     parseFloat(customForm.duration) || 0,
      calBurned:    parseFloat(customForm.cal),
    });
    setCustomForm(EMPTY_CUSTOM);
    setCustomMode(false);
    onUpdate();
  }

  async function handleDelete(id) {
    await deleteExerciseEntry(id);
    onUpdate();
  }

  const previewCal = selected ? calcExerciseCal(selected, duration) : null;

  return (
    <div className="exercise-section">
      <div className="exercise-header">
        <p className="section-title">Exercise</p>
        <button
          className="exercise-custom-btn"
          onClick={() => { setCustomMode(m => !m); setSelected(null); setQuery(""); setResults([]); }}
        >
          {customMode ? "✕ Cancel" : "+ Manual"}
        </button>
      </div>

      {customMode ? (
        <div className="exercise-custom-form">
          <input
            placeholder="Exercise name *"
            value={customForm.name}
            onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))}
          />
          <div className="exercise-form-row">
            <input
              type="number" placeholder="Duration (min)"
              value={customForm.duration}
              onChange={e => setCustomForm(f => ({ ...f, duration: e.target.value }))}
            />
            <input
              type="number" placeholder="Calories burned *"
              value={customForm.cal}
              onChange={e => setCustomForm(f => ({ ...f, cal: e.target.value }))}
            />
          </div>
          <button className="exercise-add-btn" onClick={handleCustomAdd}
            disabled={!customForm.name || !customForm.cal}>
            Add Exercise
          </button>
        </div>
      ) : (
        <div className="exercise-search-wrap">
          <input
            className="exercise-search"
            placeholder="Search exercise (e.g. running, yoga, cricket)…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />
          {results.length > 0 && (
            <div className="exercise-results">
              {results.map(ex => (
                <button key={ex.id} className="exercise-result-btn" onClick={() => pickExercise(ex)}>
                  <span>{ex.name}</span>
                  <span className="exercise-result-meta">{ex.category} · ~{ex.calPerMin} kcal/min</span>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div className="exercise-duration-row">
              <label className="amount-label">Duration</label>
              <input
                className="qty-input"
                type="number" min="1" step="1"
                value={duration}
                onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <label className="amount-label">min</label>
              {previewCal !== null && (
                <span className="exercise-cal-preview">≈ {previewCal} kcal burned</span>
              )}
              <button className="exercise-add-btn" onClick={handleAdd}>Add</button>
            </div>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <div className="exercise-list">
          {entries.map(e => (
            <div key={e.id} className="exercise-entry">
              <div className="exercise-entry-info">
                <span className="exercise-entry-name">{e.exerciseName}</span>
                <span className="exercise-entry-meta">
                  {e.duration ? `${e.duration} min` : ""}{e.category !== "Custom" ? ` · ${e.category}` : ""}
                </span>
              </div>
              <span className="exercise-entry-cal">−{e.calBurned} kcal</span>
              <button className="delete-btn" onClick={() => handleDelete(e.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !customMode && !selected && !query && (
        <p className="exercise-empty">No exercise logged today.</p>
      )}
    </div>
  );
}
