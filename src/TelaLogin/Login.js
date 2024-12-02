import React, { Fragment, useState } from 'react';
import { Button, Alert, Modal } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [wrongLogin, setWrongLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpenModalRecover, setIsOpenModalRecover] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const navigate = useNavigate();

    const checkEmail = () => {
        const isValid = email.includes('@');
        setEmailError(isValid ? '' : 'Formato de e-mail inválido');
        return isValid;
    };

    const checkPassword = () => {
        const isValid = password && password.length >= 8;
        setPasswordError(isValid ? '' : 'Favor informe sua senha');
        return isValid;
    };

    const maybeLogin = async () => {
        if (loading) return;

        const isValid = checkEmail() && checkPassword();
        if (!isValid) return;

        setLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/login`, { email, password });

            if (response.status === 200) {
                navigate('/home');
            } else {
                setWrongLogin(true);
                Swal.fire({
                    title: 'Erro!',
                    text: 'As credenciais fornecidas estão incorretas.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            setWrongLogin(true);
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao realizar o login. Tente novamente mais tarde.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordRecovery = () => {
        Swal.fire({
            title: 'Recuperação de Senha',
            text: `Um e-mail de recuperação foi enviado para ${email}. Verifique sua caixa de entrada.`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
        setIsOpenModalRecover(false);
    };

    return (
        <Fragment>
            <div 
                className="bg-image" 
                style={{
                    backgroundColor: '#e0f7fa',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="rui-sign-form" style={{ 
                    backgroundColor: '#ffffff', 
                    padding: '40px', 
                    borderRadius: '12px', 
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    maxWidth: '400px',  
                    width: '100%',       
                }}>
                    <h1 className="display-4 mb-4" style={{ color: '#4caf50', textAlign: 'center' }}>Green Hub</h1>
                    <h2 className="slogan mb-3" style={{ fontSize: '1rem', textAlign: 'center', color: '#757575' }}> 
                        Seu meio ambiente mais próximo de você!
                    </h2>
                    <h1 className="display-5 mb-4" style={{ color: '#616161', textAlign: 'center' }}>Login</h1>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="email"
                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={checkEmail}
                            disabled={loading}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} 
                        />
                        {emailError && <div className="invalid-feedback">{emailError}</div>}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={checkPassword}
                            disabled={loading}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                    </div>
                    {wrongLogin && <Alert color="danger">Erro ao realizar o login.</Alert>}
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <input 
                                type="checkbox" 
                                id="rememberMe" 
                                checked={rememberMe} 
                                onChange={() => setRememberMe(!rememberMe)} 
                                style={{ marginRight: '4px' }}
                            />
                            <label htmlFor="rememberMe" style={{ fontSize: 'small' }}>Ficar Logado</label>
                        </div>
                        <Button 
                            onClick={() => setIsOpenModalRecover(true)} 
                            style={{ fontSize: 'small', padding: '0', height: 'auto' }}
                        >
                            Esqueceu sua senha?
                        </Button>
                    </div>
                    
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Button 
                        onClick={maybeLogin} 
                        disabled={loading}
                        style={{ backgroundColor: '#4caf50', borderColor: '#4caf50', width: '100%', height: '45px', borderRadius: '8px' }}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Entrar'}
                    </Button>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#757575' }}>
                        GreenHub: seu espaço para a sustentabilidade. Junte-se a nós e faça a diferença!
                    </p>
                </div>
            </div>
            <Modal isOpen={isOpenModalRecover} toggle={() => setIsOpenModalRecover(false)}>
                <div style={{ padding: '20px' }}>
                    <h5>Recuperar Senha</h5>
                    <input
                        type="email"
                        className="form-control mt-3"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        color="primary"
                        onClick={handlePasswordRecovery}
                        style={{ marginTop: '10px', width: '100%' }}
                    >
                        Enviar
                    </Button>
                </div>
            </Modal>
        </Fragment>
    );
};

export default Login;
