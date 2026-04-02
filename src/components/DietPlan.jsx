import { useState, useEffect, useCallback } from "react";
import { getGoals } from "../db";
import { getDislikedFoods, addDislikedFood, removeDislikedFood } from "../db";
import { generateMealPlan } from "../dietPlan";

// ── Small helpers ─────────────────────────────────────────────────────────────

function MacroPill({ label, value, color }) {
  return (
    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
      {label} {value}
    </span>
  );
}

function MealCard({ mealData, onDislike }) {
  const totals = mealData.items.reduce(
    (acc, item) => ({
      cal:     acc.cal     + item.cal,
      protein: acc.protein + item.protein,
      carbs:   acc.carbs   + item.carbs,
      fat:     acc.fat     + item.fat,
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const round = n => Math.round(n * 10) / 10;

  return (
    <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
      {/* Meal header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[20px] text-emerald-700"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {mealData.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-bold text-base text-on-surface leading-tight">{mealData.label}</p>
          <p className="text-xs text-on-surface-variant">~{mealData.targetCal} kcal target</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/20" />

      {/* Food items */}
      <div className="space-y-3">
        {mealData.items.map((item, i) => (
          <div key={item.food.id + i} className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-bold text-on-surface leading-snug">{item.food.name}</p>
              <p className="text-xs text-on-surface-variant">
                {item.servings === 1
                  ? item.food.serving
                  : `${item.servings} × ${item.food.serving}`}
              </p>
              <div className="flex flex-wrap gap-1 pt-0.5">
                <MacroPill label="🔥" value={`${Math.round(item.cal)} kcal`} color="bg-orange-50 text-orange-700" />
                <MacroPill label="P" value={`${round(item.protein)}g`}       color="bg-blue-50 text-blue-700"   />
                <MacroPill label="C" value={`${round(item.carbs)}g`}         color="bg-amber-50 text-amber-700" />
                <MacroPill label="F" value={`${round(item.fat)}g`}           color="bg-purple-50 text-purple-700" />
              </div>
            </div>
            <button
              onClick={() => onDislike(item.food)}
              title={`Don't like ${item.food.name}`}
              className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-semibold text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-colors mt-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">thumb_down</span>
              <span className="hidden sm:inline">Skip</span>
            </button>
          </div>
        ))}
      </div>

      {/* Meal total */}
      <div className="border-t border-outline-variant/20 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-on-surface-variant uppercase tracking-wide text-[10px]">Meal total</span>
          <div className="flex items-center gap-2">
            <span className="text-orange-600 font-bold">{Math.round(totals.cal)} kcal</span>
            <span className="text-blue-600">{round(totals.protein)}g P</span>
            <span className="text-amber-600">{round(totals.carbs)}g C</span>
            <span className="text-purple-600">{round(totals.fat)}g F</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Day summary card ──────────────────────────────────────────────────────────

function DaySummaryCard({ plan, goals }) {
  if (!plan || plan.length === 0) return null;

  const totals = plan
    .flatMap(m => m.items)
    .reduce(
      (acc, item) => ({
        cal:     acc.cal     + item.cal,
        protein: acc.protein + item.protein,
        carbs:   acc.carbs   + item.carbs,
        fat:     acc.fat     + item.fat,
      }),
      { cal: 0, protein: 0, carbs: 0, fat: 0 },
    );

  const round = n => Math.round(n * 10) / 10;
  const pct   = (val, target) => Math.min(100, Math.round((val / (target || 1)) * 100));

  const bars = [
    { label: "Calories", val: Math.round(totals.cal),     target: goals?.calories ?? 2000, unit: "kcal", color: "bg-orange-400", textColor: "text-orange-600" },
    { label: "Protein",  val: round(totals.protein),      target: goals?.protein  ?? 60,   unit: "g",    color: "bg-blue-400",   textColor: "text-blue-600"   },
    { label: "Carbs",    val: round(totals.carbs),        target: goals?.carbs    ?? 250,  unit: "g",    color: "bg-amber-400",  textColor: "text-amber-600"  },
    { label: "Fat",      val: round(totals.fat),          target: goals?.fat      ?? 65,   unit: "g",    color: "bg-purple-400", textColor: "text-purple-600" },
  ];

  return (
    <div className="bg-primary rounded-4xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-white/80"
          style={{ fontVariationSettings: "'FILL' 1" }}>summarize</span>
        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">Day Summary</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {bars.map(bar => (
          <div key={bar.label} className="bg-white/10 rounded-2xl p-3 space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-white/60 uppercase tracking-wide font-semibold">{bar.label}</span>
              <span className="text-xs text-white font-bold">{bar.val}<span className="text-white/50 font-normal"> / {bar.target}{bar.unit}</span></span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                style={{ width: `${pct(bar.val, bar.target)}%` }}
              />
            </div>
            <p className="text-[10px] text-white/50 text-right">{pct(bar.val, bar.target)}% of goal</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Disliked panel ────────────────────────────────────────────────────────────

function DislikedPanel({ disliked, onRemove, onClose }) {
  const items = [...disliked.entries()];   // [[id, name], ...]

  return (
    <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4 border-2 border-outline-variant/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant"
            style={{ fontVariationSettings: "'FILL' 1" }}>thumb_down</span>
          <h3 className="font-headline font-bold text-base text-on-surface">Do Not Like List</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 space-y-2">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40"
            style={{ fontVariationSettings: "'FILL' 1" }}>sentiment_satisfied</span>
          <p className="text-sm text-on-surface-variant">No foods disliked yet.</p>
          <p className="text-xs text-on-surface-variant/60">Tap Skip on any food item to exclude it from future plans.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map(([id, name]) => (
            <div key={id} className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-surface-container transition-colors">
              <span className="text-sm font-semibold text-on-surface">{name}</span>
              <button
                onClick={() => onRemove(id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DietPlan() {
  const [goals,             setGoals]             = useState(null);
  const [disliked,          setDisliked]          = useState(new Map()); // id → name
  const [plan,              setPlan]              = useState([]);
  const [seed,              setSeed]              = useState(0);
  const [showDislikedPanel, setShowDislikedPanel] = useState(false);
  const [loading,           setLoading]           = useState(true);

  // ── Load on mount ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const [g, dislikes] = await Promise.all([getGoals(), getDislikedFoods()]);
      setGoals(g);
      const map = new Map(dislikes.map(d => [d.id, d.name]));
      setDisliked(map);
      setLoading(false);
    }
    load();
  }, []);

  // ── Regenerate plan whenever seed / disliked / goals change ──
  useEffect(() => {
    if (!goals) return;
    const dislikedSet = new Set(disliked.keys());
    const newPlan = generateMealPlan(goals, goals, dislikedSet, seed);
    setPlan(newPlan);
  }, [seed, disliked, goals]);

  // ── Handlers ──────────────────────────────────────────────
  const handleDislike = useCallback(async (food) => {
    await addDislikedFood({ id: food.id, name: food.name });
    setDisliked(prev => {
      const next = new Map(prev);
      next.set(food.id, food.name);
      return next;
    });
    setSeed(s => s + 1);
  }, []);

  const handleRemoveDislike = useCallback(async (id) => {
    await removeDislikedFood(id);
    setDisliked(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setSeed(s => s + 1);
  }, []);

  const handleRefresh = useCallback(() => {
    setSeed(s => s + 1);
  }, []);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
      </div>
    );
  }

  // ── No goals state ────────────────────────────────────────
  const hasGoals = goals && goals.calories;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface">Today's Meal Plan</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {hasGoals
              ? `Personalised for ${goals.calories} kcal / day`
              : "Set up your goals first"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasGoals && (
            <button
              onClick={handleRefresh}
              title="Regenerate plan"
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-surface-container-lowest hover:bg-emerald-50 hover:text-primary transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[22px]">refresh</span>
            </button>
          )}
          <button
            onClick={() => setShowDislikedPanel(v => !v)}
            title="Foods I don't like"
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-colors ${
              showDislikedPanel
                ? "bg-red-100 text-red-600"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: showDislikedPanel ? "'FILL' 1" : "'FILL' 0" }}>
              thumb_down
            </span>
            <span className="hidden sm:inline">Dislikes</span>
            {disliked.size > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {disliked.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Disliked panel */}
      {showDislikedPanel && (
        <DislikedPanel
          disliked={disliked}
          onRemove={handleRemoveDislike}
          onClose={() => setShowDislikedPanel(false)}
        />
      )}

      {/* No goals prompt */}
      {!hasGoals && (
        <div className="bg-surface-container-lowest rounded-4xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px] text-emerald-600"
              style={{ fontVariationSettings: "'FILL' 1" }}>ads_click</span>
          </div>
          <div className="space-y-1">
            <p className="font-headline font-bold text-base text-on-surface">No Goals Set Yet</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Head over to the <strong className="text-primary">Goals</strong> tab to set up your profile and calorie targets. Your personalised meal plan will appear here automatically.
            </p>
          </div>
        </div>
      )}

      {/* Meal cards */}
      {hasGoals && plan.map(mealData => (
        <MealCard
          key={mealData.meal}
          mealData={mealData}
          onDislike={handleDislike}
        />
      ))}

      {/* Day summary */}
      {hasGoals && plan.length > 0 && (
        <DaySummaryCard plan={plan} goals={goals} />
      )}

      {/* Footer note */}
      {hasGoals && (
        <p className="text-xs text-center text-on-surface-variant/60 italic pb-2">
          Servings are suggestions. Tap <span className="not-italic">↺</span> to regenerate. Tap Skip on any food to exclude it.
        </p>
      )}
    </div>
  );
}
