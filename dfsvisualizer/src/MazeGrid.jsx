import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid({ width = 20, height = 20 }) {
  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState([]);

  useEffect(() => {
    generateMaze(height, width);
  }, []);

  function resetVisitedCells() {
    
    setMaze((prevMaze) =>
      prevMaze.map((row) =>
        row.map((cell) =>
          cell === "visited" ? "path" : cell // Reset visited cells to "path"
        )
      )
    );
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
  }

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
    resetVisitedCells()
    let queue = [startNode];
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);

    function visitCell(x, y) {
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            rowIndex === y && cellIndex === x
              ? cell === "end"
                ? "end"
                : "visited"
              : cell
          )
        )
      );

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
          ny < height &&
          !visited.has(`${nx},${ny}`) &&
          (maze[ny][nx] === "path" || maze[ny][nx] === "end")
          ny < maze.length &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (visitCell(nx, ny)) {
            return true;
          }
          queue.push([nx, ny]);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) return true;
  
            queue.push([nx, ny]);
            visited.add(`${nx},${ny}`);
          }
        }
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((prevTimeoutIds) => [
        ...prevTimeoutIds,
        timeoutId,
      ]);
    }

    step();
    }
  
    console.log("No path found");
    return false;
  }
  

  // DFS Algorithm
  function dfs(startNode) {
    resetVisitedCells()
    let stack = [startNode];
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);
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
          ny < height &&
          !visited.has(`${nx},${ny}`) &&
          (maze[ny][nx] === "path" || maze[ny][nx] === "end")
          ny < maze.length &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (visitCell(nx, ny)) {
            return true;
          }
          stack.push([nx, ny]);

          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) return true;

            stack.push([nx, ny]);
          }
        }
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((prevTimeoutIds) => [
        ...prevTimeoutIds,
        timeoutId,
      ]);
    }

    console.log("No path found");
    return false;
  }

  function aStar(startNode, endNode) {       
    
    resetVisitedCells()
    let openSet = [startNode];    
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);
    
    let gScore = { [`${startNode[0]},${startNode[1]}`]: 0 };
    let fScore = { [`${startNode[0]},${startNode[1]}`]: heuristic(startNode, endNode) };

    function heuristic([x, y], [ex, ey]) {
      return Math.abs(x - ex) + Math.abs(y - ey); 
    }

    function visitCell(x, y) {
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            rowIndex === y && cellIndex === x
              ? cell === "end"
                ? "end"
                : "visited"
              : cell
          )
        )
      );

      if (maze[y][x] === "end") {
        console.log("path found!");
        return true;
      }
      return false;
    }

    function step() {
      if (openSet.length === 0) {
        
        return;
      }

      openSet.sort((a, b) => fScore[`${a[0]},${a[1]}`] - fScore[`${b[0]},${b[1]}`]);
      const [x, y] = openSet.shift();

      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        const neighbor = `${nx},${ny}`;

        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(neighbor) &&
          (maze[ny][nx] === "path" || maze[ny][nx] === "end")
        ) {
          const tentativeGScore = gScore[`${x},${y}`] + 1;
          

          if (tentativeGScore < (gScore[neighbor] || Infinity)) {
            gScore[neighbor] = tentativeGScore;
            fScore[neighbor] = tentativeGScore + heuristic([nx, ny], endNode);
            
          }
          visited.add(`${x},${y}`);
          if (visitCell(x, y)) {
            return;
          }

          openSet.push([nx, ny]);
        }

      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((prevTimeoutIds) => [...prevTimeoutIds, timeoutId]);
    }

    step();
  }

  function dijkstra(startNode) {
    resetVisitedCells(); // Clear the board before starting
    let openSet = [[startNode[0], startNode[1]]]; // Start with the starting node
    let visited = new Set([`${startNode[0]},${startNode[1]}`]); // Track visited nodes
    let gScore = { [`${startNode[0]},${startNode[1]}`]: 0 }; // Initialize gScore for the start nod
      
    function step() {
      if (openSet.length === 0) {
        console.log("No path found!");
        return;
      }
  
  
      // Sort openSet by gScore (not fScore, since there's no heuristic in Dijkstra)
      openSet.sort((a, b) => gScore[`${a[0]},${a[1]}`] - gScore[`${b[0]},${b[1]}`]);
      const [x, y] = openSet.shift(); // Take the node with the lowest gScore
  
      // If the current node is the goal, stop the algorithm
      if (maze[y][x] === "end") {
        console.log("Path found!");
        return;
      }
  
      // Explore neighbors
      const dirs = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0], // Up
      ];
  
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        const neighbor = `${nx},${ny}`;
  
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(neighbor) &&
          (maze[ny][nx] === "path" || maze[ny][nx] === "end")
        ) {
          visited.add(neighbor);
  
          // Calculate tentative gScore
          const tentativeGScore = gScore[`${x},${y}`] + 1;
  
          if (tentativeGScore < (gScore[neighbor] || Infinity)) {
            gScore[neighbor] = tentativeGScore; // Update gScore
            openSet.push([nx, ny]); // Add neighbor to openSet
          }
        }
      }
  
      const timeoutId = setTimeout(step, 100); // Delay for visualization
      setTimeoutIds((prevTimeoutIds) => [...prevTimeoutIds, timeoutId]);
    }
  
    step(); // Start the Dijkstra algorithm
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
        <button className="maze-button" onClick={() => bfs([0, 1])}>
        <button
          className="maze-button"
          onClick={() => bfs([1, 0])}
        >
          BFS
        </button>
        <button className="maze-button" onClick={() => dfs([0, 1])}>
        <button
          className="maze-button"
          onClick={() => dfs([1, 0])}
        >
          DFS
        </button>
        <button className="maze-button" onClick={() => aStar([0,1], [width - 1, height - 2])}>
          A* Search
        </button>
        <button className="maze-button" onClick={() => dijkstra([1,1])}>
          Dijkstra
        </button>
      </div>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div className={`cell ${cell}`} key={cellIndex}></div>
            ))}
          </div>
        ))}
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
