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
    const [recoveryError, setRecoveryError] = useState('');
    const [messageRecovery, setMessageRecovery] = useState('');
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

        let isValid = checkEmail() && checkPassword();

        if (!isValid) return;

        setLoading(true);
        console.log('Logando...');

        try {
            // Alterado para usar Axios
            const response = await axios.post(`${backendUrl}login`, {
                email,
                password,
            });

            if (response.status === 200) {
                console.log('Login bem-sucedido!', response.data);
                setWrongLogin(false);
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
            console.error('Erro na requisição:', error);
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

    return (
        <Fragment>
            <div 
                className="bg-image" 
                style={{
                    backgroundColor: '#f0f0f0',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div className="rui-sign-form" style={{ 
                    backgroundColor: 'white', 
                    padding: '30px', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    maxWidth: '400px',  
                    width: '100%',       
                    margin: '0 auto'     
                }}>
                    <h1 className="display-4 mb-10" style={{ color: 'green', textAlign: 'center' }}>Green Hub</h1>
                    <h2 className="slogan mb-2" style={{ fontSize: '0.8rem', textAlign: 'center', color: 'gray' }}> 
                        Seu meio ambiente na palma das suas mãos!
                    </h2>
                    <h1 className="display-4 mb-10" style={{ color: 'gray', textAlign: 'center' }}>Login | GreenHub</h1>
                    
                    <div style={{ marginBottom: '20px' }}> {}
                        <input
                            type="email"
                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                            placeholder="E-mail ou login"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={checkEmail}
                            disabled={loading}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }} 
                        />
                        {emailError && <div className="invalid-feedback">{emailError}</div>}
                    </div>
                    <div style={{ marginBottom: '20px' }}> {}
                        <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={checkPassword}
                            disabled={loading}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                    </div>
                    {wrongLogin && <Alert color="danger">Erro ao realizar o login.</Alert>}
                    
                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', justifyContent: 'center' }}>
                        <input 
                            type="checkbox" 
                            id="rememberMe" 
                            checked={rememberMe} 
                            onChange={() => setRememberMe(!rememberMe)} 
                            style={{ marginRight: '4px' }}
                        />
                        <label htmlFor="rememberMe" style={{ fontSize: 'small' }}>Ficar Logado</label>
                        
                        <Button 
                            onClick={() => setIsOpenModalRecover(true)} 
                            style={{ marginLeft: '20px', fontSize: 'small', padding: '0', height: 'auto', lineHeight: 'normal' }} // Ajuste do botão
                        >
                            <span style={{ fontSize: '0.8rem' }}>Esqueceu sua</span><br/>
                            <span style={{ fontSize: '0.8rem' }}>senha?</span>
                        </Button>
                    </div>
                    
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Button 
                            onClick={maybeLogin} 
                            disabled={loading}
                            style={{ backgroundColor: 'green', borderColor: 'green', width: '100%', height: '45px', borderRadius: '8px' }} // Adicionei bordas arredondadas
                        >
                            {loading ? <span>Loading...</span> : 'Entrar'}
                        </Button>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpenModalRecover}>
            </Modal>
        </Fragment>
    );
};

export default Login;
