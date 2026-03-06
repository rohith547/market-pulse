import { SignalBadge } from "./SignalBadge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function IndicatorCard({ indicator }) {
  const { name, value, previous, unit, signal, description, category } = indicator;

  const change = value != null && previous != null ? value - previous : null;
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? "text-emerald-400" : change < 0 ? "text-red-400" : "text-gray-500";

  const formatVal = (v) => {
    if (v == null) return "—";
    if (Math.abs(v) >= 1000) return v.toLocaleString();
    return typeof v === "number" ? v.toFixed(v % 1 === 0 ? 0 : 2) : v;
  };

  return (
    <div className="bg-[#111214] border border-[#1e2025] rounded-xl p-4 hover:border-[#2e3035] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider truncate">{name}</p>
        </div>
        <SignalBadge signal={signal} />
      </div>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-2xl font-bold text-white font-mono">
          {formatVal(value)}{unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
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
