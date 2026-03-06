import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function ScoreCard({ scoreData }) {
  const { score, label, bullish, bearish, neutral, total } = scoreData;

  const gaugeColor =
    score >= 65 ? "#10b981" :
    score >= 50 ? "#f59e0b" :
    score >= 35 ? "#f97316" : "#ef4444";

  const glowColor =
    score >= 65 ? "shadow-emerald-900/40" :
    score >= 50 ? "shadow-amber-900/40" :
    score >= 35 ? "shadow-orange-900/40" : "shadow-red-900/40";

  const bgGradient =
    score >= 65 ? "from-emerald-950/40 via-[#111214] to-[#111214]" :
    score >= 50 ? "from-amber-950/40 via-[#111214] to-[#111214]" :
    score >= 35 ? "from-orange-950/40 via-[#111214] to-[#111214]" : "from-red-950/40 via-[#111214] to-[#111214]";

  return (
    <div className={`bg-gradient-to-br ${bgGradient} border border-[#1e2025] rounded-2xl p-6 shadow-xl ${glowColor} col-span-full`}>
      <div className="flex flex-col lg:flex-row items-center gap-8">

        {/* Gauge */}
        <div className="relative w-52 h-52 flex-shrink-0">
          {/* Glow ring */}
          <div className="absolute inset-4 rounded-full opacity-20 blur-xl" style={{ background: gaugeColor }} />
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="60%"
              innerRadius="68%" outerRadius="88%"
              startAngle={180} endAngle={0}
              data={[{ value: 100, fill: "#1e2025" }, { value: score, fill: gaugeColor }]}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={false} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
            <span className="text-6xl font-black" style={{ color: gaugeColor }}>{score}</span>
            <span className="text-sm text-gray-500 mt-1">out of 100</span>
          </div>
        </div>

        {/* Label & breakdown */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Overall Market Sentiment</p>
          <h2 className="text-4xl font-black mb-2" style={{ color: gaugeColor }}>{label}</h2>
          <p className="text-sm text-gray-500 mb-5">Based on {total} macro, sentiment & crypto indicators</p>

          <div className="flex justify-center lg:justify-start gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                <TrendingUp size={16} />
                <span className="text-3xl font-bold">{bullish}</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Bullish</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-red-400">
                <TrendingDown size={16} />
                <span className="text-3xl font-bold">{bearish}</span>
              </div>
              <p className="text-xs text-red-600 mt-1 font-medium">Bearish</p>
            </div>
            <div className="bg-slate-500/10 border border-slate-500/20 rounded-xl px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-400">
                <Activity size={16} />
                <span className="text-3xl font-bold">{neutral}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">Neutral</p>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="flex-shrink-0 w-full lg:w-48">
          <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-wider">Score Range</p>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #ef4444, #f97316, #f59e0b, #10b981)" }}>
            <div
              className="relative h-full"
              style={{ width: `${score}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ background: gaugeColor }} />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Bear</span>
            <span>Neutral</span>
            <span>Bull</span>
          </div>
        </div>
      </div>
    </div>
  );
}

