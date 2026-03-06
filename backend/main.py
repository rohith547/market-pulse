"""
Market Pulse — FastAPI Backend
Serves all macro, sentiment, crypto, and market indicators.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import macro, sentiment, crypto, market, score

load_dotenv()

app = FastAPI(title="Market Pulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(macro.router,      prefix="/api/macro",     tags=["Macro"])
app.include_router(sentiment.router,  prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(crypto.router,     prefix="/api/crypto",    tags=["Crypto"])
app.include_router(market.router,     prefix="/api/market",    tags=["Market"])
app.include_router(score.router,      prefix="/api/score",     tags=["Score"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Market Pulse API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
