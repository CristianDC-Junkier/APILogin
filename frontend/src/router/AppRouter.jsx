import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

// Importa tus componentes de página aquí
import LoginPage from '../pages/Login';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import AccessDenied from '../pages/AccessDenied';
import UserList from '../pages/Users/UserList'

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/accessdenied" element={<AccessDenied />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />

                <Route path="/users" element={<UserList />} />

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;