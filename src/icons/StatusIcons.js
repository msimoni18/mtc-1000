import React from "react";

export function HeaterStatusIcon(props) {
  return props.status ? <span>🔴</span> : <span>🔵</span>;
}

export function ArduinoStatusIcon(props) {
  return props.status ? <span>🟢</span> : <span>🔴</span>;
}
