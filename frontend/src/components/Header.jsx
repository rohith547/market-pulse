import { RefreshCw } from "lucide-react";

export function Header({ lastUpdated, onRefresh, loading }) {
  return (
    <header className="bg-[#0d0e10] border-b border-[#1e2025] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-400 font-black text-sm">P</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Priced In</h1>
              <p className="text-gray-500 text-xs">Market Pulse Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-xs text-gray-600 hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-[#1e2025] hover:border-[#2e3035] px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <a
            href="https://pricedindaily.beehiiv.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            📬 Newsletter
          </a>
        </div>
      </div>
    </header>
  );
}
