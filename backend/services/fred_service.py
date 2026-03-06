"""
FRED Service — fetches macro economic indicators from Federal Reserve.
All series IDs: https://fred.stlouisfed.org
"""
import os
import requests
from services.cache import cached

FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"

def _fred_latest(series_id: str) -> float:
    api_key = os.environ.get("FRED_API_KEY", "")
    if not api_key:
        return None
    try:
        r = requests.get(FRED_BASE, params={
            "series_id": series_id,
            "api_key": api_key,
            "file_type": "json",
            "sort_order": "desc",
            "limit": 2,
        }, timeout=10)
        r.raise_for_status()
        obs = [o for o in r.json()["observations"] if o["value"] != "."]
        return float(obs[0]["value"]) if obs else None
    except Exception as e:
        print(f"FRED error {series_id}: {e}")
        return None

def _fred_two(series_id: str) -> tuple:
    """Returns (latest, previous) values."""
    api_key = os.environ.get("FRED_API_KEY", "")
    if not api_key:
        return None, None
    try:
        r = requests.get(FRED_BASE, params={
            "series_id": series_id,
            "api_key": api_key,
            "file_type": "json",
            "sort_order": "desc",
            "limit": 3,
        }, timeout=10)
        r.raise_for_status()
        obs = [o for o in r.json()["observations"] if o["value"] != "."]
        latest = float(obs[0]["value"]) if obs else None
        prev   = float(obs[1]["value"]) if len(obs) > 1 else None
        return latest, prev
    except Exception as e:
        print(f"FRED error {series_id}: {e}")
        return None, None

def _signal(value, thresholds: dict) -> str:
    """Returns 'bullish', 'bearish', or 'neutral' based on thresholds."""
    if value is None:
        return "neutral"
    if value >= thresholds.get("bull", float("inf")):
        return "bullish"
    if value <= thresholds.get("bear", float("-inf")):
        return "bearish"
    return "neutral"

@cached(ttl_seconds=3600)
def get_macro_indicators() -> list[dict]:
    indicators = []

    # Industrial Production Index (manufacturing proxy)
    indpro, indpro_prev = _fred_two("INDPRO")
    indpro_chg = None
    if indpro and indpro_prev:
        indpro_chg = round(((indpro - indpro_prev) / indpro_prev) * 100, 2)
    indicators.append({
        "id": "ism_manufacturing",
        "name": "Industrial Production (MoM%)",
        "category": "macro",
        "value": indpro_chg,
        "previous": None,
        "unit": "%",
        "signal": _signal(indpro_chg, {"bull": 0.3, "bear": -0.3}),
        "description": "Industrial output change. Positive = manufacturing expanding.",
        "threshold_bull": 0.3,
        "threshold_bear": -0.3,
    })

    # Consumer Sentiment (services/economy proxy)
    umcs, umcs_prev = _fred_two("UMCSENT")
    indicators.append({
        "id": "ism_services",
        "name": "Consumer Sentiment (UMich)",
        "category": "macro",
        "value": umcs,
        "previous": umcs_prev,
        "unit": "",
        "signal": _signal(umcs, {"bull": 80, "bear": 60}),
        "description": "Consumer confidence. Above 80 = strong economy. Below 60 = recession fears.",
        "threshold_bull": 80,
        "threshold_bear": 60,
    })

    # CPI Inflation YoY (low = bullish for stocks)
    cpi, cpi_prev = _fred_two("CPIAUCSL")
    cpi_yoy = None
    if cpi and cpi_prev:
        cpi_yoy = round(((cpi - cpi_prev) / cpi_prev) * 100 * 12, 2)  # annualized monthly
    indicators.append({
        "id": "cpi_inflation",
        "name": "CPI Inflation (MoM ann.)",
        "category": "macro",
        "value": cpi_yoy,
        "previous": None,
        "unit": "%",
        "signal": _signal(cpi_yoy, {"bear": 4.0}) if cpi_yoy else "neutral",
        "description": "High inflation → Fed hikes rates → bearish stocks & crypto.",
        "threshold_bull": None,
        "threshold_bear": 4.0,
    })

    # Non-Farm Payrolls (strong = bullish)
    nfp, nfp_prev = _fred_two("PAYEMS")
    nfp_change = None
    if nfp and nfp_prev:
        nfp_change = round(nfp - nfp_prev, 0)
    indicators.append({
        "id": "nfp",
        "name": "Non-Farm Payrolls",
        "category": "macro",
        "value": nfp_change,
        "previous": None,
        "unit": "K jobs",
        "signal": _signal(nfp_change, {"bull": 150, "bear": 0}) if nfp_change else "neutral",
        "description": "Monthly job additions. Strong jobs = risk-on sentiment.",
        "threshold_bull": 150,
        "threshold_bear": 0,
    })

    # GDP Growth (positive = bullish)
    gdp, gdp_prev = _fred_two("A191RL1Q225SBEA")
    indicators.append({
        "id": "gdp_growth",
        "name": "GDP Growth Rate",
        "category": "macro",
        "value": gdp,
        "previous": gdp_prev,
        "unit": "%",
        "signal": _signal(gdp, {"bull": 2.0, "bear": 0.0}),
        "description": "Real GDP QoQ annualized. Positive = expanding economy.",
        "threshold_bull": 2.0,
        "threshold_bear": 0.0,
    })

    # Retail Sales MoM (positive = bullish)
    rs, rs_prev = _fred_two("RSXFS")
    rs_change = None
    if rs and rs_prev:
        rs_change = round(((rs - rs_prev) / rs_prev) * 100, 2)
    indicators.append({
        "id": "retail_sales",
        "name": "Retail Sales (MoM)",
        "category": "macro",
        "value": rs_change,
        "previous": None,
        "unit": "%",
        "signal": _signal(rs_change, {"bull": 0.3, "bear": -0.3}) if rs_change else "neutral",
        "description": "Consumer spending power. Rising = healthy economy.",
        "threshold_bull": 0.3,
        "threshold_bear": -0.3,
    })

    return indicators
