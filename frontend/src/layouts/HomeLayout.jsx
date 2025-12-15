import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/UseTheme';
import Footer from '../components/FooterComponent';
import BannerCookies from '../components/utils/BannerCookiesComponent';
import background from '../../src/assets/vista-aérea-municipio-de-almonte.png';

/**
 * Estilos de fondo para la páginas Home y PublicHome.
 */
const HomeLayout = () => {

    const { darkMode } = useTheme(); 

    return (
        <div style={{
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
            color: darkMode ? "white" : "#222"
        }}>
            <div style={{ flex: 1, display: "flex", width: "100%", overflow: "auto" }}>
                <Outlet />
            </div>
            <Footer />
            <BannerCookies />
        </div>
    );
};

export default HomeLayout;
