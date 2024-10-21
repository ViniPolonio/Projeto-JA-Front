import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, // Importando a escala de categoria
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

// Registrando as escalas e elementos necessários
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const DashBoard = () => {
    const { id } = useParams();
    const [plantData, setPlantData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [dates, setDates] = useState([]);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchPlantData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}plantas/${id}`);
            setPlantData(response.data.data);
            const logPlant = response.data.log_plant;
            setTemperatureData(logPlant.map(log => log.temperatura));
            setHumidityData(logPlant.map(log => log.umidade));
            setDates(logPlant.map(log => new Date(log.created_at).toLocaleDateString()));
            setError('');
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar os dados da planta.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlantData();
    }, [id]);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Temperatura',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Umidade',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div>
            <h1>{plantData.name_planta}</h1>
            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {temperatureData.length > 0 || humidityData.length > 0 ? (
                <Line data={data} />
            ) : (
                !loading && <p>Nenhum dado disponível para exibição.</p>
            )}
        </div>
    );
};

export default DashBoard;
