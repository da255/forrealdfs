import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import MazeGrid from './MazeGrid.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MazeGrid />
  </StrictMode>,
)
