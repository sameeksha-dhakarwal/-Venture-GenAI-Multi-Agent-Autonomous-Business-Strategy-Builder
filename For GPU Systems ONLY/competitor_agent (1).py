from utils.realtime import get_competitors
from langchain_community.chat_models import ChatOllama
import re


def _is_real_company(name: str) -> bool:
    """
    Returns False if the name looks like an article title or blog list
    rather than an actual company name.
    """
    article_signals = [
        "best ", "top ", "list", "startups to watch", "companies in",
        "our top", "jan,", "feb,", "mar,", "2024", "2025", "2026",
        "watch in", "contech", "article", "report", "guide", "ranking",
    ]
    name_lower = name.lower()
    return not any(signal in name_lower for signal in article_signals)


def competitor_agent(state):
    idea = state["idea"]

    # ── STEP 1: GET REAL COMPETITORS ─────────────────────────────────────────
    real_comps = get_competitors(idea)

    # Filter out article titles — keep only real company names
    filtered_comps = [c for c in real_comps if c.get("name") and _is_real_company(c["name"])]

    # Fall back to all results if filter removes everything
    if not filtered_comps:
        filtered_comps = real_comps

    comp_names = [c["name"] for c in filtered_comps if c.get("name")]

    comp_context = ""
    for c in filtered_comps:
        name = c.get("name", "")
        link = c.get("link", "")
        comp_context += f"- {name} ({link})\n"

    names_str = "\n".join(f"- {n}" for n in comp_names) if comp_names else "- No data"

    # ── STEP 2: PROMPT ────────────────────────────────────────────────────────
    PROMPT = f"""You are a competitive intelligence analyst with deep knowledge of real companies.

Startup Idea: {idea}

Web search found these potential competitors (may include article titles — ignore those, use only real company names):
{names_str}

YOUR TASK:
1. From the list above, identify the REAL companies (ignore any article titles or blog posts)
2. If the list has fewer than 3 real companies, add 2-3 well-known REAL companies that compete in the "{idea}" space
3. Use ONLY real, named companies — never use article titles, blog posts, or list names as competitors

STRICT RULES:
- Output ONLY the structured text below — no JSON, no markdown, no preamble, no explanation
- Every field must have specific, real content about actual named companies
- Replace ALL [...] placeholders with real content

COMPETITOR LIST:
- Name: [Real company name 1]
  Segment: [their specific market segment]
  Pricing: [their actual pricing model]
  Target Market: [who they sell to]
- Name: [Real company name 2]
  Segment: [their specific market segment]
  Pricing: [their actual pricing model]
  Target Market: [who they sell to]
- Name: [Real company name 3]
  Segment: [their specific market segment]
  Pricing: [their actual pricing model]
  Target Market: [who they sell to]

MARKET SHARE:
Leader: [Company name] ([XX]%) - [why they lead this market]
Mid-tier: [Company name] ([XX]%) - [their market position]
Emerging: [Company name] ([XX]%-[YY]%) - [their growth trajectory]

PRICING:
Free: [price or N/A]
Pro: [price per month]
Enterprise: [price per month]

FEATURE COMPARISON:
Features: [1-2 sentence comparison of product/service features across the three companies]
Pricing: [1-2 sentence comparison of their pricing strategies]
UX: [1-2 sentence comparison of their customer/user experience]
Support: [1-2 sentence comparison of their customer support]
Scalability: [1-2 sentence comparison of their ability to scale]

STRENGTHS:
- [Key strength 1 shared by market leaders]
- [Key strength 2 — brand or distribution advantage]
- [Key strength 3 — technology or product advantage]

WEAKNESSES:
- [Key weakness 1 — pricing or accessibility gap]
- [Key weakness 2 — innovation lag or slow iteration]
- [Key weakness 3 — poor customer support or UX]

COMPETITIVE GAPS:
- [Gap 1: specific unmet need these companies leave open, that a new startup could address]
- [Gap 2: underserved customer segment or geography with explanation]

BENCHMARK METRICS:
Market Share: [breakdown — who leads with what %, who follows, emerging players share]
CAC: [customer acquisition cost range and dynamics in this specific market]
Churn: [annual churn rate estimates and key drivers in this market]
Growth Rate: [market growth rate % per year and what is driving it]"""

    # ── STEP 3: INVOKE (same pattern as market_agent) ─────────────────────────
    result = ""
    for attempt, temp in enumerate([0.7, 0.4], 1):
        try:
            llm = ChatOllama(model="llama3", temperature=temp)
            print(f"[competitor_agent] Attempt {attempt} for: {idea}")
            response = llm.invoke(PROMPT)
            raw = response.content if hasattr(response, "content") else str(response)
            raw = raw.strip()
            print(f"[competitor_agent] Attempt {attempt} length: {len(raw)}")
            print(f"[competitor_agent] Preview: {raw[:200]}")

            required = [
                "COMPETITOR LIST:",
                "MARKET SHARE:",
                "PRICING:",
                "FEATURE COMPARISON:",
                "STRENGTHS:",
                "WEAKNESSES:",
                "COMPETITIVE GAPS:",
                "BENCHMARK METRICS:",
            ]
            missing = [s for s in required if s.lower() not in raw.lower()]
            if missing:
                print(f"[competitor_agent] Attempt {attempt} missing: {missing}")
                if attempt == 1:
                    continue
            if len(raw) > 300:
                result = raw
                break
        except Exception as e:
            print(f"[competitor_agent] Attempt {attempt} error: {e}")

    if not result:
        state["competitors"] = "ERROR: Could not generate competitor analysis. Please ensure Ollama is running with llama3 model."
        return state

    state["competitors"] = result.strip()
    print("[competitor_agent] Done — competitors set successfully")
    return state