import { RadialBarChart, RadialBar, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function ScoreCard({ scoreData }) {
  const { score, label, bullish, bearish, neutral, total, color } = scoreData;

  const gaugeColor =
    score >= 65 ? "#00d4aa" :
    score >= 50 ? "#f5a623" :
    score >= 35 ? "#ff8c42" : "#ff4757";

  const data = [{ value: score, fill: gaugeColor }];

  return (
    <div className="bg-[#111214] border border-[#1e2025] rounded-2xl p-6 col-span-full">
      <div className="flex flex-col lg:flex-row items-center gap-8">

        {/* Gauge */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="60%"
              innerRadius="70%" outerRadius="90%"
              startAngle={180} endAngle={0}
              data={[{ value: 100, fill: "#1e2025" }, { value: score, fill: gaugeColor }]}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={false} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
            <span className="text-5xl font-black" style={{ color: gaugeColor }}>{score}</span>
            <span className="text-xs text-gray-500 mt-1">/ 100</span>
          </div>
        </div>

        {/* Label & breakdown */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Overall Market Sentiment</span>
          </div>
          <h2 className="text-3xl font-black mb-4" style={{ color: gaugeColor }}>{label}</h2>

          <div className="flex justify-center lg:justify-start gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp size={16} />
                <span className="text-2xl font-bold">{bullish}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Bullish</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5 text-red-400">
                <TrendingDown size={16} />
                <span className="text-2xl font-bold">{bearish}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Bearish</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Activity size={16} />
                <span className="text-2xl font-bold">{neutral}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Neutral</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 max-w-sm mx-auto lg:mx-0">
            <div className="w-full h-2 bg-[#1e2025] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${score}%`, background: gaugeColor }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Extreme Bear</span>
              <span>Neutral</span>
              <span>Extreme Bull</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 text-center lg:text-right">
          <p className="text-xs text-gray-500 mb-2">Indicators tracked</p>
          <p className="text-4xl font-black text-white">{total}</p>
          <p className="text-xs text-gray-500 mt-1">macro + sentiment + crypto</p>
        </div>
      </div>
    </div>
  );
}
