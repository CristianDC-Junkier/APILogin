import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Spinner,
} from 'reactstrap';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container
            fluid
            className="d-flex flex-column py-4"
            style={{
                minHeight: '70vh',
            }}
        >

            <div className="d-flex flex-column justify-content-center align-items-center" style={{ flexGrow: 1 }}>
                <Row className="g-3 mb-4 w-100">
                    <Col xs="6" md="3" className="d-flex justify-content-center">
                        <Button
                            onClick={() => console.log("Página Web Externa")}
                        >
                            Continuar
                        </Button>
                    </Col>
                    <Col xs="6" md="3" className="d-flex justify-content-center">
                        <Button
                            onClick={() => navigate('/users')}
                        >
                            Gestión de Usuarios
                        </Button>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default Home;