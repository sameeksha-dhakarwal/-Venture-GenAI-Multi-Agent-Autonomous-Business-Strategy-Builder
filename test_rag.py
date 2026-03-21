from rag.retriever import retrieve

query = "AI startup in education"

docs = retrieve(query)

for i, doc in enumerate(docs):
    print(f"\nResult {i+1}:")
    print(doc.page_content)