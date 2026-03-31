import { openDB } from "idb";

const DB_NAME = "calorie-tracker";
const DB_VERSION = 1;

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Food log entries
      if (!db.objectStoreNames.contains("logs")) {
        const logs = db.createObjectStore("logs", { keyPath: "id", autoIncrement: true });
        logs.createIndex("date", "date");
      }
      // Custom recipes/foods
      if (!db.objectStoreNames.contains("recipes")) {
        db.createObjectStore("recipes", { keyPath: "id" });
      }
      // User goals
      if (!db.objectStoreNames.contains("goals")) {
        db.createObjectStore("goals", { keyPath: "key" });
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
  return g || { calories: 2000, protein: 60, carbs: 250, fat: 65 };
}

// ── Helpers ──────────────────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
