from utils.llm import get_llm

llm = get_llm()

def pitch_agent(state):
    prompt = f"""
Create a startup pitch deck.

Market:
{state['market']}

Business:
{state['business_model']}

Financials:
{state['financials']}

Give:
Slide 1: Title
Slide 2: Problem
Slide 3: Solution
Slide 4: Market
Slide 5: Business Model
Slide 6: Financials

Answer:
"""

    output = llm.invoke(prompt[:1500])
    result = output.replace(prompt, "").strip()

    state["pitch_deck"] = result
    return state