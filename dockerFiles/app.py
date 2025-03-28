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
        repo_path = os.path.join(os.getcwd(), "optimizinator69420")
        with open(os.path.join(repo_path, "testing.c"), "w") as f:
            f.write(data["code"])

        output = subprocess.check_output(["make"], cwd=repo_path, universal_newlines=True)
        print(output)
        print()

        return jsonify({"output": output}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1738)