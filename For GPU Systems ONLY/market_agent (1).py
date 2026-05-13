from langchain_community.chat_models import ChatOllama
from rag.retriever import retrieve
from utils.realtime import get_competitors, get_market_data, get_trends
import re


def market_agent(state):
    idea = state["idea"]
    idea_lower = idea.lower()

    # 🔍 RAG CONTEXT
    try:
        docs = retrieve(idea_lower)
        context = "\n".join([d.page_content for d in docs]) if docs else ""
    except Exception:
        context = ""

    # 🌐 REAL DATA
    try:
        real_comps = get_competitors(idea_lower)
        comp_names = [c["name"] for c in real_comps if c.get("name")]
        real_context = ", ".join(comp_names) if comp_names else "No competitors found"
    except Exception:
        real_context = "No competitors found"

    try:
        market_data = get_market_data(idea_lower)
    except Exception:
        market_data = ""

    try:
        trend_data = get_trends(idea_lower)
    except Exception:
        trend_data = ""

    # ── helpers ──────────────────────────────────────────────────────────────

    def extract_section(text, label):
        """Extract text block under a header, stopping at next ALL-CAPS-starting header."""
        regex = re.compile(
            label + r":\s*\n([\s\S]*?)(?=\n[A-Z][^\n:]{2,}:\s*\n|\nCAGR_VALUE:|\Z)",
            re.IGNORECASE
        )
        m = regex.search(text)
        return m.group(1).strip() if m else ""

    def to_bullets(block):
        """Convert a text block into clean bullet strings."""
        if not block:
            return []
        results = []
        for line in block.split("\n"):
            clean = re.sub(r"^[\s\-•*\d.]+", "", line).strip()
            if clean and len(clean) > 5:
                results.append(clean)
        return results

    def extract_tag(text, label):
        m = re.search(label + r":([^\n]+)", text)
        return m.group(1).strip() if m else ""

    def bullets_to_tag(bullets):
        return " || ".join(b.strip() for b in bullets if b.strip())

    # ── prompt llama3 directly ───────────────────────────────────────────────

    PROMPT = f"""You are a startup market analyst. Write a market analysis for this startup idea.

Startup Idea: {idea}
Real Market Data: {market_data}
Real Trends: {trend_data}
Competitors: {real_context}

STRICT RULES:
- Every answer must be SPECIFIC to "{idea}" — no generic text
- Use real numbers, percentages, and named companies where possible
- Output ONLY plain text — no JSON, no markdown, no code blocks
- Use EXACTLY the section headers below, each followed by a colon and newline

Market Size (TAM/SAM/SOM):
TAM: $[number] [unit] — [specific TAM description for {idea}]
SAM: $[number] [unit] — [specific SAM description for {idea}]
SOM: $[number] [unit] — [specific SOM description for {idea}]

Market Growth Rate:
[2-3 sentences with specific CAGR % for the {idea} market]

Customer Segments:
- [Segment 1 name]: [specific 1-sentence description for {idea}]
- [Segment 2 name]: [specific 1-sentence description for {idea}]
- [Segment 3 name]: [specific 1-sentence description for {idea}]

Customer Personas:
- [Persona 1]: [specific description for {idea}]
- [Persona 2]: [specific description for {idea}]

Demand Trends:
- [Specific trend 1 with % or data point relevant to {idea}]
- [Specific trend 2 with % or data point relevant to {idea}]
- [Specific trend 3 with % or data point relevant to {idea}]
- [Specific trend 4 with % or data point relevant to {idea}]

Problem Solution Fit:
[4-5 sentences on how {idea} solves specific problems in this market]

Buying Behavior:
- [How {idea} customers discover products]
- [What influences their purchase decision]
- [Price sensitivity and value drivers]
- [Brand loyalty signals]
- [Channel preferences]

Market Trends:
- [Specific trend 1 for {idea} industry]
- [Specific trend 2 for {idea} industry]
- [Specific trend 3 for {idea} industry]

Entry Barriers:
- [Specific barrier 1 for {idea} with explanation]
- [Specific barrier 2 for {idea} with explanation]
- [Specific barrier 3 for {idea} with explanation]

Market Risks:
- [Specific risk 1 for {idea} with % impact]
- [Specific risk 2 for {idea} with % impact]
- [Specific risk 3 for {idea} with % impact]

Competitive Landscape:
- [Named competitor 1 and how they compete in {idea}]
- [Named competitor 2 and how they compete in {idea}]
- [Named competitor 3 and how they compete in {idea}]

Key Insights:
- [Key insight 1 for {idea} with supporting data]
- [Key insight 2 for {idea} with supporting data]
- [Key insight 3 for {idea} with supporting data]

Target Persona Bullets:
- [Who they are — age, profession, lifestyle specific to {idea}]
- [Their core goal or aspiration related to {idea}]
- [How they discover and research products like {idea}]
- [Their income level and purchasing power for {idea}]
- [Why they specifically need {idea} over alternatives]

Pain Points Bullets:
- [Pain point 1 that {idea} directly solves — with context]
- [Pain point 2 that {idea} directly solves — frustration or gap]
- [Pain point 3 that {idea} directly solves — cost or inefficiency]
- [Pain point 4 that {idea} directly solves — unmet need]
- [Pain point 5 that {idea} directly solves — market failure]

Behavior Bullets:
- [How customers in {idea} market discover and buy — channel and trigger]
- [What social proof or content influences their decision for {idea}]
- [Their price sensitivity and what value means for {idea}]
- [How loyal they are after first purchase of {idea}]
- [Preferred subscription or purchase model for {idea}]"""

    result = ""
    for attempt, temp in enumerate([0.7, 0.4], 1):
        try:
            llm = ChatOllama(model="llama3", temperature=temp)
            print(f"[market_agent] Attempt {attempt} for: {idea}")
            response = llm.invoke(PROMPT)
            raw = response.content if hasattr(response, "content") else str(response)
            raw = raw.strip()
            print(f"[market_agent] Attempt {attempt} length: {len(raw)}")

            # Validate minimum required sections present
            required = ["Market Size", "Customer Segments", "Target Persona Bullets", "Pain Points Bullets", "Behavior Bullets"]
            missing = [s for s in required if s.lower() not in raw.lower()]
            if missing:
                print(f"[market_agent] Attempt {attempt} missing: {missing}")
                if attempt == 1:
                    continue
            if len(raw) > 400:
                result = raw
                break
        except Exception as e:
            print(f"[market_agent] Attempt {attempt} error: {e}")

    if not result:
        state["market"] = "ERROR: Could not generate market analysis. Please ensure Ollama is running with llama3 model."
        return state

    # ── post-process: extract all sections ──────────────────────────────────

    # TAM/SAM/SOM — look for TAM:/SAM:/SOM: lines
    tam_line = extract_tag(result, "TAM")
    sam_line = extract_tag(result, "SAM")
    som_line = extract_tag(result, "SOM")

    # If not found as tags, try from the section block
    if not tam_line:
        tsblock = extract_section(result, r"Market Size \(TAM/SAM/SOM\)")
        for line in tsblock.split("\n"):
            if line.strip().startswith("TAM"):
                tam_line = re.sub(r"^TAM:\s*", "", line).strip()
            elif line.strip().startswith("SAM"):
                sam_line = re.sub(r"^SAM:\s*", "", line).strip()
            elif line.strip().startswith("SOM"):
                som_line = re.sub(r"^SOM:\s*", "", line).strip()

    # CAGR
    growth_section = extract_section(result, "Market Growth Rate")
    cagr_match = re.search(r"([\d.]+)\s*%", growth_section + result[:500])
    cagr = float(cagr_match.group(1)) if cagr_match else 15.0
    # Cap CAGR to reasonable range
    if cagr > 100:
        cagr = 15.0

    trend_points = [
        round(cagr, 1),
        round(cagr * 1.4, 1),
        round(cagr * 1.9, 1),
        round(cagr * 2.5, 1),
    ]

    # Market strength scores
    demand_bullets   = to_bullets(extract_section(result, "Demand Trends"))
    comp_bullets     = to_bullets(extract_section(result, "Competitive Landscape"))
    insight_bullets  = to_bullets(extract_section(result, "Key Insights"))
    segment_bullets  = to_bullets(extract_section(result, "Customer Segments"))

    demand_score = min(95, 60 + len(demand_bullets) * 6)
    growth_score = min(95, int(cagr * 4) if cagr < 22 else 85)
    comp_score   = max(30, 80 - len(comp_bullets) * 8)
    profit_score = min(90, 65 + len(insight_bullets) * 5)
    scale_score  = min(95, 70 + len(segment_bullets) * 5)

    # Bullet card data
    persona_bullets  = to_bullets(extract_section(result, "Target Persona Bullets"))
    pain_bullets     = to_bullets(extract_section(result, "Pain Points Bullets"))
    behavior_bullets = to_bullets(extract_section(result, r"Behavior Bullets"))

    print(f"[market_agent] persona_bullets: {len(persona_bullets)}")
    print(f"[market_agent] pain_bullets: {len(pain_bullets)}")
    print(f"[market_agent] behavior_bullets: {len(behavior_bullets)}")

    # ── build final output with appended tags ────────────────────────────────
    formatted = f"""{result}

CAGR_VALUE:{cagr}
TREND_POINTS:{",".join(str(p) for p in trend_points)}
DEMAND_SCORE:{demand_score}
GROWTH_SCORE:{growth_score}
COMP_SCORE:{comp_score}
PROFIT_SCORE:{profit_score}
SCALE_SCORE:{scale_score}
TAM_RAW:{tam_line}
SAM_RAW:{sam_line}
SOM_RAW:{som_line}
PERSONA_BULLETS:{bullets_to_tag(persona_bullets)}
PAIN_BULLETS:{bullets_to_tag(pain_bullets)}
BEHAVIOR_BULLETS:{bullets_to_tag(behavior_bullets)}"""

    state["market"] = formatted.strip()
    print("[market_agent] Done — market data set successfully")
    return state