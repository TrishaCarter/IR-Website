#!/bin/sh
# Check if the repository directory exists
if [ ! -d "optimizinator69420" ]; then
  echo "Repository not found. Cloning now..."
  git clone https://github.com/dubya62/optimizinator69420.git
else
  echo "Repository already exists. Skipping clone."
fi

# Execute Gunicorn to run your Flask app
exec gunicorn --workers 3 --bind 0.0.0.0:1738 myapp:app