import atexit
import functools

from flask import Flask, request, jsonify
from psycopg_pool import ConnectionPool


conn_info = "host=localhost dbname=bulletin user=postgres password=example port=5433"
pool = ConnectionPool(conn_info, min_size=4, max_size=20, open=True)
app = Flask(__name__)

atexit.register(lambda: pool.close())

# query_rank = """\
# SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline FROM documents, plainto_tsquery('english', 'Higgs Boson') query WHERE to_tsvector('english', content) @@ query ORDER BY rank DESC LIMIT 5;
# """

query_rank = """\
SELECT id, year, issues, ts_rank_cd(to_tsvector('english', content), query) AS rank, ts_headline(content, query) as headline
FROM documents, plainto_tsquery('english', %s) query
WHERE to_tsvector('english', content) @@ query
ORDER BY rank DESC
LIMIT 5
OFFSET 0;
"""


@functools.lru_cache(maxsize=1024)
def search_db(q):
    with pool.connection() as conn:
        cur = conn.cursor()
        cur.execute(query_rank, (q,))
        results = cur.fetchall()
        return [{'year': result[1], 'issues': result[2], 'headline': result[4]} for result in results]


@app.route('/api/search')
def search():
    q = request.args.get('q')
    if not q:
        return jsonify([])

    print("QUERY", q)
    results = search_db(q)
    return jsonify(results)


app.run(host='0.0.0.0', port=5000)
