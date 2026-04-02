from utils.llm import get_llm
from utils.realtime import get_competitors, get_market_data, get_trends

llm = get_llm()

def pitch_agent(state):
    idea = state["idea"].lower()

    # 🌐 REAL COMPETITORS
    comps = get_competitors(idea)
    comp_names = [c["name"] for c in comps if c.get("name")]

    # 🌍 REAL MARKET DATA
    market_data = get_market_data(idea)

    # 📊 REAL TRENDS
    trend_data = get_trends(idea)

    # 🔥 BUILD CONTEXT
    real_context = f"""
Competitors: {comp_names}

Market Data:
{market_data}

Trends:
{trend_data}
"""

    # 🔥 🔥 REAL INVESTOR PITCH PROMPT
    prompt = f"""
You are a startup founder pitching to top-tier investors.

Startup Idea:
{idea}

REAL DATA CONTEXT:
{real_context}

Market Analysis:
{state['market']}

Business Model:
{state['business_model']}

Financials:
{state['financials']}

CRITICAL INSTRUCTIONS:
- This must sound like a REAL startup pitch
- Use real market numbers (from context)
- Reference competitors explicitly
- Use financial projections realistically
- Avoid generic startup phrases
- Make it persuasive and concise

IMPORTANT:
You are presenting a REAL business case, not generating generic content.

FORMAT:

Elevator Pitch:

Problem Statement:

Solution Pitch:

Market Opportunity:
(include real market size / CAGR)

Business Model:

Traction / Validation:
(use logical assumptions if no data)

Competitive Advantage:
(compare with competitors)

Financial Highlights:
(use real projections)

Funding Ask:
(realistic amount + use case)

Storyline / Narrative Flow:
(clear investor storytelling)
"""

    try:
        output = llm.invoke(prompt[:3500])

        if hasattr(output, "content"):
            output = output.content

        result = output.strip()

        if result and len(result) > 150:
            state["pitch_deck"] = result
            return state

    except Exception as e:
        print("Pitch agent error:", e)

    # 🔥 FALLBACK (UNCHANGED)
    fallback = f"""
Elevator Pitch:
Innovative startup focused on {idea}

Problem Statement:
Existing solutions are inefficient

Solution Pitch:
Technology-driven platform

Market Opportunity:
Large and growing market

Business Model:
Subscription-based

Traction / Validation:
Early-stage growth

Competitive Advantage:
Unique AI-based approach

Financial Highlights:
Strong projected growth

Funding Ask:
$100K–$500K

Storyline / Narrative Flow:
Problem → Solution → Market → Growth → Investment
"""

    state["pitch_deck"] = fallback.strip()
    return state