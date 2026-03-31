import { useState } from "react";
import DailyLog from "./components/DailyLog";
import History from "./components/History";
import CustomRecipe from "./components/CustomRecipe";
import Goals from "./components/Goals";
import "./App.css";

const TABS = [
  { id: "today",   label: "Today",    icon: "🍽️" },
  { id: "history", label: "History",  icon: "📅" },
  { id: "recipes", label: "My Foods", icon: "📝" },
  { id: "goals",   label: "Goals",    icon: "🎯" },
];

export default function App() {
  const [tab, setTab] = useState("today");

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">CalTrack</h1>
        <p className="app-subtitle">Indian Food Calorie Tracker</p>
      </header>

      <main className="app-main">
        {tab === "today"   && <DailyLog />}
        {tab === "history" && <History />}
        {tab === "recipes" && <CustomRecipe />}
        {tab === "goals"   && <Goals />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
