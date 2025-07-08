import React from 'react';
import './Node.css';

const Node = ({
  col,
  row,
  isStart,
  isFinish,
  isWall,
  isVisited,
  distance,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const getDisplay = () => {
    if (isStart) return '⛳';
    if (isFinish) return '🏁';
    if (isPath && distance !== Infinity) return distance;
    return '';
  };

  let extraClassName = '';
  if (isFinish) extraClassName = 'node-finish';
  else if (isStart) extraClassName = 'node-start';
  else if (isWall) extraClassName = 'node-wall';

  return (
    <div
      id={`node-${row}-${col}`}
      title={`(${row}, ${col})`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      <div className="node-content">{getDisplay()}</div>
    </div>
  );
};

export default Node;