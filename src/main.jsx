import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./style1.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/components/common/Header.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
