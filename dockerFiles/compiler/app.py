from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import subprocess, os, time, tempfile

app = Flask(__name__)
CORS(app, resources={r"/check": {"origins": "*"}})

@app.route('/check', methods=['POST', 'OPTIONS'])
def check():

    if request.method == 'OPTIONS':
        # This will return a 200 OK with the CORS headers
        return '', 200

    try:

        data = request.get_json()
        code = data.get("code")
        cuda = data.get("cuda", False)
        uid = data.get("user")
        probID = data.get("probID")
        numArgs = data.get("numArgs")
        functionName = data.get("functionName")

        if not probID:
            return jsonify({"error": "Missing probID"}), 400

        if not code:
            return jsonify({"error": "Missing code"}), 400

        repo_path = os.path.join(os.getcwd(), "RBE_Preprocess", "ir_compiler")

        # Write the user-submitted code to testing.c in the repo.
        testing_c_path = os.path.join(repo_path, "testing.c")
        # if it doesnt exist, create the testing.c file
        with open(testing_c_path, "w") as f:
            f.write(code)
            print(code)

        if cuda:
            proc = subprocess.Popen(
                ["python3", "cuda_preprocess.py", "testing.cu", "cuda.rbe", str(probID)],
                cwd=repo_path,
                universal_newlines=True,
                stdout=subprocess.PIPE,
                stdin=subprocess.PIPE
            )
        else:
            proc = subprocess.Popen(
                ["python3", "c_preprocess.py", "testing.c", str(numArgs), functionName, '{"#1": "$1"}', "c.rbe", str(probID)],
                cwd=repo_path,
                universal_newlines=True,
                stdout=subprocess.PIPE,
                stdin=subprocess.PIPE
            )

        out, err = proc.communicate()

        with open(os.path.join(repo_path, "c.rbe"), "r") as f:
            rbe_code = f.read()
            print("RBE Code:", rbe_code)

        # Optionally log err if needed.
        return jsonify({"output": out}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # try:
    #     data = request.get_json()
    #     print(data)
    #     user = data.get("user")
    #     code = data.get("code")
    #     probid = data.get("probID")

    #     if not code:
    #         return jsonify({"error": "Missing code"}), 400

    #     # Save the incoming request data to a file
    #     repo_path = os.path.join(os.getcwd(), "RBE_Preprocess", "ir_compiler")
    #     with open(os.path.join(repo_path, "testing.c"), "w") as f:
    #         f.write(data["code"])

    #     # If the code is C code, save it to a .c file, otherwise save it to a .cu file
    #     if data["cuda"] == True:
    #         print("CUDA Code detected")
    #         # with open(os.path.join(cuda_path, "testing.cu"), "w") as f:
    #         #     f.write(data["code"])
    #     else:
    #         with open(os.path.join(repo_path, "testing.c"), "w") as f:
    #             f.write(data["code"])

    #     # Attempt to compile CUDA code
    #     if data["cuda"] == True:
    #         proc = subprocess.Popen(["python3", "cuda_preprocess.py", "testing.cu", "cuda.rbe", str(data["probid"])], cwd=cuda_path, universal_newlines=True, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
    #     else:
    #         prob_id = data.get("probID")
    #         proc = subprocess.Popen(["python3", "c_preprocess.py", "testing.c", '{"#1": "$1"}', "c.rbe", str(prob_id)], cwd=repo_path, universal_newlines=True, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        
    #     out, err = proc.communicate()

    #     print(out)

    #     return jsonify({"output": out}), 200
    # except subprocess.CalledProcessError as e:
    #     return jsonify({"error": str(e)}), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1738)
