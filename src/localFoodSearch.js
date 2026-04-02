import { FOODS } from "./foodDatabase";

// All foods merged into one array once the JSON loads.
// Simple string matching — far faster than Fuse.js for food names
// and gives better results (users type what they're looking for).
let allFoods = [...FOODS]; // start with local Indian foods immediately
let jsonLoaded = false;

// Kick off the JSON load as soon as this module is imported
fetch("/foodDb.json")
  .then(r => r.json())
  .then(usdaFoods => {
    // Merge, local Indian foods first (rank higher on ties)
    const existingIds = new Set(FOODS.map(f => f.id));
    allFoods = [...FOODS, ...usdaFoods.filter(f => !existingIds.has(f.id))];
    jsonLoaded = true;
  })
  .catch(() => { jsonLoaded = true; }); // graceful fallback

export function searchLocalFoods(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);

  const tier1 = []; // name starts with query
  const tier2 = []; // name contains query as substring
  const tier3 = []; // all individual words appear in name

  for (const food of allFoods) {
    const n = food.name.toLowerCase();
    if (n.startsWith(q)) {
      tier1.push(food);
    } else if (n.includes(q)) {
      tier2.push(food);
    } else if (words.length > 1 && words.every(w => n.includes(w))) {
      tier3.push(food);
    }
  }

  return [...tier1, ...tier2, ...tier3].slice(0, 30);
}

export function isIndexReady() { return jsonLoaded; }
