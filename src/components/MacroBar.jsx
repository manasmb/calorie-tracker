export default function MacroBar({ label, value, goal, unit, color }) {
  const pct = Math.min((value / goal) * 100, 100);
  const over = value > goal;
  return (
    <div className="macro-bar-row">
      <span className="macro-label">{label}</span>
      <div className="macro-track">
        <div
          className="macro-fill"
          style={{ width: `${pct}%`, background: over ? "#e53935" : color }}
        />
      </div>
      <span className="macro-value" style={{ color: over ? "#e53935" : "#333" }}>
        {value}{unit} / {goal}{unit}
      </span>
    </div>
  );
}
