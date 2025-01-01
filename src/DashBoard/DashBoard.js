import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './DashBoard.css';

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
    const [daysOffset, setDaysOffset] = useState(3);  // Definido para 3 dias por padrão

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const calculateDateRange = (offset) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - offset);  // Definindo a data de 3 dias atrás
        return {
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd'),
        };
    };

    // Função para buscar dados com base no intervalo de datas
    const fetchPlantData = async (offset) => {
        setLoading(true);
        const { start_date, end_date } = calculateDateRange(offset);
        try {
            const response = await axios.get(`${backendUrl}/monitoring-plans-log/1`, {
                params: { start_date, end_date },
            });
            setPlantData(response.data);
            const logPlant = response.data.data || [];

            if (Array.isArray(logPlant)) {
                setTemperatureData(logPlant.map(log => log.temperatura));
                setHumidityData(logPlant.map(log => log.umidade));
                setDates(logPlant.map(log => new Date(log.created_at)));
            } else {
                console.error('logPlant não é um array:', logPlant);
            }

            setError('');
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar os dados da planta.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlantData(daysOffset);  // Consultando os últimos 3 dias
    }, [id, daysOffset]);

    const data = {
        labels: dates.map(date => format(date, 'dd/MM', { locale: ptBR })),
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Umidade (%)',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            },
        ],
    };

    const handleDaysOffsetChange = (e) => {
        setDaysOffset(Number(e.target.value));
    };

    return (
        <div className="dashboard-container">
            <h1 className="plant-title">{plantData.name_planta || 'Planta Desconhecida'}</h1>
            
            <div className="offset-controls">
                <label htmlFor="daysOffset">Mostrar dados dos últimos: </label>
                <select id="daysOffset" value={daysOffset} onChange={handleDaysOffsetChange}>
                    <option value={3}>3 dias</option>
                    <option value={5}>5 dias</option>
                    <option value={10}>10 dias</option>
                    <option value={30}>30 dias</option>
                </select>
            </div>

            {loading ? (
                <div className="loader">Carregando...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div>
                    {temperatureData.length > 0 || humidityData.length > 0 ? (
                        <Line data={data} />
                    ) : (
                        <p className="no-data">Nenhum dado disponível para exibição.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashBoard;
