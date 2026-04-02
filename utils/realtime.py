import requests
import yfinance as yf

SERP_API_KEY = "59ffe217b0c5612c3091a17251c86a1cd5aa28d127a1a46514d1a57d85f8f95d"


# 🔥 GOOGLE SEARCH (REAL COMPETITORS)
def get_competitors(idea):
    idea = idea.lower()

    # 🔥 PREDEFINED COMPANY DATABASE (VERY IMPORTANT)
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

    # 🔥 MATCH IDEA TO INDUSTRY
    for key in industry_map:
        if key in idea:
            for name in industry_map[key]:
                competitors.append({
                    "name": name,
                    "link": ""
                })

    # 🔥 IF NOTHING MATCHED → FALLBACK TO GOOGLE
    if not competitors:
        try:
            url = "https://serpapi.com/search"
            params = {
                "q": f"{idea} companies",
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