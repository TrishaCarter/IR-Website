#!/bin/bash
# run.sh - compile and run code in a safe environment

# Compile solution.c and capture errors
gcc solution.c -o solution 2> compile_error.txt
if [ $? -ne 0 ]; then
  echo "Compilation Error:"
  cat compile_error.txt
  exit 1
fi

# Run the compiled executable
./solution