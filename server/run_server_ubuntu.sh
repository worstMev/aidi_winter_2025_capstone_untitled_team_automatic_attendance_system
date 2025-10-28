#!/bin/bash
rm -f ./buffer/* &&
rm -f ./temp_student_pic/* &&
./myvenv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
