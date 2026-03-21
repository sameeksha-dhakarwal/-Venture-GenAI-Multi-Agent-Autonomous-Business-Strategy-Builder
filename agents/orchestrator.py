from langgraph.graph import StateGraph
from memory.state import StartupState

from agents.market_agent import market_agent
from agents.competitor_agent import competitor_agent
from agents.business_agent import business_agent
from agents.finance_agent import finance_agent
from agents.pitch_agent import pitch_agent

builder = StateGraph(StartupState)

builder.add_node("market", market_agent)
builder.add_node("competitor", competitor_agent)
builder.add_node("business", business_agent)
builder.add_node("finance", finance_agent)
builder.add_node("pitch", pitch_agent)

builder.set_entry_point("market")

builder.add_edge("market", "competitor")
builder.add_edge("competitor", "business")
builder.add_edge("business", "finance")
builder.add_edge("finance", "pitch")

graph = builder.compile()