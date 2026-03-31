import { useState, useEffect } from "react";
import { saveRecipe, getAllRecipes, deleteRecipe } from "../db";
import { searchFood, calcMacros, FOODS } from "../foodDatabase";

const EMPTY_QUICK = { name: "", serving: "1 serving", cal: "", protein: "", carbs: "", fat: "", fiber: "", sugar: "", sodium: "" };

// Unit → grams conversion
function unitToGrams(food, amount, unit) {
  switch (unit) {
    case "g":
    case "ml":   return amount;
    case "tsp":  return amount * 5;
    case "tbsp": return amount * 15;
    case "cup":  return amount * 240;
    case "serving": return amount * food.gramsPerServing;
    default:     return amount;
  }
}

const UNITS = ["g", "ml", "tsp", "tbsp", "cup", "serving"];

export default function CustomRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [mode, setMode] = useState(null); // null | "quick" | "builder"

  // Quick add state
  const [quickForm, setQuickForm] = useState(EMPTY_QUICK);

  // Builder state
  const [recipeName, setRecipeName]       = useState("");
  const [recipeServing, setRecipeServing] = useState("1 serving");
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [ingredientResults, setIngredientResults] = useState([]);
  const [ingredients, setIngredients]     = useState([]); // { food, amount, unit }
  const [builderTotals, setBuilderTotals] = useState({ cal:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, sodium:0 });

  async function load() { setRecipes(await getAllRecipes()); }
  useEffect(() => { load(); }, []);

  // Recalculate totals whenever ingredients change
  useEffect(() => {
    const totals = ingredients.reduce((acc, ing) => {
      const grams = unitToGrams(ing.food, ing.amount, ing.unit);
      const m = calcMacros(ing.food, { grams });
      return {
        cal:     acc.cal     + m.cal,
        protein: acc.protein + m.protein,
        carbs:   acc.carbs   + m.carbs,
        fat:     acc.fat     + m.fat,
        fiber:   acc.fiber   + m.fiber,
        sugar:   acc.sugar   + m.sugar,
        sodium:  acc.sodium  + m.sodium,
      };
    }, { cal:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, sodium:0 });

    setBuilderTotals({
      cal:     Math.round(totals.cal),
      protein: Math.round(totals.protein * 10) / 10,
      carbs:   Math.round(totals.carbs   * 10) / 10,
      fat:     Math.round(totals.fat     * 10) / 10,
      fiber:   Math.round(totals.fiber   * 10) / 10,
      sugar:   Math.round(totals.sugar   * 10) / 10,
      sodium:  Math.round(totals.sodium),
    });
  }, [ingredients]);

  // ── Quick add ──────────────────────────────────────────────
  function handleQuickChange(e) {
    setQuickForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleQuickSave() {
    if (!quickForm.name || !quickForm.cal) return;
    await saveRecipe({
      id: quickForm.name.toLowerCase().replace(/\s+/g, "_") + "_custom_" + Date.now(),
      name:    quickForm.name.trim(),
      serving: quickForm.serving || "1 serving",
      gramsPerServing: 100, // default for custom quick-add
      cal:     parseFloat(quickForm.cal)     || 0,
      protein: parseFloat(quickForm.protein) || 0,
      carbs:   parseFloat(quickForm.carbs)   || 0,
      fat:     parseFloat(quickForm.fat)     || 0,
      fiber:   parseFloat(quickForm.fiber)   || 0,
      sugar:   parseFloat(quickForm.sugar)   || 0,
      sodium:  parseFloat(quickForm.sodium)  || 0,
    });
    setQuickForm(EMPTY_QUICK);
    setMode(null);
    load();
  }

  // ── Builder ────────────────────────────────────────────────
  async function handleIngredientSearch(q) {
    setIngredientQuery(q);
    if (q.length < 2) { setIngredientResults([]); return; }
    const customs = await getAllRecipes();
    setIngredientResults(searchFood(q, customs));
  }

  function addIngredient(food) {
    setIngredients(prev => [...prev, { food, amount: food.gramsPerServing, unit: "g" }]);
    setIngredientQuery("");
    setIngredientResults([]);
  }

  function updateIngredient(index, field, value) {
    setIngredients(prev => prev.map((ing, i) =>
      i === index ? { ...ing, [field]: field === "amount" ? parseFloat(value) || 0 : value } : ing
    ));
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  async function handleBuilderSave() {
    if (!recipeName.trim() || ingredients.length === 0) return;
    await saveRecipe({
      id: recipeName.toLowerCase().replace(/\s+/g, "_") + "_recipe_" + Date.now(),
      name:    recipeName.trim(),
      serving: recipeServing || "1 serving",
      gramsPerServing: ingredients.reduce((sum, ing) => sum + unitToGrams(ing.food, ing.amount, ing.unit), 0),
      ...builderTotals,
      ingredients: ingredients.map(ing => ({
        name:   ing.food.name,
        amount: ing.amount,
        unit:   ing.unit,
        grams:  Math.round(unitToGrams(ing.food, ing.amount, ing.unit)),
      })),
    });
    setRecipeName(""); setRecipeServing("1 serving");
    setIngredients([]); setIngredientQuery(""); setIngredientResults([]);
    setMode(null);
    load();
  }

  function cancelMode() {
    setMode(null);
    setQuickForm(EMPTY_QUICK);
    setRecipeName(""); setRecipeServing("1 serving");
    setIngredients([]); setIngredientQuery(""); setIngredientResults([]);
  }

  async function handleDelete(id) { await deleteRecipe(id); load(); }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="custom-recipe">
      <div className="section-header">
        <h2>My Custom Foods</h2>
        {!mode && (
          <div className="add-btn-group">
            <button className="add-btn" onClick={() => setMode("quick")}>+ Quick Add</button>
            <button className="add-btn add-btn-secondary" onClick={() => setMode("builder")}>🧪 Build Recipe</button>
          </div>
        )}
        {mode && <button className="cancel-text-btn" onClick={cancelMode}>✕ Cancel</button>}
      </div>

      {/* ── Quick Add form ── */}
      {mode === "quick" && (
        <div className="recipe-form">
          <input name="name"    placeholder="Food name *"    value={quickForm.name}    onChange={handleQuickChange} />
          <input name="serving" placeholder="Serving size"   value={quickForm.serving} onChange={handleQuickChange} />
          <div className="form-row">
            <input name="cal"     type="number" placeholder="Calories *" value={quickForm.cal}     onChange={handleQuickChange} />
            <input name="protein" type="number" placeholder="Protein (g)" value={quickForm.protein} onChange={handleQuickChange} />
          </div>
          <div className="form-row">
            <input name="carbs"   type="number" placeholder="Carbs (g)"   value={quickForm.carbs}   onChange={handleQuickChange} />
            <input name="fat"     type="number" placeholder="Fat (g)"     value={quickForm.fat}     onChange={handleQuickChange} />
          </div>
          <div className="form-row">
            <input name="fiber"   type="number" placeholder="Fiber (g)"   value={quickForm.fiber}   onChange={handleQuickChange} />
            <input name="sugar"   type="number" placeholder="Sugar (g)"   value={quickForm.sugar}   onChange={handleQuickChange} />
          </div>
          <input name="sodium" type="number" placeholder="Sodium (mg)" value={quickForm.sodium} onChange={handleQuickChange} />
          <button className="save-recipe-btn" onClick={handleQuickSave}>Save Food</button>
        </div>
      )}

      {/* ── Builder form ── */}
      {mode === "builder" && (
        <div className="builder-form">
          <div className="builder-name-row">
            <input
              className="builder-name-input"
              placeholder="Recipe name (e.g. Chana Chaat) *"
              value={recipeName}
              onChange={e => setRecipeName(e.target.value)}
            />
            <input
              className="builder-serving-input"
              placeholder="Serving (e.g. 1 bowl)"
              value={recipeServing}
              onChange={e => setRecipeServing(e.target.value)}
            />
          </div>

          {/* Ingredient search */}
          <div className="ingredient-search-wrap">
            <input
              className="ingredient-search"
              placeholder="Search ingredient to add..."
              value={ingredientQuery}
              onChange={e => handleIngredientSearch(e.target.value)}
            />
            {ingredientResults.length > 0 && (
              <div className="ingredient-results">
                {ingredientResults.map(f => (
                  <button key={f.id} className="ingredient-result-btn" onClick={() => addIngredient(f)}>
                    <span>{f.name}</span>
                    <span className="ingredient-result-meta">{f.serving} · {f.cal} kcal per {f.gramsPerServing}g</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients list */}
          {ingredients.length > 0 && (
            <div className="ingredients-list">
              {ingredients.map((ing, i) => {
                const grams = unitToGrams(ing.food, ing.amount, ing.unit);
                const m = calcMacros(ing.food, { grams });
                return (
                  <div key={i} className="ingredient-row">
                    <div className="ingredient-row-top">
                      <span className="ingredient-name">{ing.food.name}</span>
                      <button className="remove-ingredient-btn" onClick={() => removeIngredient(i)}>✕</button>
                    </div>
                    <div className="ingredient-row-controls">
                      <input
                        className="ingredient-amount"
                        type="number"
                        min="0"
                        step="any"
                        value={ing.amount}
                        onChange={e => updateIngredient(i, "amount", e.target.value)}
                      />
                      <select
                        className="ingredient-unit"
                        value={ing.unit}
                        onChange={e => updateIngredient(i, "unit", e.target.value)}
                      >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <span className="ingredient-cal-preview">
                        ≈ {grams.toFixed(0)}g · {m.cal} kcal · P:{m.protein}g C:{m.carbs}g F:{m.fat}g
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Live totals */}
              <div className="builder-totals">
                <p className="builder-totals-title">Recipe Totals ({recipeServing})</p>
                <div className="builder-totals-grid">
                  <div className="bt-item"><span>Calories</span><strong>{builderTotals.cal} kcal</strong></div>
                  <div className="bt-item"><span>Protein</span><strong>{builderTotals.protein}g</strong></div>
                  <div className="bt-item"><span>Carbs</span><strong>{builderTotals.carbs}g</strong></div>
                  <div className="bt-item"><span>Fat</span><strong>{builderTotals.fat}g</strong></div>
                  <div className="bt-item"><span>Fiber</span><strong>{builderTotals.fiber}g</strong></div>
                  <div className="bt-item"><span>Sugar</span><strong>{builderTotals.sugar}g</strong></div>
                  <div className="bt-item"><span>Sodium</span><strong>{builderTotals.sodium}mg</strong></div>
                  <div className="bt-item"><span>Total weight</span>
                    <strong>{Math.round(ingredients.reduce((s, ing) => s + unitToGrams(ing.food, ing.amount, ing.unit), 0))}g</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {ingredients.length === 0 && (
            <p className="builder-empty">Search for ingredients above to start building your recipe.</p>
          )}

          <button
            className="save-recipe-btn"
            onClick={handleBuilderSave}
            disabled={!recipeName.trim() || ingredients.length === 0}
          >
            Save Recipe
          </button>
        </div>
      )}

      {/* Saved recipes */}
      {recipes.length === 0 && !mode && (
        <p className="empty-state">No custom foods yet. Add one above!</p>
      )}

      {recipes.map(r => (
        <div key={r.id} className="recipe-card">
          <div className="recipe-info">
            <span className="recipe-name">{r.name}</span>
            <span className="recipe-serving">{r.serving}</span>
            {r.ingredients && (
              <span className="recipe-ingredient-count">{r.ingredients.length} ingredients</span>
            )}
          </div>
          <div className="recipe-macros">
            <span>{r.cal} kcal</span>
            <span>P:{r.protein}g</span>
            <span>C:{r.carbs}g</span>
            <span>F:{r.fat}g</span>
            <span>🌿{r.fiber}g</span>
            <span>🍬{r.sugar}g</span>
          </div>
          <button className="delete-btn" onClick={() => handleDelete(r.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
}
