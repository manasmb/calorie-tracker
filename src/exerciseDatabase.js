// calPerMin = MET × 70kg / 60  (for average 70 kg person)
// Users can log custom exercises with manual cal input too

export const EXERCISES = [
  // ── Cardio ──────────────────────────────────────────────────
  { id: "walking_slow",      name: "Walking (slow)",        category: "Cardio",   calPerMin: 3.3 },
  { id: "walking_moderate",  name: "Walking (moderate)",    category: "Cardio",   calPerMin: 4.1 },
  { id: "walking_brisk",     name: "Walking (brisk)",       category: "Cardio",   calPerMin: 5.0 },
  { id: "running_6",         name: "Running (6 km/h)",      category: "Cardio",   calPerMin: 7.6 },
  { id: "running_8",         name: "Running (8 km/h)",      category: "Cardio",   calPerMin: 9.3 },
  { id: "running_10",        name: "Running (10 km/h)",     category: "Cardio",   calPerMin: 11.7 },
  { id: "cycling_leisure",   name: "Cycling (leisure)",     category: "Cardio",   calPerMin: 5.8 },
  { id: "cycling_moderate",  name: "Cycling (moderate)",    category: "Cardio",   calPerMin: 7.9 },
  { id: "cycling_fast",      name: "Cycling (fast)",        category: "Cardio",   calPerMin: 11.1 },
  { id: "swimming",          name: "Swimming",              category: "Cardio",   calPerMin: 7.0 },
  { id: "jump_rope",         name: "Jump Rope / Skipping",  category: "Cardio",   calPerMin: 11.7 },
  { id: "stair_climbing",    name: "Stair Climbing",        category: "Cardio",   calPerMin: 9.3 },
  { id: "elliptical",        name: "Elliptical Trainer",    category: "Cardio",   calPerMin: 8.2 },
  { id: "rowing",            name: "Rowing Machine",        category: "Cardio",   calPerMin: 8.2 },
  { id: "treadmill",         name: "Treadmill",             category: "Cardio",   calPerMin: 9.3 },

  // ── HIIT & Group ────────────────────────────────────────────
  { id: "hiit",              name: "HIIT",                  category: "HIIT",     calPerMin: 12.3 },
  { id: "circuit_training",  name: "Circuit Training",      category: "HIIT",     calPerMin: 9.3 },
  { id: "tabata",            name: "Tabata",                category: "HIIT",     calPerMin: 11.7 },
  { id: "zumba",             name: "Zumba",                 category: "HIIT",     calPerMin: 7.0 },
  { id: "aerobics",          name: "Aerobics",              category: "HIIT",     calPerMin: 7.6 },

  // ── Strength ────────────────────────────────────────────────
  { id: "weight_training",   name: "Weight Training",       category: "Strength", calPerMin: 5.8 },
  { id: "bodyweight",        name: "Bodyweight Exercises",  category: "Strength", calPerMin: 5.8 },
  { id: "powerlifting",      name: "Powerlifting",          category: "Strength", calPerMin: 6.4 },
  { id: "crossfit",          name: "CrossFit",              category: "Strength", calPerMin: 9.9 },
  { id: "pilates",           name: "Pilates",               category: "Strength", calPerMin: 3.5 },

  // ── Yoga & Mindfulness ──────────────────────────────────────
  { id: "yoga_gentle",       name: "Yoga (gentle/hatha)",   category: "Yoga",     calPerMin: 2.9 },
  { id: "yoga_power",        name: "Yoga (power/vinyasa)",  category: "Yoga",     calPerMin: 4.7 },
  { id: "surya_namaskar",    name: "Surya Namaskar",        category: "Yoga",     calPerMin: 5.8 },
  { id: "pranayama",         name: "Pranayama / Breathing", category: "Yoga",     calPerMin: 1.4 },

  // ── Indian Sports ───────────────────────────────────────────
  { id: "cricket_batting",   name: "Cricket (batting)",     category: "Sports",   calPerMin: 5.3 },
  { id: "cricket_fielding",  name: "Cricket (fielding)",    category: "Sports",   calPerMin: 4.1 },
  { id: "kabaddi",           name: "Kabaddi",               category: "Sports",   calPerMin: 8.2 },
  { id: "kho_kho",           name: "Kho Kho",               category: "Sports",   calPerMin: 7.0 },
  { id: "badminton",         name: "Badminton",             category: "Sports",   calPerMin: 6.4 },
  { id: "table_tennis",      name: "Table Tennis",          category: "Sports",   calPerMin: 4.1 },
  { id: "football",          name: "Football / Soccer",     category: "Sports",   calPerMin: 9.3 },
  { id: "basketball",        name: "Basketball",            category: "Sports",   calPerMin: 7.6 },
  { id: "volleyball",        name: "Volleyball",            category: "Sports",   calPerMin: 4.1 },
  { id: "tennis",            name: "Tennis",                category: "Sports",   calPerMin: 7.0 },
  { id: "squash",            name: "Squash",                category: "Sports",   calPerMin: 11.1 },

  // ── Everyday ────────────────────────────────────────────────
  { id: "dancing",           name: "Dancing",               category: "Everyday", calPerMin: 5.8 },
  { id: "gardening",         name: "Gardening",             category: "Everyday", calPerMin: 3.5 },
  { id: "house_cleaning",    name: "House Cleaning",        category: "Everyday", calPerMin: 2.9 },
  { id: "cooking_active",    name: "Cooking (active)",      category: "Everyday", calPerMin: 2.3 },
];

export function searchExercise(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return EXERCISES.filter(e =>
    e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
  ).slice(0, 8);
}

export function calcExerciseCal(exercise, durationMin) {
  return Math.round(exercise.calPerMin * durationMin);
}
