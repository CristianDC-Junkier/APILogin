import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import ExternalLayout from '../layouts/ExternalLayout';
import HomeLayout from '../layouts/HomeLayout';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import LoginPage from '../pages/Login';
import HomePage from '../pages/home/Home';
//import HomeOld from '../pages/old-pages/Home-old';

import NotFoundPage from '../pages/NotFound';
import AccessDeniedPage from '../pages/AccessDenied';

import DashBoardUserPage from '../pages/users/DashboardUser';
import DashboardSystemPage from '../pages/system/DashboardSystem';
import DashboardDepartmentPage from '../pages/department/DashboardDepartment';
import ExternalWebPage from '../pages/web/ExternalWeb';
//import WebListPage from '../pages/old-pages/WebList-old';

import ProfileUserPage from '../pages/users/ProfileUser';

import PrivacityPage from '../pages/politics/Privacity';
import CookiesPage from '../pages/politics/Cookies';
import CompromisePage from '../pages/politics/Compromise';

/**
 * Encargado de definir las rutas de acceso a las distintas páginas y
 * limitar su acceso dependiendo de los permisos del usuario
 */

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/accessdenied" element={<AccessDeniedPage />} />

                <Route path="/privacity-politic" element={<PrivacityPage />} />
                <Route path="/cookies-politic" element={<CookiesPage />} />
                <Route path="/data-compromise" element={<CompromisePage />} />

                {/* Rutas publicas */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

                {/* Rutas privadas */}
                <Route path="/profile" element={<PrivateRoute><ProfileUserPage /> </PrivateRoute>} />

                {/* Rutas privadas por rol */}
                <Route path="/users" element={<RoleRoute allowedRoles={['ADMIN', 'SUPERADMIN']}><DashBoardUserPage /></RoleRoute>} />
                <Route path="/logs" element={<RoleRoute allowedRoles={['ADMIN', 'SUPERADMIN']}><DashboardSystemPage /></RoleRoute>} />
                <Route path="/departments" element={<RoleRoute allowedRoles={['ADMIN', 'SUPERADMIN']}><DashboardDepartmentPage /></RoleRoute>} />

                <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route element={<ExternalLayout />}>
                <Route path="/web" element={<PrivateRoute><ExternalWebPage /></PrivateRoute>} />
            </Route>
            <Route element={<HomeLayout />}>
                <Route path="/home" element={<PrivateRoute> <HomePage /> </PrivateRoute>} />
            </Route>

        </Routes>
    );
};

export default AppRouter;
