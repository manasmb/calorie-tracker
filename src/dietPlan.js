import { FOODS } from "./foodDatabase";

const FOOD_MAP = Object.fromEntries(FOODS.map(f => [f.id, f]));

// In the Indian context eggs are typically considered non-veg
export const NON_VEG_IDS = new Set([
  "boiled_egg", "omelette", "egg_bhurji", "egg_curry", "anda_paratha",
  "biryani_egg", "biryani_chicken", "biryani_mutton", "biryani_prawn",
  "chicken_curry", "butter_chicken", "kadai_chicken", "chicken_masala",
  "chicken_do_pyaza", "achari_chicken", "methi_chicken", "chicken_korma",
  "chettinad_chicken", "chicken_tikka", "tandoori_chicken", "chicken_65",
  "seekh_kebab", "galouti_kebab", "shammi_kebab", "reshmi_kebab",
  "chicken_roll", "chicken_shawarma", "chicken_fried_rice",
  "mutton_curry", "rogan_josh", "keema", "laal_maas", "nihari",
  "haleem", "paya", "keema_matar",
  "fish_curry", "kerala_fish_curry", "goan_fish_curry", "fish_fry",
  "prawn_curry", "prawn_masala", "machher_jhol", "shorshe_ilish",
  "crab_curry", "raw_chicken", "raw_mutton", "raw_fish", "raw_prawn",
  "momos_chicken", "egg_roll",
]);

// ── Meal structures ───────────────────────────────────────────────────────────
// Each slot: { weight: share-of-meal-calories, options: [foodId,...] }
// Options ordered: weight-loss-friendly → maintenance → gain

const BREAKFAST_STRUCTURE = [
  {
    weight: 0.55,
    options: [
      "oats_porridge", "besan_chilla", "moong_chilla", "poha", "upma",
      "idli", "uttapam", "pesarattu", "dosa", "aloo_paratha", "paratha",
      "pongal", "bread_butter",
    ],
  },
  {
    weight: 0.30,
    options: ["boiled_egg", "omelette", "curd", "paneer", "moong_dal"],
  },
  {
    weight: 0.15,
    options: [
      "green_tea", "black_coffee", "chai", "milk", "filter_coffee", "golden_milk",
    ],
  },
];

const LUNCH_STRUCTURE = [
  {
    weight: 0.30,
    options: [
      "roti", "steamed_rice", "khichdi", "jeera_rice", "bisibelebath",
    ],
  },
  {
    weight: 0.35,
    options: [
      "dal_tadka", "moong_dal", "masoor_dal", "dal_makhani", "rajma", "chole",
      "palak_paneer", "paneer_butter_masala", "egg_curry", "chicken_curry",
      "butter_chicken", "fish_curry", "kerala_fish_curry", "mutton_curry",
      "prawn_curry",
    ],
  },
  {
    weight: 0.25,
    options: [
      "mix_veg", "aloo_gobi", "bhindi_masala", "aloo_matar", "baingan_bharta",
      "saag", "sarson_ka_saag", "sambar", "rasam", "kadhi",
    ],
  },
  {
    weight: 0.10,
    options: [
      "raita", "boondi_raita", "kachumber", "curd", "onion_salad", "papad",
    ],
  },
];

const SNACK_STRUCTURE = [
  {
    weight: 0.55,
    options: [
      "apple", "banana", "orange", "guava", "pomegranate",
      "grapes", "watermelon", "mango",
    ],
  },
  {
    weight: 0.45,
    options: [
      "buttermilk", "coconut_water", "green_tea", "lassi", "chai",
      "almonds", "cashews", "peanuts", "masala_peanuts", "dhokla",
    ],
  },
];

const DINNER_STRUCTURE = [
  {
    weight: 0.30,
    options: ["roti", "khichdi", "steamed_rice", "jeera_rice"],
  },
  {
    weight: 0.40,
    options: [
      "dal_tadka", "palak_paneer", "egg_curry", "chicken_curry", "moong_dal",
      "masoor_dal", "fish_curry", "dal_makhani", "tandoori_chicken", "keema",
      "rogan_josh",
    ],
  },
  {
    weight: 0.30,
    options: [
      "mix_veg", "aloo_gobi", "bhindi_masala", "saag", "baingan_bharta",
      "raita", "curd", "kachumber",
    ],
  },
];

const MEAL_DEFS = [
  { meal: "breakfast", label: "Breakfast",  icon: "wb_sunny",    calShare: 0.25, structure: BREAKFAST_STRUCTURE },
  { meal: "lunch",     label: "Lunch",      icon: "restaurant",  calShare: 0.35, structure: LUNCH_STRUCTURE     },
  { meal: "snack",     label: "Snack",      icon: "nutrition",   calShare: 0.10, structure: SNACK_STRUCTURE     },
  { meal: "dinner",    label: "Dinner",     icon: "nights_stay", calShare: 0.30, structure: DINNER_STRUCTURE    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function goalType(goals) {
  const cw = parseFloat(goals.currentWeight);
  const tw = parseFloat(goals.targetWeight);
  if (!cw || !tw || cw === tw) return "maintenance";
  return cw > tw ? "loss" : "gain";
}

function pickFood(seed, slotIndex, options, dislikedIds, type, vegOnly) {
  const len = options.length;
  let offset = 0;
  if (type === "maintenance") offset = Math.floor(len * 0.3);
  else if (type === "gain")    offset = Math.floor(len * 0.6);

  // Filter to known + non-disliked + (optionally) veg-only
  const available = options.filter(id =>
    FOOD_MAP[id] &&
    !dislikedIds.has(id) &&
    (!vegOnly || !NON_VEG_IDS.has(id))
  );
  if (available.length === 0) {
    // fallback: ignore dislikes but still respect vegOnly
    const fallback = options.find(id => FOOD_MAP[id] && (!vegOnly || !NON_VEG_IDS.has(id)));
    return fallback ? FOOD_MAP[fallback] : null;
  }

  // Map offset into available list proportionally
  const idx = Math.abs((seed * 31 + slotIndex * 17 + offset) % available.length);
  return FOOD_MAP[available[idx]] ?? null;
}

function calcServings(targetCal, food) {
  if (!food || food.cal <= 0) return 1;
  const raw = targetCal / food.cal;
  return Math.max(0.5, Math.min(3, Math.round(raw * 2) / 2));
}

function round1(n) { return Math.round(n * 10) / 10; }

// ── Main export ───────────────────────────────────────────────────────────────

export function generateMealPlan(goals, _profile, dislikedIds, seed, vegOnly = false) {
  const totalCal = goals?.calories ?? 2000;
  const type = goalType(goals ?? {});

  return MEAL_DEFS.map((def, mealIdx) => {
    const targetCal = Math.round(totalCal * def.calShare);
    const items = [];

    def.structure.forEach((slot, slotIdx) => {
      const food = pickFood(
        seed + mealIdx * 100,
        slotIdx,
        slot.options,
        dislikedIds,
        type,
        vegOnly,
      );
      if (!food) return;

      const slotCal  = targetCal * slot.weight;
      const servings = calcServings(slotCal, food);

      items.push({
        food,
        servings,
        cal:     round1(servings * food.cal),
        protein: round1(servings * food.protein),
        carbs:   round1(servings * food.carbs),
        fat:     round1(servings * food.fat),
      });
    });

    return {
      meal:      def.meal,
      label:     def.label,
      icon:      def.icon,
      targetCal,
      items,
    };
  });
}
