export default function MacroBar({ label, value, goal, unit, color }) {
  const pct  = Math.min((value / goal) * 100, 100);
  const over = value > goal;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-14 text-xs font-semibold text-on-surface-variant">{label}</span>
      <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: over ? "#ba1a1a" : color }}
        />
      </div>
      <span className="w-24 text-xs text-right" style={{ color: over ? "#ba1a1a" : "#3d4a3e" }}>
        {value}{unit} / {goal}{unit}
      </span>
    </div>
  );
}
