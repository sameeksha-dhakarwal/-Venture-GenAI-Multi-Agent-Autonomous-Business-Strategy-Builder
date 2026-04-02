from utils.llm import get_llm
from rag.retriever import retrieve
from utils.realtime import get_competitors  # 🔥 NEW

llm = get_llm()

def market_agent(state):
    idea = state["idea"].lower()

    # 🔍 RAG CONTEXT (KEPT)
    docs = retrieve(idea)
    context = "\n".join([d.page_content for d in docs]) if docs else ""

    # 🌐 REAL COMPETITORS (NEW 🔥)
    real_comps = get_competitors(idea)
    comp_names = [c["name"] for c in real_comps if c.get("name")]

    real_context = ", ".join(comp_names) if comp_names else "No real data found"

    # 🔥 YOUR EXISTING LOGIC (KEPT AS FALLBACK)
    keywords = idea.split()

    if "ai" in idea:
        market_size = "TAM: Expanding global AI market, SAM: AI applications in target domain, SOM: Early adopters segment"
        growth = "High growth (>20% CAGR)"
    elif "fintech" in idea or "finance" in idea:
        market_size = "TAM: Global financial services, SAM: digital payments/fintech users, SOM: niche user base"
        growth = "High growth due to digital adoption"
    else:
        market_size = "TAM: Broad industry market, SAM: target niche segment, SOM: initial penetration market"
        growth = "Moderate to high growth"

    segments = f"Users related to {idea}, businesses, and tech-savvy consumers"
    personas = f"Early adopters interested in {idea}, young professionals, digital users"

    # 🔥 IMPROVED LLM PROMPT (REAL + STRUCTURED)
    prompt = f"""
You are a market research analyst.

Startup Idea:
{idea}

Real companies in this space:
{real_context}

Additional context:
{context}

INSTRUCTIONS:
- Use real-world knowledge
- Base analysis on these companies
- Avoid generic statements
- Use realistic estimates

STRICT FORMAT:

Market Size (TAM/SAM/SOM):
- TAM:
- SAM:
- SOM:

Market Growth Rate:

Customer Segments:
- 

Customer Personas:
- 

Demand Trends:
- 
- 
- 

Problem–Solution Fit:

Buying Behavior:

Market Trends:
- 
- 
- 

Entry Barriers:

Market Risks:
"""

    try:
        response = llm.invoke(prompt[:2000])

        # 🔥 IMPROVED VALIDATION
        if response and len(response.strip()) > 150 and "Market Size" in response:
            state["market"] = response.strip()
            return state

    except Exception as e:
        print("LLM failed, using fallback...", e)

    # 🔥 FALLBACK (YOUR ORIGINAL LOGIC — KEPT)
    trends = [
        f"Increasing adoption of {keywords[0] if keywords else 'technology'}",
        "Shift towards digital platforms",
        "Rising investment in innovative startups"
    ]

    problem_solution = f"""
The idea addresses inefficiencies related to {idea}, improving accessibility and user experience.
""".strip()

    buying_behavior = f"""
Customers prefer convenient and digital-first solutions related to {idea}.
""".strip()

    market_trends = [
        "Digital transformation",
        "AI integration",
        f"Growth in {idea} sector"
    ]

    entry_barriers = f"""
High competition and need for technological expertise in {idea}.
""".strip()

    risks = f"""
Competition, scalability challenges, and market uncertainty.
""".strip()

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
{problem_solution}

Buying Behavior:
{buying_behavior}

Market Trends:
- {market_trends[0]}
- {market_trends[1]}
- {market_trends[2]}

Entry Barriers:
{entry_barriers}

Market Risks:
{risks}
"""

    state["market"] = result.strip()
    return state