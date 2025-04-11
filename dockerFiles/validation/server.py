import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["*"])

def slug_to_camel(slug):
    parts = slug.split('-')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def generate_main(test_case, function_name):
    """
    Generates a main() function using the provided test_case.
    The test_case should be an object with an "inputs" key containing a list of 
    key/value pairs and an "expected" output (used later for comparison).
    """
    declarations = ""
    args_call = []
    # Loop over each input to generate C declarations.
    for input_obj in test_case:
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
    
    declaration = ""
    # Add this after args_string is built:
    camel_name = slug_to_camel(function_name)
    declaration = f"int* {camel_name}(int* nums, int numsSize, int target, int* returnSize);\n"
    
    # If testing a function like twoSum that requires a returnSize pointer.
    if function_name == "two-sum":
        declarations += "int returnSize;\n"
        args_call.append("&returnSize")
    args_string = ", ".join(args_call)

    
    
    # Generate a main() that calls the function and prints the result.
    main_code = f"""
#include <stdio.h>
#include <stdlib.h>
{declaration}
{declarations}
int main() {{
    int* result = {camel_name}({args_string});
    if (result != NULL) {{
        for (int i = 0; i < returnSize; i++) {{
            printf("%d ", result[i]);
        }}
        free(result);
    }} else {{
        printf("NULL");
    }}
    return 0;
}}
"""
    return main_code

@app.route('/run_test', methods=['POST'])
def run_tests():
    # Expect a JSON payload with keys: code, functionName, testCase
    data = request.get_json()
    user_code = data["code"]
    function_name = data["functionName"]
    test_case = data["testCase"]
    output = data["output"]
    
    if not user_code or not test_case:
        print("Missing code or test case")
        return jsonify({"error": "Missing code or test case"}), 400

    try:

        # Generate the main() function code for this test case.
        main_code = generate_main(test_case, function_name)
        combined_code = main_code + "\n" + user_code

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
            results_raw = output_file.read().strip()
            results_list = list(map(int, results_raw.split()))
            expected_list = eval(output) if isinstance(output, str) else output

            print("Parsed output:", results_list)
            print("Expected output:", expected_list)
        
        # Clean up the temporary files
        os.remove(temp_file_path)
        os.remove("temp_program")
        os.remove("output.txt")

        if results_list == expected_list:
            print("Tests passed")
            return jsonify({"passed": True, "results": results_raw}), 200
        else:
            print("Tests failed")
            return jsonify({"passed": False, "results": results_raw}), 200
        
    except Exception as e:
        print("An error occurred:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=1739)