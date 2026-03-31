import { useState, useEffect } from "react";
import { getGoals, saveGoals } from "../db";

export default function Goals() {
  const [goals, setGoals] = useState({ calories: 2000, protein: 60, carbs: 250, fat: 65 });
  const [saved, setSaved] = useState(false);

  useEffect(() => { getGoals().then(setGoals); }, []);

  function handleChange(e) {
    setGoals(g => ({ ...g, [e.target.name]: parseInt(e.target.value) || 0 }));
    setSaved(false);
  }

  async function handleSave() {
    await saveGoals(goals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const presets = [
    { label: "Weight Loss",     cal: 1500, protein: 100, carbs: 150, fat: 50 },
    { label: "Maintenance",     cal: 2000, protein: 60,  carbs: 250, fat: 65 },
    { label: "Muscle Gain",     cal: 2500, protein: 150, carbs: 280, fat: 70 },
    { label: "High Protein",    cal: 2000, protein: 180, carbs: 150, fat: 65 },
  ];

  return (
    <div className="goals">
      <h2>Daily Goals</h2>

      <div className="presets">
        <p className="section-title">Quick presets</p>
        <div className="preset-row">
          {presets.map(p => (
            <button key={p.label} className="preset-btn" onClick={() => { setGoals(p); setSaved(false); }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="goals-form">
        {[
          { name: "calories", label: "Calories", unit: "kcal" },
          { name: "protein",  label: "Protein",  unit: "g" },
          { name: "carbs",    label: "Carbs",    unit: "g" },
          { name: "fat",      label: "Fat",      unit: "g" },
        ].map(field => (
          <div key={field.name} className="goal-row">
            <label className="goal-label">{field.label}</label>
            <input
              className="goal-input"
              type="number"
              name={field.name}
              value={goals[field.name]}
              onChange={handleChange}
              min="0"
            />
            <span className="goal-unit">{field.unit}</span>
          </div>
        ))}
      </div>

      <button className="save-goals-btn" onClick={handleSave}>
        {saved ? "✓ Saved!" : "Save Goals"}
      </button>
    </div>
  );
}
