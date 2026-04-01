import { useState, useEffect } from "react";
import { saveRecipe, getAllRecipes, deleteRecipe } from "../db";
import { searchFood, calcMacros } from "../foodDatabase";
import { getGlobalFoods } from "../globalFoods";

const EMPTY_QUICK = { name:"", serving:"1 serving", cal:"", protein:"", carbs:"", fat:"", fiber:"", sugar:"", sodium:"" };
const UNITS = ["g","ml","tsp","tbsp","cup","serving"];

function unitToGrams(food, amount, unit) {
  switch (unit) {
    case "g": case "ml": return amount;
    case "tsp":     return amount * 5;
    case "tbsp":    return amount * 15;
    case "cup":     return amount * 240;
    case "serving": return amount * food.gramsPerServing;
    default:        return amount;
  }
}

export default function CustomRecipe() {
  const [recipes,  setRecipes]  = useState([]);
  const [mode,     setMode]     = useState(null);
  const [quickForm,setQuickForm]= useState(EMPTY_QUICK);
  const [recipeName,   setRecipeName]   = useState("");
  const [recipeServing,setRecipeServing]= useState("1 serving");
  const [ingredientQuery,  setIngredientQuery]  = useState("");
  const [ingredientResults,setIngredientResults]= useState([]);
  const [ingredients,      setIngredients]      = useState([]);
  const [builderTotals, setBuilderTotals] = useState({ cal:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0 });

  async function load() { setRecipes(await getAllRecipes()); }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = ingredients.reduce((acc, ing) => {
      const grams = unitToGrams(ing.food, ing.amount, ing.unit);
      const m = calcMacros(ing.food, { grams });
      return { cal: acc.cal+m.cal, protein: acc.protein+m.protein, carbs: acc.carbs+m.carbs, fat: acc.fat+m.fat, fiber: acc.fiber+m.fiber, sugar: acc.sugar+m.sugar, sodium: acc.sodium+m.sodium };
    }, { cal:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0 });
    setBuilderTotals({ cal:Math.round(t.cal), protein:Math.round(t.protein*10)/10, carbs:Math.round(t.carbs*10)/10, fat:Math.round(t.fat*10)/10, fiber:Math.round(t.fiber*10)/10, sugar:Math.round(t.sugar*10)/10, sodium:Math.round(t.sodium) });
  }, [ingredients]);

  async function handleQuickSave() {
    if (!quickForm.name || !quickForm.cal) return;
    await saveRecipe({ id: quickForm.name.toLowerCase().replace(/\s+/g,"_")+"_custom_"+Date.now(), name:quickForm.name.trim(), serving:quickForm.serving||"1 serving", gramsPerServing:100, cal:parseFloat(quickForm.cal)||0, protein:parseFloat(quickForm.protein)||0, carbs:parseFloat(quickForm.carbs)||0, fat:parseFloat(quickForm.fat)||0, fiber:parseFloat(quickForm.fiber)||0, sugar:parseFloat(quickForm.sugar)||0, sodium:parseFloat(quickForm.sodium)||0 });
    setQuickForm(EMPTY_QUICK); setMode(null); load();
  }

  async function handleIngredientSearch(q) {
    setIngredientQuery(q);
    if (q.length < 2) { setIngredientResults([]); return; }
    const [customs, globals] = await Promise.all([getAllRecipes(), getGlobalFoods()]);
    setIngredientResults(searchFood(q, [...customs, ...globals]));
  }

  function addIngredient(food) { setIngredients(p => [...p, { food, amount: food.gramsPerServing, unit:"g" }]); setIngredientQuery(""); setIngredientResults([]); }
  function updateIngredient(i, field, value) { setIngredients(p => p.map((ing, idx) => idx===i ? {...ing,[field]: field==="amount"?parseFloat(value)||0:value}:ing)); }
  function removeIngredient(i) { setIngredients(p => p.filter((_,idx)=>idx!==i)); }

  async function handleBuilderSave() {
    if (!recipeName.trim() || ingredients.length===0) return;
    await saveRecipe({ id:recipeName.toLowerCase().replace(/\s+/g,"_")+"_recipe_"+Date.now(), name:recipeName.trim(), serving:recipeServing||"1 serving", gramsPerServing:ingredients.reduce((s,ing)=>s+unitToGrams(ing.food,ing.amount,ing.unit),0), ...builderTotals, ingredients:ingredients.map(ing=>({name:ing.food.name,amount:ing.amount,unit:ing.unit,grams:Math.round(unitToGrams(ing.food,ing.amount,ing.unit))})) });
    setRecipeName(""); setRecipeServing("1 serving"); setIngredients([]); setIngredientQuery(""); setIngredientResults([]); setMode(null); load();
  }

  function cancelMode() { setMode(null); setQuickForm(EMPTY_QUICK); setRecipeName(""); setRecipeServing("1 serving"); setIngredients([]); setIngredientQuery(""); setIngredientResults([]); }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-headline font-bold text-xl text-on-surface">My Custom Foods</h2>
        {!mode ? (
          <div className="flex gap-2">
            <button onClick={() => setMode("quick")}
              className="px-4 py-2 bg-primary text-white rounded-2xl text-xs font-bold hover:bg-emerald-800 transition-colors">
              + Quick Add
            </button>
            <button onClick={() => setMode("builder")}
              className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-2xl text-xs font-bold hover:opacity-90 transition-opacity">
              🧪 Build Recipe
            </button>
          </div>
        ) : (
          <button onClick={cancelMode} className="text-sm text-on-surface-variant font-semibold">✕ Cancel</button>
        )}
      </div>

      {/* Quick Add form */}
      {mode === "quick" && (
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-3">
          <input placeholder="Food name *" value={quickForm.name} name="name"
            onChange={e => setQuickForm(f=>({...f,name:e.target.value}))}
            className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input placeholder="Serving size" value={quickForm.serving} name="serving"
            onChange={e => setQuickForm(f=>({...f,serving:e.target.value}))}
            className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
          />
          {[["cal","Calories *","protein","Protein (g)"],["carbs","Carbs (g)","fat","Fat (g)"],["fiber","Fiber (g)","sugar","Sugar (g)"]].map(([n1,p1,n2,p2]) => (
            <div key={n1} className="flex gap-2">
              {[[n1,p1],[n2,p2]].map(([n,p]) => (
                <input key={n} type="number" placeholder={p} value={quickForm[n]} name={n}
                  onChange={e => setQuickForm(f=>({...f,[n]:e.target.value}))}
                  className="flex-1 px-3 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
                />
              ))}
            </div>
          ))}
          <input type="number" placeholder="Sodium (mg)" value={quickForm.sodium} name="sodium"
            onChange={e => setQuickForm(f=>({...f,sodium:e.target.value}))}
            className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
          />
          <button onClick={handleQuickSave}
            className="w-full py-3 bg-primary text-white rounded-3xl font-headline font-bold hover:bg-emerald-800 transition-colors">
            Save Food
          </button>
        </div>
      )}

      {/* Builder form */}
      {mode === "builder" && (
        <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4">
          <div className="space-y-2">
            <input placeholder="Recipe name (e.g. Chana Chaat) *" value={recipeName}
              onChange={e => setRecipeName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input placeholder="Serving (e.g. 1 bowl)" value={recipeServing}
              onChange={e => setRecipeServing(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none"
            />
          </div>

          {/* Ingredient search */}
          <div className="relative">
            <input placeholder="Search ingredient to add…" value={ingredientQuery}
              onChange={e => handleIngredientSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-primary/40 bg-surface-container-low text-sm focus:outline-none focus:border-primary"
            />
            {ingredientResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-outline-variant shadow-lg z-10 overflow-hidden">
                {ingredientResults.map(f => (
                  <button key={f.id} onClick={() => addIngredient(f)}
                    className="flex justify-between items-center w-full px-4 py-3 hover:bg-surface-container-low text-left border-b border-outline-variant/20 last:border-0">
                    <span className="text-sm font-semibold">{f.name}</span>
                    <span className="text-xs text-on-surface-variant">{f.cal} kcal</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ingredient list */}
          {ingredients.length > 0 && (
            <div className="space-y-2">
              {ingredients.map((ing, i) => {
                const grams = unitToGrams(ing.food, ing.amount, ing.unit);
                const m = calcMacros(ing.food, { grams });
                return (
                  <div key={i} className="bg-surface-container-low rounded-2xl p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-on-surface">{ing.food.name}</span>
                      <button onClick={() => removeIngredient(i)} className="text-on-surface-variant hover:text-error text-lg">✕</button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input type="number" min="0" step="any" value={ing.amount}
                        onChange={e => updateIngredient(i,"amount",e.target.value)}
                        className="w-20 text-center px-2 py-1.5 rounded-xl border border-outline-variant text-sm focus:outline-none"
                      />
                      <select value={ing.unit} onChange={e => updateIngredient(i,"unit",e.target.value)}
                        className="px-2 py-1.5 rounded-xl border border-outline-variant text-sm bg-white focus:outline-none">
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <span className="text-xs text-on-surface-variant">{grams.toFixed(0)}g · {m.cal} kcal</span>
                    </div>
                  </div>
                );
              })}

              {/* Totals */}
              <div className="bg-primary rounded-3xl p-4">
                <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-3">Recipe Totals ({recipeServing})</p>
                <div className="grid grid-cols-4 gap-3">
                  {[["Cal",builderTotals.cal+" kcal"],["Protein",builderTotals.protein+"g"],["Carbs",builderTotals.carbs+"g"],["Fat",builderTotals.fat+"g"]].map(([k,v])=>(
                    <div key={k} className="text-center">
                      <p className="text-[9px] text-white/60 uppercase tracking-wide">{k}</p>
                      <p className="text-sm font-bold text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {ingredients.length === 0 && (
            <p className="text-center text-on-surface-variant text-sm py-4">Search for ingredients above to start building.</p>
          )}

          <button onClick={handleBuilderSave} disabled={!recipeName.trim() || ingredients.length===0}
            className="w-full py-3 bg-primary text-white rounded-3xl font-headline font-bold hover:bg-emerald-800 transition-colors disabled:opacity-40">
            Save Recipe
          </button>
        </div>
      )}

      {/* Saved recipes */}
      {recipes.length === 0 && !mode && (
        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] mb-3">restaurant_menu</span>
          <p className="text-sm">No custom foods yet. Add one above!</p>
        </div>
      )}

      <div className="space-y-3">
        {recipes.map(r => (
          <div key={r.id} className="bg-surface-container-lowest rounded-3xl px-5 py-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-on-surface text-sm">{r.name}</p>
              <p className="text-xs text-on-surface-variant">{r.serving}{r.ingredients ? ` · ${r.ingredients.length} ingredients` : ""}</p>
            </div>
            <div className="text-right text-xs text-on-surface-variant space-y-0.5 mr-2">
              <p className="font-bold text-primary text-sm">{Math.round(r.cal)} kcal</p>
              <p>P:{Math.round(r.protein)}g C:{Math.round(r.carbs)}g F:{Math.round(r.fat)}g</p>
            </div>
            <button onClick={async () => { await deleteRecipe(r.id); load(); }}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-error-container transition-colors text-on-surface-variant flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
