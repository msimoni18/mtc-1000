#include <OneWire.h>
#include <DallasTemperature.h>

#define TEMP_SENSOR 2

// Setup a oneWire instance to communicate with any OneWire device
OneWire oneWire(TEMP_SENSOR);

// Pass oneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);

// variable to hold device addresses
DeviceAddress Thermometer;

int deviceCount = 0;
float tempC;
float tempF;

void setup()
{
  // put setup code here to run once
  Serial.begin(9600);

  sensors.begin();

  locateTemperatureSensors();

  Serial.println("Arduino is ready!");
}

// locate all available temperature sensors on setup()
void locateTemperatureSensors()
{
  // locate devices on the bus
  Serial.println("Locating temperature sensors...");
  Serial.print("Found ");
  deviceCount = sensors.getDeviceCount();
  Serial.print(deviceCount, DEC);
  Serial.println(" sensors.");
  Serial.println("");

  Serial.println("Printing addresses...");
  for (int i = 0; i < deviceCount; i++)
  {
    Serial.print("Sensor ");
    Serial.print(i);
    Serial.print(" : ");
    sensors.getAddress(Thermometer, i);
    printAddress(Thermometer);
    Serial.println("");
  }
  Serial.println("");
}

// function to print a device address
void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16)
      Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}

void getTemperature(DeviceAddress deviceAddress)
{
  // Send the command to get temperatures.
  sensors.requestTemperatures();

  // Get temperature for each device in Fahrenheit
  // Print information
  //   serial:value for each device, separated by a comma
  for (uint8_t i = 0; i < deviceCount; i++)
  {
    if (sensors.getAddress(deviceAddress, i))
    {
      tempF = sensors.getTempFByIndex(i);
      printAddress(deviceAddress);
      Serial.print(":");
      Serial.print(tempF);
      Serial.print(",");
    }
  }
  Serial.println("");
}

void loop()
{
  // wait for data to be available
  while (Serial.available() == 0) {} 

  char ch = Serial.read();

  if (ch == '!') {
    getTemperature(Thermometer);
  };

}
