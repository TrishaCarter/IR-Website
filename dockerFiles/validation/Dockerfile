# Use the official GCC image as the base
FROM gcc:latest

# Install Python and Flask
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install flask

# Set working directory inside container
WORKDIR /usr/src/app

# Copy the server script and any helper scripts
COPY server.py /usr/src/app/server.py
COPY run.sh /usr/src/app/run.sh

# Make sure run.sh is executable
RUN chmod +x /usr/src/app/run.sh

# Expose a port (e.g., 5000)
EXPOSE 5000

# Run the Flask server when the container starts
CMD ["python3", "server.py"]