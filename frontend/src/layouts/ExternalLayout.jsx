import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/UseTheme';
import BannerCookies from '../components/utils/BannerCookiesComponent';
import background from '../../src/assets/background.jpg';

/**
 * Estilos de fondo para la página ExternalWeb.
 */
const ExternalLayout = () => {

    const { darkMode } = useTheme(); 

    const imageBackground = {
        backgroundImage: darkMode
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${background})`
            : `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: darkMode ? "white" : "#222",
        transition: "background-color 0.3s ease, color 0.3s ease"
    };

    return (
        <div style={imageBackground}>
            {/* Contenedor principal para el contenido */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: darkMode ? "rgba(27, 27, 37, 0.6)" : "transparent", }}>
                <Outlet context={{ darkMode }} /> {/* pasa darkMode y toggleMode a los hijos */}
            </div>
            {/* Banner de cookies */}
            <BannerCookies />
        </div>
    );
};

export default ExternalLayout;
