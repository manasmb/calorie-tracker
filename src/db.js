import { openDB } from "idb";
import { auth } from "./firebase.js";

const DB_VERSION = 3;

function getDB() {
  const uid = auth.currentUser?.uid ?? "local";
  return openDB(`calorie-tracker-${uid}`, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const logs = db.createObjectStore("logs", { keyPath: "id", autoIncrement: true });
        logs.createIndex("date", "date");
        db.createObjectStore("recipes", { keyPath: "id" });
        db.createObjectStore("goals", { keyPath: "key" });
      }
      if (oldVersion < 2) {
        const ex = db.createObjectStore("exercises", { keyPath: "id", autoIncrement: true });
        ex.createIndex("date", "date");
      }
      if (oldVersion < 3) {
        db.createObjectStore("dislikedFoods", { keyPath: "id" });
      }
    },
  });
}

// ── Log entries ──────────────────────────────────────────────
export async function addLogEntry(entry) {
  const db = await getDB();
  return db.add("logs", { ...entry, createdAt: Date.now() });
}

export async function getLogsByDate(dateStr) {
  const db = await getDB();
  return db.getAllFromIndex("logs", "date", dateStr);
}

export async function getAllDates() {
  const db = await getDB();
  const all = await db.getAll("logs");
  const dates = [...new Set(all.map(e => e.date))];
  return dates.sort((a, b) => b.localeCompare(a));
}

export async function deleteLogEntry(id) {
  const db = await getDB();
  return db.delete("logs", id);
}

export async function updateLogEntry(entry) {
  const db = await getDB();
  return db.put("logs", entry);
}

// ── Custom recipes ───────────────────────────────────────────
export async function saveRecipe(recipe) {
  const db = await getDB();
  return db.put("recipes", recipe);
}

export async function getAllRecipes() {
  const db = await getDB();
  return db.getAll("recipes");
}

export async function deleteRecipe(id) {
  const db = await getDB();
  return db.delete("recipes", id);
}

// ── Goals ────────────────────────────────────────────────────
export async function saveGoals(goals) {
  const db = await getDB();
  await db.put("goals", { key: "main", ...goals });
}

export async function getGoals() {
  const db = await getDB();
  const g = await db.get("goals", "main");
  return g || { calories: 2000, protein: 60, carbs: 250, fat: 65, fiber: 30, sugar: 50, sodium: 2300 };
}

// ── Exercise log ─────────────────────────────────────────────
export async function addExerciseEntry(entry) {
  const db = await getDB();
  return db.add("exercises", { ...entry, createdAt: Date.now() });
}

export async function getExercisesByDate(dateStr) {
  const db = await getDB();
  return db.getAllFromIndex("exercises", "date", dateStr);
}

export async function deleteExerciseEntry(id) {
  const db = await getDB();
  return db.delete("exercises", id);
}

export async function getAllExerciseDates() {
  const db = await getDB();
  const all = await db.getAll("exercises");
  const dates = [...new Set(all.map(e => e.date))];
  return dates.sort((a, b) => b.localeCompare(a));
}

// ── Disliked Foods ───────────────────────────────────────────
export async function getDislikedFoods() {
  const db = await getDB();
  return db.getAll("dislikedFoods");
}

export async function addDislikedFood(food) {
  const db = await getDB();
  return db.put("dislikedFoods", food);
}

export async function removeDislikedFood(id) {
  const db = await getDB();
  return db.delete("dislikedFoods", id);
}

// ── Helpers ──────────────────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
