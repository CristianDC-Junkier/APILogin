import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Card, CardBody, CardImg, Button } from "reactstrap";
import { faUsers, faUserAlt, faGlobeEurope, faScroll, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import logo from "../assets/ayto_almonte_notext.png";
import { useAuth } from '../hooks/useAuth';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const actions = (() => {
        switch (user.usertype) {
            case 'USER': return [
                { label: 'Proyectos', icon: faGlobeEurope, action: () => navigate('/list') },
                { label: 'Mi Perfil', icon: faUserAlt, action: () => navigate('/profile') },
            ];
            default: return [
                { label: 'Proyectos', icon: faGlobeEurope, action: () => navigate('/list') },
                { label: 'Gestión de Usuarios', icon: faUsers, action: () => navigate('/users') },
                { label: 'Gestión de Departamentos', icon: faBriefcase, action: () => navigate('/departments') },
                { label: 'Acceder Logs', icon: faScroll, action: () => navigate('/logs') },
                { label: 'Mi Perfil', icon: faUserAlt, action: () => navigate('/profile') },
            ];
        }
    })();

    const notify = (msg) => {
        Swal.fire({
            title: "Información",
            text: msg,
            icon: "info",
            confirmButtonColor: "#4A90E2",
        });
    };

    const toggleMode = () => setDarkMode(!darkMode);

    return (
        <div
            style={{
                minHeight: "95vh",
                display: "flex",
                fontFamily: "Arial",
                background: darkMode ? "rgba(27, 27, 37, 0.6)" : "rgba(245, 245, 245, 0.6)",
                color: darkMode ? "white" : "#222",
                transition: "all 0.3s",
            }}
        >
            {/* ------------------ SIDEBAR ----------------------- */}
            <motion.div
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                style={{
                    width: sidebarExpanded ? "225px" : "60px",
                    background: darkMode ? "rgba(33,37,41,0.8)" : "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(12px)",
                    borderRight: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    padding: "20px 10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s",
                }}
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <div style={{ borderRadius: "8px", padding: "5px", display: "inline-block" }}>
                            <img src={logo} alt="Ayuntamiento de Almonte" style={{ height: "30px", display: "block" }} />
                        </div>
                    </div>

                    {actions.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={<FontAwesomeIcon icon={item.icon} />}
                            text={item.label}
                            expanded={sidebarExpanded}
                            onClick={item.action}
                        />
                    ))}

                    <SidebarItem
                        icon={darkMode ? <FaSun /> : <FaMoon />}
                        text={darkMode ? "Modo Claro" : "Modo Oscuro"}
                        expanded={sidebarExpanded}
                        onClick={toggleMode}
                    />
                </div>

                <SidebarItem
                    icon={<FaSignOutAlt />}
                    text="Cerrar sesión"
                    expanded={sidebarExpanded}
                    onClick={logout}
                />
            </motion.div>

            {/* ------------------ CONTENIDO ----------------------- */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {/* Banner superior */}
                <div
                    style={{
                        padding: "15px 30px",
                        background: darkMode ? "rgba(33,37,41,0.8)" : "rgba(255,255,255,0.8)",
                        backdropFilter: "blur(12px)",
                        borderBottom: darkMode ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(27,27,37,0.5)",
                        textAlign: "center",
                        fontFamily: '"Montserrat", sans-serif',
                    }}
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ fontWeight: 700, margin: 0 }}
                    >
                        Infraestructura de Datos Espaciales - Ayuntamiento de Almonte
                    </motion.h2>
                </div>

                <div style={{ flex: 1, padding: "20px 30px" }}>
                    {/* Sección solo texto */}
                    <motion.div
                        className="mt-3 p-4"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            background: darkMode ? "rgba(25,25,30,0.8)" : "rgba(255,255,255,0.9)",
                            borderRadius: "12px",
                            border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                            padding: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "20px",
                                alignItems: "center",
                                flexWrap: "wrap", // responsive
                            }}
                        >
                            {/* Parte izquierda: Título + Texto */}
                            <div style={{ flex: 1, minWidth: "280px" }}>
                                <h3 style={{ color: darkMode ? "white" : "#222", marginBottom: "15px" }}>
                                    Plataforma de Datos Espaciales
                                </h3>

                                <p style={{ opacity: 0.8, color: darkMode ? "white" : "#222" }}>
                                    La Infraestructura de Datos Espaciales <strong>ide.Almonte</strong> tiene
                                    como objeto la consulta de los datos, metadatos, servicios
                                    de información geográfica
                                    que se produce en el Ayuntamiento de Sevilla, y las
                                    Infraestructuras de Datos Espaciales
                                    de ámbito nacional, autonómico y local, a través de Internet.
                                    <br /><br />
                                    Ide.Almonte integra el GeoPortal y un conjunto de aplicaciones
                                    que tienen en común la puesta a disposición de los ciudadanos
                                    de la información geográfica que genera el Ayuntamiento de Sevilla.
                                    <br /><br />
                                    La información geográfica es hoy en día un vector de crecimiento
                                    que favorece el conocimiento del entorno y mejora las acciones
                                    proyectadas sobre el territorio.
                                </p>
                            </div>

                            {/* Parte derecha: Imagen */}
                            <img
                                src="https://picsum.photos/400/300"
                                alt="Imagen aleatoria"
                                style={{
                                    width: "350px",
                                    height: "230px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                    flexShrink: 0, // evita que se encoja
                                }}
                            />
                        </div>
                    </motion.div>


                    {/* Sección con apps dinámicas */}
                    <DepartmentLinks
                        title="Departamento de Urbanismo"
                        apps={[
                            { title: "Información Urbanística", desc: "Consulta la normativa urbanística vigente", img: "https://picsum.photos/400/200?random=1", onClick: () => notify("Información Urbanística") },
                            { title: "geoSEVILLA", desc: "Acceso a los servicios de la IDE", img: "https://picsum.photos/400/200?random=2", onClick: () => notify("geoSEVILLA") },
                            { title: "Mapas Comparados", desc: "Comparación visual de capas GIS", img: "https://picsum.photos/400/200?random=3", onClick: () => notify("Mapas Comparados") },
                        ]}
                        darkMode={darkMode}
                    />

                    {/* Secciones solo texto */}



                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------
   COMPONENTES
------------------------------------------------------------- */

function SidebarItem({ icon, text, onClick, expanded, darkMode }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            style={{
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                justifyContent: expanded ? "flex-start" : "center",
                transition: "all 0.5s",
                height: "45px",        
            }}
        >
            <span style={{ fontSize: "18px" }}>{icon}</span>

            <motion.span
                initial={{ opacity: 0 }}
                animate={{
                    opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{
                    display: expanded ? "inline-block" : "none",  
                    whiteSpace: "normal",
                    maxWidth: "150px",
                }}
            >
                {text}
            </motion.span>
        </motion.div>


    );
}

function AnimatedCard({ title, desc, img, onClick, darkMode }) {
    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <Card
                onClick={onClick}
                style={{
                    cursor: "pointer",
                    background: darkMode ? "rgba(30,30,30,0.8)" : "rgba(255,255,255,0.8)",
                    borderRadius: "12px",
                    border: darkMode ? "1px solid rgba(205,205,205,0.1)" : "1px solid rgba(0,0,0,0.1)",
                }}
            >
                <CardImg top width="100%" src={img} alt={title} />
                <CardBody>
                    <h5 style={{ color: darkMode ? "white" : "#222" }}>{title}</h5>
                    <p style={{ opacity: 0.8, color: darkMode ? "white" : "#222" }}>{desc}</p>
                    <Button color="primary" size="sm">
                        Entrar
                    </Button>
                </CardBody>
            </Card>
        </motion.div>
    );
}

// Componente Section dinámico
function DepartmentLinks({ title, apps = [], darkMode }) {
    return (
        <motion.div
            className="mt-4 mb-4 p-4"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                background: darkMode ? "rgba(25,25,30,0.8)" : "rgba(255,255,255,0.8)",
                borderRadius: "12px",
                border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                padding: "20px",
            }}
        >
            <h3 style={{ color: darkMode ? "white" : "#222" }}>{title}</h3>

            <Row className="mt-3">
                {apps.map((app, index) => (
                    <Col md="4" key={index} className="mb-3">
                        <AnimatedCard
                            title={app.title}
                            desc={app.desc}
                            img={app.img}
                            onClick={app.onClick}
                            darkMode={darkMode}
                        />
                    </Col>
                ))}
            </Row>
        </motion.div>
    );
}
