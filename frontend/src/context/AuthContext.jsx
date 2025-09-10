import React, { createContext, useState, useEffect } from 'react';
import {
    getProfile,
    login,
    logout,
    register,
} from '../services/AuthService';
import { setSession } from '../services/SessionStateService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Carga el perfil del usuario y lo establece en el contexto.
     * Devuelve el perfil si tiene éxito, o null si falla.
     */
    const loadUser = async () => {
        try {
            const { success, data } = await getProfile();
            if (success) {
                setUser(data);
                return data;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error("Error loading user:", error);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user !== null) {
            setSession(user);
        }
    }, [user]);

    /**
     * Login normal
     */
    const contextLogin = async (credentials) => {
        const result = await login(credentials);
        if (result.success) {
            await loadUser();
        } else {
            setUser(null);
        }
        return result;
    };

    /**
    * Logout
    */
    const contextLogout = async () => {
        await logout();
        setUser(null);
    };

    /**
     * Registro de usuario
     */
    const contextRegister = async (credentials) => {
        const result = await register(credentials);
        if (result.success) {
            await loadUser();
        } else {
            setUser(null);
        }
        return result;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login: contextLogin,
                logout: contextLogout,
                register: contextRegister,
                loadUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
