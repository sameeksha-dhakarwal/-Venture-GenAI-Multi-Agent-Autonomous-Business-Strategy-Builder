from utils.llm import get_llm
from utils.realtime import get_competitors, get_market_data, get_trends

llm = get_llm()

def business_agent(state):
    idea = state["idea"].lower()

    # 🌐 REAL COMPETITORS
    comps = get_competitors(idea)
    comp_names = [c["name"] for c in comps if c.get("name")]

    # 🌍 REAL MARKET DATA
    market_data = get_market_data(idea)

    # 📊 REAL TRENDS
    trend_data = get_trends(idea)

    # 🔥 BUILD CONTEXT
    real_context = f"""
Competitors: {comp_names}

Market Data:
{market_data}

Trends:
{trend_data}
"""

    # 🔥 🔥 REAL ANALYSIS PROMPT
    prompt = f"""
You are a startup business strategist.

Startup Idea:
{idea}

REAL DATA CONTEXT:
{real_context}

CRITICAL INSTRUCTIONS:
- Base your business model on real market data
- Use competitors for benchmarking
- Do NOT generate generic startup answers
- Adapt strategy based on industry
- Think like a founder + investor

IMPORTANT:
You are ANALYZING the business opportunity using real data.

EXAMPLES:
Food delivery → commissions, logistics, delivery cost  
Fintech → transaction fees, subscriptions  
AI SaaS → subscription + API usage pricing  

FORMAT:

Business Idea Summary:

Value Proposition:

Problem Statement:

Solution Overview:

Business Model:

Revenue Streams:
- 

Pricing Strategy:
- 

Key Activities:
- 

Key Resources:
- 

Unique Selling Proposition (USP):

SWOT Analysis:
Strengths:
- 
Weaknesses:
- 
Opportunities:
- 
Threats:
- 
"""

    try:
        result = llm.invoke(prompt[:3000])

        if hasattr(result, "content"):
            result = result.content

        if result and len(result.strip()) > 150:
            state["business_model"] = result.strip()
            return state

    except Exception as e:
        print("Business agent error:", e)

    # 🔥 FALLBACK (UNCHANGED)
    fallback = f"""
Business Idea Summary:
Startup focused on {idea}

Value Proposition:
Provides efficient and scalable solution

Problem Statement:
Current systems are inefficient

Solution Overview:
Technology-driven platform

Business Model:
Platform-based model

Revenue Streams:
- Subscription
- Commission

Pricing Strategy:
Tier-based pricing

Key Activities:
- Development
- Marketing

Key Resources:
- Technology
- Team

Unique Selling Proposition (USP):
Differentiated AI-based approach

SWOT Analysis:
Strengths:
- Innovation
Weaknesses:
- Early-stage risk
Opportunities:
- Market growth
Threats:
- Competition
"""
    state["business_model"] = fallback.strip()
    return state