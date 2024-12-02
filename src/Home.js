import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'reactstrap'; 
import { Link } from 'react-router-dom'; 

import girassolImg from './images/girassol.jpg';
import rosaImg from './images/rosa.jpg';
import cactoImg from './images/cacto.jpg';
import tomateImg from './images/tomate.jpg';  

const Home = () => {
    const [plants, setPlants] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
    const [expandedPlants, setExpandedPlants] = useState({}); 
    const [selectedPlant, setSelectedPlant] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchPlants = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/plantas`);
            setPlants(response.data);
            setError(''); 
        } catch (err) {
            setError('Erro ao carregar as plantas.'); 
        } finally {
            setLoading(false); 
        }
    };

    const updatePlantaStatus = async (id, status) => {
        setLoading(true);
        try {
            await axios.put(`${backendUrl}/plantas/${id}`, { status });
            setPlants((prevPlants) =>
                prevPlants.map((plant) =>
                    plant.id === id ? { ...plant, status } : plant
                )
            );
            setSelectedPlant(null); // Fecha o menu após a atualização
        } catch (err) {
            setError('Erro ao atualizar o status da planta.');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedPlants((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleMenuClick = (e, plantId) => {
        e.stopPropagation();
        setSelectedPlant(plantId);
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center', fontSize: '40px' }}>GreenHub</h1>
            <h2 style={{ textAlign: 'center' }}>Selecione</h2>
    
            {/* Botão para cadastrar nova planta */}
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <Link to="/cadastrar-planta">
                    <button style={{ 
                        backgroundColor: '#4CAF50', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontSize: '16px' 
                    }}>
                        Cadastrar nova Planta
                    </button>
                </Link>
            </div>
    
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <Spinner color="primary" /> 
                </div>
            )}
    
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} 
    
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {plants.map(plant => {
                    const isExpanded = expandedPlants[plant.id] || false;
                    const isActive = plant.status === 1;

                    return (
                        <div key={plant.id} style={{ position: 'relative' }}>
                            <Link to={`/plantas/${plant.id}`} style={{ textDecoration: 'none' }}>
                                <div 
                                    style={{ 
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
                                        opacity: isActive ? 1 : 0.5,
                                    }}
                                >
                                    {plant.name_planta === "Girassol" && (
                                        <img src={girassolImg} alt="Girassol" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                    )}
                                    {plant.name_planta === "Rosa" && (
                                        <img src={rosaImg} alt="Rosa" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                    )}
                                    {plant.name_planta === "Cacto" && (
                                        <img src={cactoImg} alt="Cacto" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                                    )}
                                    {plant.name_planta === "Tomate" && (
                                        <img src={tomateImg} alt="Tomate" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
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
                            
                            <div 
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px', 
                                    padding: '5px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    zIndex: 1,
                                }}
                                onClick={(e) => handleMenuClick(e, plant.id)}
                            >
                                <span style={{ fontSize: '20px', color: 'gray' }}>...</span>
                            </div>

                            {selectedPlant === plant.id && (
                                <div 
                                    style={{ 
                                        position: 'absolute', 
                                        top: '40px', 
                                        right: '10px', 
                                        backgroundColor: 'white', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '5px', 
                                        padding: '10px', 
                                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' 
                                    }}
                                >
                                    <button 
                                        onClick={() => updatePlantaStatus(plant.id, 1)} 
                                        style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                    >
                                        Ativar
                                    </button>
                                    <button 
                                        onClick={() => updatePlantaStatus(plant.id, 0)} 
                                        style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginLeft: '10px' }}
                                    >
                                        Inativar
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
