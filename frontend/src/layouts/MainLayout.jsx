import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import Footer from '../components/FooterComponent';
import BannerCookies from '../components/utils/BannerCookiesComponent';
import background from '../../src/assets/background.jpg';

const MainLayout = () => {
    const [darkMode, setDarkMode] = useState(false);

    // Recupera el modo guardado al cargar
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode === "true") setDarkMode(true);
    }, []);

    const toggleMode = () => {
        setDarkMode(prev => {
            localStorage.setItem("darkMode", !prev);
            return !prev;
        });
    };

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
                <Outlet context={{ darkMode, toggleMode }} /> {/* pasa darkMode y toggleMode */}
            </Container>

            {/* Footer de la página */}
            <Footer />
            {/* Banner de cookies */}
            <BannerCookies />
        </div>
    );
};

export default MainLayout;
