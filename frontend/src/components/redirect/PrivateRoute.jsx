import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utils/Spinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('PrivateRoute - User:', user, 'Loading:', loading);
        if (!loading && user === null) {
            navigate('/login', { replace: true });
        }
    }, [loading, user, navigate]);

    if (loading) return <Spinner />;
    return user ? children : <Spinner />;
};

export default PrivateRoute;
