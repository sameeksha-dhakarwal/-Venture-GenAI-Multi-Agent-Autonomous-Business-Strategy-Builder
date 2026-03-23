import streamlit as st
from agents.market_agent import market_agent
from agents.competitor_agent import competitor_agent
from agents.business_agent import business_agent
from agents.finance_agent import finance_agent
from agents.pitch_agent import pitch_agent

# 🔧 PAGE CONFIG
st.set_page_config(page_title="Venture GenAI", layout="wide")

# 🎯 HEADER
st.title("🚀 Venture GenAI")
st.subheader("Multi-Agent AI Startup Strategy Builder")
st.caption("Powered by RAG + Multi-Agent AI + Mistral (Ollama)")

# 🧠 INPUT
idea = st.text_input("Enter your startup idea:")

# 🚫 VALIDATION
if st.button("Generate Strategy"):

    if idea.strip() == "":
        st.warning("⚠️ Please enter a startup idea")
        st.stop()

    # 🧾 STATE
    state = {
        "idea": idea,
        "market": "",
        "competitors": "",
        "business_model": "",
        "financials": "",
        "pitch_deck": ""
    }

    # ⏳ LOADING
    with st.spinner("🤖 AI Agents Working... Please wait..."):
        state = market_agent(state)
        state = competitor_agent(state)
        state = business_agent(state)
        state = finance_agent(state)
        state = pitch_agent(state)

    # ✅ SUCCESS
    st.success("✅ Analysis Complete!")

    # 📊 TABS UI
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "🌍 Market",
        "🏢 Competitors",
        "🧠 Business",
        "📊 Financials",
        "🎤 Pitch"
    ])

    with tab1:
        st.markdown(state["market"])

    with tab2:
        st.markdown(state["competitors"])

    with tab3:
        st.markdown(state["business_model"])

    with tab4:
        st.markdown(state["financials"])

    with tab5:
        st.markdown(state["pitch_deck"])

    # 🔥 DOWNLOAD REPORT FEATURE
    full_report = f"""
===============================
🚀 VENTURE GENAI REPORT
===============================

IDEA:
{state['idea']}

-------------------------------
🌍 MARKET ANALYSIS
-------------------------------
{state['market']}

-------------------------------
🏢 COMPETITOR ANALYSIS
-------------------------------
{state['competitors']}

-------------------------------
🧠 BUSINESS MODEL
-------------------------------
{state['business_model']}

-------------------------------
📊 FINANCIALS
-------------------------------
{state['financials']}

-------------------------------
🎤 PITCH DECK
-------------------------------
{state['pitch_deck']}
"""

    st.download_button(
        label="📥 Download Full Report",
        data=full_report,
        file_name="venture_genai_report.txt"
    )