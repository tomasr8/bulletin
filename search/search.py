from dataclasses import dataclass


@dataclass
class Document:
    ID: int
    issue: str
    year: str
    text: str



# def load_documents():
#     # open a filehandle to the gzipped Wikipedia dump
#     with gzip.open('data/enwiki.latest-abstract.xml.gz', 'rb') as f:
#         doc_id = 1
#         # iterparse will yield the entire `doc` element once it finds the
#         # closing `</doc>` tag
#         for _, element in etree.iterparse(f, events=('end',), tag='doc'):
#             title = element.findtext('./title')
#             url = element.findtext('./url')
#             abstract = element.findtext('./abstract')

#             yield Abstract(ID=doc_id, title=title, url=url, abstract=abstract)

#             doc_id += 1
#             # the `element.clear()` call will explicitly free up the memory
#             # used to store the element
#             element.clear()


import Stemmer

STEMMER_EN = Stemmer.Stemmer('english')
STEMMER_FR = Stemmer.Stemmer('french')


def tokenize(text):
    return text.split()

def lowercase_filter(tokens):
    return [token.lower() for token in tokens]

def stem_filter(tokens):
    return STEMMER.stemWords(tokens)


import re
import string

PUNCTUATION = re.compile('[%s]' % re.escape(string.punctuation))

def punctuation_filter(tokens):
    return [PUNCTUATION.sub('', token) for token in tokens]


def stopword_filter(tokens):
    return [token for token in tokens if token not in STOPWORDS]

class Index:
    def __init__(self):
        self.index = {}
        self.documents = {}

    def index_document(self, document):
        if document.ID not in self.documents:
            self.documents[document.ID] = document

        for token in analyze(document.fulltext):
            if token not in self.index:
                self.index[token] = set()
            self.index[token].add(document.ID)

    def _results(self, analyzed_query):
        return [self.index.get(token, set()) for token in analyzed_query]

    def search(self, query):
        """
        Boolean search; this will return documents that contain all words from the
        query, but not rank them (sets are fast, but unordered).
        """
        analyzed_query = analyze(query)
        results = self._results(analyzed_query)
        documents = [self.documents[doc_id] for doc_id in set.intersection(*results)]

        return documents
