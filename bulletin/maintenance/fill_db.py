import os
import sys
from pathlib import Path

import psycopg2
from pypdf import PdfReader


insert_query = """INSERT INTO {}(year, issues, page, content) VALUES (%s, %s, %s, %s);"""


def get_table_name(filename):
    if filename.endswith("_en"):
        return "english_documents"
    if filename.endswith("_fr"):
        return "french_documents"
    return "bilingual_documents"


def prepare_db(conn, cur):
    sql = (Path(__file__).parent / "init.sql").read_text()
    cur.execute(sql)
    conn.commit()


def insert_into_db(conn, cur):
    for pdf in (Path(__file__).parents[1] / "client/public/issues").rglob("*"):
        if not pdf.is_file():
            continue

        try:
            reader = PdfReader(pdf)
        except Exception:  # noqa: BLE001
            print(f"Failed to read {pdf}. Aborting..")
            sys.exit(1)

        year = pdf.parents[0].stem
        issue = pdf.stem
        table_name = get_table_name(issue)
        issue = issue.split("_")[0]  # strip the language from the name

        for i, page in enumerate(reader.pages):
            print(f"∟ {year}/{issue}: page {i}")
            text = page.extract_text()
            cur.execute(insert_query.format(table_name), (year, issue, i, text))
    conn.commit()


def post_insert(conn, cur):
    sql = (Path(__file__).parent / "post_init.sql").read_text()
    cur.execute(sql)
    conn.commit()


def analyze(conn, cur):
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    cur.execute("ALTER DATABASE bulletin SET default_statistics_target = '10000'")
    cur.execute("VACUUM (FULL,ANALYZE)")


if __name__ == "__main__":
    conn = psycopg2.connect(f"dbname=bulletin")
    cur = conn.cursor()

    prepare_db(conn, cur)
    insert_into_db(conn, cur)
    post_insert(conn, cur)
    analyze(conn, cur)
    cur.close()
    conn.close()
