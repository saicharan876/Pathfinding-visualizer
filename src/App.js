import React, { useState, useRef } from "react";
import PathfindingVisualizer from "./Path/path.jsx";
import "./App.css";

function App() {
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const visualizerRef = useRef();

  const handleModeChange = (mode) => {
    if (visualizerRef.current) {
      visualizerRef.current.setMode(mode);
    }
  };

  const visualizeAlgorithm = () => {
    if (visualizerRef.current) {
      visualizerRef.current.runVisualization();
    }
  };

  const resetGrid = () => {
    if (visualizerRef.current) {
      visualizerRef.current.resetGrid();
    }
  };

  return (
    <div className="App">
      <div className="top-controls">
        <div className="select-container">
          <label htmlFor="algorithm-select">Algorithm:</label>
          <select
            id="algorithm-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="dijkstra">Dijkstra</option>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
        </div>

        <div className="button-group">
          <button onClick={() => handleModeChange("start")}>Set Start</button>
          <button onClick={() => handleModeChange("end")}>Set End</button>
          <button onClick={() => handleModeChange("wall")}>Draw Walls</button>

          <button onClick={() => visualizerRef.current.resetGridKeepWalls()}>
            Reset (Keep Walls)
          </button>
          <button onClick={() => visualizerRef.current.resetGridFull()}>
            Reset Grid (Full)
          </button>

          <button onClick={visualizeAlgorithm}>
            Visualize {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}
          </button>
        </div>
      </div>

      <PathfindingVisualizer ref={visualizerRef} algorithm={algorithm} />
    </div>
  );
}

export default App;
