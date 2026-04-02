import { useState, useEffect } from "react";
import { getGoals, saveGoals } from "../db";

// ── Mifflin-St Jeor BMR ──────────────────────────────────────────────────────
function calcBMR(weight, height, age, gender) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "female" ? base - 161 : base + 5;
}

const ACTIVITY = [
  { value: "sedentary",  label: "Sedentary",      desc: "Desk job, little exercise",      factor: 1.2   },
  { value: "light",      label: "Light",           desc: "1–3 workouts / week",             factor: 1.375 },
  { value: "moderate",   label: "Moderate",        desc: "3–5 workouts / week",             factor: 1.55  },
  { value: "active",     label: "Active",          desc: "6–7 workouts / week",             factor: 1.725 },
  { value: "veryactive", label: "Very Active",     desc: "Physical job or 2× daily",        factor: 1.9   },
];

function calcGoals(profile) {
  const { currentWeight, targetWeight, height, age, gender, activityLevel, weeksToGoal } = profile;
  const actFactor = ACTIVITY.find(a => a.value === activityLevel)?.factor ?? 1.55;
  const bmr  = calcBMR(currentWeight, height, age, gender);
  const tdee = Math.round(bmr * actFactor);

  const weightDiff   = currentWeight - targetWeight;       // positive = lose, negative = gain
  const totalKcal    = weightDiff * 7700;                  // 1kg fat ≈ 7700 kcal
  const dailyDelta   = Math.round(totalKcal / (weeksToGoal * 7));
  const cappedDelta  = Math.min(Math.abs(dailyDelta), 1000) * Math.sign(dailyDelta);
  const minCal       = gender === "female" ? 1200 : 1500;
  const calories     = Math.max(minCal, tdee - cappedDelta);

  // Macros
  const protein  = Math.round(Math.max(targetWeight, currentWeight) * (weightDiff > 0 ? 2.0 : 1.6)); // g
  const fat      = Math.round((calories * 0.27) / 9);       // 27% of calories from fat
  const carbCal  = calories - protein * 4 - fat * 9;
  const carbs    = Math.round(Math.max(50, carbCal / 4));

  return {
    tdee,
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    fiber:  30,
    sugar:  40,
    sodium: 2300,
  };
}

const EMPTY_PROFILE = {
  currentWeight: "",
  targetWeight:  "",
  height:        "",
  age:           "",
  gender:        "male",
  activityLevel: "moderate",
  weeksToGoal:   12,
};

const MACRO_FIELDS = [
  { name: "calories", label: "Calories",     unit: "kcal", icon: "local_fire_department", color: "text-primary" },
  { name: "protein",  label: "Protein",      unit: "g",    icon: "egg",                   color: "text-blue-600"  },
  { name: "carbs",    label: "Carbs",        unit: "g",    icon: "nutrition",              color: "text-amber-600" },
  { name: "fat",      label: "Fat",          unit: "g",    icon: "water_drop",             color: "text-purple-600"},
  { name: "fiber",    label: "Fiber (min)",  unit: "g",    icon: "grass",                  color: "text-green-600" },
  { name: "sugar",    label: "Sugar (max)",  unit: "g",    icon: "cake",                   color: "text-pink-600"  },
  { name: "sodium",   label: "Sodium (max)", unit: "mg",   icon: "science",                color: "text-zinc-500"  },
];

export default function Goals() {
  const [saved,    setSaved]    = useState(false);
  const [step,     setStep]     = useState("profile"); // "profile" | "goals"
  const [profile,  setProfile]  = useState(EMPTY_PROFILE);
  const [goals,    setGoals]    = useState(null);   // calculated + user-editable macros
  const [rec,      setRec]      = useState(null);   // snapshot of recommendations

  useEffect(() => {
    getGoals().then(data => {
      if (!data) return;
      if (data.currentWeight) {
        setProfile({
          currentWeight: data.currentWeight,
          targetWeight:  data.targetWeight,
          height:        data.height,
          age:           data.age,
          gender:        data.gender        ?? "male",
          activityLevel: data.activityLevel ?? "moderate",
          weeksToGoal:   data.weeksToGoal   ?? 12,
        });
        const r = calcGoals(data);
        setRec(r);
        setGoals({ calories: data.calories, protein: data.protein, carbs: data.carbs, fat: data.fat, fiber: data.fiber, sugar: data.sugar, sodium: data.sodium });
        setStep("goals");
      }
    });
  }, []);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: name === "gender" || name === "activityLevel" ? value : value }));
  }

  function handleCalculate() {
    const p = {
      ...profile,
      currentWeight: parseFloat(profile.currentWeight),
      targetWeight:  parseFloat(profile.targetWeight),
      height:        parseFloat(profile.height),
      age:           parseInt(profile.age),
      weeksToGoal:   parseInt(profile.weeksToGoal) || 12,
    };
    if (!p.currentWeight || !p.targetWeight || !p.height || !p.age) return;
    const r = calcGoals(p);
    setRec(r);
    setGoals({ calories: r.calories, protein: r.protein, carbs: r.carbs, fat: r.fat, fiber: r.fiber, sugar: r.sugar, sodium: r.sodium });
    setProfile(p);
    setStep("goals");
  }

  async function handleSave() {
    await saveGoals({ ...profile, ...goals });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function applyRecommended() {
    setGoals({ calories: rec.calories, protein: rec.protein, carbs: rec.carbs, fat: rec.fat, fiber: rec.fiber, sugar: rec.sugar, sodium: rec.sodium });
  }

  const profileReady = profile.currentWeight && profile.targetWeight && profile.height && profile.age;
  const weightDiff   = parseFloat(profile.targetWeight) - parseFloat(profile.currentWeight);
  const isLosing     = weightDiff < 0;
  const isGaining    = weightDiff > 0;

  // ── Step 1: Profile ──────────────────────────────────────────────────────────
  if (step === "profile") {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface">Set Your Goals</h2>
          <p className="text-sm text-on-surface-variant mt-1">We'll calculate your personalised daily targets.</p>
        </div>

        {/* Weight */}
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4">
          <p className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant">Weight</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Current weight</label>
              <div className="relative">
                <input type="number" name="currentWeight" placeholder="70" value={profile.currentWeight}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-outline-variant bg-surface-container-low text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">kg</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Target weight</label>
              <div className="relative">
                <input type="number" name="targetWeight" placeholder="65" value={profile.targetWeight}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-outline-variant bg-surface-container-low text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">kg</span>
              </div>
            </div>
          </div>

          {/* Live weight diff pill */}
          {profile.currentWeight && profile.targetWeight && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold w-fit ${
              isLosing ? "bg-blue-50 text-blue-700" : isGaining ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {isLosing ? "trending_down" : isGaining ? "trending_up" : "check_circle"}
              </span>
              {isLosing
                ? `Lose ${Math.abs(weightDiff).toFixed(1)} kg`
                : isGaining
                ? `Gain ${weightDiff.toFixed(1)} kg`
                : "Maintain weight"}
            </div>
          )}
        </div>

        {/* Body stats */}
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4">
          <p className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant">About you</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Height</label>
              <div className="relative">
                <input type="number" name="height" placeholder="170" value={profile.height}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-outline-variant bg-surface-container-low text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">cm</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Age</label>
              <div className="relative">
                <input type="number" name="age" placeholder="25" value={profile.age}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-outline-variant bg-surface-container-low text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">yrs</span>
              </div>
            </div>
          </div>

          {/* Gender toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Biological sex</label>
            <div className="flex gap-2">
              {["male","female"].map(g => (
                <button key={g} onClick={() => setProfile(p => ({...p, gender: g}))}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-bold capitalize transition-colors ${
                    profile.gender === g
                      ? "bg-primary text-white"
                      : "bg-surface-container-low text-on-surface-variant border border-outline-variant"
                  }`}>
                  {g === "male" ? "♂ Male" : "♀ Female"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity level */}
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant">Activity level</p>
          <div className="space-y-2">
            {ACTIVITY.map(a => (
              <button key={a.value} onClick={() => setProfile(p => ({...p, activityLevel: a.value}))}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors ${
                  profile.activityLevel === a.value
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container"
                }`}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${profile.activityLevel === a.value ? "bg-primary" : "bg-outline-variant"}`} />
                <div>
                  <p className={`text-sm font-bold ${profile.activityLevel === a.value ? "text-primary" : "text-on-surface"}`}>{a.label}</p>
                  <p className="text-xs text-on-surface-variant">{a.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant">Timeline</p>
            <span className="text-sm font-bold text-primary">{profile.weeksToGoal} weeks</span>
          </div>
          <input type="range" name="weeksToGoal" min="2" max="52" step="1"
            value={profile.weeksToGoal} onChange={handleProfileChange}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>2 weeks</span>
            <span>6 months</span>
            <span>1 year</span>
          </div>
          {profile.currentWeight && profile.targetWeight && weightDiff !== 0 && (
            <p className="text-xs text-on-surface-variant text-center">
              ~{(Math.abs(weightDiff) / profile.weeksToGoal * 1000 / 7).toFixed(0)} g/day loss
              · {(Math.abs(weightDiff) * 7700 / profile.weeksToGoal / 7).toFixed(0)} kcal/day deficit
            </p>
          )}
        </div>

        <button onClick={handleCalculate} disabled={!profileReady}
          className="w-full py-4 rounded-3xl text-base font-headline font-bold bg-primary text-white hover:bg-emerald-800 active:scale-95 transition-all disabled:opacity-40">
          Calculate My Goals →
        </button>
      </div>
    );
  }

  // ── Step 2: Goals ────────────────────────────────────────────────────────────
  const wDiff = (profile.targetWeight - profile.currentWeight);
  const tag = wDiff < 0 ? "Weight Loss" : wDiff > 0 ? "Muscle Gain" : "Maintenance";

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface">Your Daily Goals</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">{tag} · {profile.weeksToGoal} weeks</p>
        </div>
        <button onClick={() => setStep("profile")}
          className="text-xs font-semibold text-primary flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-[14px]">edit</span>
          Recalculate
        </button>
      </div>

      {/* Summary card */}
      {rec && (
        <div className="bg-primary rounded-4xl p-5">
          <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-4">Recommended for you</p>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "TDEE",    value: rec.tdee + " kcal",    sub: "maintenance" },
              { label: "Goal",    value: rec.calories + " kcal", sub: `${Math.abs(rec.tdee - rec.calories)} kcal ${wDiff < 0 ? "deficit" : wDiff > 0 ? "surplus" : ""}` },
              { label: "Protein", value: rec.protein + "g",     sub: "per day"     },
              { label: "Carbs",   value: rec.carbs + "g",       sub: "per day"     },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wide">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
                <p className="text-[9px] text-white/50">{item.sub}</p>
              </div>
            ))}
          </div>
          <button onClick={applyRecommended}
            className="w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors">
            Apply Recommended
          </button>
        </div>
      )}

      {/* Editable goals */}
      <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant mb-3">Fine-tune your targets</p>
        {goals && MACRO_FIELDS.map(f => (
          <div key={f.name} className="flex items-center gap-3 py-2 border-b border-outline-variant/20 last:border-0">
            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
              <span className={`material-symbols-outlined text-[16px] ${f.color}`}>{f.icon}</span>
            </div>
            <span className="flex-1 text-sm font-semibold text-on-surface">{f.label}</span>
            <input
              type="number" min="0"
              value={goals[f.name] ?? 0}
              onChange={e => { setGoals(g => ({...g, [f.name]: parseInt(e.target.value)||0})); setSaved(false); }}
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
        }`}>
        {saved ? "✓ Saved!" : "Save Goals"}
      </button>
    </div>
  );
}
