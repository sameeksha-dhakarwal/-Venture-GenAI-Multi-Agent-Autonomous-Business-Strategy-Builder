from fastapi import FastAPI
from pydantic import BaseModel

from agents.market_agent import market_agent
from agents.competitor_agent import competitor_agent
from agents.business_agent import business_agent
from agents.finance_agent import finance_agent
from agents.pitch_agent import pitch_agent
from auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth_router)
# ✅ Enable CORS (important for Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    idea: str

@app.post("/generate")
def generate(data: IdeaRequest):
    state = {
        "idea": data.idea,
        "market": "",
        "competitors": "",
        "business_model": "",
        "financials": "",
        "pitch_deck": ""
    }

    state = market_agent(state)
    state = competitor_agent(state)
    state = business_agent(state)
    state = finance_agent(state)
    state = pitch_agent(state)

    return state