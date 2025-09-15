import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import background from '../../src/assets/background.jpg';

const imageBackground = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
};

const ExternalLayout = () => (
    <div style={imageBackground}>
        {/* Contenido principal */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Outlet />
        </div>
    </div>
);

export default ExternalLayout;
