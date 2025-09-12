import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utils/Spinner';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
                if (user.usertype === 'ADMIN' || user.usertype === 'SUPERADMIN') {
                    navigate('/home');
                }
                else if (user.usertype === 'USER') {
                    navigate('/app');
                } else {
                    navigate('/login');
                }
        }
    }, [loading, user, navigate]);

    if (loading) return <Spinner />;
    return !user ? children : <Spinner />;
};

export default PublicRoute;

