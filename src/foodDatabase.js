// Indian food database
// Macros per standard serving. gramsPerServing = weight of that serving in grams (or ml for liquids).
// All gram-based input is calculated proportionally: value = (macroPerServing / gramsPerServing) * inputGrams

export const FOODS = [
  // ── Breakfast ──
  { id:"idli",            name:"Idli",                serving:"2 pieces",      gramsPerServing:130,  cal:136, protein:4,   carbs:28,  fat:0.4, fiber:1.2, sugar:0.5, sodium:280  },
  { id:"dosa",            name:"Dosa",                serving:"1 dosa",        gramsPerServing:150,  cal:168, protein:4,   carbs:30,  fat:3.7, fiber:1.5, sugar:0.5, sodium:320  },
  { id:"masala_dosa",     name:"Masala Dosa",         serving:"1 dosa",        gramsPerServing:220,  cal:230, protein:5,   carbs:38,  fat:6,   fiber:2.5, sugar:1,   sodium:450  },
  { id:"upma",            name:"Upma",                serving:"1 cup",         gramsPerServing:180,  cal:200, protein:5,   carbs:33,  fat:5,   fiber:2,   sugar:2,   sodium:380  },
  { id:"poha",            name:"Poha",                serving:"1 cup",         gramsPerServing:160,  cal:180, protein:4,   carbs:35,  fat:3,   fiber:2,   sugar:2,   sodium:260  },
  { id:"paratha",         name:"Paratha",             serving:"1 paratha",     gramsPerServing:100,  cal:260, protein:5,   carbs:36,  fat:10,  fiber:2,   sugar:1,   sodium:310  },
  { id:"aloo_paratha",    name:"Aloo Paratha",        serving:"1 paratha",     gramsPerServing:140,  cal:310, protein:6,   carbs:48,  fat:10,  fiber:3,   sugar:1.5, sodium:370  },
  { id:"stuffed_paratha", name:"Stuffed Paratha",     serving:"1 paratha",     gramsPerServing:130,  cal:290, protein:7,   carbs:42,  fat:10,  fiber:3,   sugar:1.5, sodium:350  },
  { id:"puri",            name:"Puri",                serving:"2 puris",       gramsPerServing:80,   cal:260, protein:4,   carbs:32,  fat:13,  fiber:1.5, sugar:0.5, sodium:200  },
  { id:"besan_chilla",    name:"Besan Chilla",        serving:"1 chilla",      gramsPerServing:90,   cal:120, protein:6,   carbs:16,  fat:3,   fiber:2.5, sugar:1,   sodium:220  },
  { id:"oats_porridge",   name:"Oats Porridge",       serving:"1 bowl",        gramsPerServing:200,  cal:150, protein:5,   carbs:27,  fat:3,   fiber:4,   sugar:1,   sodium:80   },
  { id:"bread",           name:"Bread",               serving:"2 slices",      gramsPerServing:60,   cal:130, protein:4,   carbs:25,  fat:1.5, fiber:1.5, sugar:3,   sodium:280  },
  { id:"bread_butter",    name:"Bread with Butter",   serving:"2 slices",      gramsPerServing:70,   cal:210, protein:4,   carbs:25,  fat:10,  fiber:1.5, sugar:3,   sodium:360  },
  { id:"roti",            name:"Roti / Chapati",      serving:"1 roti",        gramsPerServing:40,   cal:104, protein:3,   carbs:20,  fat:1.5, fiber:2,   sugar:0.5, sodium:120  },
  { id:"thepla",          name:"Thepla",              serving:"1 thepla",      gramsPerServing:60,   cal:150, protein:4,   carbs:22,  fat:5,   fiber:2,   sugar:1,   sodium:200  },

  // ── Rice dishes ──
  { id:"steamed_rice",    name:"Steamed Rice",        serving:"1 cup cooked",  gramsPerServing:195,  cal:206, protein:4,   carbs:45,  fat:0.4, fiber:0.6, sugar:0,   sodium:2    },
  { id:"jeera_rice",      name:"Jeera Rice",          serving:"1 cup",         gramsPerServing:200,  cal:250, protein:4,   carbs:47,  fat:5,   fiber:0.8, sugar:0,   sodium:180  },
  { id:"biryani_chicken", name:"Chicken Biryani",     serving:"1 plate",       gramsPerServing:350,  cal:490, protein:28,  carbs:55,  fat:16,  fiber:2,   sugar:4,   sodium:820  },
  { id:"biryani_veg",     name:"Veg Biryani",         serving:"1 plate",       gramsPerServing:320,  cal:350, protein:8,   carbs:60,  fat:8,   fiber:3,   sugar:4,   sodium:680  },
  { id:"biryani_mutton",  name:"Mutton Biryani",      serving:"1 plate",       gramsPerServing:370,  cal:530, protein:30,  carbs:55,  fat:20,  fiber:2,   sugar:4,   sodium:900  },
  { id:"pulao",           name:"Veg Pulao",           serving:"1 cup",         gramsPerServing:200,  cal:220, protein:5,   carbs:40,  fat:5,   fiber:2,   sugar:2,   sodium:420  },
  { id:"curd_rice",       name:"Curd Rice",           serving:"1 cup",         gramsPerServing:220,  cal:180, protein:6,   carbs:30,  fat:4,   fiber:0.5, sugar:3,   sodium:200  },
  { id:"lemon_rice",      name:"Lemon Rice",          serving:"1 cup",         gramsPerServing:190,  cal:230, protein:4,   carbs:44,  fat:5,   fiber:1,   sugar:1,   sodium:320  },
  { id:"fried_rice",      name:"Veg Fried Rice",      serving:"1 cup",         gramsPerServing:200,  cal:260, protein:6,   carbs:44,  fat:7,   fiber:2,   sugar:3,   sodium:560  },
  { id:"khichdi",         name:"Khichdi",             serving:"1 cup",         gramsPerServing:220,  cal:190, protein:8,   carbs:32,  fat:4,   fiber:3,   sugar:1,   sodium:280  },

  // ── Curries & Gravies ──
  { id:"dal_tadka",       name:"Dal Tadka",           serving:"1 bowl",        gramsPerServing:200,  cal:180, protein:10,  carbs:25,  fat:5,   fiber:6,   sugar:2,   sodium:460  },
  { id:"dal_makhani",     name:"Dal Makhani",         serving:"1 bowl",        gramsPerServing:220,  cal:280, protein:12,  carbs:30,  fat:12,  fiber:7,   sugar:3,   sodium:580  },
  { id:"rajma",           name:"Rajma",               serving:"1 bowl",        gramsPerServing:220,  cal:220, protein:12,  carbs:35,  fat:4,   fiber:8,   sugar:2,   sodium:420  },
  { id:"chole",           name:"Chole / Chana Masala",serving:"1 bowl",        gramsPerServing:220,  cal:240, protein:12,  carbs:36,  fat:7,   fiber:9,   sugar:4,   sodium:480  },
  { id:"palak_paneer",    name:"Palak Paneer",        serving:"1 bowl",        gramsPerServing:220,  cal:310, protein:14,  carbs:12,  fat:22,  fiber:4,   sugar:3,   sodium:520  },
  { id:"paneer_butter_masala", name:"Paneer Butter Masala", serving:"1 bowl",  gramsPerServing:230,  cal:380, protein:15,  carbs:18,  fat:28,  fiber:3,   sugar:8,   sodium:680  },
  { id:"shahi_paneer",    name:"Shahi Paneer",        serving:"1 bowl",        gramsPerServing:220,  cal:350, protein:14,  carbs:16,  fat:26,  fiber:2,   sugar:6,   sodium:600  },
  { id:"aloo_matar",      name:"Aloo Matar",          serving:"1 bowl",        gramsPerServing:200,  cal:200, protein:6,   carbs:30,  fat:7,   fiber:5,   sugar:3,   sodium:380  },
  { id:"aloo_gobi",       name:"Aloo Gobi",           serving:"1 bowl",        gramsPerServing:200,  cal:180, protein:4,   carbs:26,  fat:7,   fiber:4,   sugar:3,   sodium:340  },
  { id:"matar_paneer",    name:"Matar Paneer",        serving:"1 bowl",        gramsPerServing:220,  cal:280, protein:13,  carbs:20,  fat:18,  fiber:4,   sugar:4,   sodium:480  },
  { id:"baingan_bharta",  name:"Baingan Bharta",      serving:"1 bowl",        gramsPerServing:180,  cal:130, protein:3,   carbs:14,  fat:7,   fiber:4,   sugar:5,   sodium:320  },
  { id:"bhindi_masala",   name:"Bhindi Masala",       serving:"1 bowl",        gramsPerServing:180,  cal:150, protein:3,   carbs:16,  fat:8,   fiber:5,   sugar:3,   sodium:290  },
  { id:"sambar",          name:"Sambar",              serving:"1 bowl",        gramsPerServing:200,  cal:100, protein:5,   carbs:16,  fat:2,   fiber:4,   sugar:3,   sodium:480  },
  { id:"rasam",           name:"Rasam",               serving:"1 bowl",        gramsPerServing:200,  cal:60,  protein:2,   carbs:10,  fat:1,   fiber:1,   sugar:2,   sodium:420  },
  { id:"kadhi",           name:"Kadhi",               serving:"1 bowl",        gramsPerServing:200,  cal:140, protein:5,   carbs:16,  fat:6,   fiber:1,   sugar:4,   sodium:380  },
  { id:"mix_veg",         name:"Mix Veg Curry",       serving:"1 bowl",        gramsPerServing:200,  cal:170, protein:5,   carbs:22,  fat:7,   fiber:5,   sugar:4,   sodium:360  },

  // ── Chicken & Meat ──
  { id:"chicken_curry",   name:"Chicken Curry",       serving:"1 bowl",        gramsPerServing:250,  cal:300, protein:28,  carbs:8,   fat:16,  fiber:1,   sugar:3,   sodium:620  },
  { id:"butter_chicken",  name:"Butter Chicken",      serving:"1 bowl",        gramsPerServing:250,  cal:370, protein:28,  carbs:14,  fat:22,  fiber:1,   sugar:8,   sodium:740  },
  { id:"chicken_tikka",   name:"Chicken Tikka",       serving:"6 pieces",      gramsPerServing:180,  cal:250, protein:30,  carbs:5,   fat:12,  fiber:0.5, sugar:2,   sodium:580  },
  { id:"tandoori_chicken",name:"Tandoori Chicken",    serving:"2 pieces",      gramsPerServing:200,  cal:280, protein:32,  carbs:6,   fat:14,  fiber:0.5, sugar:2,   sodium:640  },
  { id:"chicken_65",      name:"Chicken 65",          serving:"6 pieces",      gramsPerServing:180,  cal:290, protein:24,  carbs:12,  fat:16,  fiber:0.5, sugar:2,   sodium:680  },
  { id:"mutton_curry",    name:"Mutton Curry",        serving:"1 bowl",        gramsPerServing:250,  cal:380, protein:30,  carbs:6,   fat:26,  fiber:1,   sugar:3,   sodium:720  },
  { id:"keema",           name:"Keema",               serving:"1 bowl",        gramsPerServing:220,  cal:350, protein:28,  carbs:8,   fat:22,  fiber:1,   sugar:3,   sodium:680  },
  { id:"fish_curry",      name:"Fish Curry",          serving:"1 bowl",        gramsPerServing:250,  cal:230, protein:24,  carbs:8,   fat:11,  fiber:1,   sugar:3,   sodium:560  },
  { id:"egg_curry",       name:"Egg Curry",           serving:"2 eggs+gravy",  gramsPerServing:220,  cal:240, protein:14,  carbs:10,  fat:16,  fiber:1,   sugar:3,   sodium:520  },
  { id:"omelette",        name:"Omelette",            serving:"2 eggs",        gramsPerServing:100,  cal:190, protein:13,  carbs:2,   fat:14,  fiber:0,   sugar:0.5, sodium:340  },
  { id:"boiled_egg",      name:"Boiled Egg",          serving:"1 egg",         gramsPerServing:50,   cal:78,  protein:6,   carbs:0.6, fat:5,   fiber:0,   sugar:0.5, sodium:62   },

  // ── Snacks & Street food ──
  { id:"samosa",          name:"Samosa",              serving:"1 piece",       gramsPerServing:80,   cal:130, protein:2,   carbs:16,  fat:6,   fiber:1.5, sugar:1,   sodium:280  },
  { id:"vada_pav",        name:"Vada Pav",            serving:"1 piece",       gramsPerServing:130,  cal:290, protein:6,   carbs:44,  fat:10,  fiber:2,   sugar:3,   sodium:480  },
  { id:"pav_bhaji",       name:"Pav Bhaji",           serving:"2 pav+bhaji",   gramsPerServing:300,  cal:380, protein:10,  carbs:58,  fat:12,  fiber:5,   sugar:6,   sodium:760  },
  { id:"pani_puri",       name:"Pani Puri",           serving:"6 pieces",      gramsPerServing:120,  cal:120, protein:2,   carbs:22,  fat:3,   fiber:1.5, sugar:2,   sodium:340  },
  { id:"bhel_puri",       name:"Bhel Puri",           serving:"1 plate",       gramsPerServing:150,  cal:180, protein:4,   carbs:32,  fat:4,   fiber:2,   sugar:4,   sodium:420  },
  { id:"sev_puri",        name:"Sev Puri",            serving:"1 plate",       gramsPerServing:150,  cal:200, protein:4,   carbs:30,  fat:7,   fiber:2,   sugar:5,   sodium:460  },
  { id:"aloo_tikki",      name:"Aloo Tikki",          serving:"2 pieces",      gramsPerServing:150,  cal:220, protein:4,   carbs:32,  fat:8,   fiber:2.5, sugar:1,   sodium:360  },
  { id:"pakora",          name:"Pakora / Bhajia",     serving:"4 pieces",      gramsPerServing:120,  cal:200, protein:5,   carbs:22,  fat:10,  fiber:2,   sugar:1,   sodium:300  },
  { id:"dhokla",          name:"Dhokla",              serving:"3 pieces",      gramsPerServing:120,  cal:120, protein:5,   carbs:20,  fat:2,   fiber:1.5, sugar:3,   sodium:380  },
  { id:"kachori",         name:"Kachori",             serving:"1 piece",       gramsPerServing:80,   cal:180, protein:4,   carbs:22,  fat:8,   fiber:2,   sugar:1,   sodium:280  },
  { id:"medu_vada",       name:"Medu Vada",           serving:"2 pieces",      gramsPerServing:120,  cal:180, protein:6,   carbs:22,  fat:8,   fiber:2,   sugar:0.5, sodium:320  },
  { id:"egg_roll",        name:"Egg Roll",            serving:"1 roll",        gramsPerServing:180,  cal:300, protein:12,  carbs:36,  fat:12,  fiber:2,   sugar:3,   sodium:520  },

  // ── Drinks & Beverages ──
  { id:"chai",            name:"Chai (Milk Tea)",     serving:"1 cup",         gramsPerServing:150,  cal:60,  protein:2,   carbs:8,   fat:2,   fiber:0,   sugar:7,   sodium:40   },
  { id:"black_tea",       name:"Black Tea",           serving:"1 cup",         gramsPerServing:150,  cal:5,   protein:0,   carbs:1,   fat:0,   fiber:0,   sugar:0,   sodium:5    },
  { id:"coffee",          name:"Coffee with milk",    serving:"1 cup",         gramsPerServing:150,  cal:55,  protein:2,   carbs:7,   fat:2,   fiber:0,   sugar:6,   sodium:35   },
  { id:"black_coffee",    name:"Black Coffee",        serving:"1 cup",         gramsPerServing:150,  cal:5,   protein:0,   carbs:1,   fat:0,   fiber:0,   sugar:0,   sodium:5    },
  { id:"lassi",           name:"Lassi (Sweet)",       serving:"1 glass",       gramsPerServing:250,  cal:180, protein:6,   carbs:28,  fat:5,   fiber:0,   sugar:24,  sodium:80   },
  { id:"lassi_salt",      name:"Lassi (Salted)",      serving:"1 glass",       gramsPerServing:250,  cal:100, protein:6,   carbs:10,  fat:4,   fiber:0,   sugar:8,   sodium:320  },
  { id:"buttermilk",      name:"Buttermilk / Chaas",  serving:"1 glass",       gramsPerServing:250,  cal:50,  protein:3,   carbs:5,   fat:1,   fiber:0,   sugar:4,   sodium:180  },
  { id:"mango_lassi",     name:"Mango Lassi",         serving:"1 glass",       gramsPerServing:280,  cal:220, protein:5,   carbs:38,  fat:5,   fiber:1,   sugar:32,  sodium:80   },
  { id:"coconut_water",   name:"Coconut Water",       serving:"1 glass",       gramsPerServing:240,  cal:46,  protein:2,   carbs:9,   fat:0.5, fiber:0,   sugar:9,   sodium:252  },
  { id:"nimbu_pani",      name:"Nimbu Pani",          serving:"1 glass",       gramsPerServing:250,  cal:30,  protein:0,   carbs:8,   fat:0,   fiber:0,   sugar:7,   sodium:180  },
  { id:"milk",            name:"Milk (Full Fat)",     serving:"1 glass",       gramsPerServing:240,  cal:150, protein:8,   carbs:12,  fat:8,   fiber:0,   sugar:12,  sodium:105  },
  { id:"milk_skim",       name:"Milk (Skimmed)",      serving:"1 glass",       gramsPerServing:240,  cal:90,  protein:8,   carbs:12,  fat:0.5, fiber:0,   sugar:12,  sodium:105  },

  // ── Dairy ──
  { id:"paneer",          name:"Paneer",              serving:"100g",          gramsPerServing:100,  cal:265, protein:18,  carbs:4,   fat:20,  fiber:0,   sugar:2,   sodium:30   },
  { id:"curd",            name:"Curd / Dahi",         serving:"1 cup",         gramsPerServing:245,  cal:100, protein:6,   carbs:8,   fat:4,   fiber:0,   sugar:8,   sodium:80   },
  { id:"ghee",            name:"Ghee",                serving:"1 tsp",         gramsPerServing:5,    cal:45,  protein:0,   carbs:0,   fat:5,   fiber:0,   sugar:0,   sodium:0    },
  { id:"butter",          name:"Butter",              serving:"1 tsp",         gramsPerServing:5,    cal:35,  protein:0,   carbs:0,   fat:4,   fiber:0,   sugar:0,   sodium:30   },

  // ── Sweets & Desserts ──
  { id:"gulab_jamun",     name:"Gulab Jamun",         serving:"2 pieces",      gramsPerServing:120,  cal:250, protein:4,   carbs:40,  fat:8,   fiber:0.5, sugar:35,  sodium:120  },
  { id:"jalebi",          name:"Jalebi",              serving:"3 pieces",      gramsPerServing:80,   cal:220, protein:2,   carbs:45,  fat:4,   fiber:0,   sugar:38,  sodium:80   },
  { id:"kheer",           name:"Kheer",               serving:"1 bowl",        gramsPerServing:200,  cal:250, protein:6,   carbs:40,  fat:7,   fiber:0.5, sugar:30,  sodium:100  },
  { id:"halwa",           name:"Sooji Halwa",         serving:"1 bowl",        gramsPerServing:150,  cal:320, protein:4,   carbs:50,  fat:12,  fiber:1,   sugar:28,  sodium:80   },
  { id:"ladoo",           name:"Besan Ladoo",         serving:"1 piece",       gramsPerServing:50,   cal:170, protein:4,   carbs:22,  fat:8,   fiber:1,   sugar:14,  sodium:40   },
  { id:"barfi",           name:"Barfi",               serving:"1 piece",       gramsPerServing:40,   cal:150, protein:3,   carbs:22,  fat:6,   fiber:0,   sugar:18,  sodium:30   },
  { id:"rasgulla",        name:"Rasgulla",            serving:"2 pieces",      gramsPerServing:120,  cal:150, protein:4,   carbs:28,  fat:2,   fiber:0,   sugar:24,  sodium:60   },

  // ── Fruits ──
  { id:"banana",          name:"Banana",              serving:"1 medium",      gramsPerServing:118,  cal:89,  protein:1,   carbs:23,  fat:0.3, fiber:2.6, sugar:12,  sodium:1    },
  { id:"apple",           name:"Apple",               serving:"1 medium",      gramsPerServing:182,  cal:72,  protein:0.4, carbs:19,  fat:0.2, fiber:3.3, sugar:14,  sodium:1    },
  { id:"mango",           name:"Mango",               serving:"1 cup sliced",  gramsPerServing:165,  cal:99,  protein:1.4, carbs:25,  fat:0.6, fiber:2.6, sugar:22,  sodium:2    },
  { id:"orange",          name:"Orange",              serving:"1 medium",      gramsPerServing:131,  cal:62,  protein:1.2, carbs:15,  fat:0.2, fiber:3.1, sugar:12,  sodium:0    },
  { id:"grapes",          name:"Grapes",              serving:"1 cup",         gramsPerServing:151,  cal:104, protein:1,   carbs:27,  fat:0.2, fiber:1.4, sugar:23,  sodium:3    },
  { id:"watermelon",      name:"Watermelon",          serving:"2 cups",        gramsPerServing:280,  cal:85,  protein:1.7, carbs:21,  fat:0.4, fiber:1.1, sugar:17,  sodium:3    },
  { id:"papaya",          name:"Papaya",              serving:"1 cup",         gramsPerServing:145,  cal:55,  protein:0.9, carbs:14,  fat:0.2, fiber:2.5, sugar:8,   sodium:4    },
  { id:"guava",           name:"Guava",               serving:"1 medium",      gramsPerServing:100,  cal:68,  protein:2.6, carbs:14,  fat:1,   fiber:5.4, sugar:9,   sodium:2    },

  // ── Salads & Sides ──
  { id:"raita",           name:"Raita",               serving:"1 bowl",        gramsPerServing:150,  cal:70,  protein:3,   carbs:7,   fat:3,   fiber:0.5, sugar:5,   sodium:200  },
  { id:"papad",           name:"Papad (roasted)",     serving:"1 piece",       gramsPerServing:10,   cal:35,  protein:2,   carbs:6,   fat:0.5, fiber:0.5, sugar:0,   sodium:190  },
  { id:"pickle",          name:"Pickle / Achar",      serving:"1 tsp",         gramsPerServing:10,   cal:20,  protein:0,   carbs:2,   fat:1.5, fiber:0.5, sugar:0.5, sodium:380  },
  { id:"chutney",         name:"Chutney",             serving:"2 tbsp",        gramsPerServing:30,   cal:30,  protein:1,   carbs:4,   fat:1,   fiber:1,   sugar:2,   sodium:120  },

  // ── Fast food ──
  { id:"maggi",           name:"Maggi Noodles",       serving:"1 packet",      gramsPerServing:70,   cal:310, protein:7,   carbs:44,  fat:12,  fiber:1.5, sugar:2,   sodium:1040 },
  { id:"pizza_slice",     name:"Pizza Slice",         serving:"1 slice",       gramsPerServing:107,  cal:280, protein:12,  carbs:34,  fat:10,  fiber:2,   sugar:4,   sodium:640  },
  { id:"burger",          name:"Veg Burger",          serving:"1 burger",      gramsPerServing:180,  cal:310, protein:8,   carbs:44,  fat:11,  fiber:3,   sugar:6,   sodium:680  },
  { id:"burger_chicken",  name:"Chicken Burger",      serving:"1 burger",      gramsPerServing:200,  cal:380, protein:22,  carbs:40,  fat:14,  fiber:2,   sugar:6,   sodium:780  },
];

// Voice/text aliases
export const ALIASES = {
  "chapati":"roti","phulka":"roti","rice":"steamed_rice","plain rice":"steamed_rice",
  "white rice":"steamed_rice","dal":"dal_tadka","lentils":"dal_tadka","chana":"chole",
  "chickpeas":"chole","kidney beans":"rajma","tea":"chai","milk tea":"chai",
  "egg":"boiled_egg","eggs":"boiled_egg","dahi":"curd","yogurt":"curd","yoghurt":"curd",
  "noodles":"maggi","instant noodles":"maggi","lemon water":"nimbu_pani","nimbu water":"nimbu_pani",
};

export function searchFood(query, customRecipes = []) {
  if (!query) return [];
  const q = query.toLowerCase().trim();

  const aliasId = ALIASES[q];
  if (aliasId) {
    const food = FOODS.find(f => f.id === aliasId);
    if (food) return [food];
  }

  const allFoods = [...customRecipes, ...FOODS];
  return allFoods
    .map(f => {
      const name = f.name.toLowerCase();
      if (name === q) return { food: f, score: 100 };
      if (name.startsWith(q)) return { food: f, score: 80 };
      if (name.includes(q)) return { food: f, score: 60 };
      const words = q.split(" ").filter(w => w.length > 2);
      const matched = words.filter(w => name.includes(w)).length;
      if (matched > 0) return { food: f, score: matched * 20 };
      return { food: f, score: 0 };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.food);
}

// Calculate macros for a given food + input (quantity-based or gram-based)
export function calcMacros(food, { quantity = 1, grams = null }) {
  const multiplier = grams != null
    ? grams / food.gramsPerServing
    : quantity;

  return {
    cal:     Math.round(food.cal     * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs:   Math.round(food.carbs   * multiplier * 10) / 10,
    fat:     Math.round(food.fat     * multiplier * 10) / 10,
    fiber:   Math.round(food.fiber   * multiplier * 10) / 10,
    sugar:   Math.round(food.sugar   * multiplier * 10) / 10,
    sodium:  Math.round(food.sodium  * multiplier),
  };
}

export function getMealTypeByTime() {
  const h = new Date().getHours();
  if (h >= 5  && h < 11) return "breakfast";
  if (h >= 11 && h < 16) return "lunch";
  if (h >= 16 && h < 19) return "snack";
  return "dinner";
}

export function parseMealTypeFromText(text) {
  const t = text.toLowerCase();
  if (t.includes("breakfast") || t.includes("morning")) return "breakfast";
  if (t.includes("lunch")     || t.includes("afternoon")) return "lunch";
  if (t.includes("dinner")    || t.includes("supper") || t.includes("night")) return "dinner";
  if (t.includes("snack")     || t.includes("evening")) return "snack";
  return null;
}

// Returns { quantity, grams }
// grams is set if user said "150 grams", "150g", etc.
// quantity is used otherwise (1, 2, "half" → 0.5)
export function parseAmountFromText(text) {
  const t = text.toLowerCase();

  // Gram patterns: "150 grams", "150g", "200 gram", "150 gm"
  const gramMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:grams?|gm|g)\b/);
  if (gramMatch) {
    return { quantity: 1, grams: parseFloat(gramMatch[1]) };
  }

  // ml patterns: treat like grams for liquids
  const mlMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:ml|milliliter)/);
  if (mlMatch) {
    return { quantity: 1, grams: parseFloat(mlMatch[1]) };
  }

  // Fractional/word quantities
  if (t.includes("half") || t.includes("0.5")) return { quantity: 0.5, grams: null };
  if (t.includes("quarter") || t.includes("1/4")) return { quantity: 0.25, grams: null };

  // Numeric quantity
  const numMatch = t.match(/\b([2-9]|10)\b/);
  if (numMatch) return { quantity: parseInt(numMatch[1]), grams: null };
  if (t.includes("two"))   return { quantity: 2, grams: null };
  if (t.includes("three")) return { quantity: 3, grams: null };
  if (t.includes("four"))  return { quantity: 4, grams: null };

  return { quantity: 1, grams: null };
}
