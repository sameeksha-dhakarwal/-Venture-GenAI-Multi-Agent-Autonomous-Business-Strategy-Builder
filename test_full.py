from agents.market_agent import market_agent
from agents.competitor_agent import competitor_agent
from agents.business_agent import business_agent
from agents.finance_agent import finance_agent
from agents.pitch_agent import pitch_agent

state = {
    "idea": "AI-based personalized learning platform",
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

for key, value in state.items():
    print(f"\n=== {key.upper()} ===\n")
    print(value)