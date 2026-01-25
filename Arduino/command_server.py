from flask import Flask, request, jsonify

app = Flask(__name__)

CURRENT_COMMAND = None
LAST_RESULT = None

@app.route("/set", methods=["POST"])
def set_command():
    global CURRENT_COMMAND
    CURRENT_COMMAND = request.json["command"]
    return "OK"

@app.route("/get", methods=["GET"])
def get_command():
    global CURRENT_COMMAND
    cmd = CURRENT_COMMAND
    CURRENT_COMMAND = None
    return jsonify({"command": cmd})

@app.route("/result", methods=["POST"])
def result():
    global LAST_RESULT
    LAST_RESULT = request.json["result"]
    return "OK"

app.run(host="0.0.0.0", port=8000)
