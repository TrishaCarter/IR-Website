import os
import tempfile
from flask import Flask, request, jsonify

app = Flask(__name__)

def generate_main(test_case, function_name):
    """
    Generates a main() function using the provided test_case.
    The test_case should be an object with an "inputs" key containing a list of 
    key/value pairs and an "expected" output (used later for comparison).
    """
    declarations = ""
    args_call = []
    # Loop over each input to generate C declarations.
    for input_obj in test_case.get("inputs", []):
        name = input_obj["name"]
        value = input_obj["value"]
        if isinstance(value, list):
            arr_str = ", ".join(str(v) for v in value)
            declarations += f"int {name}[] = {{{arr_str}}};\n"
            declarations += f"int {name}Size = sizeof({name})/sizeof({name}[0]);\n"
            args_call.append(name)
            args_call.append(f"{name}Size")
        else:
            declarations += f"int {name} = {value};\n"
            args_call.append(name)
    # If testing a function like twoSum that requires a returnSize pointer.
    if function_name == "twoSum":
        declarations += "int returnSize;\n"
        args_call.append("&returnSize")
    args_string = ", ".join(args_call)
    
    # Generate a main() that calls the function and prints the result.
    main_code = f"""
#include <stdio.h>
#include <stdlib.h>
{declarations}
int main() {{
    int* result = {function_name}({args_string});
    for (int i = 0; i < returnSize; i++) {{
        printf("%d ", result[i]);
    }}
    free(result);
    return 0;
}}
"""
    return main_code

@app.route('/run_test', methods=['POST'])
def run_tests():
    # Expect a JSON payload with keys: code, functionName, testCase
    data = request.get_json()
    user_code = data.get("code")
    function_name = data.get("functionName")
    test_case = data.get("testCase")
    output = data.get("output")  
    
    if not user_code or not test_case:
        return jsonify({"error": "Missing code or test case"}), 400

    try:

        # Generate the main() function code for this test case.
        main_code = generate_main(test_case, function_name)
        combined_code = user_code + "\n" + main_code

        # Create a temporary C file to compile and run.
        with tempfile.NamedTemporaryFile(delete=False, suffix='.c') as temp_file:
            temp_file.write(combined_code.encode())
            temp_file_path = temp_file.name
        
        # Compile the C code.
        os.system(f"gcc {temp_file_path} -o temp_program")
        
        # Run the compiled program and capture output
        os.system("./temp_program > output.txt")
        
        # Read the output from the file.
        with open("output.txt", "r") as output_file:
            results = output_file.read().strip()
            print("Output from the program:")
            print(results)
            print("User provided output:")
            print(output)
        
        # Clean up the temporary files
        os.remove(temp_file_path)
        os.remove("temp_program")
        os.remove("output.txt")

        if results == output:
            return jsonify({"passed": True, "results": results}), 200
        else:
            return jsonify({"passed": False, "results": results}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)