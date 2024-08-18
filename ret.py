from dataclasses import dataclass
import sys
from pathlib import Path

from pypdf import PdfReader


@dataclass
class Document:
    page_content: str
    metadata: dict


def get_documents():
    docs = []
    for pdf in (Path(__file__).parent / "bulletin/client/public/issues").rglob("*"):
        if not pdf.is_file():
            continue

        try:
            reader = PdfReader(pdf)
        except Exception:  # noqa: BLE001
            print(f"Failed to read {pdf}. Aborting..")
            sys.exit(1)

        year = pdf.parents[0].stem
        issue = pdf.stem

        for i, page in enumerate(reader.pages):
            print(f"∟ {year}/{issue}: page {i}")
            text = page.extract_text()
            docs.append(Document(text, {"year": year, "issue": issue, "page": i}))
        break
    return docs


from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200, add_start_index=True
)
docs = get_documents()
print(len(docs))
all_splits = text_splitter.split_documents(docs)
print(len(all_splits))
print(all_splits[0].metadata)


from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import LlamaCppEmbeddings

vectorstore = Chroma.from_documents(documents=all_splits, embedding=LlamaCppEmbeddings(model_path="tinyllama-1.1b-chat-v1.0.Q5_K_M.gguf"))
