from langchain_community.chat_models import ChatOllama
from utils.realtime import get_competitors, get_stock_data


def finance_agent(state):
    idea = state["idea"]

    # 🌐 REAL COMPETITORS
    comps = get_competitors(idea.lower())
    comp_names = [c["name"] for c in comps if c.get("name")]

    # 🔥 INDUSTRY → STOCK MAPPING
    idea_lower = idea.lower()
    industry_map = {
        "food": "ZOMATO.NS",
        "delivery": "UBER",
        "fintech": "PYPL",
        "payment": "V",
        "ai": "MSFT",
        "saas": "CRM",
        "education": "COUR",
        "health": "UNH",
    }
    stock_symbol = "AAPL"
    for key in industry_map:
        if key in idea_lower:
            stock_symbol = industry_map[key]
            break

    # 📈 REAL FINANCIAL SIGNAL
    stock_data = get_stock_data(stock_symbol)
    financial_context = f"""
Industry benchmark ({stock_symbol}):
Revenue: {stock_data.get("revenue")}
Market Cap: {stock_data.get("market_cap")}
Growth: {stock_data.get("growth")}
"""

    # ================================================
    # BYPASS OllamaLLM wrapper — call ChatOllama directly
    # so we get a plain text string back, not a dict
    # ================================================
    try:
        direct_llm = ChatOllama(model="llama3", temperature=0.7)

        prompt = f"""You are a startup financial analyst. Analyze this startup idea and provide a detailed financial breakdown.

Startup Idea: {idea}
Comparable companies: {comp_names}
{financial_context}

IMPORTANT RULES:
- Use SPECIFIC dollar amounts with reasoning for this exact startup idea
- Every section MUST have real, specific data — no placeholders, no "N/A" unless truly not applicable
- All numbers must be realistic for this specific startup idea and industry
- Do NOT include any JSON, markdown code blocks, or extra formatting
- Respond using EXACTLY these section headers with a colon after each

Cost Structure:
- [specific cost item]: $[amount]/year ([reason specific to this idea])
- [specific cost item]: $[amount]/year ([reason specific to this idea])
- [specific cost item]: $[amount]/year ([reason specific to this idea])
- [specific cost item]: $[amount]/year ([reason specific to this idea])
- [specific cost item]: $[amount]/year ([reason specific to this idea])

Revenue Projections:
- Year 1: $[amount] ([specific reasoning for this startup])
- Year 2: $[amount] ([specific reasoning for this startup])
- Year 3: $[amount] ([specific reasoning for this startup])

Profit & Loss Forecast:
- Year 1 Loss: $[amount] ([specific reasoning])
- Year 2 Profit: $[amount] ([specific reasoning])
- Year 3 Profit: $[amount] ([specific reasoning])

Break-even Analysis:
- [specific month range] at [specific revenue milestone] ([reasoning specific to this idea])

Unit Economics:
- Revenue per user: $[specific amount]
- CAC: $[specific amount]
- LTV: $[specific amount]
- Margin: [specific %]

Pricing Strategy:
- [specific tier with price and detail for this startup]
- [specific tier with price and detail for this startup]
- [specific tier with price and detail for this startup]
- [specific tier with price and detail for this startup]

Cash Flow Forecast:
- [specific cash flow point with numbers for this startup]
- [specific cash flow point with numbers for this startup]
- [specific cash flow point with numbers for this startup]

Funding Requirements:
- [specific funding stage and amount for this startup]
- [specific use of funds breakdown]
- [specific investor type and rationale]

ROI Estimation:
- [specific ROI % and timeline for this startup]
- [specific comparable exits and valuations]
- [specific investor return scenario with numbers]

Financial Risks:
- [specific risk 1 with quantified impact for this startup]
- [specific risk 2 with quantified impact for this startup]
- [specific risk 3 with quantified impact for this startup]
- [specific risk 4 with quantified impact for this startup]

Key Insights:
- [specific key financial insight 1 for this startup]
- [specific key financial insight 2 for this startup]
- [specific key financial insight 3 for this startup]

Now fill in ALL the above with real specific numbers and reasoning for: {idea}"""

        print(f"[finance_agent] Calling ChatOllama directly for: {idea}")
        response = direct_llm.invoke(prompt)
        result = response.content if hasattr(response, "content") else str(response)
        result = result.strip()

        print(f"[finance_agent] Got response, length: {len(result)}")
        print(f"[finance_agent] First 200 chars: {result[:200]}")

        # Validate response has required sections
        required_sections = [
            "Revenue Projections:",
            "Unit Economics:",
            "Cost Structure:",
            "Profit & Loss Forecast:",
        ]
        missing = [s for s in required_sections if s not in result]

        if missing:
            print(f"[finance_agent] Missing sections: {missing}")
            result_lower = result.lower()
            really_missing = [
                s for s in required_sections
                if s.lower().replace(":", "") not in result_lower
            ]
            if really_missing:
                print(f"[finance_agent] Really missing: {really_missing}")
                raise ValueError(f"LLM output missing required sections: {really_missing}")

        if len(result) < 300:
            raise ValueError(f"LLM output too short: {len(result)} chars")

        state["financials"] = result
        print("[finance_agent] Successfully set financials from LLM output")
        return state

    except Exception as e:
        print(f"[finance_agent] ChatOllama direct call failed: {e}")

    # ================================================
    # SECOND ATTEMPT — shorter, simpler prompt
    # ================================================
    try:
        direct_llm2 = ChatOllama(model="llama3", temperature=0.5)

        simple_prompt = f"""Analyze startup idea: "{idea}"
Competitors: {comp_names}

Write financial analysis with EXACTLY these headers and real specific numbers:

Cost Structure:
- Engineering: $[amount]/year ([why])
- Marketing: $[amount]/year ([why])
- Operations: $[amount]/year ([why])
- Infrastructure: $[amount]/year ([why])
- Admin & Legal: $[amount]/year ([why])

Revenue Projections:
- Year 1: $[amount] ([why])
- Year 2: $[amount] ([why])
- Year 3: $[amount] ([why])

Profit & Loss Forecast:
- Year 1 Loss: $[amount] ([why])
- Year 2 Profit: $[amount] ([why])
- Year 3 Profit: $[amount] ([why])

Break-even Analysis:
- Month [X] to [Y] at $[amount] revenue ([why])

Unit Economics:
- Revenue per user: $[amount]
- CAC: $[amount]
- LTV: $[amount]
- Margin: [%]

Pricing Strategy:
- Free tier: [details]
- Pro plan: $[amount]/month ([details])
- Enterprise: $[amount]/month ([details])

Cash Flow Forecast:
- [specific point 1]
- [specific point 2]
- [specific point 3]

Funding Requirements:
- Seed: $[amount] for [purpose]
- Series A: $[amount] for [purpose]
- Use of funds: [breakdown]

ROI Estimation:
- Expected ROI: [%] over [years]
- Comparable exits: [examples]
- Investor return: [scenario]

Financial Risks:
- [risk 1 with % impact]
- [risk 2 with % impact]
- [risk 3 with % impact]
- [risk 4 with % impact]

Key Insights:
- [insight 1 with data]
- [insight 2 with data]
- [insight 3 with data]"""

        print(f"[finance_agent] Trying simpler prompt...")
        response2 = direct_llm2.invoke(simple_prompt)
        result2 = response2.content if hasattr(response2, "content") else str(response2)
        result2 = result2.strip()

        print(f"[finance_agent] Second attempt length: {len(result2)}")

        if result2 and len(result2) > 200 and "Revenue Projections:" in result2:
            state["financials"] = result2
            print("[finance_agent] Second attempt succeeded")
            return state

    except Exception as e2:
        print(f"[finance_agent] Second attempt failed: {e2}")

    # ================================================
    # FINAL: Set error state so UI shows helpful message
    # ================================================
    print("[finance_agent] All attempts failed")
    state["financials"] = (
        "ERROR: Could not generate financial analysis. "
        "Please check:\n"
        "1. Ollama is running: run 'ollama serve' in a terminal\n"
        "2. llama3 model is pulled: run 'ollama pull llama3'\n"
        "3. Try running: ollama run llama3 'hello' to verify"
    )
    return state