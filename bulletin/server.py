import atexit

from flask import Flask, request, jsonify, make_response
import psycopg2
# from psycopg_pool import ConnectionPool

# conn = psycopg.connect("host=172.17.0.1 dbname=bulletin user=postgres password=Monaco port=5434")
conn = psycopg2.connect("dbname=bulletin user=postgres password=Monaco port=5434")

# conn_info = "host=172.17.0.1 dbname=bulletin user=postgres password=Monaco port=5434"
# pool = ConnectionPool(conn_info, min_size=4, max_size=20, open=True)
app = Flask(__name__)

atexit.register(lambda: conn.close())


query = """\
SELECT * FROM
(
    SELECT id, year, issues, page, 'en-fr' as language, ts_rank_cd(to_tsvector_multilang(content), query) AS rank, ts_headline(content, query) as headline
    FROM bilingual_documents, tsquery_or(plainto_tsquery('english', %(query)s), plainto_tsquery('french', %(query)s)) query
    WHERE to_tsvector_multilang(content) @@ query
    ORDER BY rank DESC
    LIMIT %(subquery_limit)s OFFSET %(subquery_offset)s
) q1
UNION ALL
SELECT * FROM
(
    SELECT id, year, issues, page, 'en' as language, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline
    FROM english_documents, plainto_tsquery('english', %(query)s) query
    WHERE to_tsvector('english', content) @@ query
    ORDER BY rank DESC
    LIMIT %(subquery_limit)s OFFSET %(subquery_offset)s
) q2
UNION ALL
SELECT * FROM
(
    SELECT id, year, issues, page, 'fr' as language, ts_rank_cd(to_tsvector('french', content), query) AS rank, ts_headline(content, query) as headline
    FROM french_documents, plainto_tsquery('french', %(query)s) query
    WHERE to_tsvector('french', content) @@ query
    ORDER BY rank DESC
    LIMIT %(subquery_limit)s OFFSET %(subquery_offset)s
) q3
ORDER BY rank DESC
LIMIT 5 OFFSET %(offset)s;
"""


def search_db(q, offset):
    with conn.cursor() as cur:
        cur = conn.cursor()
        results = []

        import time
        start = time.time()

        subquery_offset = max(offset - 5, 0)
        subquery_limit = offset + 5
        cur.execute(query, dict(query=q, offset=offset,
                                subquery_offset=subquery_offset,
                                subquery_limit=subquery_limit))

        results += cur.fetchall()

        end = time.time()
        print("TIME:", end-start)

        results.sort(key=lambda r: -r[5])

        return [
            {
                'year': int(result[1]),
                'issues': result[2].split('_')[0],
                'page': result[3] + 1,
                'language': result[4],
                'headline': result[6]
            } for result in results
        ][:5]


@app.route('/api/search')
def search():
    q = request.args.get('q')
    offset = int(request.args.get('offset', 0))
    print("QUERY", q)
    if not q:
        return jsonify([])

    results = search_db(q, offset)
    return jsonify(results)


@app.route('/pdf/<year>/<issue>')
def pdf(year, issue):
    year = int(year)

    with conn.cursor() as cur:
        cur = conn.cursor()

        query = 'SELECT content from pdfs WHERE year = %(year)s AND issue = %(issue)s'
        cur.execute(query, dict(year=year, issue=issue))

        pdf = cur.fetchone()[0]
        print("%%%% PDF:", pdf)
        # return {}
        response = make_response(bytes(pdf))
        response.headers.set('Content-Type', 'application/pdf')
        response.headers['Content-Disposition'] = f'inline; filename={year}/{issue}.pdf'
        return response



# app.run(host='0.0.0.0', port=5000)
