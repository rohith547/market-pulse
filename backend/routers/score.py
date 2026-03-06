"""
Score engine — aggregates all indicators into a single market health score.
Formula: each indicator → +1 (bullish) / -1 (bearish) / 0 (neutral)
Final score: 0–100
"""
from fastapi import APIRouter
from services.fred_service import get_macro_indicators
from services.sentiment_service import get_sentiment_indicators
from services.crypto_service import get_crypto_indicators
from services.market_service import get_monetary_indicators

router = APIRouter()

def _score_indicators(indicators: list[dict]) -> list[dict]:
    scored = []
    for ind in indicators:
        s = ind.get("signal", "neutral")
        points = 1 if s == "bullish" else (-1 if s == "bearish" else 0)
        scored.append({**ind, "points": points})
    return scored

@router.get("/")
def score():
    all_indicators = (
        _score_indicators(get_macro_indicators()) +
        _score_indicators(get_sentiment_indicators()) +
        _score_indicators(get_crypto_indicators()) +
        _score_indicators(get_monetary_indicators())
    )

    bullish = sum(1 for i in all_indicators if i["points"] == 1)
    bearish = sum(1 for i in all_indicators if i["points"] == -1)
    neutral = sum(1 for i in all_indicators if i["points"] == 0)
    total   = len(all_indicators)

    # Score 0–100: 50 = all neutral, 100 = all bullish, 0 = all bearish
    raw = sum(i["points"] for i in all_indicators)
    score_0_100 = round(((raw + total) / (2 * total)) * 100) if total else 50

    if score_0_100 >= 65:
        label, color = "Bullish", "green"
    elif score_0_100 >= 50:
        label, color = "Cautiously Bullish", "yellow"
    elif score_0_100 >= 35:
        label, color = "Cautiously Bearish", "orange"
    else:
        label, color = "Bearish", "red"

    return {
        "score": score_0_100,
        "label": label,
        "color": color,
        "bullish": bullish,
        "bearish": bearish,
        "neutral": neutral,
        "total": total,
        "indicators": all_indicators,
    }
