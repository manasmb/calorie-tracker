import { useState, useEffect } from "react";
import { getGoals, saveGoals } from "../db";

const FIELDS = [
  { name: "calories", label: "Calories",     unit: "kcal", icon: "local_fire_department" },
  { name: "protein",  label: "Protein",      unit: "g",    icon: "egg" },
  { name: "carbs",    label: "Carbs",        unit: "g",    icon: "nutrition" },
  { name: "fat",      label: "Fat",          unit: "g",    icon: "water_drop" },
  { name: "fiber",    label: "Fiber (min)",  unit: "g",    icon: "grass" },
  { name: "sugar",    label: "Sugar (max)",  unit: "g",    icon: "cake" },
  { name: "sodium",   label: "Sodium (max)", unit: "mg",   icon: "science" },
];

const PRESETS = [
  { label: "Weight Loss",  calories:1500, protein:100, carbs:150, fat:50,  fiber:35, sugar:40, sodium:2000 },
  { label: "Maintenance",  calories:2000, protein:60,  carbs:250, fat:65,  fiber:30, sugar:50, sodium:2300 },
  { label: "Muscle Gain",  calories:2500, protein:150, carbs:280, fat:70,  fiber:30, sugar:60, sodium:2300 },
  { label: "High Protein", calories:2000, protein:180, carbs:150, fat:65,  fiber:30, sugar:40, sodium:2300 },
];

export default function Goals() {
  const [goals, setGoals] = useState({ calories:2000, protein:60, carbs:250, fat:65, fiber:30, sugar:50, sodium:2300 });
  const [saved, setSaved] = useState(false);

  useEffect(() => { getGoals().then(setGoals); }, []);

  function handleChange(e) { setGoals(g => ({ ...g, [e.target.name]: parseInt(e.target.value)||0 })); setSaved(false); }

  async function handleSave() { await saveGoals(goals); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="space-y-5">
      <h2 className="font-headline font-bold text-xl text-on-surface">Daily Goals</h2>

      {/* Presets */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant">Quick presets</p>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => { setGoals(p); setSaved(false); }}
              className="p-4 bg-surface-container-lowest rounded-3xl text-left hover:bg-surface-container-low border border-outline-variant/30 transition-colors">
              <p className="font-headline font-bold text-sm text-on-surface">{p.label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{p.calories} kcal</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4">
        {FIELDS.map(f => (
          <div key={f.name} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{f.icon}</span>
            </div>
            <label className="flex-1 text-sm font-semibold text-on-surface">{f.label}</label>
            <input
              type="number" name={f.name} min="0"
              value={goals[f.name] || 0} onChange={handleChange}
              className="w-24 text-center px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="w-8 text-xs text-on-surface-variant">{f.unit}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-on-surface-variant italic">
        Sugar and Sodium are daily maximums. Fiber is a minimum.
      </p>

      <button onClick={handleSave}
        className={`w-full py-4 rounded-3xl text-base font-headline font-bold transition-all duration-300 ${
          saved
            ? "bg-emerald-600 text-white"
            : "bg-primary text-white hover:bg-emerald-800 active:scale-95"
        }`}
      >
        {saved ? "✓ Saved!" : "Save Goals"}
      </button>
    </div>
  );
}
