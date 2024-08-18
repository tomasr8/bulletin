from dataclasses import dataclass
import sys
from pathlib import Path

from pypdf import PdfReader
from nltk.tokenize import word_tokenize


@dataclass
class Document:
    page_content: str
    metadata: dict


@dataclass
class Chunk:
    text: str
    metadata: dict


def get_document():
    docs = []
    pdf = Path(__file__).parents[1] / "client/public/issues/2021/4-5_en.pdf"

    try:
        reader = PdfReader(pdf)
    except Exception as e:  # noqa: BLE001
        print(f"Failed to read {pdf}. Aborting..")
        sys.exit(1)

    year = pdf.parents[0].stem
    issue = pdf.stem

    for i, page in enumerate(reader.pages):
        print(f"∟ {year}/{issue}: page {i}")
        text = page.extract_text()
        docs.append(Document(text, {"year": year, "issue": issue, "page": i}))
    return docs


def chunk_text(text, chunk_size):
    tokenized_text = word_tokenize(text)
    num_tokens = len(tokenized_text)

    chunks = []
    start_index = 0

    while start_index < num_tokens:
        end_index = min(start_index + chunk_size, num_tokens)
        chunk_tokens = tokenized_text[start_index:end_index]
        chunk = " ".join(chunk_tokens)
        chunks.append(chunk)
        start_index = end_index

    return chunks


def chunk_pages(pages, chunk_size):
    chunks = []
    for page in pages:
        page_chunks = chunk_text(page.page_content, chunk_size)
        chunks.extend(Chunk(c, page.metadata) for c in page_chunks)
    return chunks

# pages = get_document()


# chunks = chunk_text(docs[0].page_content, 50)
# chunks = chunk_pages(pages, 50)
# print(len(chunks))
# for c in chunks:
#     print(c)
