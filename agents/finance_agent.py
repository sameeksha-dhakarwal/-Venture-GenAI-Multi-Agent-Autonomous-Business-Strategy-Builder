from utils.llm import get_llm

llm = get_llm()

def finance_agent(state):
    idea = state["idea"]

    prompt = f"""
    Generate financial projections for:
    {idea}

    Include:
    - Revenue (3 years)
    - Costs
    - Break-even
    """

    result = llm.predict(prompt)
    state["financials"] = result

    return state