from utils.llm import get_llm
from rag.retriever import retrieve
from utils.realtime import get_competitors, get_market_data, get_trends  # 🔥 NEW

llm = get_llm()

def market_agent(state):
    idea = state["idea"].lower()

    # 🔍 RAG CONTEXT (KEPT)
    docs = retrieve(idea)
    context = "\n".join([d.page_content for d in docs]) if docs else ""

    # 🌐 REAL COMPETITORS
    real_comps = get_competitors(idea)
    comp_names = [c["name"] for c in real_comps if c.get("name")]
    real_context = ", ".join(comp_names) if comp_names else "No real data found"

    # 🔥 NEW — REAL MARKET DATA
    market_data = get_market_data(idea)

    # 🔥 NEW — REAL TRENDS
    trend_data = get_trends(idea)

    # 🔥 YOUR EXISTING LOGIC (KEPT AS FALLBACK)
    keywords = idea.split()

    if "ai" in idea:
        market_size = "AI market expanding rapidly"
        growth = "High growth (>20% CAGR)"
    elif "fintech" in idea or "finance" in idea:
        market_size = "Global fintech market expanding"
        growth = "High growth due to digital adoption"
    else:
        market_size = "Broad industry market"
        growth = "Moderate to high growth"

    segments = f"Users related to {idea}"
    personas = f"Digital-first users interested in {idea}"

    # 🔥 🔥 REAL DATA DRIVEN PROMPT (MAIN FIX)
    prompt = f"""
You are a professional market analyst.

Startup Idea:
{idea}

REAL MARKET DATA (from live sources):
{market_data}

REAL INDUSTRY TRENDS:
{trend_data}

REAL COMPETITORS:
{real_context}

Additional context:
{context}

CRITICAL INSTRUCTIONS:
- DO NOT invent data
- Use ONLY the real data provided above
- Extract actual numbers (market size, CAGR)
- Mention competitors where relevant
- Explain insights like a consultant
- Avoid generic phrases completely

IMPORTANT:
Your job is to ANALYZE the data, not generate random content.

FORMAT:

Market Size (TAM/SAM/SOM):
- TAM:
- SAM:
- SOM:

Market Growth Rate:

Customer Segments:

Customer Personas:

Demand Trends:

Problem–Solution Fit:

Buying Behavior:

Market Trends:

Entry Barriers:

Market Risks:
"""

    try:
        response = llm.invoke(prompt[:3000])

        if response and len(response.strip()) > 150:
            state["market"] = response.strip()
            return state

    except Exception as e:
        print("LLM failed, using fallback...", e)

    # 🔥 FALLBACK (UNCHANGED)
    trends = [
        f"Increasing adoption of {keywords[0] if keywords else 'technology'}",
        "Shift towards digital platforms",
        "Rising investment in innovative startups"
    ]

    result = f"""
Market Size (TAM/SAM/SOM):
{market_size}

Market Growth Rate:
{growth}

Customer Segments:
{segments}

Customer Personas:
{personas}

Demand Trends:
- {trends[0]}
- {trends[1]}
- {trends[2]}

Problem–Solution Fit:
The idea improves efficiency.

Buying Behavior:
Users prefer digital solutions.

Market Trends:
- Digital transformation
- AI integration

Entry Barriers:
High competition

Market Risks:
Market uncertainty
"""

    state["market"] = result.strip()
    return state