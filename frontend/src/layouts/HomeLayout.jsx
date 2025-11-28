// HomeLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/FooterComponent';
import BannerCookies from '../components/utils/BannerCookiesComponent';
import background from '../../src/assets/vista-aérea-municipio-de-almonte.png';

const HomeLayout = () => {
    const [darkMode, setDarkMode] = useState(false);

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
                <Outlet context={{ darkMode, toggleMode }} />
            </div>
            <Footer />
            <BannerCookies />
        </div>
    );
};

export default HomeLayout;
