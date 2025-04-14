import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, origins=["*"])

def slug_to_camel(slug):
    parts = slug.split('-')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def generate_main(test_case, function_name, result_type):
    if isinstance(test_case, dict) and "inputs" not in test_case:
        test_case = [test_case]
    declarations = ""
    args_call = []
    for input_obj in test_case:
        if not isinstance(input_obj, dict):
            try:
                input_obj = json.loads(input_obj)
            except Exception as e:
                raise ValueError(f"Cannot parse input: {input_obj} - {e}")
        var_name = input_obj["name"]
        var_type = input_obj.get("type", "int")
        value = input_obj["value"]
        if var_type.endswith("[]"):
            base_type = var_type[:-2]
            if isinstance(value, list):
                arr_str = ", ".join(str(v) for v in value)
            else:
                arr_str = value.strip()[1:-1]
            declarations += f"{base_type} {var_name}[] = {{{arr_str}}};\n"
            declarations += f"int {var_name}Size = sizeof({var_name})/sizeof({var_name}[0]);\n"
            args_call.append(var_name)
            args_call.append(f"{var_name}Size")
        else:
            declarations += f"{var_type} {var_name} = {value};\n"
            args_call.append(var_name)
    args_string = ", ".join(args_call)
    result_declaration = f"{result_type} result = {function_name}({args_string});\n"
    format_specifier = "%d"
    if result_type in ["float", "double"]:
        format_specifier = "%f"
    elif result_type == "char":
        format_specifier = "%c"
    elif result_type == "char*":
        format_specifier = "%s"
    # Added newline to the printf string for proper flushing.
    print_statement = f'printf("{format_specifier}\\n", result);\n'
    main_code = f"""
#include <stdio.h>
#include <stdlib.h>
{declarations}
int main() {{
    {result_declaration}
    {print_statement}
    return 0;
}}
"""
    return main_code

@app.route('/run_test', methods=['POST'])
def run_tests():
    data = request.get_json()
    user_code = data.get("code")
    function_name = data.get("functionName")
    result_type = data.get("resultType", "int")
    test_cases = data.get("testCase")
    if not user_code or not test_cases:
        return jsonify({"error": "Missing code or test case"}), 400
    if not isinstance(test_cases, list):
        test_cases = [test_cases]

    normalized_test_cases = []
    for tc in test_cases:
        if isinstance(tc, str):
            try:
                parsed = json.loads(tc)
                normalized_test_cases.append(parsed)
            except json.JSONDecodeError:
                return jsonify({"error": "Invalid testCase format"}), 400
        elif isinstance(tc, dict):
            if "inputs" in tc:
                inputs = tc["inputs"]
                if isinstance(inputs, str):
                    try:
                        parsed_inputs = json.loads(inputs)
                        tc["inputs"] = parsed_inputs
                    except json.JSONDecodeError:
                        return jsonify({"error": "Invalid format for testCase inputs"}), 400
                elif not isinstance(inputs, list):
                    if isinstance(inputs, dict):
                        tc["inputs"] = [inputs]
                    else:
                        return jsonify({"error": "TestCase inputs should be a list"}), 400
            normalized_test_cases.append(tc)
        else:
            normalized_test_cases.append(tc)
    test_cases = normalized_test_cases

    overall_pass = True
    results = []
    import subprocess, time
    for tc in test_cases:
        if isinstance(tc, dict) and "inputs" in tc:
            inputs = tc["inputs"]
            tc_expected = str(tc.get("output", "")).strip()
        else:
            inputs = tc
            tc_expected = str(data.get("output", "")).strip()
        main_code = generate_main(inputs, function_name, result_type)
        combined_code = user_code + "\n" + main_code
        
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_file_path = os.path.join(temp_dir, "solution.c")
            executable_path = os.path.join(temp_dir, "temp_program")
            with open(temp_file_path, "w") as temp_file:
                temp_file.write(combined_code)
            compile_res = subprocess.run(
                ["gcc", temp_file_path, "-o", executable_path],
                capture_output=True, text=True
            )
            if compile_res.returncode != 0:
                results.append({"passed": False, "error": compile_res.stderr})
                overall_pass = False
                continue
            time.sleep(0.1)
            try:
                exec_res = subprocess.run(
                    [executable_path],
                    capture_output=True, text=True, timeout=5
                )
                prog_out = exec_res.stdout.strip()
            except subprocess.TimeoutExpired:
                prog_out = "Timeout"
        pass_case = " ".join(prog_out.split()) == " ".join(tc_expected.split())
        if not pass_case:
            overall_pass = False
        results.append({"passed": pass_case, "results": prog_out, "expected": tc_expected})
    if overall_pass:
        return jsonify({"passed": True, "results": results}), 200
    else:
        return jsonify({"passed": False, "results": results}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=1739)