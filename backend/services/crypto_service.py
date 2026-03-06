"""
Crypto on-chain service — funding rates, open interest, BTC dominance via free APIs.
"""
import requests
from services.cache import cached


@cached(ttl_seconds=300)
def get_crypto_indicators() -> list[dict]:
    indicators = []

    # BTC Funding Rate via CoinGlass (free public endpoint)
    try:
        r = requests.get(
            "https://open-api.coinglass.com/public/v2/funding",
            params={"symbol": "BTC"},
            headers={"coinglassSecret": ""},
            timeout=10,
        )
        # Fallback: use Binance public funding rate
        r2 = requests.get(
            "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT",
            timeout=10,
        )
        r2.raise_for_status()
        rate = float(r2.json()["lastFundingRate"]) * 100
        signal = "bearish" if rate > 0.05 else ("bullish" if rate < -0.01 else "neutral")
        indicators.append({
            "id": "btc_funding_rate",
            "name": "BTC Funding Rate",
            "category": "crypto",
            "value": round(rate, 4),
            "unit": "%",
            "signal": signal,
            "description": "High positive = overleveraged longs = correction risk. Negative = shorts dominant.",
            "threshold_bull": -0.01,
            "threshold_bear": 0.05,
        })
    except Exception as e:
        indicators.append({"id": "btc_funding_rate", "name": "BTC Funding Rate", "value": None, "signal": "neutral", "error": str(e)})

    # BTC Dominance via CoinGecko (free)
    try:
        r = requests.get("https://api.coingecko.com/api/v3/global", timeout=10)
        r.raise_for_status()
        data = r.json()["data"]
        btc_dom = round(data["market_cap_percentage"]["btc"], 1)
        total_mcap = data["total_market_cap"]["usd"]
        signal = "bullish" if btc_dom > 55 else ("bearish" if btc_dom < 40 else "neutral")
        indicators.append({
            "id": "btc_dominance",
            "name": "BTC Dominance",
            "category": "crypto",
            "value": btc_dom,
            "unit": "%",
            "signal": signal,
            "description": "High dominance = Bitcoin season. Low dominance = altcoin season.",
            "threshold_bull": 55,
            "threshold_bear": 40,
            "extra": {"total_mcap_usd": total_mcap},
        })

        # Total Crypto Market Cap change
        mcap_chg = round(data["market_cap_change_percentage_24h_usd"], 2)
        indicators.append({
            "id": "crypto_market_cap",
            "name": "Crypto Total Market Cap (24h)",
            "category": "crypto",
            "value": mcap_chg,
            "unit": "%",
            "signal": "bullish" if mcap_chg > 1 else ("bearish" if mcap_chg < -1 else "neutral"),
            "description": "24h change in total crypto market cap. Positive = capital flowing in.",
            "threshold_bull": 1,
            "threshold_bear": -1,
        })
    except Exception as e:
        indicators.append({"id": "btc_dominance", "name": "BTC Dominance", "value": None, "signal": "neutral"})

    # BTC Open Interest via Binance (free)
    try:
        r = requests.get(
            "https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT",
            timeout=10,
        )
        r.raise_for_status()
        oi = float(r.json()["openInterest"])
        indicators.append({
            "id": "btc_open_interest",
            "name": "BTC Open Interest",
            "category": "crypto",
            "value": round(oi, 0),
            "unit": "BTC",
            "signal": "neutral",  # Need historical context to signal
            "description": "Total open futures contracts. High + rising = volatility incoming.",
        })
    except Exception as e:
        indicators.append({"id": "btc_open_interest", "name": "BTC Open Interest", "value": None, "signal": "neutral"})

    return indicators
