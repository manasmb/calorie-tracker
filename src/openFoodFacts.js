// Uses the stable CGI search endpoint (better CORS support than the v2 API)
const BASE = "https://world.openfoodfacts.org/cgi/search.pl";
const FIELDS = "product_name,nutriments,serving_size,serving_quantity,brands,code";

function normalize(product) {
  const n = product.nutriments ?? {};
  const cal = n["energy-kcal_100g"]
    ?? (n["energy_100g"] ? Math.round(n["energy_100g"] / 4.184) : null);
  if (!cal || cal <= 0) return null;

  // Prefer "Brand – Product name", fall back to just product name
  const nameParts = [product.brands, product.product_name].filter(s => s && s.trim());
  const name = nameParts.join(" – ").trim();
  if (!name) return null;

  const gramsPerServing = parseFloat(product.serving_quantity) || 100;
  const serving = product.serving_size || "100g";

  return {
    id: "off_" + (product.code || Math.random().toString(36).slice(2)),
    name,
    serving,
    gramsPerServing,
    cal:     Math.round(cal),
    protein: Math.round((n.proteins_100g       ?? 0) * 10) / 10,
    carbs:   Math.round((n.carbohydrates_100g  ?? 0) * 10) / 10,
    fat:     Math.round((n.fat_100g            ?? 0) * 10) / 10,
    fiber:   Math.round((n.fiber_100g          ?? 0) * 10) / 10,
    sugar:   Math.round((n.sugars_100g         ?? 0) * 10) / 10,
    sodium:  Math.round((n.sodium_100g         ?? 0) * 1000), // g → mg
    source: "openfoodfacts",
  };
}

export async function searchOpenFoodFacts(query, { pageSize = 8 } = {}) {
  if (!query || query.length < 2) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: 1,
      action: "process",
      json: 1,
      page_size: pageSize,
      fields: FIELDS,
    });
    const res = await fetch(`${BASE}?${params}`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products ?? []).map(normalize).filter(Boolean);
  } catch {
    clearTimeout(timer);
    return [];
  }
}
