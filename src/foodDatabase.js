// Indian food database — calories and macros per standard serving
export const FOODS = [
  // ── Breakfast ──
  { id: "idli", name: "Idli", serving: "2 pieces", cal: 136, protein: 4, carbs: 28, fat: 0.4 },
  { id: "dosa", name: "Dosa", serving: "1 dosa", cal: 168, protein: 4, carbs: 30, fat: 3.7 },
  { id: "masala_dosa", name: "Masala Dosa", serving: "1 dosa", cal: 230, protein: 5, carbs: 38, fat: 6 },
  { id: "upma", name: "Upma", serving: "1 cup", cal: 200, protein: 5, carbs: 33, fat: 5 },
  { id: "poha", name: "Poha", serving: "1 cup", cal: 180, protein: 4, carbs: 35, fat: 3 },
  { id: "paratha", name: "Paratha", serving: "1 paratha", cal: 260, protein: 5, carbs: 36, fat: 10 },
  { id: "aloo_paratha", name: "Aloo Paratha", serving: "1 paratha", cal: 310, protein: 6, carbs: 48, fat: 10 },
  { id: "stuffed_paratha", name: "Stuffed Paratha", serving: "1 paratha", cal: 290, protein: 7, carbs: 42, fat: 10 },
  { id: "puri", name: "Puri", serving: "2 puris", cal: 260, protein: 4, carbs: 32, fat: 13 },
  { id: "besan_chilla", name: "Besan Chilla", serving: "1 chilla", cal: 120, protein: 6, carbs: 16, fat: 3 },
  { id: "oats_porridge", name: "Oats Porridge", serving: "1 bowl", cal: 150, protein: 5, carbs: 27, fat: 3 },
  { id: "bread", name: "Bread", serving: "2 slices", cal: 130, protein: 4, carbs: 25, fat: 1.5 },
  { id: "bread_butter", name: "Bread with Butter", serving: "2 slices", cal: 210, protein: 4, carbs: 25, fat: 10 },
  { id: "roti", name: "Roti / Chapati", serving: "1 roti", cal: 104, protein: 3, carbs: 20, fat: 1.5 },
  { id: "thepla", name: "Thepla", serving: "1 thepla", cal: 150, protein: 4, carbs: 22, fat: 5 },

  // ── Rice dishes ──
  { id: "steamed_rice", name: "Steamed Rice", serving: "1 cup cooked", cal: 206, protein: 4, carbs: 45, fat: 0.4 },
  { id: "jeera_rice", name: "Jeera Rice", serving: "1 cup", cal: 250, protein: 4, carbs: 47, fat: 5 },
  { id: "biryani_chicken", name: "Chicken Biryani", serving: "1 plate", cal: 490, protein: 28, carbs: 55, fat: 16 },
  { id: "biryani_veg", name: "Veg Biryani", serving: "1 plate", cal: 350, protein: 8, carbs: 60, fat: 8 },
  { id: "biryani_mutton", name: "Mutton Biryani", serving: "1 plate", cal: 530, protein: 30, carbs: 55, fat: 20 },
  { id: "pulao", name: "Veg Pulao", serving: "1 cup", cal: 220, protein: 5, carbs: 40, fat: 5 },
  { id: "curd_rice", name: "Curd Rice", serving: "1 cup", cal: 180, protein: 6, carbs: 30, fat: 4 },
  { id: "lemon_rice", name: "Lemon Rice", serving: "1 cup", cal: 230, protein: 4, carbs: 44, fat: 5 },
  { id: "fried_rice", name: "Veg Fried Rice", serving: "1 cup", cal: 260, protein: 6, carbs: 44, fat: 7 },
  { id: "khichdi", name: "Khichdi", serving: "1 cup", cal: 190, protein: 8, carbs: 32, fat: 4 },

  // ── Curries & Gravies ──
  { id: "dal_tadka", name: "Dal Tadka", serving: "1 bowl", cal: 180, protein: 10, carbs: 25, fat: 5 },
  { id: "dal_makhani", name: "Dal Makhani", serving: "1 bowl", cal: 280, protein: 12, carbs: 30, fat: 12 },
  { id: "rajma", name: "Rajma", serving: "1 bowl", cal: 220, protein: 12, carbs: 35, fat: 4 },
  { id: "chole", name: "Chole / Chana Masala", serving: "1 bowl", cal: 240, protein: 12, carbs: 36, fat: 7 },
  { id: "palak_paneer", name: "Palak Paneer", serving: "1 bowl", cal: 310, protein: 14, carbs: 12, fat: 22 },
  { id: "paneer_butter_masala", name: "Paneer Butter Masala", serving: "1 bowl", cal: 380, protein: 15, carbs: 18, fat: 28 },
  { id: "shahi_paneer", name: "Shahi Paneer", serving: "1 bowl", cal: 350, protein: 14, carbs: 16, fat: 26 },
  { id: "aloo_matar", name: "Aloo Matar", serving: "1 bowl", cal: 200, protein: 6, carbs: 30, fat: 7 },
  { id: "aloo_gobi", name: "Aloo Gobi", serving: "1 bowl", cal: 180, protein: 4, carbs: 26, fat: 7 },
  { id: "matar_paneer", name: "Matar Paneer", serving: "1 bowl", cal: 280, protein: 13, carbs: 20, fat: 18 },
  { id: "baingan_bharta", name: "Baingan Bharta", serving: "1 bowl", cal: 130, protein: 3, carbs: 14, fat: 7 },
  { id: "bhindi_masala", name: "Bhindi Masala", serving: "1 bowl", cal: 150, protein: 3, carbs: 16, fat: 8 },
  { id: "sambar", name: "Sambar", serving: "1 bowl", cal: 100, protein: 5, carbs: 16, fat: 2 },
  { id: "rasam", name: "Rasam", serving: "1 bowl", cal: 60, protein: 2, carbs: 10, fat: 1 },
  { id: "kadhi", name: "Kadhi", serving: "1 bowl", cal: 140, protein: 5, carbs: 16, fat: 6 },
  { id: "mix_veg", name: "Mix Veg Curry", serving: "1 bowl", cal: 170, protein: 5, carbs: 22, fat: 7 },

  // ── Chicken & Meat ──
  { id: "chicken_curry", name: "Chicken Curry", serving: "1 bowl", cal: 300, protein: 28, carbs: 8, fat: 16 },
  { id: "butter_chicken", name: "Butter Chicken", serving: "1 bowl", cal: 370, protein: 28, carbs: 14, fat: 22 },
  { id: "chicken_tikka", name: "Chicken Tikka", serving: "6 pieces", cal: 250, protein: 30, carbs: 5, fat: 12 },
  { id: "tandoori_chicken", name: "Tandoori Chicken", serving: "2 pieces", cal: 280, protein: 32, carbs: 6, fat: 14 },
  { id: "chicken_65", name: "Chicken 65", serving: "6 pieces", cal: 290, protein: 24, carbs: 12, fat: 16 },
  { id: "mutton_curry", name: "Mutton Curry", serving: "1 bowl", cal: 380, protein: 30, carbs: 6, fat: 26 },
  { id: "keema", name: "Keema", serving: "1 bowl", cal: 350, protein: 28, carbs: 8, fat: 22 },
  { id: "fish_curry", name: "Fish Curry", serving: "1 bowl", cal: 230, protein: 24, carbs: 8, fat: 11 },
  { id: "egg_curry", name: "Egg Curry", serving: "2 eggs + gravy", cal: 240, protein: 14, carbs: 10, fat: 16 },
  { id: "omelette", name: "Omelette", serving: "2 eggs", cal: 190, protein: 13, carbs: 2, fat: 14 },
  { id: "boiled_egg", name: "Boiled Egg", serving: "1 egg", cal: 78, protein: 6, carbs: 0.6, fat: 5 },

  // ── Snacks & Street food ──
  { id: "samosa", name: "Samosa", serving: "1 piece", cal: 130, protein: 2, carbs: 16, fat: 6 },
  { id: "vada_pav", name: "Vada Pav", serving: "1 piece", cal: 290, protein: 6, carbs: 44, fat: 10 },
  { id: "pav_bhaji", name: "Pav Bhaji", serving: "2 pav + bhaji", cal: 380, protein: 10, carbs: 58, fat: 12 },
  { id: "pani_puri", name: "Pani Puri", serving: "6 pieces", cal: 120, protein: 2, carbs: 22, fat: 3 },
  { id: "bhel_puri", name: "Bhel Puri", serving: "1 plate", cal: 180, protein: 4, carbs: 32, fat: 4 },
  { id: "sev_puri", name: "Sev Puri", serving: "1 plate", cal: 200, protein: 4, carbs: 30, fat: 7 },
  { id: "aloo_tikki", name: "Aloo Tikki", serving: "2 pieces", cal: 220, protein: 4, carbs: 32, fat: 8 },
  { id: "pakora", name: "Pakora / Bhajia", serving: "4 pieces", cal: 200, protein: 5, carbs: 22, fat: 10 },
  { id: "dhokla", name: "Dhokla", serving: "3 pieces", cal: 120, protein: 5, carbs: 20, fat: 2 },
  { id: "kachori", name: "Kachori", serving: "1 piece", cal: 180, protein: 4, carbs: 22, fat: 8 },
  { id: "medu_vada", name: "Medu Vada", serving: "2 pieces", cal: 180, protein: 6, carbs: 22, fat: 8 },
  { id: "egg_roll", name: "Egg Roll", serving: "1 roll", cal: 300, protein: 12, carbs: 36, fat: 12 },

  // ── Drinks & Beverages ──
  { id: "chai", name: "Chai (Milk Tea)", serving: "1 cup", cal: 60, protein: 2, carbs: 8, fat: 2 },
  { id: "black_tea", name: "Black Tea", serving: "1 cup", cal: 5, protein: 0, carbs: 1, fat: 0 },
  { id: "coffee", name: "Coffee with milk", serving: "1 cup", cal: 55, protein: 2, carbs: 7, fat: 2 },
  { id: "black_coffee", name: "Black Coffee", serving: "1 cup", cal: 5, protein: 0, carbs: 1, fat: 0 },
  { id: "lassi", name: "Lassi (Sweet)", serving: "1 glass", cal: 180, protein: 6, carbs: 28, fat: 5 },
  { id: "lassi_salt", name: "Lassi (Salted)", serving: "1 glass", cal: 100, protein: 6, carbs: 10, fat: 4 },
  { id: "buttermilk", name: "Buttermilk / Chaas", serving: "1 glass", cal: 50, protein: 3, carbs: 5, fat: 1 },
  { id: "mango_lassi", name: "Mango Lassi", serving: "1 glass", cal: 220, protein: 5, carbs: 38, fat: 5 },
  { id: "coconut_water", name: "Coconut Water", serving: "1 glass", cal: 46, protein: 2, carbs: 9, fat: 0.5 },
  { id: "nimbu_pani", name: "Nimbu Pani", serving: "1 glass", cal: 30, protein: 0, carbs: 8, fat: 0 },
  { id: "milk", name: "Milk (Full Fat)", serving: "1 glass", cal: 150, protein: 8, carbs: 12, fat: 8 },
  { id: "milk_skim", name: "Milk (Skimmed)", serving: "1 glass", cal: 90, protein: 8, carbs: 12, fat: 0.5 },

  // ── Dairy ──
  { id: "paneer", name: "Paneer", serving: "100g", cal: 265, protein: 18, carbs: 4, fat: 20 },
  { id: "curd", name: "Curd / Dahi", serving: "1 cup", cal: 100, protein: 6, carbs: 8, fat: 4 },
  { id: "ghee", name: "Ghee", serving: "1 tsp", cal: 45, protein: 0, carbs: 0, fat: 5 },
  { id: "butter", name: "Butter", serving: "1 tsp", cal: 35, protein: 0, carbs: 0, fat: 4 },

  // ── Sweets & Desserts ──
  { id: "gulab_jamun", name: "Gulab Jamun", serving: "2 pieces", cal: 250, protein: 4, carbs: 40, fat: 8 },
  { id: "jalebi", name: "Jalebi", serving: "3 pieces", cal: 220, protein: 2, carbs: 45, fat: 4 },
  { id: "kheer", name: "Kheer", serving: "1 bowl", cal: 250, protein: 6, carbs: 40, fat: 7 },
  { id: "halwa", name: "Sooji Halwa", serving: "1 bowl", cal: 320, protein: 4, carbs: 50, fat: 12 },
  { id: "ladoo", name: "Besan Ladoo", serving: "1 piece", cal: 170, protein: 4, carbs: 22, fat: 8 },
  { id: "barfi", name: "Barfi", serving: "1 piece", cal: 150, protein: 3, carbs: 22, fat: 6 },
  { id: "rasgulla", name: "Rasgulla", serving: "2 pieces", cal: 150, protein: 4, carbs: 28, fat: 2 },

  // ── Fruits ──
  { id: "banana", name: "Banana", serving: "1 medium", cal: 89, protein: 1, carbs: 23, fat: 0.3 },
  { id: "apple", name: "Apple", serving: "1 medium", cal: 72, protein: 0.4, carbs: 19, fat: 0.2 },
  { id: "mango", name: "Mango", serving: "1 cup sliced", cal: 99, protein: 1.4, carbs: 25, fat: 0.6 },
  { id: "orange", name: "Orange", serving: "1 medium", cal: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { id: "grapes", name: "Grapes", serving: "1 cup", cal: 104, protein: 1, carbs: 27, fat: 0.2 },
  { id: "watermelon", name: "Watermelon", serving: "2 cups", cal: 85, protein: 1.7, carbs: 21, fat: 0.4 },
  { id: "papaya", name: "Papaya", serving: "1 cup", cal: 55, protein: 0.9, carbs: 14, fat: 0.2 },
  { id: "guava", name: "Guava", serving: "1 medium", cal: 68, protein: 2.6, carbs: 14, fat: 1 },

  // ── Salads & Sides ──
  { id: "raita", name: "Raita", serving: "1 bowl", cal: 70, protein: 3, carbs: 7, fat: 3 },
  { id: "papad", name: "Papad (roasted)", serving: "1 piece", cal: 35, protein: 2, carbs: 6, fat: 0.5 },
  { id: "pickle", name: "Pickle / Achar", serving: "1 tsp", cal: 20, protein: 0, carbs: 2, fat: 1.5 },
  { id: "chutney", name: "Chutney (coconut/mint)", serving: "2 tbsp", cal: 30, protein: 1, carbs: 4, fat: 1 },

  // ── Fast food / common extras ──
  { id: "maggi", name: "Maggi Noodles", serving: "1 packet", cal: 310, protein: 7, carbs: 44, fat: 12 },
  { id: "pizza_slice", name: "Pizza Slice", serving: "1 slice", cal: 280, protein: 12, carbs: 34, fat: 10 },
  { id: "burger", name: "Veg Burger", serving: "1 burger", cal: 310, protein: 8, carbs: 44, fat: 11 },
  { id: "burger_chicken", name: "Chicken Burger", serving: "1 burger", cal: 380, protein: 22, carbs: 40, fat: 14 },
];

// Aliases for fuzzy voice matching
export const ALIASES = {
  "chapati": "roti",
  "phulka": "roti",
  "rice": "steamed_rice",
  "plain rice": "steamed_rice",
  "white rice": "steamed_rice",
  "dal": "dal_tadka",
  "lentils": "dal_tadka",
  "chana": "chole",
  "chickpeas": "chole",
  "kidney beans": "rajma",
  "tea": "chai",
  "milk tea": "chai",
  "coffee": "coffee",
  "egg": "boiled_egg",
  "eggs": "boiled_egg",
  "dahi": "curd",
  "yogurt": "curd",
  "yoghurt": "curd",
  "paneer tikka": "chicken_tikka",
  "noodles": "maggi",
  "instant noodles": "maggi",
  "lemon water": "nimbu_pani",
  "nimbu water": "nimbu_pani",
};

export function searchFood(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();

  // Check alias first
  const aliasId = ALIASES[q];
  if (aliasId) {
    const food = FOODS.find(f => f.id === aliasId);
    if (food) return [food];
  }

  // Score-based matching
  return FOODS
    .map(f => {
      const name = f.name.toLowerCase();
      if (name === q) return { food: f, score: 100 };
      if (name.startsWith(q)) return { food: f, score: 80 };
      if (name.includes(q)) return { food: f, score: 60 };
      const words = q.split(" ");
      const matched = words.filter(w => w.length > 2 && name.includes(w)).length;
      if (matched > 0) return { food: f, score: matched * 20 };
      return { food: f, score: 0 };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.food);
}

export function getMealTypeByTime() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 19) return "snack";
  return "dinner";
}

export function parseMealTypeFromText(text) {
  const t = text.toLowerCase();
  if (t.includes("breakfast") || t.includes("morning")) return "breakfast";
  if (t.includes("lunch") || t.includes("afternoon")) return "lunch";
  if (t.includes("dinner") || t.includes("supper") || t.includes("night")) return "dinner";
  if (t.includes("snack") || t.includes("evening")) return "snack";
  return null;
}

export function parseQuantityFromText(text) {
  const t = text.toLowerCase();
  if (t.includes("half") || t.includes("0.5")) return 0.5;
  if (t.includes("two") || t.match(/\b2\b/)) return 2;
  if (t.includes("three") || t.match(/\b3\b/)) return 3;
  if (t.includes("four") || t.match(/\b4\b/)) return 4;
  return 1;
}
