from pathlib import Path

from pypdf import PdfReader
import psycopg2

conn = psycopg2.connect('host=localhost dbname=bulletin user=postgres password=example port=5433')
cur = conn.cursor()

query = """INSERT INTO {}(year, issues, page, content) VALUES (%s, %s, %s, %s);"""


def get_language(filename):
    if filename.endswith('_en'):
        return 'en'
    elif filename.endswith('_fr'):
        return 'fr'
    else:
        return 'bilingual'


def get_table_name(lang):
    if lang == 'en':
        return 'english_documents'
    elif lang == 'fr':
        return 'french_documents'
    else:
        return 'bilingual_documents'


def prepare_db():
    sql = (Path(__file__).parent / 'init.sql').read_text()
    cur.execute(sql)
    conn.commit()


def insert_into_db():
    for pdf in (Path(__file__).parent / '../bulletin/public/issues').rglob('*'):
        if not pdf.is_file():
            continue

        try:
            reader = PdfReader(pdf)
        except Exception:
            print()
            print(f'Skipping: {pdf}')
            print()

        year = pdf.parents[0].stem
        issues = pdf.stem
        lang = get_language(issues)
        table_name = get_table_name(lang)

        for i, page in enumerate(reader.pages):
            print(f'∟ {year}/{issues}: page {i}')
            text = page.extract_text()
            cur.execute(query.format(table_name), (year, issues, i, text))
    conn.commit()


prepare_db()
insert_into_db()
cur.close()
conn.close()
