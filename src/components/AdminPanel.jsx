import { useState, useEffect } from "react";
import { getGlobalFoods, addGlobalFood, deleteGlobalFood } from "../globalFoods";

const EMPTY = {
  name: "", serving: "1 serving", gramsPerServing: "",
  cal: "", protein: "", carbs: "", fat: "",
  fiber: "", sugar: "", sodium: "", category: "",
};

const FIELDS = [
  { name: "cal",            label: "Calories",         unit: "kcal", required: true },
  { name: "protein",        label: "Protein",          unit: "g",    required: false },
  { name: "carbs",          label: "Carbs",            unit: "g",    required: false },
  { name: "fat",            label: "Fat",              unit: "g",    required: false },
  { name: "fiber",          label: "Fiber",            unit: "g",    required: false },
  { name: "sugar",          label: "Sugar",            unit: "g",    required: false },
  { name: "sodium",         label: "Sodium",           unit: "mg",   required: false },
  { name: "gramsPerServing",label: "Grams per serving",unit: "g",    required: true  },
];

export default function AdminPanel() {
  const [foods,   setFoods]   = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [search,  setSearch]  = useState("");

  async function load() {
    const data = await getGlobalFoods();
    setFoods(data.sort((a, b) => a.name.localeCompare(b.name)));
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.cal || !form.gramsPerServing) return;
    setLoading(true);
    try {
      await addGlobalFood({
        id:             form.name.toLowerCase().replace(/\s+/g, "_") + "_admin_" + Date.now(),
        name:           form.name.trim(),
        serving:        form.serving || "1 serving",
        gramsPerServing:parseFloat(form.gramsPerServing) || 100,
        cal:            parseFloat(form.cal)     || 0,
        protein:        parseFloat(form.protein) || 0,
        carbs:          parseFloat(form.carbs)   || 0,
        fat:            parseFloat(form.fat)     || 0,
        fiber:          parseFloat(form.fiber)   || 0,
        sugar:          parseFloat(form.sugar)   || 0,
        sodium:         parseFloat(form.sodium)  || 0,
        category:       form.category.trim() || "General",
      });
      setForm(EMPTY);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      load();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(firestoreId) {
    await deleteGlobalFood(firestoreId);
    load();
  }

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-700">shield</span>
        </div>
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface">Admin Panel</h2>
          <p className="text-xs text-on-surface-variant">Foods added here appear for all users</p>
        </div>
      </div>

      {/* Add food form */}
      <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
        <p className="font-headline font-semibold text-on-surface text-base mb-1">Add New Food</p>

        <input
          name="name" placeholder="Food name *" value={form.name} onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <div className="flex gap-2">
          <input
            name="serving" placeholder='Serving (e.g. "1 bowl")' value={form.serving} onChange={handleChange}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
          />
          <input
            name="category" placeholder="Category" value={form.category} onChange={handleChange}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
          />
        </div>

        {/* Numeric fields in a grid */}
        <div className="grid grid-cols-2 gap-2">
          {FIELDS.map(f => (
            <div key={f.name} className="flex items-center gap-1.5 bg-surface-container-low rounded-2xl px-3 py-2 border border-outline-variant/50">
              <div className="flex-1">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">{f.label}{f.required ? " *" : ""}</p>
                <input
                  type="number" name={f.name} min="0" value={form[f.name]} onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-bold text-on-surface focus:outline-none"
                />
              </div>
              <span className="text-xs text-on-surface-variant">{f.unit}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={loading || !form.name.trim() || !form.cal || !form.gramsPerServing}
          className={`w-full py-3 rounded-3xl font-headline font-bold text-sm transition-all ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-primary text-white hover:bg-emerald-800 disabled:opacity-40"
          }`}
        >
          {loading ? "Adding…" : saved ? "✓ Food Added!" : "Add to Database"}
        </button>
      </div>

      {/* Existing admin foods */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-headline font-semibold text-on-surface">{foods.length} admin foods</p>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Filter…"
            className="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm w-36 focus:outline-none"
          />
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-on-surface-variant text-sm py-8">No admin foods yet.</p>
        )}

        {filtered.map(f => (
          <div key={f._firestoreId} className="bg-surface-container-lowest rounded-3xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-on-surface">{f.name}</p>
              <p className="text-xs text-on-surface-variant">{f.serving} · {f.category}</p>
            </div>
            <div className="text-right text-xs text-on-surface-variant mr-2">
              <p className="font-bold text-primary text-sm">{f.cal} kcal</p>
              <p>P:{f.protein}g C:{f.carbs}g F:{f.fat}g</p>
            </div>
            <button
              onClick={() => handleDelete(f._firestoreId)}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-error-container transition-colors text-on-surface-variant flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
