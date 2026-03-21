import streamlit as st
from agents.orchestrator import graph

st.title("🚀 Venture GenAI")

idea = st.text_input("Enter your startup idea")

if st.button("Generate"):
    state = {
        "idea": idea,
        "market": "",
        "competitors": "",
        "business_model": "",
        "financials": "",
        "pitch_deck": ""
    }

    result = graph.invoke(state)

    st.header("Market Research")
    st.write(result["market"])

    st.header("Competitor Analysis")
    st.write(result["competitors"])

    st.header("Business Model")
    st.write(result["business_model"])

    st.header("Financials")
    st.write(result["financials"])

    st.header("Pitch Deck")
    st.write(result["pitch_deck"])