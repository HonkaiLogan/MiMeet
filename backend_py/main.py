"""
FastAPI 入口 — MiMo Python 服务
端口: 8000
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from mimo_client import (
    daily_recommendation,
    match_candidates,
    generate_lunch_icebreaker,
    generate_commute_icebreaker,
)
from agent_recommend import recommend_food, recommend_offers, offers_chat

app = FastAPI(title="MiMeet MiMo Service", version="0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://127.0.0.1:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── 请求/响应模型 ────────────────────────────────────────

class DailyRecommendRequest(BaseModel):
    date: str
    zodiac: str = "天秤座"

class MatchRequest(BaseModel):
    user_profile: dict
    candidates: list
    scene: str

class IcebreakerRequest(BaseModel):
    profile_a: dict
    profile_b: dict
    scene: str

class FoodRequest(BaseModel):
    taste_pref: List[str] = []
    budget: str = ""
    meal_time: str = ""

class OffersRequest(BaseModel):
    commute_area: str = ""
    category: str = ""

class OffersChatRequest(BaseModel):
    messages: list
    user_profile: dict = {}
    is_initial: bool = False


# ─── 路由 ─────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/daily/recommend")
async def daily_recommend(req: DailyRecommendRequest):
    try:
        result = await daily_recommendation(req.date, req.zodiac)
        return {"code": 200, "msg": "ok", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/match")
async def match(req: MatchRequest):
    try:
        result = await match_candidates(req.user_profile, req.candidates, req.scene)
        return {"code": 200, "msg": "ok", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/icebreaker")
async def icebreaker(req: IcebreakerRequest):
    try:
        if req.scene == "commute":
            result = await generate_commute_icebreaker(req.profile_a, req.profile_b)
        else:
            result = await generate_lunch_icebreaker(req.profile_a, req.profile_b)
        return {"code": 200, "msg": "ok", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/food")
async def agent_food(req: FoodRequest):
    try:
        result = await recommend_food(req.taste_pref, req.budget, req.meal_time)
        return {"code": 200, "msg": "ok", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/offers")
async def agent_offers(req: OffersRequest):
    try:
        result = await recommend_offers(req.commute_area, req.category)
        return {"code": 200, "msg": "ok", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/offers-chat")
async def agent_offers_chat(req: OffersChatRequest):
    try:
        result = await offers_chat(req.messages, req.user_profile, req.is_initial)
        return {"code": 200, "msg": "ok", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
