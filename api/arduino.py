from serial import Serial


class Arduino:

    def __init__(self, baudrate=9600, timeout=1):
        self.read_temperatures = b'!'
        self.ser = Serial(
            baudrate=baudrate,
            timeout=timeout
        )

    def start(self, port):
        """Start Arduino."""
        self.ser.setPort(port)
        self.ser.open()

    def receive(self):
        """Read output from the Arduino.

        Returns
        -------
        dict
            key: serial number of the sensor
            value: temperature
        """
        self.ser.write(self.read_temperatures)
        line = self.ser.readline().decode('utf-8').strip()
        line = line.split(',')[:-1]
        print('-' * 80)
        print(line)
        print('-' * 80)

        temperatures = {}
        for item in line:
            ser, val = item.split(':')
            temperatures[ser] = float(val)

        return temperatures
