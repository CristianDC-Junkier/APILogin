import React from 'react';
import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/UseTheme';
import Footer from '../components/FooterComponent';
import BannerCookies from '../components/utils/BannerCookiesComponent';
import background from '../../src/assets/background.jpg';

/**
 * Estilos de fondo con imagen para toda la página.
 */
const MainLayout = () => {

    const { darkMode } = useTheme(); 

    const imageBackground = {
        backgroundImage: darkMode
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${background})` 
            : `url(${background})`, 
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        
        color: darkMode ? "white" : "#222",
        transition: "background-color 0.3s ease, color 0.3s ease"
    };

    return (
        <div style={imageBackground}>
            {/* Contenedor principal centrado verticalmente */}
            <Container
                tag="main"
                className="flex-grow-1 d-flex flex-column"
                style={{ justifyContent: 'center' }}
            >
                <Outlet />
            </Container>

            {/* Footer de la página */}
            <Footer />
            {/* Banner de cookies */}
            <BannerCookies />
        </div>
    );
};

export default MainLayout;
