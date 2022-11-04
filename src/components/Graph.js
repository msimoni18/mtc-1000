import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./Graph.css";

function Graph() {
  const [bool, setBool] = useState(false);
  const [setpoint, setSetpoint] = useState(68);

  const [state, setState] = useState({
    data: [],
    layout: {
      width: 800,
      height: 500,
      title: "Plot Title",
      xaxis: {
        title: "Time (s)",
      },
      yaxis: {
        title: "Temperature (F)",
      },
      shapes: [
        {
          type: "line",
          xref: "paper",
          x0: 0,
          y0: setpoint,
          x1: 1,
          y1: setpoint,
          // line: {
          //   color: "rgb(255, 0, 0)",
          //   width: 4,
          //   dash: "dot",
          // },
        },
      ],
    },
    frames: [],
    config: {},
  });

  function updateState(data) {
    const newData = [];

    let keys = Object.keys(data);
    let sensors = keys.filter(removeKeys);
    function removeKeys(keys) {
      return keys !== "Time" && keys !== "Date";
    }

    sensors.forEach((sensor) => {
      const newSensor = {
        x: data["Time"],
        y: data[sensor],
        name: sensor,
        type: "scatter",
        mode: "lines+markers",
      };

      newData.push(newSensor);
    });

    setState((prevState) => {
      return {
        ...prevState,
        data: newData,
      };
    });
  }

  useEffect(() => {
    if (bool) {
      const timer = setInterval(() => {
        fetch("/get-temperatures")
          .then((response) => response.json())
          .then((data) => updateState(data));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bool]);

  const initialized = () => {
    console.log("onInitialized");
  };

  const afterPlot = (e) => {
    console.log("onAfterPlot");
  };

  const update = (e) => {
    console.log("onUpdate");
    // console.log(e.layout.shapes[0]);
  };

  const hover = () => {
    console.log("onHover");
  };

  const click = (e) => {
    console.log("onClick");
    console.log(e);
  };

  const relayout = () => {
    console.log("onRelayout");
    // console.log(state.layout);
    // console.log("x-axis layout:");
    // console.log(state.layout.xaxis);
    // console.log("y-axis layout:");
    // console.log(state.layout.yaxis);
  };

  const unhover = () => {
    console.log("onUnhover");
  };

  const selected = () => {
    console.log("onSelected");
  };

  const legendClick = (e) => {
    console.log("onLegendClick");
    console.log(e);
  };

  const changeSetpoint = (e) => {
    console.log(Number(e.target.value));
  };

  const updateLayout = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    console.log(id);
    console.log(value);
    console.log(e.target);

    if (id === "title") {
      setState((prevState) => {
        return {
          ...prevState,
          layout: {
            ...prevState.layout,
            title: value,
          },
        };
      });
    }

    if (id === "setpoint-btn") {
      setState((prevState) => {
        return {
          ...prevState,
          layout: {
            ...prevState.layout,
            shapes: [
              {
                type: "line",
                xref: "paper",
                x0: 0,
                y0: setpoint,
                x1: 1,
                y1: setpoint,
                // line: {
                //   color: "rgb(255, 0, 0)",
                //   width: 4,
                //   dash: "dot",
                // },
              },
            ],
          },
        };
      });
    }

    // setLayout({
    //   ...layout,
    //   shapes: [
    //     {
    //       type: "line",
    //       xref: "paper",
    //       x0: 0,
    //       y0: setpoint,
    //       x1: 1,
    //       y1: setpoint,
    //     },
    //   ],
    // });
  };

  return (
    <div className="graph">
      <Button
        id="start-stop-btn"
        variant="contained"
        onClick={() => setBool(!bool)}
      >
        Start/Stop
      </Button>
      <Button id="setpoint-btn" variant="contained" onClick={updateLayout}>
        Update Setpoint
      </Button>
      <TextField
        id="setpoint"
        label="Setpoint"
        variant="outlined"
        defaultValue="68"
        onChange={(e) => setSetpoint(Number(e.target.value))}
      />
      <TextField
        id="title"
        label="Title"
        variant="outlined"
        onChange={updateLayout}
      />
      <Plot
        data={state.data}
        layout={state.layout}
        frames={state.frames}
        revision={state.revision}
        onInitialized={initialized}
        onUpdate={update}
        onAfterPlot={afterPlot}
        onHover={hover}
        onClick={click}
        onRelayout={relayout}
        onUnhover={unhover}
        onSelected={selected}
        onLegendClick={legendClick}
      />
    </div>
  );
}

export default Graph;
