from utils.llm import get_llm

llm = get_llm()

def business_agent(state):
    idea = state["idea"]

    prompt = f"""
Startup Idea: {idea}

Create a clear business model.

Give:
1. Revenue Model
2. Pricing Strategy
3. Value Proposition

Answer:
"""

    result = llm.invoke(prompt).content

    state["business_model"] = result
    return state