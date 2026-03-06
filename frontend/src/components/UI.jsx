const sectionColors = {
  "🧠": "from-violet-500 to-purple-500",
  "🏭": "from-blue-500 to-cyan-500",
  "💵": "from-amber-500 to-yellow-500",
  "₿": "from-orange-500 to-amber-500",
};

export function SectionTitle({ title, emoji, count }) {
  const gradient = sectionColors[emoji] || "from-gray-400 to-gray-500";
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-base shadow-lg`}>
        {emoji}
      </div>
      <h2 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h2>
      {count != null && (
        <span className="text-xs text-gray-500 bg-[#1a1c20] border border-[#2a2d35] px-2.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-[#2a2d35] to-transparent" />
    </div>
  );
}

export function LoadingGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#111214] border border-[#1e2025] rounded-xl p-4 animate-pulse">
          <div className="h-3 bg-[#1e2025] rounded w-2/3 mb-3" />
          <div className="h-8 bg-[#1e2025] rounded w-1/3 mb-2" />
          <div className="h-3 bg-[#1e2025] rounded w-full" />
        </div>
      ))}
    </div>
  );
}
