from pathlib import Path

from pypdf import PdfReader
import psycopg2

# Connect to your postgres DB
conn = psycopg2.connect("host=localhost dbname=bulletin user=postgres password=example port=5433")

# Open a cursor to perform database operations
cur = conn.cursor()

query = """INSERT INTO documents(year, issues, content) VALUES (%s, %s, %s);"""


def load_documents():
    for pdf in (Path(__file__).parent / "../bulletin/public/issues").rglob("*"):
        if not pdf.is_file():
            continue
        reader = PdfReader(pdf)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        year = pdf.parents[0].stem
        issues = pdf.stem
        print(f"{year}/{issues}")
        cur.execute(query, (year, issues, text))


load_documents()
conn.commit()
cur.close()
