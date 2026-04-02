const BASE = "https://world.openfoodfacts.net/api/v2/search";
const FIELDS = "product_name,nutriments,serving_size,serving_quantity,brands,categories_tags";

function normalize(product) {
  const n = product.nutriments ?? {};
  const cal = n["energy-kcal_100g"] ?? (n["energy_100g"] ? Math.round(n["energy_100g"] / 4.184) : null);
  if (!cal) return null;

  const name = [product.brands, product.product_name].filter(Boolean).join(" – ").trim();
  if (!name) return null;

  // Serving: prefer serving_quantity (grams), else 100g default
  const gramsPerServing = parseFloat(product.serving_quantity) || 100;
  const serving = product.serving_size || "100g";

  return {
    id: "off_" + (product._id || product.code || Math.random().toString(36).slice(2)),
    name,
    serving,
    gramsPerServing,
    cal:     Math.round(cal),
    protein: Math.round((n.proteins_100g    ?? 0) * 10) / 10,
    carbs:   Math.round((n.carbohydrates_100g ?? 0) * 10) / 10,
    fat:     Math.round((n.fat_100g          ?? 0) * 10) / 10,
    fiber:   Math.round((n.fiber_100g        ?? 0) * 10) / 10,
    sugar:   Math.round((n.sugars_100g       ?? 0) * 10) / 10,
    sodium:  Math.round((n.sodium_100g       ?? 0) * 1000), // g → mg
    source: "openfoodfacts",
  };
}

export async function searchOpenFoodFacts(query, { pageSize = 8 } = {}) {
  if (!query || query.length < 2) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      fields: FIELDS,
      page_size: pageSize,
      json: 1,
    });
    const res = await fetch(`${BASE}?${params}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products ?? []).map(normalize).filter(Boolean);
  } catch {
    return [];
  }
}
