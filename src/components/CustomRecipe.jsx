import { useState, useEffect } from "react";
import { saveRecipe, getAllRecipes, deleteRecipe } from "../db";

const EMPTY = { name: "", serving: "1 serving", cal: "", protein: "", carbs: "", fat: "" };

export default function CustomRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(false);

  async function load() {
    setRecipes(await getAllRecipes());
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!form.name || !form.cal) return;
    const recipe = {
      id: form.name.toLowerCase().replace(/\s+/g, "_") + "_custom",
      name: form.name.trim(),
      serving: form.serving || "1 serving",
      cal: parseFloat(form.cal) || 0,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
    };
    await saveRecipe(recipe);
    setForm(EMPTY);
    setEditing(false);
    load();
  }

  async function handleDelete(id) {
    await deleteRecipe(id);
    load();
  }

  return (
    <div className="custom-recipe">
      <div className="section-header">
        <h2>My Custom Foods</h2>
        <button className="add-btn" onClick={() => setEditing(e => !e)}>
          {editing ? "✕ Cancel" : "+ Add Food"}
        </button>
      </div>

      {editing && (
        <div className="recipe-form">
          <input name="name"    placeholder="Food name *"   value={form.name}    onChange={handleChange} />
          <input name="serving" placeholder="Serving size"  value={form.serving} onChange={handleChange} />
          <div className="form-row">
            <input name="cal"     type="number" placeholder="Calories *" value={form.cal}     onChange={handleChange} />
            <input name="protein" type="number" placeholder="Protein (g)" value={form.protein} onChange={handleChange} />
          </div>
          <div className="form-row">
            <input name="carbs"   type="number" placeholder="Carbs (g)"  value={form.carbs}   onChange={handleChange} />
            <input name="fat"     type="number" placeholder="Fat (g)"    value={form.fat}     onChange={handleChange} />
          </div>
          <button className="save-recipe-btn" onClick={handleSave}>Save Food</button>
        </div>
      )}

      {recipes.length === 0 && !editing && (
        <p className="empty-state">No custom foods yet. Add your own recipes above!</p>
      )}

      {recipes.map(r => (
        <div key={r.id} className="recipe-card">
          <div className="recipe-info">
            <span className="recipe-name">{r.name}</span>
            <span className="recipe-serving">{r.serving}</span>
          </div>
          <div className="recipe-macros">
            <span>{r.cal} kcal</span>
            <span>P:{r.protein}g</span>
            <span>C:{r.carbs}g</span>
            <span>F:{r.fat}g</span>
          </div>
          <button className="delete-btn" onClick={() => handleDelete(r.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
}
