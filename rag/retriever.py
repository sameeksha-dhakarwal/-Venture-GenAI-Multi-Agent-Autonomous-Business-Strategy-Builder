from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# ✅ LOAD ONCE (GLOBAL)
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

# ✅ LOAD DB ONCE
db = FAISS.load_local(
    "rag/startup_index",
    embeddings,
    allow_dangerous_deserialization=True
)

def retrieve(query):
    return db.similarity_search(query, k=3)