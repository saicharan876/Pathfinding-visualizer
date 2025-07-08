export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // Skip walls
    if (closestNode.isWall) continue;

    // Early exit if unreachable
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Stop if we reached the target
    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
}

function sortNodesByDistance(nodes) {
  nodes.sort((a, b) => a.distance - b.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    const tentativeDistance = node.distance + 1;
    if (tentativeDistance < neighbor.distance) {
      neighbor.distance = tentativeDistance;
      neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((n) => !n.isVisited);
}

function getAllNodes(grid) {
  return grid.flat(); 
}

// Trace shortest path from finishNode to startNode
export function getNodesInShortestPathOrder(finishNode) {
  const path = [];
  let current = finishNode;
  while (current) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}
