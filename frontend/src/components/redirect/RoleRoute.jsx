import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utils/Spinner';

const RoleRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(user.usertype);
            if (!loading && (!user || !allowedRoles.includes(user.usertype))) {
                navigate('/accessdenied', { replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [loading, user, navigate, allowedRoles]);

    if (loading) return <Spinner />;
    if (!user || !allowedRoles.includes(user.usertype)) return null;

    return children;
};

export default RoleRoute;
