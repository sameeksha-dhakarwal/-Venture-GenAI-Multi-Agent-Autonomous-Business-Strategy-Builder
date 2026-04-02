from utils.llm import get_llm
from utils.realtime import get_competitors

llm = get_llm()

def competitor_agent(state):
    idea = state["idea"]

    # 🔥 STEP 1: GET REAL COMPETITORS
    real_comps = get_competitors(idea)

    # Extract only names
    comp_names = [c["name"] for c in real_comps if c.get("name")]

    # If API fails → fallback
    if not comp_names:
        comp_names = ["No real data found"]

    # 🔥 STEP 2: GIVE REAL DATA TO LLM
    prompt = f"""
You are a Competitive Intelligence AI.

Startup Idea:
{idea}

REAL competitors (from Google search):
{comp_names}

INSTRUCTIONS:
- Use ONLY these companies
- Do NOT generate fake names
- Be realistic and specific

STRICT FORMAT:

Competitor List:
- Name:
  Segment:
  Pricing:
  Target Market:

Market Share Distribution:
- Leader:
- Mid-tier:
- Emerging:

Pricing Comparison:
- Free:
- Pro:
- Enterprise:

Feature Comparison:
- Features:
- Pricing:
- UX:
- Support:
- Scalability:

Strengths & Weaknesses:
- Strengths:
- Weaknesses:

Competitive Gaps:
- 
- 

Benchmark Metrics:
- Market Share:
- CAC:
- Churn:
- Growth Rate:
"""

    try:
        output = llm.invoke(prompt)

        if output and len(output) > 100:
            state["competitors"] = output
            return state

    except Exception as e:
        print("Competitor agent error:", e)

    # 🔥 FALLBACK
    state["competitors"] = f"""
Competitor List:
{', '.join(comp_names)}

(Real-time API fallback mode)
"""
    return state