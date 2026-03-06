import { useCallback } from "react";
import { useFetch } from "./hooks/useFetch";
import { fetchScore, fetchMacro, fetchSentiment, fetchCrypto, fetchPrices, fetchMonetary } from "./lib/api";
import { Header } from "./components/Header";
import { PriceBar } from "./components/PriceBar";
import { ScoreCard } from "./components/ScoreCard";
import { IndicatorCard } from "./components/IndicatorCard";
import { SectionTitle, LoadingGrid } from "./components/UI";

function App() {
  const score     = useFetch(useCallback(fetchScore,    []), 120000);
  const macro     = useFetch(useCallback(fetchMacro,    []), 3600000);
  const sentiment = useFetch(useCallback(fetchSentiment,[]), 600000);
  const crypto    = useFetch(useCallback(fetchCrypto,   []), 300000);
  const prices    = useFetch(useCallback(fetchPrices,   []), 300000);
  const monetary  = useFetch(useCallback(fetchMonetary, []), 3600000);

  const loading = score.loading;
  const lastUpdated = score.lastUpdated;

  const handleRefresh = () => {
    score.refresh(); macro.refresh(); sentiment.refresh();
    crypto.refresh(); prices.refresh(); monetary.refresh();
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at top, #0d1117 0%, #08090a 60%)" }}>
      <Header lastUpdated={lastUpdated} onRefresh={handleRefresh} loading={loading} />
      <PriceBar prices={prices.data?.prices} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Overall Score */}
        {score.data ? (
          <div className="grid grid-cols-1">
            <ScoreCard scoreData={score.data} />
          </div>
        ) : (
          <div className="bg-[#111214] border border-[#1e2025] rounded-2xl p-6 animate-pulse h-40" />
        )}

        {/* Sentiment */}
        <section>
          <SectionTitle title="Market Sentiment" emoji="🧠" count={sentiment.data?.indicators?.length} />
          {sentiment.loading ? <LoadingGrid count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentiment.data?.indicators?.map(ind => <IndicatorCard key={ind.id} indicator={ind} />)}
            </div>
          )}
        </section>

        {/* Macro Economy */}
        <section>
          <SectionTitle title="Macro Economy" emoji="🏭" count={macro.data?.indicators?.length} />
          {macro.loading ? <LoadingGrid count={6} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {macro.data?.indicators?.map(ind => <IndicatorCard key={ind.id} indicator={ind} />)}
            </div>
          )}
        </section>

        {/* Monetary Policy */}
        <section>
          <SectionTitle title="Monetary Policy" emoji="💵" count={monetary.data?.indicators?.length} />
          {monetary.loading ? <LoadingGrid count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {monetary.data?.indicators?.map(ind => <IndicatorCard key={ind.id} indicator={ind} />)}
            </div>
          )}
        </section>

        {/* Crypto On-Chain */}
        <section>
          <SectionTitle title="Crypto On-Chain" emoji="₿" count={crypto.data?.indicators?.length} />
          {crypto.loading ? <LoadingGrid count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {crypto.data?.indicators?.map(ind => <IndicatorCard key={ind.id} indicator={ind} />)}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1e2025] pt-8 pb-4 text-center">
          <p className="text-xs text-gray-600">
            Built by{" "}
            <a href="https://pricedindaily.beehiiv.com" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noreferrer">
              Priced In
            </a>
            {" "}· Data: FRED, Binance, CoinGecko, CNN, Yahoo Finance · Auto-refreshes every 2 min
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
