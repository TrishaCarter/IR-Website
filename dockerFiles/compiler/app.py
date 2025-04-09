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
        cuda_path = os.path.join(repo_path, "cuda")

        # If the code is C code, save it to a .c file, otherwise save it to a .cu file
        if data["cuda"] == True:
            print("CUDA Code detected")
            with open(os.path.join(cuda_path, "testing.cu"), "w") as f:
                f.write(data["code"])
        else:
            with open(os.path.join(repo_path, "testing.c"), "w") as f:
                f.write(data["code"])

        # Attempt to compile CUDA code
        if data["cuda"] == True:
            proc = subprocess.Popen(["python3", "cuda_preprocess.py", "testing.cu", "cuda.rbe", str(data["probID"])], cwd=cuda_path, universal_newlines=True, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        else:
            proc = subprocess.Popen(["python3", "c_preprocess.py", "testing.c", '{"#1": "$1"}', "c.rbe", str(data["probID"])], cwd=repo_path, universal_newlines=True, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        
        out, err = proc.communicate()

        print(out)

        return jsonify({"output": out}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1738)