export function SectionTitle({ title, emoji, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-lg">{emoji}</span>
      <h2 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h2>
      {count != null && (
        <span className="text-xs text-gray-600 bg-[#1e2025] px-2 py-0.5 rounded-full">
          {count} indicators
        </span>
      )}
      <div className="flex-1 h-px bg-[#1e2025]" />
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
