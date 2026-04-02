import { useState, useEffect } from "react";
import DailyLog from "./components/DailyLog";
import History from "./components/History";
import CustomRecipe from "./components/CustomRecipe";
import Goals from "./components/Goals";
import DietPlan from "./components/DietPlan";
import AdminPanel from "./components/AdminPanel";
import LoginScreen from "./components/LoginScreen";
import { onAuthChange, signOutUser } from "./firebase";
import "./App.css";

const ADMIN_EMAIL = "bhatmanas12@gmail.com";

const BASE_TABS = [
  { id: "today",   label: "Today",   icon: "calendar_today" },
  { id: "history", label: "History", icon: "history" },
  { id: "diet",    label: "Diet",    icon: "today" },
  { id: "recipes", label: "Foods",   icon: "restaurant_menu" },
  { id: "goals",   label: "Goals",   icon: "ads_click" },
];

export default function App() {
  const [tab, setTab]   = useState("today");
  const [user, setUser] = useState(undefined);
  const isAdmin = user?.email === ADMIN_EMAIL;
  const TABS = isAdmin ? [...BASE_TABS, { id: "admin", label: "Admin", icon: "shield" }] : BASE_TABS;

  useEffect(() => onAuthChange(setUser), []);

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div className="bg-background font-body text-on-surface pb-24">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-emerald-900/85 backdrop-blur-xl flex justify-between items-center px-5 h-16">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full ring-2 ring-emerald-400/40 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
              {user.displayName?.[0] ?? "U"}
            </div>
          )}
          <span className="text-xl font-headline font-bold text-white tracking-tight">Vitality</span>
        </div>
        <button
          onClick={signOutUser}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-emerald-300"
          title="Sign out"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </header>

      {/* Main */}
      <main className="pt-20 px-4 max-w-2xl mx-auto space-y-5 pb-4">
        {tab === "today"   && <DailyLog />}
        {tab === "history" && <History />}
        {tab === "recipes" && <CustomRecipe />}
        {tab === "diet"    && <DietPlan />}
        {tab === "goals"   && <Goals />}
        {tab === "admin"   && <AdminPanel />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 rounded-t-3xl bg-white/85 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex justify-around items-center px-1 pt-2 pb-5">
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-200 ${
                active
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {t.icon}
              </span>
              {active && (
                <span className="text-[10px] uppercase tracking-widest mt-0.5 font-semibold">{t.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
