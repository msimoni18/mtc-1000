import collections
import time
import random
from datetime import datetime
from serial.serialutil import SerialException, PortNotOpenError
from flask import Flask, request, render_template, send_from_directory, jsonify
from flask_cors import CORS, cross_origin
from api.arduino import Arduino

# Initial setup.
arduino = Arduino()
app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

keys = ('Date', 'Time', '28DDC649F6003C1C', '284BB049F6B03CEC', '287CA749F6EE3C02', '28AD7D49F6E13C0A') 
data = collections.defaultdict(list, {k: [] for k in keys})


@app.route("/start-arduino", methods=["POST"])
@cross_origin()
def start_arduino():
    if request.method == 'POST':
        try:
            arduino.start(port=request.json)
        except SerialException as err:
            return jsonify(str(err))
    return jsonify('Arduino was successfully started!')


@app.route("/get-arduino-status")
@cross_origin()
def active_threads():
    if arduino.ser.is_open:
        return jsonify(True)
    return jsonify(False)


@app.route('/')
@cross_origin()
def home():
    """
    Give access to app in build folder. This is needed
    to access the RPi webserver from another computer.
    """
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/get-temperatures')
@cross_origin()
def temperatures():

    output = {
        '28DDC649F6003C1C': round(random.uniform(60, 64), 2),
        '284BB049F6B03CEC': round(random.uniform(63, 67), 2),
        '287CA749F6EE3C02': round(random.uniform(68, 70), 2),
        '28AD7D49F6E13C0A': round(random.uniform(72, 75), 2), 
    } 

    # key = {
    #     '28DDC649F6003C1C': 'Sensor 1',
    #     '284BB049F6B03CEC': 'Sensor 2',
    #     '287CA749F6EE3C02': 'Sensor 3',
    #     '28AD7D49F6E13C0A': 'Sensor 4', 
    # } 

    try:
        # output = arduino.receive()
        # print(output)

        if not output:
            return jsonify(data)

        dt = datetime.now()
        data['Date'].append(dt.strftime("%Y%m%d"))
        data['Time'].append(dt.strftime("%H:%M:%S"))

        for k in data:
            if k in ('Time', 'Date'):
                continue
            if k in output:
                data[k].append(output[k])
            else:
                data[k].append(0)
        
        # print(data)
    except PortNotOpenError as err:
        # Pass an alert back to UI
        print('ERROR:', err)

    
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
