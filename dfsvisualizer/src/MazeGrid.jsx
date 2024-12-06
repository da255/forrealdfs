import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid({ width = 20, height = 20 }) {
  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState([]);

  useEffect(() => {
    generateMaze(height, width);
  }, []);

  function resetCells() {
    
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
  function bfs(startNode) {
    resetCells()
    let queue = [startNode];
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);

    function visitCell(x, y) {
      console.log(x, y);

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
      if (queue.length === 0) {
        return;
      }

      const [x, y] = queue.shift();
      console.log("new step");
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell(nx, ny)) {
              return true;
            }
            queue.push([nx, ny]);
          }
        }
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [
        ...previousTimeoutIds,
        timeoutId,
      ]);
    }

    step();
    return false;
  }

  function dfs(startNode) {
    resetCells()
    let stack = [startNode];
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

      if (maze[y][x] === "end") {
        console.log("path found!");
        return true;
      }
      return false;
    }

    function step() {
      if (stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop();
      console.log("new step");
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell(nx, ny)) {
              return true;
            }
            stack.push([nx, ny]);
          }
        }
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [
        ...previousTimeoutIds,
        timeoutId,
      ]);
    }

    step();
    return false;
  }
  function starA(startNode,endNode) {
    resetCells()
    let openSet = [startNode];
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);
    let gScore = {[`${startNode[0]},${startNode[1]}`]: 0};
    let fScore = {[`${startNode[0]},${startNode[1]}`]: heuristic(startNode, endNode)};
    
    function heuristic([x,y],[ex,ey]){
      return Math.abs(x - ex) + Math.abs(y - ey);
    }


    function visitCell(x, y) {
      console.log(x, y);

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
    openSet.sort((a,b) => fScore[`${a[0]},${a[1]}`] - fScore[`${b[0]}, b{[1]}}`]);
    const [x, y] = openSet.shift();
    console.log("new step");
    const dirs = [
          [0, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
        ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        const neighbour = `${nx},${ny}`;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          const tentativeGscore = gScore[`${x},${y}`] + 1;
          if (tentativeGscore < (gScore[neighbour]) || Infinity){
            gScore[neighbour] = tentativeGscore;
            fScore[neighbour] = tentativeGscore + heuristic([nx,ny], endNode);
          }
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell(nx, ny)) {
              return true;
            }
            openSet.push([nx, ny]);
          }
        }
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [
        ...previousTimeoutIds,
        timeoutId,
      ]);
    }

    step();
    return false;
  }

  function generateMaze(height, width) {
    let matrix = [];

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
      <div className="controls">
        <button className="maze-button" onClick={refreshMaze}>
          Refresh Maze
        </button>
        <button className="maze-button" onClick={() => bfs([1, 0])}>
          BFS
        </button>
        <button className="maze-button" onClick={() => dfs([1, 0])}>
          DFS
        </button>
        <button className="maze-button" onClick={() => starA([1, 0],[width - 1, height - 2])}>
          starA
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
      </div>
    </div>
  );
}
