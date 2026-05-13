from utils.llm import get_llm
from utils.realtime import get_competitors, get_market_data, get_trends
import json
import re

llm = get_llm()


def pitch_agent(state):
    idea = state.get("idea", "").lower()

    # ─── REAL DATA FETCHING ───
    comps = get_competitors(idea)
    comp_names = [c["name"] for c in comps if c.get("name")]
    market_data = get_market_data(idea)
    trend_data = get_trends(idea)

    real_context = f"""
Competitors: {comp_names}
Market Data: {market_data}
Trends: {trend_data}
"""

    prompt = f"""Startup Idea: {idea}

REAL MARKET CONTEXT (use this data in your analysis):
{real_context}

Analyze this startup idea thoroughly using the market context above.
Use real competitor names and market data provided.
Include specific dollar amounts, percentages, and growth rates.
"""

    raw_structured = {}
    narrative = ""

    try:
        result = llm.invoke(prompt)
        print(f"LLM result type: {type(result)}")
        print(f"LLM result keys: {list(result.keys()) if isinstance(result, dict) else 'not a dict'}")

        # ── Your llm.py returns a dict with these two keys ──
        if isinstance(result, dict):
            raw_structured = result.get("structured_data") or {}
            narrative = result.get("narrative") or ""
            print(f"structured_data keys: {list(raw_structured.keys()) if raw_structured else 'EMPTY'}")
            print(f"narrative length: {len(narrative)} chars")
        else:
            # Fallback: if somehow a plain string came back, parse it
            print("WARNING: llm.invoke returned a string instead of dict — parsing manually")
            raw_str = str(result)
            if "### NARRATIVE ###" in raw_str:
                parts = raw_str.split("### NARRATIVE ###", 1)
                raw_structured = _parse_json(parts[0])
                narrative = parts[1].strip()
            else:
                raw_structured = _parse_json(raw_str)
                narrative = ""

    except Exception as e:
        print(f"LLM call error: {e}")

    # ─── If structured_data came back empty, retry with JSON-only prompt ───
    if not raw_structured:
        print("structured_data is empty — retrying with JSON-only prompt...")
        raw_structured = _retry_json_only(idea, real_context)

    # ─── Flatten for frontend ───
    pitch_structured = _flatten_structured(raw_structured)

    # ─── If narrative missing, generate separately ───
    if not narrative or len(narrative.strip()) < 100:
        print("Narrative missing — generating separately...")
        narrative = _generate_narrative(idea, real_context, pitch_structured)

    # ─── Debug ───
    print("=== FINAL PITCH STRUCTURED ===")
    for k, v in pitch_structured.items():
        print(f"  {k}: {str(v)[:100]}")
    print(f"=== NARRATIVE ({len(narrative)} chars) ===")

    state["pitch_structured"] = pitch_structured
    state["pitch_deck"] = narrative
    return state


# ─────────────────────────────────────────────
# RETRY: JSON-only fallback via a second LLM call
# ─────────────────────────────────────────────

def _retry_json_only(idea: str, real_context: str) -> dict:
    """Ask LLM for structured data only when the first call returned empty structured_data."""

    json_prompt = f"""Return ONLY a valid JSON object analyzing this startup: "{idea}"

Market context:
{real_context}

No explanation. No markdown. No backticks. Output raw JSON only:
{{
  "market": {{
    "summary": "specific market overview with dollar figures for {idea}",
    "size": "total addressable market in dollars",
    "growth_rate": "CAGR percentage"
  }},
  "customer_segments": [
    {{"name": "Primary Segment", "description": "description of who they are and why they buy"}},
    {{"name": "Secondary Segment", "description": "description of who they are and why they buy"}}
  ],
  "buying_behavior": "how customers in this market make purchasing decisions",
  "market_trends": [
    "trend 1 relevant to {idea}",
    "trend 2 relevant to {idea}",
    "trend 3 relevant to {idea}"
  ],
  "competitive_landscape": [
    "competitor or market dynamic 1",
    "competitor or market dynamic 2",
    "competitor or market dynamic 3"
  ],
  "entry_barriers": [
    "barrier 1 with explanation",
    "barrier 2 with explanation"
  ],
  "market_risks": [
    "risk 1 with explanation",
    "risk 2 with explanation",
    "risk 3 with explanation"
  ],
  "financials": {{
    "revenue_projections": ["Year 1: $X", "Year 2: $Y", "Year 3: $Z"],
    "cost_structure": ["main cost 1", "main cost 2"],
    "roi": "expected ROI and timeline"
  }},
  "key_insights": ["insight 1", "insight 2"],
  "funding_ask": "$5,000,000"
}}"""

    try:
        result = llm.invoke(json_prompt)
        print(f"Retry result type: {type(result)}")

        # Handle dict return (normal case)
        if isinstance(result, dict):
            structured = result.get("structured_data") or {}
            if structured:
                print(f"Retry structured_data OK: {list(structured.keys())}")
                return structured
            # Maybe the narrative field accidentally has our JSON
            raw_text = result.get("narrative", "")
        else:
            raw_text = str(result)

        # Try to parse JSON from whatever text we got
        parsed = _parse_json(raw_text)
        if parsed:
            print(f"Retry parsed from text: {list(parsed.keys())}")
        return parsed

    except Exception as e:
        print(f"Retry also failed: {e}")
        return {}


# ─────────────────────────────────────────────
# NARRATIVE FALLBACK
# ─────────────────────────────────────────────

def _generate_narrative(idea: str, real_context: str, s: dict) -> str:
    """Generate narrative separately when llm.py's narrative field was empty."""

    narrative_prompt = f"""Write an investor pitch speech for: "{idea}"

Data to use:
- Market: {s.get('market', 'large growing market')}
- Customers: {s.get('customer_segments', 'businesses and consumers')}
- Trends: {s.get('market_trends', 'digital transformation')}
- Competitors: {s.get('competitive_landscape', 'established players')}
- Financials: {s.get('financials', 'strong economics')}

Write 6 paragraphs, first person (We believe.../Imagine.../Our solution...).
Structure: Hook → Problem → Solution → Opportunity → Advantage → Funding Ask.
End with: "We are seeking {s.get('funding_ask', '$10,000,000')} to..."
Plain prose only. No headers, bullets, JSON or markdown."""

    try:
        result = llm.invoke(narrative_prompt)
        if isinstance(result, dict):
            text = result.get("narrative", "") or ""
            # If narrative empty, check if JSON accidentally has it
            if not text and result.get("structured_data"):
                text = str(result.get("structured_data", ""))
        else:
            text = str(result)

        text = text.strip()
        text = re.sub(r"```[a-z]*", "", text).strip().rstrip("`").strip()
        if len(text) >= 100:
            return text
    except Exception as e:
        print(f"Narrative generation failed: {e}")

    return (
        f"We are building the future of {idea}. "
        f"The market opportunity is significant — {s.get('market', 'large and rapidly growing')}. "
        f"We are seeking {s.get('funding_ask', '$10,000,000')} to bring this vision to life."
    )


# ─────────────────────────────────────────────
# JSON PARSING UTILITY
# ─────────────────────────────────────────────

def _parse_json(text: str) -> dict:
    """Extract and parse JSON from a raw string with multiple fallback strategies."""
    if not text:
        return {}

    # Strip markdown fences
    text = re.sub(r"```(?:json)?[\s\n]*", "", text)
    text = re.sub(r"```", "", text).strip()

    first = text.find("{")
    last = text.rfind("}")
    if first == -1 or last == -1 or last <= first:
        return {}

    json_str = text[first:last + 1]

    # Attempt 1: direct
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        pass

    # Attempt 2: fix trailing commas + single quotes
    fixed = re.sub(r",\s*([}\]])", r"\1", json_str)
    fixed = fixed.replace("'", '"')
    try:
        return json.loads(fixed)
    except json.JSONDecodeError:
        pass

    return {}


# ─────────────────────────────────────────────
# FLATTEN STRUCTURED DATA FOR FRONTEND
# ─────────────────────────────────────────────

def _flatten_structured(raw: dict) -> dict:
    """Convert nested LLM structured output into flat strings for the frontend."""

    def safe_str(val):
        if not val:
            return ""
        if isinstance(val, str):
            return val.strip()
        if isinstance(val, list):
            parts = []
            for item in val:
                if isinstance(item, dict):
                    name = item.get("name", "")
                    desc = item.get("description", "")
                    parts.append(f"{name}: {desc}" if (name and desc) else name or desc)
                else:
                    parts.append(str(item))
            return "\n".join(filter(None, parts))
        if isinstance(val, dict):
            return " ".join(str(v) for v in val.values() if v)
        return str(val)

    # Market
    market_raw = raw.get("market", {})
    if isinstance(market_raw, dict):
        market_str = " ".join(filter(None, [
            market_raw.get("summary", ""),
            market_raw.get("size", ""),
            market_raw.get("growth_rate", ""),
        ]))
    else:
        market_str = safe_str(market_raw)

    # Customer segments
    segs = raw.get("customer_segments", [])
    if isinstance(segs, list):
        segs_str = "\n".join(
            f"{i.get('name','')}: {i.get('description','')}" if isinstance(i, dict) else str(i)
            for i in segs
        )
    else:
        segs_str = safe_str(segs)

    # Financials
    fin = raw.get("financials", {})
    if isinstance(fin, dict):
        parts = []
        if fin.get("revenue_projections"):
            parts.append("Revenue: " + ", ".join(str(x) for x in fin["revenue_projections"]))
        if fin.get("cost_structure"):
            parts.append("Costs: " + ", ".join(str(x) for x in fin["cost_structure"]))
        if fin.get("roi"):
            parts.append("ROI: " + fin["roi"])
        fin_str = " | ".join(parts)
    else:
        fin_str = safe_str(fin)

    # Funding ask
    funding_raw = raw.get("funding_ask", "")
    if isinstance(funding_raw, dict):
        funding = funding_raw.get("amount") or funding_raw.get("total") or safe_str(funding_raw) or "$10,000,000"
    else:
        funding = safe_str(funding_raw) or "$10,000,000"

    return {
        "market":                market_str,
        "customer_segments":     segs_str,
        "buying_behavior":       safe_str(raw.get("buying_behavior", "")),
        "market_trends":         safe_str(raw.get("market_trends", [])),
        "competitive_landscape": safe_str(raw.get("competitive_landscape", [])),
        "entry_barriers":        safe_str(raw.get("entry_barriers", [])),
        "market_risks":          safe_str(raw.get("market_risks", [])),
        "financials":            fin_str,
        "key_insights":          safe_str(raw.get("key_insights", [])),
        "funding_ask":           funding,
    }
