import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BackButton from "../components/utils/BackButtonComponent";
import LogoutButton from "../components/user/LogoutComponent";

const URL = import.meta.env.VITE_URL;

const ExternalWeb = () => {
    const [loadingLogout, setLoadingLogout] = useState(false);
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            await logout();
            navigate("/");
        } finally {
            setLoadingLogout(false);
        }
    };

    if (!user) return null;

    return (
        <Container
            fluid
            className="d-flex flex-column flex-grow-1 p-0"
            style={{ width: "100%", height: "100%" }}
        >
            {/* Botonera arriba */}
            <Row className="align-items-center m-0 p-0">
                <Col className="d-flex justify-content-start p-0">
                    {user.usertype !== "USER" && (
                        <BackButton back="/home" />
                    )}
                </Col>
                <Col className="d-flex justify-content-start p-0">
                    {user.usertype === "USER" && (
                        <LogoutButton onClick={handleLogout} loading={loadingLogout} />
                    )}
                </Col>
            </Row>

            {/* Iframe que ocupa todo el espacio sobrante */}
            <Row className="flex-grow-1 m-0 p-0">
                <Col className="p-0">
                    <iframe
                        title="Web View"
                        src={URL}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            display: "block",
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ExternalWeb;
