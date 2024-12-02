// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './TelaLogin/Login';
import Home from './Home'; 
import Dashboard from './DashBoard/DashBoard';
import CadastrarPlanta from './TelaPrincipal/TelaPrincipal';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/plantas/:id" element={<Dashboard />} /> 
                <Route path="/cadastrar-planta" element={<CadastrarPlanta />} />
            </Routes>
        </Router>
    );
};

export default App;
