from dataclasses import dataclass
from pathlib import Path
import re
import string
from collections import Counter
import math

from pypdf import PdfReader
# import Stemmer
from stopwords import english, french


@dataclass
class Document:
    ID: str
    issue: str
    year: str
    text: str

    def analyze(self):
        self.term_frequencies = Counter(tokenize(self.text))

    def term_frequency(self, term):
        return self.term_frequencies.get(term, 0)

    def __repr__(self):
        return f"Document(ID={self.ID})"


def load_documents():
    for pdf in (Path(__file__).parent / "../bulletin/public/issues").iterdir():
        assert pdf.is_file
        reader = PdfReader(pdf)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        name = pdf.stem
        issue, year = name.split("-")
        yield Document(ID=name, issue=issue, year=year, text=text)


# STEMMER_EN = Stemmer.Stemmer('english')
# STEMMER_FR = Stemmer.Stemmer('french')


def tokenize(text):
    PUNCTUATION = re.compile('[%s]' % re.escape(string.punctuation))

    tokens = text.split()
    tokens = [token.lower() for token in tokens]
    tokens = [PUNCTUATION.sub('', token) for token in tokens]
    tokens = [token for token in tokens if token not in english]
    tokens = [token for token in tokens if token not in french]
    tokens = [token for token in tokens if token]
    return tokens


# def stem_filter(tokens):
#     return STEMMER.stemWords(tokens)


class Index:
    def __init__(self):
        self.index = {}
        self.documents = {}

    def index_document(self, document):
        assert document.ID not in self.documents
        self.documents[document.ID] = document
        document.analyze()

        for token in tokenize(document.text):
            if token not in self.index:
                self.index[token] = set()
            self.index[token].add(document.ID)

    def _results(self, analyzed_query):
        return [self.index.get(token, set()) for token in analyzed_query]

    def search(self, query, rank=True):
        """
        Boolean search; this will return documents that contain all words from the
        query, but not rank them (sets are fast, but unordered).
        """
        analyzed_query = tokenize(query)
        results = self._results(analyzed_query)
        documents = [self.documents[doc_id] for doc_id in set.intersection(*results)]

        if rank:
            return self.rank(analyzed_query, documents)
        return documents

    def document_frequency(self, token):
        return len(self.index.get(token, set()))

    def inverse_document_frequency(self, token):
        return math.log10(len(self.documents) / self.document_frequency(token))

    def rank(self, analyzed_query, documents):
        results = []
        if not documents:
            return results
        for document in documents:
            score = 0.0
            for token in analyzed_query:
                tf = document.term_frequency(token)
                idf = self.inverse_document_frequency(token)
                score += tf * idf
            results.append((document, score))
        return sorted(results, key=lambda doc: doc[1], reverse=True)



index = Index()
for document in load_documents():
    index.index_document(document)
print(index.search("STAFF ASSOCIATION"))
