import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/FooterComponent';
import BannerCookies from '../components/utils/BannerCookiesComponent';
import background from '../../src/assets/vista-aérea-municipio-de-almonte.png';

/**
 * Estilos de fondo con imagen para toda la página.
 */
const imageBackground = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    width: "100%",
    height: "100vh",     
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",  
};


/**
 * Layout externo para páginas públicas o de login.
 *
 * Funcionalidades:
 * - Muestra una imagen de fondo que cubre toda la ventana.
 * - Renderiza el contenido interno a través de <Outlet /> de React Router.
 * - Mantiene flexibilidad para que el contenido interno se ajuste al tamaño disponible.
 */
const HomeLayout = () => (
    <div style={imageBackground}>
        {/* Contenedor principal para el contenido */}
        <div style={{ flex: 1, display: "flex", width: "100%", overflow: "auto" }}>
            <Outlet /> {/* Aquí se renderizan las rutas hijas */}
        </div>
        {/* Footer de la página */}
        <Footer />
        {/* Banner de cookies */}
        <BannerCookies />
    </div>
);

export default HomeLayout;
