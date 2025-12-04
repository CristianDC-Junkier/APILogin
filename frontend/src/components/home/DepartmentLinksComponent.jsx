import React from "react";
import { Row, Col } from "reactstrap";
import AnimatedCard from "./AnimatedCardComponent";

/**
 * Componente que muestra los enlaces asociados a un departamento
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Nombre del departamento
 * @param {Array} props.links - Lista de los enlaces asignados al departamento
 * @param {boolean} props.darkMode - booleano que indica si el Modo Oscuro está activo
 * @returns
 */
const DepartmentLinks = ({ title, links = [], darkMode }) => {

    return (
        <div className="fade-section" style={{
            background: darkMode ? "rgba(25,25,30,0.8)" : "rgba(255,255,255,0.8)",
            borderRadius: "12px",
            border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
            padding: "10px",
            transition: "all 0.5s",
            marginBottom: "15px"
        }}>

            <h3
                style={{
                    color: darkMode ? "white" : "#222",
                    fontWeight: 700,
                    margin: 0,
                    fontSize: "clamp(1rem, 1.9vw, 1.75rem)"
                }}
            >
                {title === "Publico" ? "Visita nuestras herramientas" : `Departamento de ${title}`}
            </h3>

            <Row className="mt-4 justify-content-center">
                {!links || links.length === 0 && (
                    <Col md="3" sm="6" xs="12" className="mb-3" style={{ textAlign: "center" }}>
                        <p style={{ opacity: 0.7, margin: 0 }}>
                            Este departamento no tiene enlaces añadidos.
                        </p>
                    </Col>
                )}

                {links.map(link => (
                    <Col md="3" sm="6" xs="12" key={link.id} className="mb-3">
                        <AnimatedCard
                            title={link.name}
                            web={link.web}
                            desc={link.description}
                            img={link.image}
                            darkMode={darkMode}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DepartmentLinks;
