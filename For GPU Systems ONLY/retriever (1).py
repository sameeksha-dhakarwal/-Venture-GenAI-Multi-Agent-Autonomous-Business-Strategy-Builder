from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# 🔥 NEW: GPU detection
import torch

# ✅ AUTO DEVICE (GPU if available)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🚀 Retriever using device: {device}")

# ✅ LOAD ONCE (GLOBAL)
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": device}  # 🔥 GPU ENABLED
)

# ✅ LOAD DB ONCE
db = FAISS.load_local(
    "rag/startup_index",
    embeddings,
    allow_dangerous_deserialization=True
)

def retrieve(query):
    return db.similarity_search(query, k=3)