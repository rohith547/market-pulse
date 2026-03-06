from fastapi import APIRouter
from services.crypto_service import get_crypto_indicators

router = APIRouter()

@router.get("/")
def crypto():
    return {"indicators": get_crypto_indicators()}
