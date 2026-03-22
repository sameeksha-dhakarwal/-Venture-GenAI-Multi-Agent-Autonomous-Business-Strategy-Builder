from agents.market_agent import market_agent

# Initial state
state = {
    "idea": "AI-based personalized learning platform",
    "market": "",
    "competitors": "",
    "business_model": "",
    "financials": "",
    "pitch_deck": ""
}

# Run agent
result = market_agent(state)

print("\n=== MARKET ANALYSIS ===\n")
print(result["market"])