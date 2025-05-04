import requests
from flask import Flask, request

app = Flask(__name__)

@app.route('/run_test', methods=['POST'])
def run_test():
    resp = requests.post("http://da-optimizer.ddns.net:1743/run-test", data=request.data)
    return resp.content, resp.status_code
