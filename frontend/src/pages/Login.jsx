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
import { useAuth } from '../../hooks/useAuth';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        const success = true; //const { success, error: loginError } = await login({ username, password, rememberMe });

        if (success) {

            navigate('/home');

        } /*else {
            if (loginError?.response?.data?.code === "BlockedAccount")
                if (loginError?.response?.data?.isPermanentLock)
                    setError(e("BlockedAccountPermanent"));
                else
                    setError(e("BlockedAccount", { minutes: loginError?.response?.data?.time }));
            else
                setError(e(loginError?.response?.data?.code));
        }*/
    };

    return (
        <Row className="w-100 justify-content-center">
            <Col xs="12" sm="10" md="6" lg="5" xl="4" xxl="4" className="cmaxW">
                <Card className="Card-login position-relative">

                    <BackButton />

                    <CardBody className="p-0">
                        <h3 className="text-center mb-4 fw-bold mt-4">{"Login"}</h3>

                        <Form onSubmit={handleSubmit} className="px-4">
                            <FormGroup className="mb-2">
                                <Label className="fw-semibold">{"Correo electrónico"}</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                                {/*<Col xs="5" className="text-end">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="btn btn-link text-dark fw-semibold fs-6 p-0 m-0 align-baseline"
                                        style={{ textDecoration: 'none', cursor: 'pointer', minHeight: '2.5em' }}
                                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                    >
                                        {t("Forgot")}
                                    </button>
                                </Col>*/}
                            </Row>


                            <Button color="dark" type="submit" className="w-100 fw-bold mb-3 py-2 ">
                                {"Entrar"}
                            </Button>
                        </Form>

                        <hr className="my-3 border-3 border-dark py-1" />

                        {/*<div className="text-center mt-4">
                            <small className="text-dark">
                                {t("NoAccount")}{' '}
                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="btn btn-link text-dark p-0 m-0 align-baseline"
                                    style={{ fontSize: '1rem', textDecoration: 'none' }}
                                    onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                    {t("SignUpLog")}
                                </button>
                            </small>
                        </div>*/}

                    </CardBody>

                    {error && <Alert color="danger" className="px-4 mt-3">{error}</Alert>}

                </Card>
            </Col>
        </Row>
    );
};

export default Login;