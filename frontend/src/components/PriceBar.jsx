import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export function PriceBar({ prices }) {
  if (!prices?.length) return null;

  return (
    <div className="bg-[#0d0e10] border-b border-[#1e2025] overflow-hidden">
      <div className="flex animate-none overflow-x-auto scrollbar-none px-4 py-2 gap-6">
        {prices.map((p) => {
          const up = p.change_pct >= 0;
          const Icon = p.change_pct > 0 ? ArrowUp : p.change_pct < 0 ? ArrowDown : Minus;
          return (
            <div key={p.symbol} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-semibold text-gray-300">{p.label}</span>
              <span className="text-xs font-mono text-white">
                {p.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <div className={`flex items-center text-xs font-mono ${up ? "text-emerald-400" : "text-red-400"}`}>
                <Icon size={10} />
                <span>{Math.abs(p.change_pct).toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
