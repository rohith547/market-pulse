from fastapi import APIRouter
from services.market_service import get_prices, get_monetary_indicators

router = APIRouter()

@router.get("/prices")
def prices():
    return {"prices": get_prices()}

@router.get("/monetary")
def monetary():
    return {"indicators": get_monetary_indicators()}
