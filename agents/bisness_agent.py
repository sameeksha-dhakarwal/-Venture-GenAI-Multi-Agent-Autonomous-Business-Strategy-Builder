from utils.llm import get_llm

llm = get_llm()

def business_agent(state):
    idea = state["idea"]

    prompt = f"""
    Create a business model for:
    {idea}

    Include:
    - Revenue model
    - Pricing
    - Value proposition
    """

    result = llm.predict(prompt)
    state["business_model"] = result

    return state