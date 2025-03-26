from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import git

git.Repo.clone_from("https://github.com/dubya62/optimizinator69420", "optimizinator69420")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run', methods=['POST'])
def run_script():
    try:
        # Save the incoming request data to a file
        with open("input_data.c", "w") as f:
            f.write(request.data)

        # Run the script and return the output
        output = subprocess.check_output(["make"], universal_newlines=True)
        return jsonify({"output": output})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1738)