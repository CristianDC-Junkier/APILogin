import React from 'react';
import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import background from '../../src/assets/background.jpg';

const imageBackground = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: '100vh',  
    display: 'flex',
    flexDirection: 'column'
};

const MainLayout = () => (
    <div style={imageBackground}>
        {/* Contenido principal */}
        <Container
            tag="main"
            className="flex-grow-1 d-flex flex-column"
            style={{ justifyContent: 'center' }}
        >
            <Outlet />
        </Container>

        <Footer />
    </div>
);

export default MainLayout;


