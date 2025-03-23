#!/bin/bash

#ubuntu commands
echo "INFO : update and installing python and libsm6 libxext6 installed" &&
sudo apt update && 
sudo apt install python3-pip &&
sudo apt-get install ffmpeg libsm6 libxext6 &&
echo "INFO : pyhton installed , ffmpeg libsm6 libxext6 installed" &&
echo "INFO : create ./buffer directory, ./temp_student_pic directory" &&
mkdir -p  buffer && 
mkdir -p temp_student_pic &&
echo "INFO : create virtual environment python" &&
sudo apt install python3.12-venv &&
python3 -m venv myvenv &&
echo "INFO : pip install fastapi and  uvicorn" &&
./myvenv/bin/pip install "fastapi[standard]" uvicorn &&
echo "INFO : pip install python-socketio" &&
#./myvenv/bin/pip install "python-socketio[asyncio]" &&
#custom socket-io
./myvenv/bin/pip install -e git+https://github.com/worstMev/python-engineio-wosrtMev.git#egg=engineio_worstMev
./myvenv/bin/pip install -e git+https://github.com/worstMev/python-socketio-worstMev.git#egg=python_socket_io_worstMev
echo "INFO: pip install deepface and tf-keras and pytorch" &&
./myvenv/bin/pip install deepface &&
./myvenv/bin/pip install tf-keras &&
./myvenv/bin/pip install torch &&
echo "INFO: pip install snowflake-connector-python" &&
./myvenv/bin/pip install snowflake-connector-python
