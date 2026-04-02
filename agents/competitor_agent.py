from utils.llm import get_llm
from utils.realtime import get_competitors

llm = get_llm()

def competitor_agent(state):
    idea = state["idea"]

    # 🔥 STEP 1: GET REAL COMPETITORS
    real_comps = get_competitors(idea)

    comp_names = [c["name"] for c in real_comps if c.get("name")]
    comp_links = [c["link"] for c in real_comps if c.get("link")]

    if not comp_names:
        comp_names = ["No real data found"]

    # 🔥 NEW — BUILD REAL CONTEXT
    comp_context = ""

    for c in real_comps:
        name = c.get("name", "")
        link = c.get("link", "")
        comp_context += f"{name} ({link})\n"

    # 🔥 🔥 REAL DATA DRIVEN PROMPT
    prompt = f"""
You are a competitive intelligence analyst.

Startup Idea:
{idea}

REAL COMPETITORS:
{comp_names}

COMPETITOR SOURCES:
{comp_context}

CRITICAL INSTRUCTIONS:
- Use ONLY these competitors
- Do NOT invent companies
- Use real-world reasoning
- Compare competitors realistically
- Mention differences between them
- Use approximate real-world numbers
- Avoid generic statements

IMPORTANT:
You are ANALYZING competitors, not generating fake ones.

FORMAT:

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
        output = llm.invoke(prompt[:2500])

        # 🔥 FIX AIMessage issue
        if hasattr(output, "content"):
            output = output.content

        if output and len(output.strip()) > 150:
            state["competitors"] = output.strip()
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