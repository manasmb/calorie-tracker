import Fuse from "fuse.js";
import { FOODS } from "./foodDatabase";

const FUSE_OPTS = {
  keys: [{ name: "name", weight: 1 }],
  threshold: 0.35,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
};

// Fuse instance over the bundled DB + local Indian foods.
// Built once on first search, reused forever.
let fuse = null;
let loadPromise = null;

async function getFuse() {
  if (fuse) return fuse;
  if (loadPromise) return loadPromise;

  loadPromise = fetch("/foodDb.json")
    .then(r => r.json())
    .then(usdaFoods => {
      // Local Indian foods first so they rank higher on ties
      fuse = new Fuse([...FOODS, ...usdaFoods], FUSE_OPTS);
      return fuse;
    })
    .catch(() => {
      // If file not yet generated, fall back to local foods only
      fuse = new Fuse(FOODS, FUSE_OPTS);
      return fuse;
    });

  return loadPromise;
}

// Warm up the index as soon as this module is imported
getFuse();

export async function searchLocalFoods(query) {
  if (!query || query.length < 2) return [];
  const f = await getFuse();
  return f.search(query).map(r => r.item);
}
