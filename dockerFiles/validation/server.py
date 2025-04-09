import os
import tempfile
from flask import Flask, request, jsonify

app = Flask(__name__)

def generate_main(test_case, function_name="twoSum"):
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

@app.route('/run_tests', methods=['POST'])
def run_tests():
    # Expect a JSON payload with keys: code, functionName, testCase
    data = request.get_json()
    user_code = data.get("code")
    function_name = data.get("functionName", "twoSum")
    test_cases = data.get("testCases", {})  
    
    if not user_code or not test_cases:
        return jsonify({"error": "Missing code or test case"}), 400

    # Generate the main() function code for this test case.
    main_code = generate_main(test_case, function_name)
    combined_code = user_code + "\n" + main_code



    # Optionally, you could compare output to test_case["expected"] here.
    return jsonify({"result": output})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)