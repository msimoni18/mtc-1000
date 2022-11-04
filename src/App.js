import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Configure from "./components/Configure";
import Graph from "./components/Graph";
import "./App.css";

function App() {
  const [port, setPort] = React.useState("");

  const changePort = (e) => {
    setPort(e.target.value);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Configure port={port} handleChange={changePort} />}
        />
        <Route path="/data" element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;
