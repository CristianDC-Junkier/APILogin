import React from "react";
import { Row, Col } from "reactstrap";
import AnimatedCard from "./AnimatedCardComponent";

const DepartmentLinks = ({ title, links = [], darkMode, visibleSections, indexOffset }) => {
    return (
        <div className="fade-section" style={{
            background: darkMode ? "rgba(25,25,30,0.8)" : "rgba(255,255,255,0.8)",
            borderRadius: "12px",
            border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
            padding: "20px",
            marginBottom: "25px",
            opacity: visibleSections[indexOffset] ? 1 : 0,
            transform: visibleSections[indexOffset] ? 'translateY(0)' : 'translateY(25px)',
            transition: "all 0.5s"
        }}>

            <h3 style={{ color: darkMode ? "white" : "#222" }}>
                <strong>Departamento de {title}</strong>
            </h3>

            <Row className="mt-4 justify-content-center">
                {links.length === 0 && (
                    <p style={{ opacity: 0.7 }}>Este departamento no tiene enlaces añadidos.</p>
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
