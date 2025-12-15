import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Row, Col, Container, Card, CardBody, Label } from 'reactstrap';
import Swal from 'sweetalert2';

import { createRoot } from 'react-dom/client';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/UseTheme';
import CaptchaSliderComponent from '../components/utils/CaptchaSliderComponent';
import BackButtonComponent from "../components/utils/BackButtonComponent";
import '../styles/Global.css';
import '../styles/auth/Login.css';
import '../styles/component/ComponentsDark.css';

/**
 * Página de inicio de sesión
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    const { darkMode } = useTheme();

    useEffect(() => {
        document.title = "Inicio de Sesión - IDEE Almonte";
    }, []);

    //Función que gestiona el Captcha
    const showCaptcha = () => {
        return new Promise((resolve, reject) => {
            const container = document.createElement('div');
            const reactRoot = createRoot(container);
            let completed = false;

            reactRoot.render(
                <CaptchaSliderComponent
                    darkMode={darkMode}
                    onSuccess={() => {
                        completed = true;
                        resolve(true);
                        Swal.close();
                        setTimeout(() => reactRoot.unmount(), 0);
                    }}
                />
            );

            Swal.fire({
                title: 'Completa el captcha',
                html: container,
                showConfirmButton: true,
                allowOutsideClick: false,
                theme: darkMode ? 'dark' : '',
                preConfirm: () => {
                    if (!completed) {
                        Swal.showValidationMessage('Debes completar el captcha antes de continuar');
                        return false;
                    }
                }
            }).then(() => {
                if (!completed) reject(new Error('Captcha no completado'));
            });
        });
    };

    //Función encargada de gestionar la información aportada por el usuario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Mostrar captcha obligatorio
            await showCaptcha();

            // Comprobamos si el usuario aceptó cookies
            const cookiesAccepted = localStorage.getItem("IEE-Almonte/cookiesAccepted") === "true";

            // Si no ha aceptado cookies, forzamos remember a false
            const finalRemember = cookiesAccepted ? remember : false;

            // Hacer login
            const response = await login({ username, password, finalRemember });

            if (response.success) {
                navigate('/home');
            } else {
                Swal.fire({ title: 'Error', text: response.error || 'Login fallido', icon: 'error', theme: darkMode ? 'dark' : '' });
            }
        } catch (err) {
            Swal.fire({ title: 'Error', text: err?.error || err?.message || 'Captcha no completado', icon: 'error', theme: darkMode ? 'dark' : '' });
        }
    };

    return (
        <Container fluid className="mt-4 d-flex flex-column" style={{ minHeight: "80vh" }}>
            {/* Botón Volver */}
            <div className="position-absolute top-0 start-0">
                <BackButtonComponent back="/public-home" />
            </div>

            <Row className="w-100 flex-grow-1 justify-content-center align-items-center">
                <Col xs="12" sm="10" md="6" lg="5" xl="4" xxl="4" className="cmaxW">
                    <Card className="Card-login position-relative">
                        <CardBody className="p-0">
                            <h3 className="text-center mb-4 fw-bold mt-4">Login</h3>
                            <Form onSubmit={handleSubmit} className="px-4">
                                {/* Campo de entrada del nombre de usuario */}
                                <FormGroup className="mb-2">
                                    <Label className="fw-semibold">Usuario</Label>
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        placeholder="Usuario"
                                        className={`border-0 border-bottom border-dark rounded-0 px-3 py-2 ${darkMode ? "input_dark" : ""}`}
                                    />
                                </FormGroup>
                                {/* Campo de entrada de la contraseña */}
                                <FormGroup className="mb-4">
                                    <Label className="fw-semibold">Contraseña</Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Contraseña"
                                        className={`border-0 border-bottom border-dark rounded-0 px-3 py-2 ${darkMode ? "input_dark" : ""}`}
                                    />
                                </FormGroup>

                                <Row className="align-items-center mb-4 px-1">
                                    <Col xs="7" className="d-flex align-items-center">
                                        {/* Chack para activar el recorda usuario */}
                                        <FormGroup check className="mb-0">
                                            <Input
                                                type="checkbox"
                                                id="rememberMe"
                                                checked={remember}
                                                onChange={(e) => setRemember(e.target.checked)}
                                                className={`${darkMode ? "border-1 border-dark bg-secondary" : ""}`}
                                            />
                                            <Label for="rememberMe" check className="fw-semibold ms-2">
                                                Recuerdame
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {/* Botón para hacer el login */}
                                <Button color="dark" type="submit" className="w-100 fw-bold mb-3 py-2">
                                    Entrar
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
