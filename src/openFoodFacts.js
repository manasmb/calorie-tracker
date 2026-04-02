// USDA FoodData Central — free, reliable, 600k+ foods including branded items
// API key: get a free one at https://fdc.nal.usda.gov/api-guide.html
// Falls back to DEMO_KEY (25 req/hr per IP) if no key is configured.
const API_KEY = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY";
const cache = new Map();
const BASE    = "https://api.nal.usda.gov/fdc/v1/foods/search";

function getNutrient(nutrients, name) {
  return nutrients.find(n => n.nutrientName === name)?.value ?? 0;
}

function normalize(food) {
  const n = food.foodNutrients ?? [];
  const cal = getNutrient(n, "Energy");
  if (!cal) return null;

  const nameParts = [food.brandOwner, food.description].filter(s => s && s.trim());
  const name = nameParts.join(" – ").trim();
  if (!name) return null;

  const gramsPerServing = food.servingSize || 100;
  const unit = food.servingSizeUnit || "g";
  const serving = `${gramsPerServing}${unit}`;

  return {
    id: "usda_" + food.fdcId,
    name,
    serving,
    gramsPerServing,
    cal:     Math.round(cal),
    protein: Math.round(getNutrient(n, "Protein") * 10) / 10,
    carbs:   Math.round(getNutrient(n, "Carbohydrate, by difference") * 10) / 10,
    fat:     Math.round(getNutrient(n, "Total lipid (fat)") * 10) / 10,
    fiber:   Math.round(getNutrient(n, "Fiber, total dietary") * 10) / 10,
    sugar:   Math.round(getNutrient(n, "Sugars, total including NLEA") * 10) / 10,
    sodium:  Math.round(getNutrient(n, "Sodium, Na")),
    source: "usda",
  };
}

export async function searchOpenFoodFacts(query, { pageSize = 10 } = {}) {
  if (!query || query.length < 2) return [];

  const key = query.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const params = new URLSearchParams({
      query,
      api_key:  API_KEY,
      pageSize,
      dataType: "Branded,SR Legacy,Foundation",
    });
    const res = await fetch(`${BASE}?${params}`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    const results = (data.foods ?? []).map(normalize).filter(Boolean);
    cache.set(key, results);
    return results;
  } catch {
    clearTimeout(timer);
    return [];
  }
}
