# Stage 1: Build and Setup
FROM alpine:latest as builder

# Install build dependencies
RUN apk update && apk add --no-cache git build-base curl tar python3 py3-pip

WORKDIR /app

# Clone repositories and build components
RUN git clone https://github.com/dubya62/optimizinator69420.git && \
    cd optimizinator69420 && \
    git pull origin main && \
    rm -rf rule_based_engine/ PICIR/ ir_compiler/ && \
    git clone https://github.com/dubya62/ir_compiler.git && \
    git clone https://github.com/dubya62/rule_based_engine.git && \
    git clone https://github.com/TrishaCarter/PICIR.git && \
    make -C rule_based_engine clean && \
    make -C rule_based_engine install

# Install Python dependencies (if you have a requirements.txt)
COPY requirements.txt /app/requirements.txt
RUN pip3 install --prefix=/install -r /app/requirements.txt

COPY . /app

WORKDIR /app

# Expose port (if needed)
EXPOSE 1738

# Run the Flask app using Gunicorn
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:1738", "myapp:app"]