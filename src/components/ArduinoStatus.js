import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { ArduinoStatusIcon } from "../icons/StatusIcons";

function ArduinoStatus() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      fetch("/get-arduino-status")
        .then((response) => response.json())
        .then((data) => setStatus(data));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Typography variant="h6" component="div">
      Arduino Status: <ArduinoStatusIcon status={status} />
    </Typography>
  );
}

export default ArduinoStatus;
