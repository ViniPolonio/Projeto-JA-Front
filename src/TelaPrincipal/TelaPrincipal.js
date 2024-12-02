import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importando SweetAlert2
import './TelaPrincipal.css'; // Importando os estilos

const CadastrarPlanta = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        interval_type: 1,  // 1 para minutos (valor inicial)
        interval_time: 1,  // valor inicial para o tempo do intervalo
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [imageName, setImageName] = useState('Carregar imagem'); // Inicializando com a mensagem padrão
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            image: file,
        }));
        setImageName(file ? file.name : 'Carregar imagem'); // Atualiza com o nome do arquivo ou mensagem padrão
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('interval_type', formData.interval_type);
            formDataToSend.append('interval_time', formData.interval_time);

            // Adiciona a imagem apenas se o usuário tiver enviado uma
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await axios.post(`${backendUrl}/plantas`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.success);

            // Exibe o SweetAlert de sucesso
            Swal.fire({
                icon: 'success',
                title: 'Planta Cadastrada!',
                text: 'A planta foi cadastrada com sucesso.',
                confirmButtonText: 'OK',
            }).then(() => {
                // Redireciona para a página /home após o fechamento do alerta
                navigate('/home');
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao cadastrar a planta.');
        }
    };

    const handleGoHome = () => {
        navigate('/home'); // Função para redirecionar para a home
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Cadastrar Nova Planta</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Nome da Planta:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="form-textarea"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="interval_type" className="form-label">Tipo de Intervalo:</label>
                    <select
                        id="interval_type"
                        name="interval_type"
                        value={formData.interval_type}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="1">Minutos</option>
                        <option value="2">Horas</option>
                        <option value="3">Dias</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="interval_time" className="form-label">Tempo do Intervalo:</label>
                    <input
                        type="number"
                        id="interval_time"
                        name="interval_time"
                        value={formData.interval_time}
                        onChange={handleChange}
                        required
                        min="1"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image" className="form-label">Imagem (opcional):</label>
                    <div className="file-upload">
                        <label htmlFor="image" className="file-label">
                            {imageName}
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            className="form-file"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="form-button"
                >
                    Cadastrar Planta
                </button>
            </form>

            {/* Botão para voltar para a página inicial */}
            <button
                className="go-home-button"
                onClick={handleGoHome}
            >
                Voltar para Home
            </button>
        </div>
    );
};

export default CadastrarPlanta;
