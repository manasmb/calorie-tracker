import { useState, useEffect } from "react";
import DailyLog from "./components/DailyLog";
import History from "./components/History";
import CustomRecipe from "./components/CustomRecipe";
import Goals from "./components/Goals";
import LoginScreen from "./components/LoginScreen";
import { onAuthChange, signOutUser } from "./firebase";
import "./App.css";

const TABS = [
  { id: "today",   label: "Today",    icon: "🍽️" },
  { id: "history", label: "History",  icon: "📅" },
  { id: "recipes", label: "My Foods", icon: "📝" },
  { id: "goals",   label: "Goals",    icon: "🎯" },
];

export default function App() {
  const [tab, setTab]     = useState("today");
  const [user, setUser]   = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    return onAuthChange(setUser);
  }, []);

  // Loading splash while Firebase resolves auth state
  if (user === undefined) {
    return (
      <div className="auth-loading">
        <span className="auth-loading-spinner" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">CalTrack</h1>
          <p className="app-subtitle">Indian Food Calorie Tracker</p>
        </div>
        <div className="header-user">
          {user.photoURL && (
            <img className="user-avatar" src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
          )}
          <button className="logout-btn" onClick={signOutUser} title="Sign out">↩</button>
        </div>
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
