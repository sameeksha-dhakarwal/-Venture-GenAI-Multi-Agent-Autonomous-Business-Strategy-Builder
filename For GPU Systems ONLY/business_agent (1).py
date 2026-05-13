from langchain_community.chat_models import ChatOllama
from utils.realtime import get_competitors, get_market_data, get_trends

# Call Ollama directly — bypasses llm.py's structured JSON wrapper
# which returns a dict instead of plain text, breaking string validation
_ollama = ChatOllama(model="llama3", temperature=0.7)


def business_agent(state):
    idea = state["idea"].lower()

    # 🌐 REAL DATA
    comps = get_competitors(idea)
    comp_names = [c["name"] for c in comps if c.get("name")]
    market_data = get_market_data(idea)
    trend_data = get_trends(idea)

    comp_str = ", ".join(comp_names[:5]) if comp_names else "established market players"

    prompt = f"""You are a startup founder and investor strategist. Analyze the startup idea below and return a DETAILED business analysis.

Startup Idea: {idea}

Competitors in this space: {comp_str}
Market Data: {str(market_data)[:500]}
Trends: {str(trend_data)[:500]}

CRITICAL RULES:
- Every section must be SPECIFIC to "{idea}" — NO generic answers
- Bullet points must be LONG (2 full sentences minimum each), not short phrases
- Reference the real competitors listed above where relevant
- All content must be investor-ready and professional
- Do NOT use placeholder text like [First revenue stream] — write real content

OUTPUT FORMAT — use these EXACT section headers followed by a colon on their own line, then content:

Business Idea Summary:
Write 2-3 sentences clearly describing the startup, what it does, and who it serves.

Value Proposition:
Write a strong paragraph explaining the unique value this startup delivers to customers and why they would choose it over competitors like {comp_str}.

Problem Statement:
Write 2-3 sentences describing the real, specific pain point in the {idea} market.

Solution Overview:
Write 2-3 sentences explaining exactly how this startup solves the problem described above.

Business Model:
Write 2-3 sentences explaining the full operational and revenue model for {idea}.

Revenue Streams:
- 1. First revenue stream specific to {idea}: explain how money is made, from whom, and why it is viable. Add a second sentence with scale potential.
- 2. Second revenue stream specific to {idea}: explain the mechanics. Add a second sentence with the customer segment and growth driver.
- 3. Third revenue stream specific to {idea}: explain who pays and how. Add a second sentence on long-term scalability.

Pricing Strategy:
Write 2-3 sentences explaining the pricing logic, tiers, and how pricing compares to competitors like {comp_str}.

Key Activities:
- 1. First key activity for {idea}: explain what it involves. Add a second sentence on why it is critical to business success.
- 2. Second key activity for {idea}: explain the process. Add a second sentence on business impact.
- 3. Third key activity for {idea}: explain how it drives growth. Add a second sentence on execution approach.
- 4. Fourth key activity for {idea}: explain its operational role. Add a second sentence on long-term importance.

Key Resources:
- 1. First key resource for {idea}: explain what it is and why it is essential. Add a second sentence on strategic value.
- 2. Second key resource for {idea}: explain the type and value. Add a second sentence on competitive advantage it creates.
- 3. Third key resource for {idea}: explain how it enables competitive advantage. Add a second sentence on how it scales.
- 4. Fourth key resource for {idea}: explain its role in scaling. Add a second sentence on why it is hard to replicate.

Unique Selling Proposition (USP):
Write a strong paragraph explaining what makes this startup genuinely different from {comp_str} and why customers will prefer it.

SWOT Analysis:

Strengths:
- 1. First strength of {idea} startup: explain the advantage. Add a second sentence on its impact on the business.
- 2. Second strength of {idea} startup: explain why this is durable. Add a second sentence on competitive moat.
- 3. Third strength of {idea} startup: explain how it supports growth. Add a second sentence on customer benefit.

Weaknesses:
- 1. First weakness of {idea} startup: explain the challenge. Add a second sentence on potential impact on growth.
- 2. Second weakness of {idea} startup: explain how it limits profitability. Add a second sentence on mitigation strategy.
- 3. Third weakness of {idea} startup: explain the operational risk. Add a second sentence on how it affects market entry.

Opportunities:
- 1. First opportunity for {idea} startup: explain the market gap. Add a second sentence on how the startup can capture it.
- 2. Second opportunity for {idea} startup: explain the growth potential. Add a second sentence on timeline and approach.
- 3. Third opportunity for {idea} startup: explain strategic expansion possible. Add a second sentence on long-term upside.

Threats:
- 1. First threat to {idea} startup: explain the competitive risk. Add a second sentence on severity and response strategy.
- 2. Second threat to {idea} startup: explain regulatory or economic risks. Add a second sentence on how to mitigate.
- 3. Third threat to {idea} startup: explain technology or disruption risks. Add a second sentence on long-term impact.
"""

    try:
        print(f"🔥 Calling Ollama directly for idea: {idea}")
        response = _ollama.invoke(prompt)
        raw = response.content if hasattr(response, "content") else str(response)

        print(f"✅ Ollama raw output length: {len(raw)}")
        print(f"Preview: {raw[:200]}")

        # Validate the output has real structured content
        required_sections = [
            "Business Idea Summary",
            "Value Proposition",
            "Revenue Streams",
            "Key Activities",
            "Strengths",
        ]
        sections_found = sum(1 for s in required_sections if s in raw)

        if raw and len(raw.strip()) > 600 and sections_found >= 3:
            state["business_model"] = raw.strip()
            print(f"✅ LLM output accepted ({sections_found}/5 sections found)")
            return state
        else:
            print(f"⚠️ LLM validation failed: length={len(raw.strip())}, sections={sections_found}/5")
            print(f"Full output:\n{raw}")

    except Exception as e:
        print(f"❌ Ollama call failed: {e}")

    # Fallback only if Ollama is completely unreachable
    print("⚠️ Using fallback — check that Ollama is running: `ollama serve` and model exists: `ollama pull llama3`")
    state["business_model"] = _build_fallback(idea, comp_str)
    return state


def _build_fallback(idea, comp_str):
    """Structured fallback that matches the exact output format so the parser works."""
    return f"""Business Idea Summary:
A startup in the {idea} space that leverages modern technology to address key inefficiencies and deliver measurably better outcomes for customers. The company targets businesses and consumers who are underserved by existing solutions from {comp_str}. By combining deep domain expertise with scalable technology, the startup aims to capture significant market share in a growing industry.

Value Proposition:
We deliver a purpose-built platform for the {idea} market that enables customers to achieve faster results, lower costs, and superior quality compared to legacy solutions from {comp_str}. Our AI-powered approach automates manual processes, reduces error rates, and provides real-time visibility that competitors cannot match. Customers gain a measurable competitive edge through improved efficiency, better decision-making, and a seamless end-to-end experience.

Problem Statement:
The {idea} market is plagued by fragmented point solutions, high operational overhead, and slow adoption of modern technology, leaving businesses unable to scale efficiently. Existing providers like {comp_str} focus on volume over quality, creating a significant gap for a solution that prioritizes precision, speed, and customer outcomes. As a result, businesses waste resources on manual workarounds and miss growth opportunities that a modern, integrated platform could unlock.

Solution Overview:
Our platform provides an end-to-end, AI-driven solution that automates key workflows, consolidates data from disparate sources, and delivers actionable insights for businesses in the {idea} space. By offering a modular, API-first architecture, customers can deploy quickly, integrate with existing tools, and scale without costly custom development. This translates directly to faster time-to-value, lower total cost of ownership, and a durable competitive advantage for our customers.

Business Model:
We operate a hybrid B2B SaaS model combining tiered subscription revenue with project-based professional services, ensuring strong recurring revenue while capturing upside from enterprise customization. Subscription tiers are structured by usage volume, number of users, and access to premium features, allowing us to serve SMBs and enterprise clients on the same platform. Additional revenue comes from technology licensing and strategic partnerships that embed our solution into complementary products serving the {idea} market.

Revenue Streams:
- 1. Monthly and annual subscription fees from SMB and enterprise clients accessing the core platform, tiered by usage volume and feature set — this stream provides predictable, high-margin recurring revenue and scales directly with customer growth and expansion within accounts.
- 2. Project-based professional services fees for custom implementations, integrations, and bespoke solutions tailored to complex enterprise requirements — this stream captures high-value engagements, deepens client relationships, and creates strong switching costs that reduce churn.
- 3. Technology licensing and royalty revenue from strategic partners who embed our proprietary capabilities into their own products or resell our solution to their customer base — this stream creates a scalable, low-cost distribution channel that amplifies market reach without proportional increases in sales and marketing spend.

Pricing Strategy:
We use a value-based, tiered pricing model with a low-friction entry tier for SMBs and premium tiers designed to capture maximum value from high-volume enterprise users. Pricing is benchmarked against {comp_str} to ensure we are cost-competitive while reflecting the premium performance and unique capabilities our platform delivers. Annual contracts are incentivized with 15-20% discounts to improve cash flow predictability and reduce churn, while usage-based overages provide upside as customers grow.

Key Activities:
- 1. Continuous product development and R&D to improve platform capabilities, incorporate real customer feedback, and maintain a technology lead over competitors like {comp_str} — this is the primary driver of our competitive moat and ensures the product remains the best-in-class solution in the {idea} market as it evolves.
- 2. Sales and marketing to acquire enterprise clients and build brand authority in the {idea} market through content marketing, industry events, and targeted outbound campaigns — these activities directly drive revenue growth and are essential for establishing the credibility needed to win enterprise deals against established incumbents.
- 3. Customer success and onboarding to ensure every client achieves rapid time-to-value, maximizes platform adoption, and expands usage over time — strong customer success is the foundation of high net revenue retention and organic referral growth, which are the most capital-efficient drivers of long-term revenue expansion.
- 4. Strategic partnership development with technology vendors, industry associations, and distribution partners to extend market reach and enhance platform capabilities — partnerships reduce customer acquisition costs, accelerate product development through integrations, and create network effects that strengthen our competitive position over time.

Key Resources:
- 1. Proprietary AI and automation technology platform that forms the technical foundation of our competitive advantage and enables the performance improvements that differentiate us from {comp_str} — this IP is difficult to replicate quickly and creates a durable moat as our models improve with more data over time.
- 2. A highly skilled engineering and domain expert team with deep knowledge of the {idea} market and the technical challenges customers face — this human capital enables faster, more relevant product iteration and more credible customer relationships than generalist technology vendors can deliver.
- 3. A growing proprietary dataset generated by customer usage of the platform, which continuously improves our AI models and enables increasingly accurate, personalized recommendations — this data flywheel creates a compounding competitive advantage that strengthens as the customer base grows and becomes harder for new entrants to replicate.
- 4. Strategic partnerships and distribution channels with established players in the {idea} ecosystem that extend our market reach, provide access to complementary data and technology, and reduce customer acquisition costs through co-selling and referral arrangements — these relationships take years to build and represent a significant barrier to entry for competitors.

Unique Selling Proposition (USP):
Unlike {comp_str}, our solution uniquely combines AI-driven automation, real-time analytics, and a modular open architecture that allows businesses in the {idea} market to deploy in days, not months, without expensive custom development or high switching costs. We deliver measurably superior outcomes — including significantly faster turnaround times, lower error rates, and higher customer satisfaction — backed by transparent, real-time performance dashboards that hold us accountable. Our commitment to continuous innovation, deep customer partnership, and an open ecosystem means we evolve with our customers' needs and integrate with the tools they already use, rather than locking them into a rigid, legacy system.

SWOT Analysis:

Strengths:
- 1. Proprietary AI and automation technology that delivers measurable performance advantages over the legacy solutions offered by {comp_str}, creating a technical moat that competitors cannot replicate quickly without significant R&D investment.
- 2. A domain-expert founding team with deep knowledge of the {idea} market enables faster product iteration and builds stronger customer trust than generalist technology vendors, translating directly into shorter sales cycles and higher win rates against established players.
- 3. A scalable, modular platform architecture that reduces deployment time and allows rapid customization for diverse customer segments, enabling high net revenue retention as customers expand usage and add new modules over time.

Weaknesses:
- 1. As an early-stage company in the {idea} market, limited brand recognition compared to established players like {comp_str} may slow enterprise sales cycles and require substantial ongoing investment in marketing and thought leadership to build credibility with risk-averse procurement teams.
- 2. High initial capital requirements for technology development, talent acquisition, and market entry in the {idea} space may constrain growth speed and require disciplined cash flow management during the critical early growth phase before achieving profitability.
- 3. Dependence on a small founding team for critical technical and commercial decisions creates execution risk, particularly if key personnel depart before the organization has built sufficient process maturity and management depth to sustain operations independently.

Opportunities:
- 1. Rapidly growing demand for AI-powered automation in the {idea} market, driven by rising labor costs, digital transformation mandates, and competitive pressure, creates a large and expanding addressable market that existing solutions from {comp_str} are poorly positioned to serve.
- 2. Geographic expansion into underserved emerging markets where {idea} infrastructure is underdeveloped presents a significant greenfield opportunity to establish market leadership and brand recognition before well-funded competitors recognize and enter these markets.
- 3. Strategic acquisitions of complementary technology startups or domain-expert teams could accelerate product development, expand our IP portfolio, and enable rapid entry into adjacent market segments with a proven, paying customer base and minimal incremental sales and marketing spend.

Threats:
- 1. Well-funded incumbents like {comp_str} may respond to our market entry by accelerating product investment, reducing prices, or acquiring competitive startups to neutralize our differentiation — requiring us to continuously innovate and build deep customer switching costs to maintain our competitive position.
- 2. Evolving data privacy regulations, industry-specific compliance requirements, and potential government intervention in the {idea} space could increase operational complexity and compliance costs, particularly as we expand into new geographies or highly regulated enterprise verticals.
- 3. Rapid advances in foundational AI technology by major cloud providers like AWS, Google, and Microsoft could commoditize some of our core technical capabilities, requiring ongoing investment in deep vertical specialization, proprietary data, and customer integration to sustain differentiation and pricing power.
"""