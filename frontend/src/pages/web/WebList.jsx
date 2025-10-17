import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
//import { getLinks } from "../../services/UserService";
import { Container, Row, Col, Spinner } from "reactstrap";
import HomeButtonComponent from "../../components/utils/HomeButtonComponent";
import LogoutButton from "../../components/utils/LogoutComponent";
import { faLink, faBriefcase } from "@fortawesome/free-solid-svg-icons";

const WebListPage = () => {
    const { user, token, logout } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const data = []//await getLinks(token);
                setDepartments(data.departments || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, [token]);

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            await logout();
            navigate("/");
        } finally {
            setLoadingLogout(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Spinner color="primary" />
            </div>
        );
    }

    return (
        <Container
            fluid
            className="d-flex flex-column py-4"
            style={{ minHeight: "80vh" }}
        >
            {/* Botón de cierre de sesión */}
            <Row className="align-items-center m-0 p-0 mb-3">
                <Col className="d-flex justify-content-start">
                    <LogoutButton onClick={handleLogout} loading={loadingLogout} />
                </Col>
            </Row>

            {/* Mostrar los departamentos y sus links */}
            {departments.length === 0 ? (
                <div className="text-center mt-5 text-muted">No hay links disponibles.</div>
            ) : (
                departments.map((dep) => (
                    <div key={dep.id} className="mb-4">
                        <h5 className="text-primary mb-3">
                            <i className="me-2">
                                <faBriefcase />
                            </i>
                            {dep.name}
                        </h5>

                        <Row className="g-3">
                            {dep.links.map((link) => (
                                <Col
                                    key={link.id}
                                    xs={12} sm={6} md={4} lg={3}
                                    className="d-flex justify-content-center"
                                >
                                    <HomeButtonComponent
                                        label={link.name}
                                        icon={faLink}
                                        onClick={() => navigate(`/external?url=${encodeURIComponent(link.web)}`)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            )}
        </Container>
    );
};

export default WebListPage;
