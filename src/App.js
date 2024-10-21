// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './TelaLogin/Login';
import Home from './Home'; 
import Dashboard from './DashBoard/DashBoard';
import DashBoard from './DashBoard/DashBoard';

const App = () => {
    return (
        <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/plantas/:id" element={<DashBoard />} /> 
            </Routes>
        </Router>
    );
};

export default App;
