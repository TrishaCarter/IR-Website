import requests
import json
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/run_test": {"origins": "*"}, r"/check": {"origins": "*"}})

@app.route('/run_test', methods=['POST'])
def run_test():
    req_data = request.data.decode()
    req_data = json.loads(req_data)
    # print(req_data)
    resp = requests.post("http://da-optimizer.ddns.net:1739/run_test", json=req_data, headers={"Content-Type":"application/json"})
    # print("RESP CONTENT")
    # print(resp.json())
    # print(resp.status_code)
    return resp.json(), resp.status_code

@app.route("/check", methods=["POST"])
def check():
    req_data = request.data.decode()
    req_data = json.loads(req_data)
    # print("check Req Data")
    # print(req_data)
    resp = requests.post("http://da-optimizer.ddns.net:1738/check", json=req_data, headers={"Content-Type":"application/json"})
    # print("check RESP CONTENT")
    # print(resp.json())
    # print(resp.status_code)
    return resp.json(), resp.status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=443)
