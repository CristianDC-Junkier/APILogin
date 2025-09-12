import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import PublicRoute from '../components/redirect/PublicRoute';
import PrivateRoute from '../components/redirect/PrivateRoute';
import RoleRoute from '../components/redirect/RoleRoute';


import LoginPage from '../pages/Login';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import AccessDenied from '../pages/AccessDenied';
import UserList from '../pages/Users/UserList';

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/accessdenied" element={<AccessDenied />} />
                <Route path="/accessdenied" element={<AccessDenied />} />
                {/* Rutas publicas */}
                <Route path="/login" element={<LoginPage />} />
                {/* Rutas privadas */}
                <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                {/* Rutas privadas por rol */}
                <Route path="/users" element={<RoleRoute allowedRoles={['ADMIN', 'SUPERADMIN']}><UserList /></RoleRoute>} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
