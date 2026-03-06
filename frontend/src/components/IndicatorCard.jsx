import { SignalBadge } from "./SignalBadge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const signalStyles = {
  bullish: {
    border: "border-l-4 border-l-emerald-500/70 hover:border-l-emerald-400",
    bg: "bg-gradient-to-br from-emerald-950/30 to-[#111214]",
    glow: "hover:shadow-emerald-900/30 hover:shadow-lg",
  },
  bearish: {
    border: "border-l-4 border-l-red-500/70 hover:border-l-red-400",
    bg: "bg-gradient-to-br from-red-950/30 to-[#111214]",
    glow: "hover:shadow-red-900/30 hover:shadow-lg",
  },
  neutral: {
    border: "border-l-4 border-l-slate-700/50",
    bg: "bg-[#111214]",
    glow: "hover:shadow-slate-900/20 hover:shadow-md",
  },
};

export function IndicatorCard({ indicator }) {
  const { name, value, previous, unit, signal, description } = indicator;

  const change = value != null && previous != null ? value - previous : null;
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? "text-emerald-400" : change < 0 ? "text-red-400" : "text-gray-500";

  const styles = signalStyles[signal] || signalStyles.neutral;

  const formatVal = (v) => {
    if (v == null) return "—";
    if (Math.abs(v) >= 1000) return v.toLocaleString();
    return typeof v === "number" ? v.toFixed(v % 1 === 0 ? 0 : 2) : v;
  };

  return (
    <div className={`${styles.bg} ${styles.border} ${styles.glow} border border-[#1e2025] rounded-xl p-4 transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider truncate flex-1 min-w-0 pr-2">{name}</p>
        <SignalBadge signal={signal} />
      </div>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-2xl font-bold text-white font-mono">
          {formatVal(value)}{value != null && unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
        </span>
        {change != null && (
          <div className={`flex items-center gap-1 text-xs ${trendColor} mb-1`}>
            <TrendIcon size={12} />
            <span>{change > 0 ? "+" : ""}{change.toFixed(2)}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>
    </div>
  );
}

