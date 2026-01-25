import time
import requests
import serial

CLOUD_URL = "http://YOUR_VM_IP:8000"

arduino = serial.Serial("COM8", 115200, timeout=1)
time.sleep(2)

while True:
    try:
        r = requests.get(f"{CLOUD_URL}/get", timeout=5).json()
        if r["command"] == "PLAY":
            arduino.write(b"PLAY\n")
            while True:
                if arduino.readline().decode().strip() == "DONE":
                    requests.post(
                        f"{CLOUD_URL}/result",
                        json={"result": "DONE"}
                    )
                    break
    except Exception:
        pass

    time.sleep(2)
