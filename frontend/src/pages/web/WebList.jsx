import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import { Container, Row, Col, Spinner, Collapse, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faBriefcase, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getLinksByProfileList } from "../../services/DepartmentService";
import BackButtonComponent from "../../components/utils/BackButtonComponent";
import "../../styles/web/WebListPage.css";

/**
 * Página encargada de mostrar los enlaces disponibles a cada usuario
 */

const WebListPage = () => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true);
            try {
                const response = await getLinksByProfileList(user.version);
                setDepartments(response.data.departments || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, [user.version]);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
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
            {/* Botón Volver */}
            <div className="position-absolute top-0 start-0">
                <BackButtonComponent back="/home" />
            </div>

            <h3 className="text-center mb-4 fw-bold">
                Accesos por Departamento
            </h3>

            {departments.length === 0 ? (
                <div className="text-center mt-5 text-muted">No hay links disponibles.</div>
            ) : (
                <div className="accordion-modern">
                    {departments.map((dep) => (
                        <div
                            key={dep.id}
                            className={`accordion-item-modern ${openId === dep.id ? "active" : ""}`}
                        >
                            <button className="accordion-header-modern" onClick={() => toggle(dep.id)}>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                                    <span className="fw-semibold">{dep.name}</span>
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`chevron ${openId === dep.id ? "rotate" : ""}`}
                                />
                            </button>

                            <Collapse isOpen={openId === dep.id}>
                                <div className="accordion-body-modern">
                                    <Row className="g-3 justify-content-start">
                                        {dep.links.map((link) => (
                                            <Col
                                                key={link.id}
                                                xs={12}  // 1 por fila en móviles
                                                sm={6}   // 2 por fila en sm
                                                md={3}   // 4 por fila en md y superiores
                                                lg={3}   // 4 por fila en lg y superiores
                                                className="d-flex justify-content-center"
                                            >
                                                <Button
                                                    className="d-flex align-items-center justify-content-center fw-bold text-center shadow rounded-3 px-2 py-1 w-100"
                                                    onClick={() => navigate(`/web`, { state: { url: link.web } })}
                                                >
                                                    <FontAwesomeIcon icon={faLink} className="me-2" />
                                                    {link.name}
                                                </Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default WebListPage;
