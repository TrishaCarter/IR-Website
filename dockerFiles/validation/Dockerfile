# Use the official GCC image as the base
FROM gcc:latest

# Install Python and venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate the venv and install Flask
RUN /opt/venv/bin/pip install flask

# Set environment path
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory inside container
WORKDIR /usr/src/app

# Install Python dependencies (if you have a requirements.txt)
COPY requirements.txt /app/requirements.txt
RUN pip3 install --break-system-packages  -r /app/requirements.txt
ENV PATH="/install/bin:${PATH}"

# Copy your scripts
COPY server.py /usr/src/app/server.py
COPY run.sh /usr/src/app/run.sh

# Make run.sh executable
RUN chmod +x /usr/src/app/run.sh

# Expose port
EXPOSE 1739

# Run the Flask server
CMD ["gunicorn", "--log-level", "debug", "--workers", "3", "--bind", "0.0.0.0:1739", "server:app"]