import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "./Configure.css";

function Configure(props) {
  const port = props.port;
  const handleChange = props.handleChange;

  const startArduino = () => {
    fetch("/start-arduino", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(port),
    })
      .then((response) => response.json())
      .then((response) => alert(response))
      .catch((error) => console.error(error));
  };

  return (
    <div className="body-container">
      <div className="header-container">
        <h1>Welcome to the MTC-1000!</h1>
        <p>
          Select a USB port and start the Arduino to start logging temperatures.
        </p>
        <br />
      </div>
      <Box sx={{ minWidth: 200 }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">USB Port</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={port}
            label="USB Port"
            onChange={handleChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={"/dev/ttyACM0"}>/dev/ttyACM0 (RPi)</MenuItem>
            <MenuItem value={"/dev/cu.usbmodem14101"}>
              /dev/cu.usbmodem14101 (Mac Left)
            </MenuItem>
            <MenuItem value={"/dev/cu.usbmodem14201"}>
              /dev/cu.usbmodem14201 (Mac Right)
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className="button-container">
        <Button variant="outlined" onClick={startArduino}>
          Start Arduino
        </Button>
      </div>
    </div>
  );
}

export default Configure;
