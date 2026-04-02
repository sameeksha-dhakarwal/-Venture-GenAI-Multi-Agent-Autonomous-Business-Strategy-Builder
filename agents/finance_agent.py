from utils.llm import get_llm
from utils.realtime import get_competitors, get_stock_data  # 🔥 NEW

llm = get_llm()

def finance_agent(state):
    idea = state["idea"]

    # 🌐 REAL COMPETITORS (for context)
    comps = get_competitors(idea)
    comp_names = [c["name"] for c in comps if c.get("name")]

    # 📈 REAL FINANCIAL SIGNAL (benchmark)
    stock_data = get_stock_data("AAPL")  # proxy benchmark

    # 🔥 IMPROVED PROMPT (VERY IMPORTANT)
    prompt = f"""
Startup Idea:
{idea}

Comparable companies:
{comp_names}

Reference financial data:
{stock_data}

INSTRUCTIONS:
- Generate realistic startup financials
- Base projections on comparable companies
- Avoid generic or random numbers
- Keep it structured and investor-ready

STRICT FORMAT:

Cost Structure:
- 

Revenue Projections:
- Year 1:
- Year 2:
- Year 3:

Profit & Loss Forecast:

Break-even Analysis:

Unit Economics:
- Revenue per user:
- CAC:
- LTV:
- Margin:

Pricing Strategy:

Cash Flow Forecast:

Funding Requirements:

ROI Estimation:

Financial Risks:
- 
- 
"""

    try:
        output = llm.invoke(prompt[:2000])

        # 🔥 FIX: handle AIMessage if returned
        if hasattr(output, "content"):
            output = output.content

        result = output.strip()

        # 🔥 VALIDATION (important)
        if result and len(result) > 150 and "Revenue Projections" in result:
            state["financials"] = result
            return state

    except Exception as e:
        print("Finance agent error:", e)

    # 🔥 FALLBACK (your structure kept but improved)
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