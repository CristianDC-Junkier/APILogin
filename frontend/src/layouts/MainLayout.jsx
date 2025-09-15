import React from 'react';
import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import background from '../../src/assets/background.jpg'

const myStyle = {
    backgroundImage: `url(${background})`,
    height: "100vh",
    marginTop: "-40px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
};

const MainLayout = () => (
    <div>
        <div className="d-flex flex-column min-vh-100" style={myStyle}>
            <Container tag="main" className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <Outlet />
            </Container>
        </div>
        <Footer />
    </div>
);

export default MainLayout;
