import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import BackButtonComponent from "../../components/utils/BackButtonComponent";

const ExternalWebPage = () => {
    const { user } = useAuth();
    const location = useLocation();

    // URL oculta que llega desde WebListPage
    let url = location.state?.url;

    try {
        if (url) {
            new URL(url);
        }
    } catch {
        url = null;
    }

    if (!user) return null;

    return (
        <Container
            fluid
            className="d-flex flex-column flex-grow-1 p-0"
            style={{ width: "100%", height: "100%" }}
        >
            {/* Botonera arriba */}
            <Row className="align-items-center m-0 p-0 mb-1">
                <Col className="d-flex justify-content-start p-0">
                    <BackButtonComponent back="/list" />
                </Col>
            </Row>

            {/* Iframe que ocupa todo el espacio */}
            <Row className="flex-grow-1 m-0 p-0">
                <Col className="p-0">
                    {url ? (
                        <iframe
                            title="Web View"
                            src={url}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                display: "block",
                            }}
                        />
                    ) : (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                height: "100%",
                                fontSize: "1.5rem",
                                color: "#6c757d",
                                textAlign: "center",
                            }}
                        >
                            No se ha recibido ninguna URL válida para mostrar.
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ExternalWebPage;
