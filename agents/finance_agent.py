from utils.llm import get_llm

llm = get_llm()

def finance_agent(state):
    idea = state["idea"]

    prompt = f"""
Startup Idea: {idea}

Generate financial projections.

Give:
1. Revenue (3 years)
2. Costs
3. Break-even Point

Answer:
"""

    output = llm.invoke(prompt).content
    result = output.replace(prompt, "").strip()

    state["financials"] = result
    return state