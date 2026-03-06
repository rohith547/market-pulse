from fastapi import APIRouter
from services.sentiment_service import get_sentiment_indicators

router = APIRouter()

@router.get("/")
def sentiment():
    return {"indicators": get_sentiment_indicators()}
