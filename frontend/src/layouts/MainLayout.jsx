import React from 'react';
import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const MainLayout = () => (
    <div className="d-flex flex-column min-vh-100">
        <Container tag="main" className="flex-grow-1">
            <Outlet />
        </Container>
        <Footer />
    </div>
);

export default MainLayout;
