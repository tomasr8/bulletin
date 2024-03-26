import time

import psycopg2
from flask import Flask, Response, jsonify, request


app = Flask(__name__)


@app.route("/api/search")
def search() -> Response:
    if not (q := request.args.get("q")):
        return jsonify([])

    offset = int(request.args.get("offset", 0))
    return jsonify(fetch_results(q, offset))


def fetch_results(q: str, offset: int) -> list[dict]:
    start = time.time()
    conn = psycopg2.connect("")

    subquery_offset = max(offset - 5, 0)
    subquery_limit = offset + 5

    with conn.cursor() as cur:
        cur.execute(
            query, {"query": q, "offset": offset, "subquery_offset": subquery_offset, "subquery_limit": subquery_limit}
        )

        results = cur.fetchall()
        results.sort(key=lambda r: -r[5])

    app.logger.debug('query: "%s" took %fs', q, time.time() - start)
    conn.close()
    return [
        {
            "year": int(result[1]),
            "issues": result[2].split("_")[0],
            "page": result[3] + 1,
            "language": result[4],
            "headline": result[6],
        }
        for result in results
    ][:5]


query = """\
SELECT * FROM
(
    SELECT id, year, issues, page, 'en-fr' as language, ts_rank_cd(to_tsvector_multilang(content), query) AS rank,
           ts_headline(content, query) as headline
    FROM bilingual_documents,
         tsquery_or(plainto_tsquery('english', %(query)s), plainto_tsquery('french', %(query)s)) query
    WHERE to_tsvector_multilang(content) @@ query
    ORDER BY rank DESC
    LIMIT %(subquery_limit)s OFFSET %(subquery_offset)s
) q1
UNION ALL
SELECT * FROM
(
    SELECT id, year, issues, page, 'en' as language, ts_rank_cd(to_tsvector('english', content), query) AS rank,
           ts_headline(content, query) as headline
    FROM english_documents, plainto_tsquery('english', %(query)s) query
    WHERE to_tsvector('english', content) @@ query
    ORDER BY rank DESC
    LIMIT %(subquery_limit)s OFFSET %(subquery_offset)s
) q2
UNION ALL
SELECT * FROM
(
    SELECT id, year, issues, page, 'fr' as language, ts_rank_cd(to_tsvector('french', content), query) AS rank,
           ts_headline(content, query) as headline
    FROM french_documents, plainto_tsquery('french', %(query)s) query
    WHERE to_tsvector('french', content) @@ query
    ORDER BY rank DESC
    LIMIT %(subquery_limit)s OFFSET %(subquery_offset)s
) q3
ORDER BY rank DESC
LIMIT 5 OFFSET %(offset)s;"""
