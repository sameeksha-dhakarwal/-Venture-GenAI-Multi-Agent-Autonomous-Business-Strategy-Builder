import requests
import yfinance as yf

SERP_API_KEY = "##"


# 🔥 GOOGLE SEARCH (REAL COMPETITORS)
def get_competitors(idea):
    idea = idea.lower()

    industry_map = {
        "food": ["Zomato", "Swiggy", "Uber Eats", "DoorDash", "Grubhub"],
        "delivery": ["Uber Eats", "DoorDash", "Postmates", "Swiggy"],
        "fintech": ["Stripe", "PayPal", "Square", "Razorpay"],
        "payment": ["PayPal", "Stripe", "PhonePe", "Google Pay"],
        "ai": ["OpenAI", "Anthropic", "Google AI", "Microsoft AI"],
        "saas": ["Notion", "Slack", "Zoom", "Airtable"],
        "education": ["Coursera", "Udemy", "Byju’s", "Khan Academy"],
        "health": ["Practo", "1mg", "HealthifyMe"],
    }

    competitors = []

    for key in industry_map:
        if key in idea:
            for name in industry_map[key]:
                competitors.append({
                    "name": name,
                    "link": ""
                })

    # 🔥 FALLBACK TO SERPAPI
    if not competitors:
        try:
            url = "https://serpapi.com/search"
            params = {
                "q": f"{idea} companies list top startups",
                "api_key": SERP_API_KEY,
            }

            res = requests.get(url, params=params).json()
            results = res.get("organic_results", [])[:5]

            for r in results:
                title = r.get("title", "")
                name = title.split("-")[0].split("|")[0].strip()

                competitors.append({
                    "name": name,
                    "link": r.get("link"),
                })

        except Exception as e:
            print("SerpAPI error:", e)

    return competitors[:5]


# 🔥 NEW — REAL MARKET DATA (GAME CHANGER)
def get_market_data(idea):
    try:
        url = "https://serpapi.com/search"

        params = {
            "q": f"{idea} market size CAGR industry statistics",
            "api_key": SERP_API_KEY,
        }

        res = requests.get(url, params=params).json()
        results = res.get("organic_results", [])[:5]

        snippets = []

        for r in results:
            snippet = r.get("snippet")
            if snippet:
                snippets.append(snippet)

        return "\n".join(snippets)

    except Exception as e:
        print("Market data error:", e)
        return ""


# 🔥 NEW — INDUSTRY TRENDS
def get_trends(idea):
    try:
        url = "https://serpapi.com/search"

        params = {
            "q": f"{idea} industry trends 2025 growth drivers",
            "api_key": SERP_API_KEY,
        }

        res = requests.get(url, params=params).json()
        results = res.get("organic_results", [])[:3]

        trends = []

        for r in results:
            snippet = r.get("snippet")
            if snippet:
                trends.append(snippet)

        return "\n".join(trends)

    except Exception as e:
        print("Trend error:", e)
        return ""


# 📈 FINANCIAL DATA (REAL)
def get_stock_data(company):
    try:
        stock = yf.Ticker(company)
        info = stock.info

        return {
            "revenue": info.get("totalRevenue"),
            "market_cap": info.get("marketCap"),
            "growth": info.get("revenueGrowth"),
        }

    except Exception as e:
        print("Yahoo Finance error:", e)
        return {}
