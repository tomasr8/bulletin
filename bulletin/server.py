import atexit
import functools

from flask import Flask, request, jsonify
from psycopg_pool import ConnectionPool


conn_info = "host=localhost dbname=bulletin user=postgres password=example port=5432"
pool = ConnectionPool(conn_info, min_size=4, max_size=20, open=True)
app = Flask(__name__)

atexit.register(lambda: pool.close())

# query_rank = """\
# SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline FROM documents, plainto_tsquery('english', 'Higgs Boson') query WHERE to_tsvector('english', content) @@ query ORDER BY rank DESC LIMIT 5;
# """

# query_rank = """\
# SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline
# FROM documents, plainto_tsquery('english', %s) query
# WHERE to_tsvector('english', content) @@ query
# ORDER BY rank DESC
# LIMIT 5
# OFFSET 0;
# """

# query_rank = """\
# SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content) || to_tsvector('french', content), query) AS rank, ts_headline(content, query) as headline
# FROM bilingual_documents, plainto_tsquery('english', %s) || plainto_tsquery('french', %s) query
# WHERE (to_tsvector('english', content) || to_tsvector('french', content)) @@ query
# UNION
# SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline
# FROM bilingual_documents, plainto_tsquery('english', %s) query
# WHERE to_tsvector('english', content) @@ query
# UNION
# SELECT id, year, issues, ts_rank_cd(to_tsvector('french', content), query) AS rank, ts_headline(content, query) as headline
# FROM bilingual_documents, plainto_tsquery('french', %s) query
# WHERE to_tsvector('french', content) @@ query

# ORDER BY rank DESC
# LIMIT 5;
# """

# query_rank = """\
# SELECT id, year, issues, ts_rank_cd(to_tsvector_multilang(content), query) AS rank, ts_headline(content, query) as headline, 'en-fr' as language
# FROM bilingual_documents, tsquery_or(plainto_tsquery('english', 'Higgs Boson'), plainto_tsquery('french', 'Higgs Boson')) query
# WHERE to_tsvector_multilang(content) @@ query
# UNION
# SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline, 'en' as language
# FROM english_documents, plainto_tsquery('english', 'Higgs Boson') query
# WHERE to_tsvector('english', content) @@ query
# UNION
# SELECT id, year, issues, ts_rank_cd(to_tsvector('french', content), query) AS rank, ts_headline(content, query) as headline, 'fr' as language
# FROM french_documents, plainto_tsquery('french', 'Higgs Boson') query
# WHERE to_tsvector('french', content) @@ query

# ORDER BY rank DESC
# LIMIT 5;
# """

# query_rank = """\
# SELECT id, year, issues, page, ts_rank_cd(to_tsvector_multilang(content), query) AS rank, ts_headline(content, query) as headline, 'en-fr' as language
# FROM bilingual_documents, tsquery_or(plainto_tsquery('english', 'Higgs Boson'), plainto_tsquery('french', 'Higgs Boson')) query
# WHERE to_tsvector_multilang(content) @@ query
# ORDER BY rank DESC
# LIMIT 5;
# """

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

query_bilingual = """\
SELECT id, year, issues, page, 'en-fr' as language, ts_rank_cd(to_tsvector_multilang(content), query) AS rank, ts_headline(content, query) as headline
FROM bilingual_documents, tsquery_or(plainto_tsquery('english', %s), plainto_tsquery('french', %s)) query
WHERE to_tsvector_multilang(content) @@ query
ORDER BY rank DESC
LIMIT 5 OFFSET %s;
"""

query_english = """\
SELECT id, year, issues, page, 'en' as language, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline
FROM english_documents, plainto_tsquery('english', %s) query
WHERE to_tsvector('english', content) @@ query
ORDER BY rank DESC
LIMIT 5 OFFSET %s;
"""

query_french = """\
SELECT id, year, issues, page, 'fr' as language, ts_rank_cd(to_tsvector('french', content), query) AS rank, ts_headline(content, query) as headline
FROM french_documents, plainto_tsquery('french', %s) query
WHERE to_tsvector('french', content) @@ query
ORDER BY rank DESC
LIMIT 5 OFFSET %s;
"""

query_englishx = """\
SELECT id, year, issues, page, 'en' as language, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline
FROM english_documents, plainto_tsquery('english', 'Nobel prize') query
WHERE to_tsvector('english', content) @@ query
ORDER BY rank DESC
LIMIT 5;
"""

query_frenchx = """\
SELECT id, year, issues, page, 'fr' as language, ts_rank_cd(to_tsvector('french', content), query) AS rank, ts_headline(content, query) as headline
FROM french_documents, plainto_tsquery('french', 'Nobel prize') query
WHERE to_tsvector('french', content) @@ query
ORDER BY rank DESC
LIMIT 5;
"""


# @functools.lru_cache(maxsize=1024)
def search_db(q, offset):
    with pool.connection() as conn:
        cur = conn.cursor()
        results = []

        import time
        start = time.time()

        subquery_offset = max(offset - 5, 0)
        subquery_limit = offset + 5
        cur.execute(query, dict(query=q, offset=offset,
                                subquery_offset=subquery_offset,
                                subquery_limit=subquery_limit))

        # cur.execute(query_bilingual, (q, q, offset))
        # results += cur.fetchall()
        # cur.execute(query_english, (q, offset))
        # results += cur.fetchall()
        # cur.execute(query_french, (q, offset))
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
    if not q:
        return jsonify([])

    print("QUERY", q)
    results = search_db(q, offset)
    return jsonify(results)


# app.run(host='0.0.0.0', port=5000)
