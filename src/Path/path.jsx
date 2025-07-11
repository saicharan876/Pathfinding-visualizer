import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";
import { bfs } from "../Algorithms/bfs";
import { dfs, getNodesInShortestPathOrder as dfsPath } from "../Algorithms/dfs";
import Node from "./Node/Node";
import "./path.css";

const ANIMATION_SPEED = 5;
const PATH_ANIMATION_SPEED = 50;

const PathfindingVisualizer = forwardRef(({ algorithm }, ref) => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [start, setStart] = useState({ row: 18, col: 10 });
  const [end, setEnd] = useState({ row: 18, col: 50 });
  const [mode, setMode] = useState("wall");
  const [isVisualizing, setIsVisualizing] = useState(false);
  const timeoutIds = useRef([]);

  useEffect(() => {
    setGrid(getInitialGrid(start, end));
  }, [start, end]);

  useImperativeHandle(ref, () => ({
    runVisualization,
    resetGridKeepWalls,
    resetGridFull,
    setMode,
  }));

  const runVisualization = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);

    const freshGrid = resetVisited(grid, start, end);
    setGrid(freshGrid);

    const startNode = freshGrid[start.row][start.col];
    const endNode = freshGrid[end.row][end.col];
    let visitedNodesInOrder = [];

    switch (algorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(freshGrid, startNode, endNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(freshGrid, startNode, endNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(freshGrid, startNode, endNode);
        break;
      default:
        return;
    }

    const shortestPath =
      algorithm === "dfs"
        ? dfsPath(endNode)
        : getNodesInShortestPathOrder(endNode);

    if (shortestPath.length === 0) {
      alert("No path found!");
      setIsVisualizing(false);
      return;
    }

    animateAlgorithm(visitedNodesInOrder, shortestPath);
  };

 const resetGridKeepWalls = () => {
  timeoutIds.current.forEach((id) => clearTimeout(id));
  timeoutIds.current = [];
  setIsVisualizing(false);

  const clearedGrid = resetVisited(grid, start, end);
  setGrid(clearedGrid);

  for (let row of clearedGrid) {
    for (let node of row) {
      const el = document.getElementById(`node-${node.row}-${node.col}`);
      if (!el) continue;

      
      if (node.isWall) {
        el.className = "node node-wall";
      } else if (node.isStart) {
        el.className = "node node-start";
      } else if (node.isFinish) {
        el.className = "node node-finish";
      } else {
        el.className = "node";
      }
    }
  }
};


  const resetGridFull = () => {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
    setIsVisualizing(false);

    const fullResetGrid = getInitialGrid(start, end);
    setGrid(fullResetGrid);

    for (let row of fullResetGrid) {
      for (let node of row) {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = "node";
      }
    }
  };

  const handleClick = (row, col) => {
    if (isVisualizing) return;

    if (mode === "start") {
      setStart({ row, col });
    } else if (mode === "end") {
      setEnd({ row, col });
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
      setMouseIsPressed(true);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || mode !== "wall" || isVisualizing) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => setMouseIsPressed(false);

  const animateAlgorithm = (visited, path) => {
    for (let i = 0; i <= visited.length; i++) {
      const timeout = setTimeout(() => {
        if (i === visited.length) {
          animateShortestPath(path);
          return;
        }
        const node = visited[i];
        if (isStartOrEnd(node)) return;
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = "node node-visited";
      }, ANIMATION_SPEED * i);
      timeoutIds.current.push(timeout);
    }
  };

  const animateShortestPath = (path) => {
    for (let i = 0; i < path.length; i++) {
      const timeout = setTimeout(() => {
        const node = path[i];
        if (isStartOrEnd(node)) return;

        setGrid((prevGrid) =>
          prevGrid.map((row) =>
            row.map((n) =>
              n.row === node.row && n.col === node.col
                ? { ...n, isPath: true }
                : n
            )
          )
        );

        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = "node node-shortest-path";

        if (i === path.length - 1) {
          setTimeout(() => setIsVisualizing(false), PATH_ANIMATION_SPEED);
        }
      }, PATH_ANIMATION_SPEED * i);
      timeoutIds.current.push(timeout);
    }
  };

  const isStartOrEnd = (node) =>
    (node.row === start.row && node.col === start.col) ||
    (node.row === end.row && node.col === end.col);

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node) => (
            <Node
              key={`${node.row}-${node.col}`}
              {...node}
              isPath={node.isPath}
              isStart={node.row === start.row && node.col === start.col}
              isFinish={node.row === end.row && node.col === end.col}
              onMouseDown={() => handleClick(node.row, node.col)}
              onMouseEnter={() => handleMouseEnter(node.row, node.col)}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

const getInitialGrid = (start, end) => {
  const grid = [];
  for (let row = 0; row < 38; row++) {
    const currentRow = [];
    for (let col = 0; col < 58; col++) {
      currentRow.push(createNode(col, row, start, end));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, start, end) => ({
  col,
  row,
  isStart: row === start.row && col === start.col,
  isFinish: row === end.row && col === end.col,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
  isPath: false,
});

const resetVisited = (grid, start, end) =>
  grid.map((row) =>
    row.map((node) => ({
      ...node,
      distance: Infinity,
      isVisited: false,
      previousNode: null,
      isPath: false,
      isStart: node.row === start.row && node.col === start.col,
      isFinish: node.row === end.row && node.col === end.col,
      isWall: node.isWall, // ✅ preserve wall state
    }))
  );

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = { ...node, isWall: !node.isWall };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default PathfindingVisualizer;
