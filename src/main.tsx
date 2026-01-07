import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import App from './App.tsx' 
import ProjectHome from './components/Home/ProjectHome.tsx'
import Login from './components/Auth/Login.tsx'
import Register from './components/Auth/Register.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal: Redireciona para /home ou /login */}
        <Route path="/" element={<Navigate to="/home" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProjectHome />} />
        <Route path="/project/:projectId" element={<App />} />
        
        {/* Caso a rota não exista */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)