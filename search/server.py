from flask import Flask, request

app = Flask(__name__)


@app.route('/api/search')
def search():
    query = request.args.get('q')
    print("Q", query)
    return [1, 2, 3]


app.run(host='0.0.0.0', port=5000)
