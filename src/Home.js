// src/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'reactstrap'; 
import { Link } from 'react-router-dom'; 

import girassolImg from './images/girassol.jpg';
import rosaImg from './images/rosa.avif';

const Home = () => {
    const [plants, setPlants] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
    const [expandedPlants, setExpandedPlants] = useState({}); 

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchPlants = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}plantas`);
            setPlants(response.data);
            setError(''); 
        } catch (err) {
            setError('Erro ao carregar as plantas.'); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    const toggleExpand = (id) => {
        setExpandedPlants((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>GreenHub</h1>
            <h2 style={{ textAlign: 'center' }}>Selecione</h2>
    
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <Spinner color="primary" /> 
                </div>
            )}
    
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} 
    
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {plants.map(plant => {
                    const isExpanded = expandedPlants[plant.id] || false;
    
                    return (
                        <Link to={`/plantas/${plant.id}`} key={plant.id} style={{ textDecoration: 'none' }}>
                            <div style={{ 
                                border: '1px solid #ccc', 
                                borderRadius: '8px', 
                                padding: '20px', 
                                margin: '10px', 
                                width: '200px', 
                                textAlign: 'center',
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between', 
                                height: '350px', 
                            }}>
                                {plant.name_planta === "Girassol" && (
                                    <img src={girassolImg} alt="Girassol" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                )}
                                {plant.name_planta === "Rosa" && (
                                    <img src={rosaImg} alt="Rosa" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                )}
                                <strong>Planta:</strong> {plant.name_planta}<br />
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: isExpanded ? 'none' : 3, WebkitBoxOrient: 'vertical' }}>
                                    <strong>Descrição:</strong> {plant.description}
                                </p>
                                <button 
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        toggleExpand(plant.id); 
                                    }} 
                                    style={{ marginTop: '10px', background: 'transparent', border: 'none', color: 'blue', cursor: 'pointer' }}
                                >
                                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
