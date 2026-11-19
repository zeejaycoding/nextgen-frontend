import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import Splash from './components/Splash'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Splash />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
