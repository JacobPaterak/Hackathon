@echo off
cd /d %~dp0

python -m venv venv

call venv\Scripts\activate

pip install --upgrade pip >nul
pip install -r requirements.txt

python cloud_to_arduino.py

pause
