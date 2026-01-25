import serial
import time
from flask import Flask

BAUDRATE = 115200
TIMEOUT = 1

def detect_arduino_port():
    import serial.tools.list_ports
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        if "Arduino" in p.description or "USB" in p.description:
            return p.device
    return ports[0].device

arduino_port = detect_arduino_port()
print(f"Using Arduino on {arduino_port}")

arduino = serial.Serial(arduino_port, BAUDRATE, timeout=TIMEOUT)
time.sleep(2)

app = Flask(__name__)

@app.route("/play", methods=["POST"])
def play():
    arduino.write(b"PLAY\n")
    while True:
        line = arduino.readline().decode().strip()
        if line == "DONE":
            return "DONE"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
