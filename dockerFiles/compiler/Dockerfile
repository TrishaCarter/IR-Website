# Stage 1: Build and Setup
FROM ubuntu

# Install build dependencies
RUN apt update && apt install -y git build-essential curl tar python3 python3-pip gcc linux-tools-generic
#  nvidia-cuda-toolkit 

WORKDIR /app

# Clone repositories and build components
# RUN git clone https://github.com/dubya62/optimizinator69420.git && \
#     cd optimizinator69420 && \
#     git pull origin main && \
#     rm -rf rule_based_engine/ PICIR/ ir_compiler/ && \
#     git clone https://github.com/dubya62/ir_compiler.git && \
#     git clone https://github.com/dubya62/rule_based_engine.git && \
#     git clone https://github.com/TrishaCarter/PICIR.git && \
#     make -C rule_based_engine clean && \
#     make -C rule_based_engine install

RUN git clone https://github.com/Unkomon9/RBE_Preprocess.git

# Install Python dependencies (if you have a requirements.txt)
COPY requirements.txt /app/requirements.txt
RUN pip3 install --break-system-packages  -r /app/requirements.txt
ENV PATH="/install/bin:${PATH}"

COPY . /app

# Copy the entrypoint script and ensure it's executable
COPY entry.sh /app/entry.sh
RUN chmod +x /app/entry.sh

WORKDIR /app

# Expose port (if needed)
EXPOSE 1738

# Run the Flask app using Gunicorn
CMD ["gunicorn", "--log-level", "debug", "--workers", "3", "--bind", "0.0.0.0:1738", "app:app"]