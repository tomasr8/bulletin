import time
import chromadb
import cohere
from bulletin.rag.chunk import get_document, chunk_pages

co = cohere.Client("API_KEY")


def get_answer(question):
    doc = get_document()
    chunks = chunk_pages(doc, 256)

    queries = co.chat(
        model="command-r-plus",
        message=question,
        search_queries_only=True,
    )

    queries = [q.text for q in queries.search_queries]
    time.sleep(1)


    chroma_client = chromadb.Client()
    # switch `create_collection` to `get_or_create_collection` to avoid creating a new collection every time
    collection = chroma_client.get_or_create_collection(name="bulletin")
    # switch `add` to `upsert` to avoid adding the same documents every time
    collection.upsert(
        documents=[c.text for c in chunks], ids=[str(x) for x in range(len(chunks))]
    )

    results = collection.query(
        query_texts=queries,  # Chroma will embed this for you
        n_results=5,  # how many results to return
    )

    resp = co.chat(
        model="command-r-plus",
        message=question,
        documents=[
            {"title": "CERN Bulletin article", "snippet": doc} for doc in results['documents'][0]
        ],
    )

    return resp.text
