/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaSignInAlt } from "react-icons/fa";

import { getDepartmentPublic } from "../../services/DepartmentService";
import { useTheme } from '../../hooks/UseTheme';

import logo from "../../assets/ayto_almonte_notext.png";

import SidebarItem from '../../components/home/SideBardComponent';
import DepartmentLinks from '../../components/home/DepartmentLinksComponent';
import SpinnerComponent from '../../components/utils/SpinnerComponent';

/**
 * Página pública sin elementos de perfil ni opciones de usuario.
 */
const PublicHome = () => {
    const navigate = useNavigate();
    const { darkMode, toggleMode } = useTheme();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});
    const [publicDepartment, setPublicDepartment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Página Inicial - IDEE Almonte";
    }, []);

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) {
            setSidebarExpanded(true);
        }
    };

    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true);
            try {
                const response = await getDepartmentPublic();
                setPublicDepartment(response.data.publicDepartment || null);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('.fade-section');
            const newVisible = {};
            sections.forEach((sec, i) => {
                const rect = sec.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) {
                    newVisible[i] = true;
                }
            });
            setVisibleSections(newVisible);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) return <SpinnerComponent />;

    return (
        <div style={{
            width: "100%",
            display: "flex",
            fontFamily: "Arial",
            background: darkMode ? "rgba(27, 27, 37, 0.6)" : "rgba(245, 245, 245, 0.6)",
            color: darkMode ? "white" : "#222",
        }}>
            {/* SIDEBAR */}
            <div
                onMouseEnter={() => handleMouseEnter()}
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
                    overflowY: "auto",
                    overflowX: "hidden",
                    position: "sticky",
                    top: 0,
                    transition: "all 0.3s",
                }}
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <a href="https://almonte.es/es/" target="_blank" rel="noopener noreferrer">
                            <img className='nav-logo' src={logo} alt="Ayuntamiento de Almonte" style={{ height: "30px" }} />
                        </a>
                    </div>

                    {/* Botón Login */}
                    <SidebarItem
                        icon={<FaSignInAlt />}
                        text={"Iniciar Sesión"}
                        expanded={sidebarExpanded}
                        onClick={() => navigate('/login')}
                        darkMode={darkMode}
                    />

                    {/* Modo oscuro / claro */}
                    <SidebarItem
                        icon={darkMode ? <FaSun /> : <FaMoon />}
                        text={darkMode ? "Modo Claro" : "Modo Oscuro"}
                        expanded={sidebarExpanded}
                        onClick={toggleMode}
                        darkMode={darkMode}
                    />
                </div>
            </div>

            {/* CONTENIDO */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    padding: "15px 30px",
                    background: darkMode ? "rgba(33,37,41,0.8)" : "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(12px)",
                    borderBottom: darkMode ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(27,27,37,0.5)",
                    textAlign: "center",
                    fontFamily: '"Montserrat", sans-serif',
                }}>
                    <h2 style={{ fontWeight: 700, margin: 0 }}>
                        Infraestructura de Datos Espaciales - Ayuntamiento de Almonte
                    </h2>
                </div>

                <div style={{ flex: 1, padding: "20px 30px", overflowY: 'auto' }}>
                    {/* TEXTO PRINCIPAL */}
                    <div className="fade-section" style={{
                        background: darkMode ? "rgba(25,25,30,0.8)" : "rgba(255,255,255,0.9)",
                        borderRadius: "12px",
                        border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        padding: "20px",
                        marginBottom: "20px",
                        opacity: visibleSections[0] ? 1 : 0,
                        transform: visibleSections[0] ? 'translateY(0)' : 'translateY(25px)',
                        transition: "all 0.5s"
                    }}>
                        <h3><strong>La Plataforma IDEE Almonte</strong></h3>
                        <p>IDEE Almonte es la Plataforma de Datos Espaciales del Ayuntamiento de Almonte.
                            Ofrece acceso a mapas, datos y servicios geográficos del municipio,
                            facilitando la consulta, análisis y difusión de la información territorial.
                            Esta plataforma buscar mejorar y facilitar el conocimiento del territorio además
                            de apoyar la planificación y gestión municipal.</p>
                    </div>

                    {/* TEXTO PRINCIPAL 2 */}
                    <div className="fade-section" style={{
                        background: darkMode ? "rgba(25,25,30,0.8)" : "rgba(255,255,255,0.9)",
                        borderRadius: "12px",
                        border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        padding: "20px",
                        marginBottom: "20px",
                        opacity: visibleSections[0] ? 1 : 0,
                        transform: visibleSections[0] ? 'translateY(0)' : 'translateY(25px)',
                        transition: "all 0.5s"
                    }}>
                        <h3><strong>¿Qué son los datos espaciales?</strong></h3>
                        <p>Los datos espaciales son información geográfica que describe la localización y las características de lugares,
                            infraestructuras y recursos en el municipio de Almonte. Incluyen mapas, planos y capas de información que permiten
                            xanalizar el territorio y tomar decisiones informadas.</p>
                    </div>

                    {/* DEPARTAMENTOS DINÁMICOS */}
                    {publicDepartment && (
                        <DepartmentLinks
                            key={publicDepartment.id}
                            title={publicDepartment.name}
                            links={publicDepartment.links}
                            darkMode={darkMode}
                            visibleSections={visibleSections}
                            indexOffset={1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PublicHome;
