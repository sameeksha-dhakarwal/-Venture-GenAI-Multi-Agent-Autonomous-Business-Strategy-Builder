from utils.llm import get_llm
from utils.realtime import get_competitors, get_stock_data

llm = get_llm()

def finance_agent(state):
    idea = state["idea"].lower()

    # 🌐 REAL COMPETITORS
    comps = get_competitors(idea)
    comp_names = [c["name"] for c in comps if c.get("name")]

    # 🔥 INDUSTRY → STOCK MAPPING (NEW)
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

    stock_symbol = "AAPL"  # fallback

    for key in industry_map:
        if key in idea:
            stock_symbol = industry_map[key]

    # 📈 REAL FINANCIAL SIGNAL
    stock_data = get_stock_data(stock_symbol)

    # 🔥 BUILD CONTEXT
    financial_context = f"""
Industry benchmark ({stock_symbol}):
Revenue: {stock_data.get("revenue")}
Market Cap: {stock_data.get("market_cap")}
Growth: {stock_data.get("growth")}
"""

    # 🔥 🔥 REAL ANALYSIS PROMPT
    prompt = f"""
You are a startup financial analyst.

Startup Idea:
{idea}

Comparable companies:
{comp_names}

REAL INDUSTRY FINANCIAL DATA:
{financial_context}

CRITICAL INSTRUCTIONS:
- Base projections on industry benchmarks
- DO NOT use generic numbers
- Adjust numbers based on industry type
- Use realistic startup scaling assumptions
- Explain reasoning implicitly through numbers

EXAMPLES:
Food delivery → high CAC, lower margins  
Fintech → high LTV, strong margins  
AI SaaS → subscription model, high margin  

IMPORTANT:
You are ANALYZING financials, not guessing.

FORMAT:

Cost Structure:
- 

Revenue Projections:
- Year 1: $
- Year 2: $
- Year 3: $

Profit & Loss Forecast:

Break-even Analysis:

Unit Economics:
- Revenue per user: $
- CAC: $
- LTV: $
- Margin: %

Pricing Strategy:

Cash Flow Forecast:

Funding Requirements:

ROI Estimation:

Financial Risks:
- 
- 
"""

    try:
        output = llm.invoke(prompt[:3000])

        if hasattr(output, "content"):
            output = output.content

        result = output.strip()

        if result and len(result) > 150 and "Revenue Projections" in result:
            state["financials"] = result
            return state

    except Exception as e:
        print("Finance agent error:", e)

    # 🔥 FALLBACK (UNCHANGED)
    fallback = f"""
Cost Structure:
- Development, marketing, operations

Revenue Projections:
- Year 1: $50K
- Year 2: $150K
- Year 3: $500K

Profit & Loss Forecast:
Gradual profitability with scale

Break-even Analysis:
Expected within 18–24 months

Unit Economics:
- Revenue per user: $100
- CAC: $40
- LTV: $300
- Margin: 60%

Pricing Strategy:
Freemium + subscription tiers

Cash Flow Forecast:
Negative initially, positive after scaling

Funding Requirements:
$100K–$500K

ROI Estimation:
High growth potential

Financial Risks:
- Competition
- Scaling challenges
"""
    state["financials"] = fallback.strip()
    return state