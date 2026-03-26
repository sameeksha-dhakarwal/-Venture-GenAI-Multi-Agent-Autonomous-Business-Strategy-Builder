from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from agents.market_agent import market_agent
from agents.competitor_agent import competitor_agent
from agents.business_agent import business_agent
from agents.finance_agent import finance_agent
from agents.pitch_agent import pitch_agent

from auth import router as auth_router

# 🚀 INIT APP
app = FastAPI()

# 🔐 AUTH ROUTES
app.include_router(auth_router)

# 🌐 CORS (for Vite frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📥 REQUEST MODEL
class IdeaRequest(BaseModel):
    idea: str


# ✅ HEALTH CHECK (VERY IMPORTANT FOR DEBUG)
@app.get("/")
def root():
    return {"message": "API is running 🚀"}


# 🚀 MAIN PIPELINE
@app.post("/generate")
def generate(data: IdeaRequest):
    try:
        state = {
            "idea": data.idea,
            "market": "",
            "competitors": "",
            "business_model": "",
            "financials": "",
            "pitch_deck": ""
        }

        # 🔥 AGENT PIPELINE
        state = market_agent(state)
        state = competitor_agent(state)
        state = business_agent(state)
        state = finance_agent(state)
        state = pitch_agent(state)

        return state

    except Exception as e:
        # 🔴 DEBUG ERROR (helps frontend debugging)
        return {
            "error": str(e),
            "message": "Something went wrong in pipeline"
        }