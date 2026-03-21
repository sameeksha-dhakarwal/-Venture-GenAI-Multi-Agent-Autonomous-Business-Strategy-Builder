from utils.llm import get_llm

llm = get_llm()

def pitch_agent(state):
    prompt = f"""
    Create a pitch deck:

    Market: {state['market']}
    Business: {state['business_model']}
    Financials: {state['financials']}

    Provide slide-wise structure.
    """

    result = llm.predict(prompt)
    state["pitch_deck"] = result

    return state