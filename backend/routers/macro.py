from fastapi import APIRouter
from services.fred_service import get_macro_indicators

router = APIRouter()

@router.get("/")
def macro():
    return {"indicators": get_macro_indicators()}
