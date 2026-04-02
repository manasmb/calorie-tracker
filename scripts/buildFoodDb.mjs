/**
 * Builds public/foodDb.json — a comprehensive local food database.
 *
 * Sources:
 *   1. USDA FoodData Central — SR Legacy + Foundation foods (~9,800 items)
 *      Uses paginated /foods/list endpoint to get EVERYTHING, not just 25/query.
 *   2. Open Food Facts — Indian branded & regional products (no key required)
 *
 * Usage:
 *   node scripts/buildFoodDb.mjs
 *   node scripts/buildFoodDb.mjs YOUR_USDA_KEY   (faster, higher rate limit)
 *
 * Get a free USDA key at https://fdc.nal.usda.gov/api-guide.html
 */

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT   = join(__dir, "../public/foodDb.json");

// Load .env.local if present
try {
  const env = readFileSync(join(__dir, "../.env.local"), "utf8");
  for (const line of env.split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
} catch { /* no .env.local */ }

const API_KEY  = process.argv[2] || process.env.VITE_USDA_API_KEY || "DEMO_KEY";
const USDA     = "https://api.nal.usda.gov/fdc/v1/foods/list";
const OFF_BASE = "https://world.openfoodfacts.org/cgi/search.pl";
const PAGE_SIZE = 200; // USDA max

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── USDA nutrient helpers ────────────────────────────────────────────────────

function getNutrient(nutrients, name) {
  return nutrients?.find(n => n.name === name)?.amount ?? 0;
}

function normalizeUSDA(food) {
  const n = food.foodNutrients ?? [];
  const cal = getNutrient(n, "Energy");
  if (!cal) return null;

  const name = food.description?.trim();
  if (!name) return null;

  const gramsPerServing = food.servingSize || 100;
  const unit = food.servingSizeUnit || "g";

  return {
    id:             "usda_" + food.fdcId,
    name,
    serving:        `${gramsPerServing}${unit}`,
    gramsPerServing,
    cal:     Math.round(cal),
    protein: Math.round(getNutrient(n, "Protein") * 10) / 10,
    carbs:   Math.round(getNutrient(n, "Carbohydrate, by difference") * 10) / 10,
    fat:     Math.round(getNutrient(n, "Total lipid (fat)") * 10) / 10,
    fiber:   Math.round(getNutrient(n, "Fiber, total dietary") * 10) / 10,
    sugar:   Math.round(getNutrient(n, "Sugars, total including NLEA") * 10) / 10,
    sodium:  Math.round(getNutrient(n, "Sodium, Na")),
    source:  "usda",
  };
}

// ── Fetch ALL USDA SR Legacy + Foundation via pagination ─────────────────────

async function fetchAllUSDA(dataType) {
  const foods = [];
  let page = 1;
  const delay = API_KEY === "DEMO_KEY" ? 2000 : 300;

  while (true) {
    const params = new URLSearchParams({
      api_key:  API_KEY,
      dataType,
      pageSize: PAGE_SIZE,
      pageNumber: page,
    });

    let data;
    try {
      const res = await fetch(`${USDA}?${params}`);
      if (res.status === 429) {
        console.log("    Rate limited, waiting 60s…");
        await sleep(60000);
        continue;
      }
      if (!res.ok) { console.warn(`    HTTP ${res.status}, skipping page ${page}`); break; }
      data = await res.json();
    } catch (e) {
      console.warn(`    Fetch error on page ${page}: ${e.message}`);
      break;
    }

    if (!Array.isArray(data) || data.length === 0) break;

    for (const f of data) {
      const norm = normalizeUSDA(f);
      if (norm) foods.push(norm);
    }

    process.stdout.write(`\r    Page ${page} — ${foods.length} foods so far…`);
    if (data.length < PAGE_SIZE) break; // last page
    page++;
    await sleep(delay);
  }

  console.log(); // newline after \r
  return foods;
}

// ── USDA Branded — Indian brand queries ─────────────────────────────────────
// The USDA Branded database has Indian products sold in the US/globally.

const USDA_BRANDED_QUERIES = [
  "Haldiram", "MTR", "Gits", "Kohinoor", "Shan", "Kitchens of India",
  "Deep Indian", "Swad", "Laxmi", "Eastern", "Priya", "Aashirvaad",
  "Patanjali", "Everest", "MDH", "Catch masala", "ITC",
  "Amul cheese", "Amul butter", "Nanak ghee", "Verka",
  "Britannia biscuit", "Parle-G", "Good Day biscuit",
  "Lay's India", "Kurkure", "Uncle Chipps",
  "Maggi noodles", "Sunfeast", "McVities India",
];

async function fetchUSDABranded(query) {
  const params = new URLSearchParams({
    query,
    api_key:  API_KEY,
    pageSize: 50,
    dataType: "Branded",
  });
  try {
    const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.foods ?? []).map(f => {
      const n = f.foodNutrients ?? [];
      const cal = n.find(x => x.nutrientName === "Energy")?.value ?? 0;
      if (!cal) return null;
      const nameParts = [f.brandOwner, f.description].filter(s => s?.trim());
      const name = nameParts.join(" – ").trim();
      if (!name) return null;
      const gps = f.servingSize || 100;
      return {
        id:             "usda_" + f.fdcId,
        name,
        serving:        `${gps}${f.servingSizeUnit || "g"}`,
        gramsPerServing: gps,
        cal:     Math.round(cal),
        protein: Math.round((n.find(x => x.nutrientName === "Protein")?.value ?? 0) * 10) / 10,
        carbs:   Math.round((n.find(x => x.nutrientName === "Carbohydrate, by difference")?.value ?? 0) * 10) / 10,
        fat:     Math.round((n.find(x => x.nutrientName === "Total lipid (fat)")?.value ?? 0) * 10) / 10,
        fiber:   Math.round((n.find(x => x.nutrientName === "Fiber, total dietary")?.value ?? 0) * 10) / 10,
        sugar:   Math.round((n.find(x => x.nutrientName === "Sugars, total including NLEA")?.value ?? 0) * 10) / 10,
        sodium:  Math.round(n.find(x => x.nutrientName === "Sodium, Na")?.value ?? 0),
        source:  "usda",
      };
    }).filter(Boolean);
  } catch { return []; }
}

// ── Open Food Facts — Indian queries ────────────────────────────────────────
// Uses in.openfoodfacts.org (India-specific instance) which has better
// coverage of Indian products. No country filter — cast wide net.

const OFF_QUERIES = [
  // Major snack brands — specific product lines
  "Haldiram aloo bhujia", "Haldiram bhujia", "Haldiram namkeen",
  "Haldiram mixture", "Haldiram sev", "Haldiram moong dal",
  "Haldiram chana dal", "Haldiram mathri", "Haldiram raj kachori",
  "Bikaji bhujia", "Bikaji namkeen", "Bikaji aloo bhujia",
  "Bikaji chana dal", "Bikaji mixture",
  // Dairy
  "Amul butter", "Amul cheese", "Amul ghee", "Amul milk", "Amul curd",
  "Amul paneer", "Amul ice cream", "Amul lassi",
  "Nanak ghee", "Nandini ghee", "Nandini milk", "Nandini curd",
  "Mother Dairy milk", "Mother Dairy curd", "Mother Dairy ice cream",
  "Verka butter", "Verka ghee",
  // Biscuits & bakery
  "Parle-G biscuit", "Parle Monaco", "Parle Hide Seek",
  "Britannia Good Day", "Britannia Marie Gold", "Britannia NutriChoice",
  "Britannia Bourbon", "Sunfeast Dark Fantasy", "Sunfeast Marie",
  "McVities Digestive",
  // Instant foods
  "Maggi 2 minute noodles", "Maggi masala noodles", "Maggi oats noodles",
  "Yippee noodles", "Top Ramen", "Knorr soup",
  "MTR ready to eat", "Gits ready to eat", "Kohinoor biryani",
  // Chips & fried snacks
  "Lay's India", "Lay's Classic India", "Kurkure masala munch",
  "Kurkure natkhat nimbu", "Uncle Chipps", "Bingo chips",
  "Pringles India", "Doritos India",
  // Health & breakfast
  "Saffola oats", "Quaker oats India", "Kellogg's corn flakes India",
  "Kellogg's chocos", "Muesli India", "Bagrry's oats",
  "Yoga Bar", "RiteBite", "Slurrp Farm",
  // Spices & condiments (branded)
  "MDH chana masala", "MDH garam masala", "Everest chana masala",
  "Everest kitchen king", "Catch pepper",
  "Kissan jam", "Kissan ketchup", "Maggi ketchup",
  // Beverages
  "Bournvita", "Horlicks", "Complan", "Milo India",
  "Frooti", "Maaza mango", "Slice mango", "Real fruit juice",
  "Tropicana India", "Paper Boat",
  // Ready meals & pastes
  "Aashirvaad atta", "Pillsbury atta", "Nature Fresh atta",
  "Fortune sunflower oil", "Saffola gold oil",
  "Dabur honey", "Patanjali honey", "Apis honey",
];

function normalizeOFF(product) {
  const cal = product.nutriments?.["energy-kcal_100g"]
           ?? product.nutriments?.["energy-kcal"]
           ?? (product.nutriments?.energy_100g / 4.184);
  if (!cal || cal < 1) return null;

  const name = (product.product_name || product.product_name_en || "").trim();
  if (!name || name.length < 2) return null;

  const brand  = product.brands?.split(",")[0]?.trim();
  const fullName = brand && !name.toLowerCase().includes(brand.toLowerCase())
    ? `${brand} – ${name}`
    : name;

  const serving = product.serving_size || "100g";
  const gramsPerServing = parseFloat(product.serving_quantity) || 100;

  return {
    id:             "off_" + (product.id || product.code),
    name:            fullName,
    serving,
    gramsPerServing,
    cal:     Math.round(cal * gramsPerServing / 100),
    protein: Math.round((product.nutriments?.proteins_100g ?? 0) * gramsPerServing / 100 * 10) / 10,
    carbs:   Math.round((product.nutriments?.carbohydrates_100g ?? 0) * gramsPerServing / 100 * 10) / 10,
    fat:     Math.round((product.nutriments?.fat_100g ?? 0) * gramsPerServing / 100 * 10) / 10,
    fiber:   Math.round((product.nutriments?.fiber_100g ?? 0) * gramsPerServing / 100 * 10) / 10,
    sugar:   Math.round((product.nutriments?.sugars_100g ?? 0) * gramsPerServing / 100 * 10) / 10,
    sodium:  Math.round((product.nutriments?.sodium_100g ?? 0) * gramsPerServing / 100 * 1000),
    source:  "off",
  };
}

async function fetchOFF(query) {
  const params = new URLSearchParams({
    search_terms: query,
    json:         "1",
    page_size:    "50",
    fields:       "id,code,product_name,product_name_en,brands,serving_size,serving_quantity,nutriments",
    // No country filter — cast wide net so products not tagged "India" still appear
  });

  try {
    // in.openfoodfacts.org is the India-specific instance with better local coverage
    const res = await fetch(`https://in.openfoodfacts.org/cgi/search.pl?${params}`, {
      headers: { "User-Agent": "VitalityCalorieTracker/1.0 (food-database-builder)" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products ?? []).map(normalizeOFF).filter(Boolean);
  } catch {
    return [];
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const seen  = new Set();
  const foods = [];

  function addFoods(newFoods) {
    let added = 0;
    for (const f of newFoods) {
      if (!seen.has(f.id)) { seen.add(f.id); foods.push(f); added++; }
    }
    return added;
  }

  console.log(`USDA key: ${API_KEY === "DEMO_KEY" ? "DEMO_KEY (very slow — get a free key!)" : "custom ✓"}`);

  // ── 1. USDA SR Legacy (generic, ~8600 foods) ──────────────────────────────
  console.log("\n[1/3] USDA SR Legacy (~8,600 foods, paginated)…");
  const srFoods = await fetchAllUSDA("SR Legacy");
  const srAdded = addFoods(srFoods);
  console.log(`      → ${srAdded} foods added (total: ${foods.length})`);

  // ── 2. USDA Foundation (~1,200 foods) ─────────────────────────────────────
  console.log("\n[2/3] USDA Foundation Foods (~1,200 foods)…");
  const foundFoods = await fetchAllUSDA("Foundation");
  const foundAdded = addFoods(foundFoods);
  console.log(`      → ${foundAdded} new foods added (total: ${foods.length})`);

  // ── 3. USDA Branded — Indian brands sold globally ─────────────────────────
  console.log(`\n[3/4] USDA Branded — ${USDA_BRANDED_QUERIES.length} Indian brand queries…`);
  for (let i = 0; i < USDA_BRANDED_QUERIES.length; i++) {
    const q = USDA_BRANDED_QUERIES[i];
    process.stdout.write(`  [${i + 1}/${USDA_BRANDED_QUERIES.length}] ${q}… `);
    const results = await fetchUSDABranded(q);
    const added   = addFoods(results);
    console.log(`+${added} (total: ${foods.length})`);
    await sleep(300);
  }

  // ── 4. Open Food Facts — India instance, specific product queries ──────────
  console.log(`\n[4/4] Open Food Facts (in.openfoodfacts.org) — ${OFF_QUERIES.length} queries…`);
  for (let i = 0; i < OFF_QUERIES.length; i++) {
    const q = OFF_QUERIES[i];
    process.stdout.write(`  [${i + 1}/${OFF_QUERIES.length}] ${q}… `);
    const results = await fetchOFF(q);
    const added   = addFoods(results);
    console.log(`+${added} (total: ${foods.length})`);
    await sleep(600); // be polite to OFF
  }

  writeFileSync(OUT, JSON.stringify(foods, null, 0));
  const kb = Math.round(readFileSync(OUT).length / 1024);
  console.log(`\n✓ Done. ${foods.length} foods → public/foodDb.json (${kb} KB)`);
  console.log(`  (gzip estimate: ~${Math.round(kb * 0.13)} KB — cached after first load)`);
}

main().catch(e => { console.error(e); process.exit(1); });
