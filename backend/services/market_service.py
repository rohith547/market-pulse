"""
Market service — live prices, Fed rate, yield curve, M2, DXY via yfinance + FRED.
"""
import os
import requests
import yfinance as yf
from services.cache import cached
from services.fred_service import _fred_two, _fred_latest, _signal


@cached(ttl_seconds=300)
def get_prices() -> list[dict]:
    tickers = [
        {"symbol": "^GSPC",  "label": "S&P 500",  "type": "index"},
        {"symbol": "^IXIC",  "label": "NASDAQ",   "type": "index"},
        {"symbol": "^DJI",   "label": "Dow Jones", "type": "index"},
        {"symbol": "BTC-USD","label": "Bitcoin",   "type": "crypto"},
        {"symbol": "ETH-USD","label": "Ethereum",  "type": "crypto"},
        {"symbol": "DX-Y.NYB","label": "DXY",      "type": "currency"},
        {"symbol": "GC=F",   "label": "Gold",      "type": "commodity"},
        {"symbol": "CL=F",   "label": "Oil (WTI)", "type": "commodity"},
        {"symbol": "^TNX",   "label": "10Y Yield", "type": "rate"},
    ]
    results = []
    for t in tickers:
        try:
            ticker = yf.Ticker(t["symbol"])
            info = ticker.fast_info
            price = getattr(info, "last_price", None)
            prev  = getattr(info, "regular_market_previous_close", None)
            if price and prev:
                chg = round(((price - prev) / prev) * 100, 2)
                results.append({**t, "price": round(price, 2), "change_pct": chg})
        except:
            pass
    return results


@cached(ttl_seconds=3600)
def get_monetary_indicators() -> list[dict]:
    indicators = []

    # Fed Funds Rate
    fed, fed_prev = _fred_two("FEDFUNDS")
    fed_signal = "bearish" if (fed and fed > 4.0) else ("bullish" if fed and fed < 2.0 else "neutral")
    indicators.append({
        "id": "fed_funds_rate",
        "name": "Fed Funds Rate",
        "category": "monetary",
        "value": fed,
        "previous": fed_prev,
        "unit": "%",
        "signal": fed_signal,
        "description": "High rates = expensive borrowing = bearish. Cuts = bullish.",
        "threshold_bull": 2.0,
        "threshold_bear": 4.0,
    })

    # Yield Curve 10Y-2Y (negative = inverted = recession warning)
    yc = _fred_latest("T10Y2Y")
    indicators.append({
        "id": "yield_curve",
        "name": "Yield Curve (10Y–2Y)",
        "category": "monetary",
        "value": yc,
        "previous": None,
        "unit": "%",
        "signal": "bearish" if (yc and yc < 0) else ("bullish" if yc and yc > 0.5 else "neutral"),
        "description": "Negative = inverted = recession warning 🚨. Positive = healthy.",
        "threshold_bull": 0.5,
        "threshold_bear": 0.0,
    })

    # M2 Money Supply YoY growth (expanding = bullish for risk assets)
    m2, m2_prev = _fred_two("M2SL")
    m2_yoy = None
    if m2 and m2_prev:
        m2_yoy = round(((m2 - m2_prev) / m2_prev) * 100 * 12, 2)
    indicators.append({
        "id": "m2_money_supply",
        "name": "M2 Money Supply (MoM ann.)",
        "category": "monetary",
        "value": m2_yoy,
        "previous": None,
        "unit": "%",
        "signal": _signal(m2_yoy, {"bull": 3.0, "bear": -2.0}) if m2_yoy else "neutral",
        "description": "Expanding money = more liquidity = bullish for risk assets.",
        "threshold_bull": 3.0,
        "threshold_bear": -2.0,
    })

    return indicators
