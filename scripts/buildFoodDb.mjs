/**
 * One-time script: fetches common foods from USDA FoodData Central
 * and writes public/foodDb.json for local Fuse.js search.
 *
 * Usage:
 *   node scripts/buildFoodDb.mjs
 *   node scripts/buildFoodDb.mjs YOUR_USDA_API_KEY
 *
 * Get a free key (3600 req/hr) at https://fdc.nal.usda.gov/api-guide.html
 */

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local if present
try {
  const env = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../.env.local"), "utf8");
  for (const line of env.split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim();
  }
} catch { /* no .env.local, that's fine */ }

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT   = join(__dir, "../public/foodDb.json");

const API_KEY = process.argv[2] || process.env.VITE_USDA_API_KEY || "DEMO_KEY";
const BASE    = "https://api.nal.usda.gov/fdc/v1/foods/search";
const PAGE    = 25;

// Generic categories (SR Legacy + Foundation — no brand name)
const GENERIC_QUERIES = [
  // Proteins
  "chicken breast", "chicken thigh", "ground beef", "beef steak",
  "pork chop", "bacon", "salmon", "tuna", "shrimp", "egg",
  "tofu", "paneer", "turkey",
  // Grains & bread
  "white rice", "brown rice", "basmati rice", "oats", "bread",
  "whole wheat bread", "pasta", "noodles", "corn", "quinoa",
  // Dairy
  "milk", "yogurt", "curd", "cheese", "butter", "ghee", "cream",
  "cottage cheese", "whey protein",
  // Fruits
  "apple", "banana", "mango", "orange", "grapes", "watermelon",
  "strawberry", "pineapple", "papaya", "guava",
  // Vegetables
  "broccoli", "spinach", "carrot", "tomato", "potato", "onion",
  "cauliflower", "cabbage", "peas", "corn", "mushroom", "cucumber",
  "capsicum", "green beans", "sweet potato",
  // Legumes
  "lentils", "chickpeas", "kidney beans", "black beans", "moong dal",
  "chana dal", "toor dal",
  // Nuts & fats
  "almonds", "peanuts", "cashews", "walnuts", "peanut butter",
  "olive oil", "coconut oil",
  // Snacks & beverages
  "chocolate", "biscuit", "chips", "orange juice", "coffee", "tea",
  // Common meals
  "pizza", "burger", "sandwich", "soup", "salad",
];

// Branded queries — searched against the Branded dataType
const BRANDED_QUERIES = [
  // Indian dairy brands
  "Nanak", "Nandini", "Amul", "Mother Dairy", "Britannia", "Nestle",
  "Verka", "Parag", "Gowardhan", "Mahananda",
  // Indian snack / staple brands
  "Haldirams", "Bikaji", "Parle", "Sunfeast", "Maggi", "Patanjali",
  "MDH", "Everest", "Catch", "Tata", "Aashirvaad", "Fortune",
  "Saffola", "Dabur", "Kissan",
  // International brands common in India
  "Kellogs", "Quaker", "Tropicana", "Lay's", "Kurkure",
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getNutrient(nutrients, name) {
  return nutrients?.find(n => n.nutrientName === name)?.value ?? 0;
}

function normalize(food) {
  const n = food.foodNutrients ?? [];
  const cal = getNutrient(n, "Energy");
  if (!cal) return null;

  const nameParts = [food.brandOwner, food.description].filter(s => s?.trim());
  const name = nameParts.join(" – ").trim();
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

async function fetchQuery(query, dataType) {
  const params = new URLSearchParams({
    query,
    api_key:  API_KEY,
    pageSize: PAGE,
    dataType,
  });
  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) {
    console.warn(`  [skip] ${query} → HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  return (data.foods ?? []).map(normalize).filter(Boolean);
}

async function runBatch(label, queries, dataType, seen, foods) {
  console.log(`\n── ${label} ──`);
  const delay = API_KEY === "DEMO_KEY" ? 1500 : 250;
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    process.stdout.write(`[${i + 1}/${queries.length}] ${q}… `);
    try {
      const results = await fetchQuery(q, dataType);
      let added = 0;
      for (const f of results) {
        if (!seen.has(f.id)) {
          seen.add(f.id);
          foods.push(f);
          added++;
        }
      }
      console.log(`+${added} (total: ${foods.length})`);
    } catch (e) {
      console.log(`error: ${e.message}`);
    }
    await sleep(delay);
  }
}

async function main() {
  console.log(`Building food DB with key: ${API_KEY === "DEMO_KEY" ? "DEMO_KEY (slow, ~25 req/hr)" : "custom key"}`);

  const seen  = new Set();
  const foods = [];

  await runBatch("Generic foods (SR Legacy + Foundation)", GENERIC_QUERIES, "SR Legacy,Foundation", seen, foods);
  await runBatch("Branded foods", BRANDED_QUERIES, "Branded", seen, foods);

  writeFileSync(OUT, JSON.stringify(foods, null, 0));
  console.log(`\nDone. Wrote ${foods.length} foods to public/foodDb.json`);
}

main().catch(console.error);
