import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid({ width = 20, height = 20 }) {
  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [start, setStart] = useState([1, 0]);
  const [end, setEnd] = useState([width - 1, height - 2]);

  useEffect(() => {
    generateMaze(height, width);
  }, []);

  function resetCells() {    
    setMaze((prevMaze) =>
      prevMaze.map((row) =>
        row.map((cell) =>
          cell === "visited" || cell === "shortest" 
          ? (cell === "start" || cell === "end"  ? cell : "path") 
            : cell 
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
    let parent = {};
    parent[`${startNode[0]},${startNode[1]}`] = null;

    function reconstructPath(endNode){
      let path = [];
      let current = endNode;

      while (current !== null){
        path.push(current);
        current = parent[`${current[0]},${current[1]}`]
      }
      return path.reverse();
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
        
        const shortestPath = reconstructPath([x,y]);
        highlightPath(shortestPath);
        console.log("Highlighting path:", shortestPath);
        return true;
      }
      return false;
    }

    function highlightPath(path) {
      console.log("Highlighting path:", path);
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => 
            path.some(([x, y]) => rowIndex === y && cellIndex === x)
              ? (cell === "start" || cell === "end" ? cell : "shortest") 
              : cell 
          )
        )
      );
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
          parent[`${nx},${ny}`] = [x,y];
          console.log("Parent Map:", parent);
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

  function dfs(startNode, maze) {
    resetCells()
    let stack = [startNode];
    console.log(start);
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);
    let parent = {};
    parent[`${startNode[0]},${startNode[1]}`] = null;

    function reconstructPath(endNode){
      let path = [];
      let current = endNode;

      while (current !== null){
        path.push(current);
        current = parent[`${current[0]},${current[1]}`]
      }
      return path.reverse();
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
        const shortestPath = reconstructPath([x, y]);
        highlightPath(shortestPath);
        console.log("Highlighting path:", shortestPath);
        return true;
      }
      return false;
    }
      function highlightPath(path) {
        console.log("Highlighting path:", path);
        setMaze((prevMaze) =>
          prevMaze.map((row, rowIndex) =>
            row.map((cell, cellIndex) =>
              path.some(([x, y]) => rowIndex === y && cellIndex === x)
                ? (cell === "start" || cell === "end" ? cell : "shortest") 
                : cell
          )
        )
      );
    }
    function step() {
      if (stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop();
      console.log("new step");
      console.log("Current Maze:", maze);

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
          parent[`${nx},${ny}`] = [x,y];
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
  function starA(startNode,endNode,maze) {
    resetCells()
    let openSet = [startNode];
    let visited = new Set([`${startNode[0]},${startNode[1]}`]);
    let gScore = {[`${startNode[0]},${startNode[1]}`]: 0};
    let fScore = {[`${startNode[0]},${startNode[1]}`]: heuristic(startNode, endNode)};
    let parent = {};
    parent[`${startNode[0]},${startNode[1]}`] = null;

    function reconstructPath(endNode) {
      let path = [];
      let current = endNode;
  
      while (current !== null) {
        path.push(current);
        current = parent[`${current[0]},${current[1]}`];
      }
      return path.reverse();
    }
    
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
        const shortestPath = reconstructPath([x, y]);
        highlightPath(shortestPath);
        console.log("Highlighting path:", shortestPath);
        return true;
      }
      return false;
    }
    function highlightPath(path) {
      console.log("Highlighting path:", path);
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            path.some(([x, y]) => rowIndex === y && cellIndex === x)
              ? (cell === "start" || cell === "end" ? cell : "shortest") 
              : cell
          )
        )
      );
    }

    function step() {
      if (openSet.length === 0) {
        return;
      }
    openSet.sort((a,b) => fScore[`${a[0]},${a[1]}`] - fScore[`${b[0]},${b[1]}`]);
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
          if (tentativeGscore < ((gScore[neighbour]) || Infinity)){
            gScore[neighbour] = tentativeGscore;
            fScore[neighbour] = tentativeGscore + heuristic([nx,ny], endNode);
            parent[neighbour] = [x,y];
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
      [0, 1], 
      [1, 0], 
      [0, -1], 
      [-1, 0], 
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
    const loopProbability = 0.2
    ;

    function carvePath(x, y) {
      matrix[y][x] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carvePath(nx, ny);
        }else if (Math.random() < loopProbability){
          const rx = x + dx;
          const ry = y + dy;
          if (rx > 0 && ry > 0 && rx < width - 1 && ry < height - 1 && matrix[ry][rx] === 'wall'){
            matrix[ry][rx] = 'path';
          }
        }
      }
    }

    carvePath(1, 1);

    function getRandomPathCell() {
      while (true) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (matrix[y][x] === "path") {
          return [x, y];
        }
      }
    }

    const [startX, startY] = getRandomPathCell();
    matrix[startY][startX] = "start";
    setStart([startX, startY]);

    
    
    let [endX, endY] = getRandomPathCell();
    while (Math.abs(startX - endX) + Math.abs(startY - endY) < Math.max(width, height) / 2) {
      [endX, endY] = getRandomPathCell(); 
    }
    matrix[endY][endX] = "end";
    setEnd([endX, endY]);
    
    for (let y = 1; y<height -1; y++){
      for (let x = 1; x < width -1 ; x++)
        if(matrix[y][x] === 'wall' &&
          Math.random() <loopProbability &&
          hasAdjacentPaths(matrix, x, y)
        )
        matrix[y][x] = "path";
        
    }



    setMaze(matrix);
  }
  function hasAdjacentPaths(matrix, x, y){
    const dirs = [
      [0, 1], 
      [1, 0], 
      [0, -1], 
      [-1, 0], 
    ];

    let pathCount = 0;
    for (let [dx, dy] of dirs){
      const nx = x + dx;
      const ny = y +dy;
      if (matrix[ny]&& matrix[ny][nx] === 'path'){
        pathCount++;
      }
    }
    return pathCount >= 1000000;
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
        <button className="maze-button" onClick={() => bfs(start)}>
          BFS
        </button>
        <button className="maze-button" onClick={() => dfs(start, maze)}>
          DFS
          
        </button>
        <button className="maze-button" onClick={() => starA(start, end, maze)}>
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
