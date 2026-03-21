from utils.llm import get_llm
from rag.retriever import retrieve

llm = get_llm()

def competitor_agent(state):
    idea = state["idea"]

    docs = retrieve(idea)
    context = "\n".join([d.page_content for d in docs])

    prompt = f"""
    Analyze competitors for:
    {idea}

    Context:
    {context}

    Provide:
    - Top competitors
    - SWOT analysis
    """

    result = llm.predict(prompt)
    state["competitors"] = result

    return state