import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import {BrowserRouter} from "react-router-dom"
=======
import { BrowserRouter } from 'react-router-dom'
>>>>>>> d2a18a6d17122d00edfe0ba8848a96ad96fc04ad
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
