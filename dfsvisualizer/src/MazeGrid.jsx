import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid() {
  const initialMaze = [
    ["wall", "wall", "wall", "wall"],
    ["start", "path", "path", "wall"],
    ["wall", "wall", "path", "end"],
    ["wall", "wall", "wall", "wall"],
  ];

  const [maze, setMaze] = useState(initialMaze);

  // BFS Algorithm
  function bfs(startNode) {
    const queue = [startNode];
    const visited = new Set();
  
    function visitCell([x, y]) {
      if (maze[y][x] === "end") {
        console.log("Path found!");
        return true;
      }
      return false;
    }
  
    while (queue.length > 0) {
      const [x, y] = queue.shift();
  
      const dirs = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0], // Up
      ];
  
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
  
        if (
          nx >= 0 &&
          nx < maze[0].length &&
          ny >= 0 &&
          ny < maze.length &&
          !visited.has(`${nx},${ny}`)
        ) {
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) return true;
  
            queue.push([nx, ny]);
            visited.add(`${nx},${ny}`);
          }
        }
      }
    }
  
    console.log("No path found");
    return false;
  }
  

  // DFS Algorithm
  function dfs(startNode) {
    const stack = [startNode];
    const visited = new Set([`${startNode[0]},${startNode[1]}`]);

    function visitCell([x, y]) {
      if (maze[y][x] === "end") {
        console.log("Path found!");
        return true;
      }
      return false;
    }

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      const dirs = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0], // Up
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          nx >= 0 &&
          nx < maze[0].length &&
          ny >= 0 &&
          ny < maze.length &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);

          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) return true;

            stack.push([nx, ny]);
          }
        }
      }
    }

    console.log("No path found");
    return false;
  }

  // Generate Maze
  function generateMaze(height, width) {
    let matrix = [];

    // Initialize the matrix with walls
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }

    const dirs = [
      [0, 1], // Right
      [1, 0], // Down
      [0, -1], // Left
      [-1, 0], // Up
    ];

    function isCellValid(x, y) {
      return (
        y >= 0 &&
        x >= 0 &&
        x < width &&
        y < height &&
        matrix[y][x] === "wall"
      );
    }

    function carvePath(x, y) {
      matrix[y][x] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carvePath(nx, ny);
        }
      }
    }

    
    carvePath(1, 1); 

    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";

    setMaze(matrix); 
  }

  function refreshMaze() {
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    generateMaze(20, 20);
  }

  return (
    <div className="maze-grid">
      <div>
        <button
          className="maze-button"
          onClick={() => generateMaze(10, 10)}
        >
          Refresh Maze
        </button>
        <button
          className="maze-button"
          onClick={() => bfs([1, 0])}
        >
          BFS
        </button>
        <button
          className="maze-button"
          onClick={() => dfs([1, 0])}
        >
          DFS
        </button>
        <div className="maze">
          {maze.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div className={`cell ${cell}`} key={cellIndex}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
