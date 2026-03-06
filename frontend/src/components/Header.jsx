import { RefreshCw, BarChart2 } from "lucide-react";

export function Header({ lastUpdated, onRefresh, loading }) {
  return (
    <header className="bg-[#0a0b0d] border-b border-[#1e2025] px-6 py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <BarChart2 size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-lg leading-none">Market Pulse</h1>
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-medium">by Priced In</span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">Real-time macro &amp; crypto market dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Live"}
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-[#2a2d35] hover:border-[#3a3d45] bg-[#111214] px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin text-emerald-400" : ""} />
            Refresh
          </button>
          <a
            href="https://pricedindaily.beehiiv.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex text-xs bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400/50 px-3 py-1.5 rounded-lg transition-all font-medium items-center gap-1.5"
          >
            📬 Newsletter
          </a>
        </div>
      </div>
    </header>
  );
}

