import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Alert,
    Row,
    Col,
    Card,
    CardBody,
    Label,
} from 'reactstrap';
import { useAuth } from '../hooks/useAuth';

import '../styles/Global.css'
import '../styles/auth/Login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (a) => {
        a.preventDefault();
        setError(null);

        const response = await login({ username, password, rememberMe });

        if (response.success) {
            console.log(response.data.user);
            navigate('/home');

        } else {
            setError(response?.error?.response?.data?.message);
        }
    };

    return (
        <Row className="w-100 justify-content-center">
            <Col xs="12" sm="10" md="6" lg="5" xl="4" xxl="4" className="cmaxW">
                <Card className="Card-login position-relative">

                    <CardBody className="p-0">
                        <h3 className="text-center mb-4 fw-bold mt-4">{"Login"}</h3>

                        <Form onSubmit={handleSubmit} className="px-4">
                            <FormGroup className="mb-2">
                                <Label className="fw-semibold">{"Correo electrónico"}</Label>
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder={"Correo Electronico"}
                                    className="border-0 border-bottom border-dark rounded-0 bg-white px-3 py-2"
                                />
                            </FormGroup>

                            <FormGroup className="mb-4">
                                <Label className="fw-semibold">{"Contraseña"}</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder={"Contraseña"}
                                    className="border-0 border-bottom border-dark rounded-0 bg-white px-3 py-2"
                                />
                            </FormGroup>
                            <Row className="align-items-center mb-4 px-1">
                                <Col xs="7" className="d-flex align-items-center">
                                    <FormGroup check className="mb-0">
                                        <Input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <Label for="rememberMe" check className="fw-semibold ms-2">
                                            {"Recuerdame"}
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button color="dark" type="submit" className="w-100 fw-bold mb-3 py-2 ">
                                {"Entrar"}
                            </Button>
                        </Form>
                    </CardBody>

                    {error && <Alert color="danger" className="px-4 mt-3">{error}</Alert>}

                </Card>
            </Col>
        </Row>
    );
};

export default Login;