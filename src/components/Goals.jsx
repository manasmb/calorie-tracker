import { useState, useEffect } from "react";
import { getGoals, saveGoals } from "../db";

const FIELDS = [
  { name: "calories", label: "Calories",    unit: "kcal" },
  { name: "protein",  label: "Protein",     unit: "g"    },
  { name: "carbs",    label: "Carbs",       unit: "g"    },
  { name: "fat",      label: "Fat",         unit: "g"    },
  { name: "fiber",    label: "Fiber",       unit: "g"    },
  { name: "sugar",    label: "Sugar (max)", unit: "g"    },
  { name: "sodium",   label: "Sodium (max)",unit: "mg"   },
];

const PRESETS = [
  { label: "Weight Loss",  calories:1500, protein:100, carbs:150, fat:50, fiber:35, sugar:40,  sodium:2000 },
  { label: "Maintenance",  calories:2000, protein:60,  carbs:250, fat:65, fiber:30, sugar:50,  sodium:2300 },
  { label: "Muscle Gain",  calories:2500, protein:150, carbs:280, fat:70, fiber:30, sugar:60,  sodium:2300 },
  { label: "High Protein", calories:2000, protein:180, carbs:150, fat:65, fiber:30, sugar:40,  sodium:2300 },
];

export default function Goals() {
  const [goals, setGoals] = useState({ calories:2000, protein:60, carbs:250, fat:65, fiber:30, sugar:50, sodium:2300 });
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

  return (
    <div className="goals">
      <h2>Daily Goals</h2>

      <div className="presets">
        <p className="section-title">Quick presets</p>
        <div className="preset-row">
          {PRESETS.map(p => (
            <button key={p.label} className="preset-btn" onClick={() => { setGoals(p); setSaved(false); }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="goals-form">
        {FIELDS.map(f => (
          <div key={f.name} className="goal-row">
            <label className="goal-label">{f.label}</label>
            <input className="goal-input" type="number" name={f.name} value={goals[f.name] || 0} onChange={handleChange} min="0" />
            <span className="goal-unit">{f.unit}</span>
          </div>
        ))}
      </div>

      <p className="goals-note">Sugar and Sodium are daily maximums. Fiber is a minimum target.</p>

      <button className="save-goals-btn" onClick={handleSave}>
        {saved ? "✓ Saved!" : "Save Goals"}
      </button>
    </div>
  );
}
