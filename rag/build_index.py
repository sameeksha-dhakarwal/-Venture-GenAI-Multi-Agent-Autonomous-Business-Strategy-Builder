import pandas as pd

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

from dotenv import load_dotenv
import os

load_dotenv()
def build_index():
    df = pd.read_csv("data/processed/clean_startups.csv")

    docs = [
        Document(page_content=row["text"])
        for _, row in df.iterrows()
    ]

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    db = FAISS.from_documents(docs, embeddings)
    db.save_local("rag/startup_index")

if __name__ == "__main__":
    build_index()