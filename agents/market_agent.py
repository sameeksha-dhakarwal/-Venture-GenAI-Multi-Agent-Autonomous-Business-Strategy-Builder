from utils.llm import get_llm
from rag.retriever import retrieve

llm = get_llm()

def market_agent(state):
    idea = state["idea"]

    docs = retrieve(idea)
    context = "\n".join([d.page_content for d in docs])

    prompt = f"""
    Analyze the market for:
    {idea}

    Context:
    {context}

    Provide:
    - Target audience
    - Market size
    - Trends
    """

    result = llm.predict(prompt)
    state["market"] = result

    return state