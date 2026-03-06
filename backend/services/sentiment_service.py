"""
Sentiment service — VIX, Fear & Greed (stocks + crypto).
"""
import requests
import yfinance as yf
from services.cache import cached


@cached(ttl_seconds=600)
def get_vix() -> dict:
    try:
        vix = yf.Ticker("^VIX")
        info = vix.fast_info
        value = getattr(info, "last_price", None)
        prev  = getattr(info, "regular_market_previous_close", None)
        signal = "bearish" if value and value > 25 else ("bullish" if value and value < 15 else "neutral")
        return {
            "id": "vix",
            "name": "VIX (Fear Index)",
            "category": "sentiment",
            "value": round(value, 2) if value else None,
            "previous": round(prev, 2) if prev else None,
            "unit": "",
            "signal": signal,
            "description": "<15 = calm/bullish. >25 = fear/bearish. >40 = extreme panic.",
            "threshold_bull": 15,
            "threshold_bear": 25,
        }
    except Exception as e:
        return {"id": "vix", "name": "VIX", "value": None, "signal": "neutral", "error": str(e)}


@cached(ttl_seconds=1800)
def get_crypto_fear_greed() -> dict:
    try:
        r = requests.get("https://api.alternative.me/fng/?limit=2", timeout=10)
        r.raise_for_status()
        data = r.json()["data"]
        value = int(data[0]["value"])
        label = data[0]["value_classification"]
        prev  = int(data[1]["value"]) if len(data) > 1 else None
        signal = "bullish" if value >= 60 else ("bearish" if value <= 35 else "neutral")
        return {
            "id": "crypto_fear_greed",
            "name": "Crypto Fear & Greed",
            "category": "sentiment",
            "value": value,
            "previous": prev,
            "label": label,
            "unit": "/100",
            "signal": signal,
            "description": "0 = Extreme Fear (buy signal). 100 = Extreme Greed (sell signal).",
            "threshold_bull": 60,
            "threshold_bear": 35,
        }
    except Exception as e:
        return {"id": "crypto_fear_greed", "name": "Crypto Fear & Greed", "value": None, "signal": "neutral", "error": str(e)}


@cached(ttl_seconds=1800)
def get_stock_fear_greed() -> dict:
    """Fetch CNN Fear & Greed with browser-like headers."""
    try:
        r = requests.get(
            "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://www.cnn.com/markets/fear-and-greed",
                "Accept": "application/json",
            },
            timeout=10,
        )
        r.raise_for_status()
        data = r.json()
        score = data["fear_and_greed"]["score"]
        rating = data["fear_and_greed"]["rating"]
        value = round(float(score), 1)
        signal = "bullish" if value >= 60 else ("bearish" if value <= 35 else "neutral")
        return {
            "id": "stock_fear_greed",
            "name": "Stock Fear & Greed (CNN)",
            "category": "sentiment",
            "value": value,
            "label": rating,
            "unit": "/100",
            "signal": signal,
            "description": "CNN composite: momentum, breadth, volatility, put/call ratio.",
            "threshold_bull": 60,
            "threshold_bear": 35,
        }
    except Exception as e:
        return {"id": "stock_fear_greed", "name": "Stock Fear & Greed", "value": None, "signal": "neutral", "error": str(e)}


def get_sentiment_indicators() -> list[dict]:
    return [get_vix(), get_crypto_fear_greed(), get_stock_fear_greed()]
