from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/check": {"origins": "http://localhost:3000"}})

@app.route('/check', methods=['POST', 'OPTIONS'])
def check():

    try:
        # Save the incoming request data to a file
        with open("testing.c", "w") as f:
            f.write(request.data.code)

        # Run the script and return the output
        output = subprocess.check_output(["make"], universal_newlines=True)
        return jsonify({"output": output}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1738)