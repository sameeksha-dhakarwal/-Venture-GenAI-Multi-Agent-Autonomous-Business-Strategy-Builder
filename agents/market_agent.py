from utils.llm import get_llm
from rag.retriever import retrieve

llm = get_llm()

def market_agent(state):
    idea = state["idea"].lower()

    docs = retrieve(idea)
    context = "\n".join([d.page_content for d in docs])

    # 🔥 YOUR EXISTING LOGIC (kept as fallback)
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

    # 🔥 LLM PROMPT (REAL-WORLD DATA GENERATION)
    prompt = f"""
You are a market research analyst.

Startup Idea:
{idea}

Context (real startup data):
{context}

Generate realistic and data-driven market analysis.

STRICT FORMAT:

Market Size (TAM/SAM/SOM):
Market Growth Rate:
Customer Segments:
Customer Personas:
Demand Trends:
Problem–Solution Fit:
Buying Behavior:
Market Trends:
Entry Barriers:
Market Risks:

Keep answers concise and professional.
"""

    try:
        response = llm.invoke(prompt[:1500])

        # 🔥 BASIC VALIDATION
        if len(response) > 100:
            state["market"] = response
            return state

    except Exception as e:
        print("LLM failed, using fallback...")

    # 🔥 FALLBACK (YOUR LOGIC)
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