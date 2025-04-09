from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import subprocess, os

app = Flask(__name__)
CORS(app, resources={r"/check": {"origins": "http://localhost:3000"}})

@app.route('/check', methods=['POST', 'OPTIONS'])
def check():

    if request.method == 'OPTIONS':
        # This will return a 200 OK with the CORS headers
        return '', 200

    try:
        data = request.get_json()

        # Save the incoming request data to a file
        repo_path = os.path.join(os.getcwd(), "C_DeezNuts_Source_Code", "ir_compiler")
        with open(os.path.join(repo_path, "testing.c"), "w") as f:
            f.write(data["code"])


        proc = subprocess.Popen(["python3", "c_preprocess.py", "testing.c", '{"#1": "$1"}', "c.rbe", "1"], cwd=repo_path, universal_newlines=True, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        out, err = proc.communicate()

        print(out)

        return jsonify({"output": out}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1738)