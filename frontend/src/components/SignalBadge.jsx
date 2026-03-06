export function SignalBadge({ signal }) {
  const map = {
    bullish: { label: "BULLISH", cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" },
    bearish: { label: "BEARISH", cls: "bg-red-500/10 text-red-400 border border-red-500/30" },
    neutral: { label: "NEUTRAL", cls: "bg-gray-500/10 text-gray-400 border border-gray-500/30" },
  };
  const { label, cls } = map[signal] || map.neutral;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest ${cls}`}>
      {label}
    </span>
  );
}

export function SignalDot({ signal }) {
  const colors = { bullish: "bg-emerald-400", bearish: "bg-red-400", neutral: "bg-gray-500" };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[signal] || colors.neutral}`} />;
}
