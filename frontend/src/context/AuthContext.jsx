/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login, logout, refreshAccessToken } from '../services/AuthService';
import { setUpdateUserState } from '../utils/AuthInterceptorHelper';
import SpinnerComponent from '../components/utils/SpinnerComponent';

export const AuthContext = createContext();

/**
 * Proveedor de autenticación usando cookie HttpOnly
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);      // Usuario actual
    const [version, setVersion] = useState(0);   // Versión del usuario
    const [loading, setLoading] = useState(true); // Estado de carga inicial

    /**
     * Actualiza el usuario y su versión, función que será inyectada en el interceptor.
     * Esta función debe ser estable.
     * @param {Object} newUser - Objeto de usuario más reciente recibido del backend.
     */
    const contextUpdate = useCallback((newUser) => {
        setUser(newUser);
        setVersion(newUser.version || 0);
    }, [version]); // Incluimos 'version' en dependencias para fines de logging y para que React sepa cuándo re-crear la función.

    /**
     * Inyecta la función de actualización (contextUpdate) en el helper global.
     * Se llama una sola vez para que el interceptor pueda usarla.
     */
    useEffect(() => {
        setUpdateUserState(contextUpdate);
        return () => {
            setUpdateUserState(null);
        };
    }, [contextUpdate]);


    /** * Restaurar sesión al cargar la app usando cookie HttpOnly
     */
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const res = await refreshAccessToken();
                if (!res.success) throw new Error("No hay sesión");

                // Usamos contextUpdate para establecer el estado de manera consistente
                contextUpdate(res.data.user);
            } catch {
                // Si no hay sesión o hay error → limpiar estado
                setUser(null);
                setVersion(0);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [contextUpdate]); // contextUpdate es estable gracias a useCallback.

    /**
     * Login
     * @param {Object} credentials - { username, password, remember }
     */
    const contextLogin = async (credentials) => {
        try {
            const result = await login(credentials);

            if (result.success) {
                // Reconstruimos el objeto para asegurar que tiene todas las propiedades clave
                const userLog = {
                    id: result.data.user.id,
                    username: result.data.user.username,
                    usertype: result.data.user.usertype,
                    ...result.data.user, // Incluimos el resto de propiedades
                    forcePwdChange: result.data.user.forcePwdChange || false,
                    version: result.data.user.version || 0,
                };
                setUser(userLog);
                setVersion(userLog.version);
            } else {
                setUser(null);
                setVersion(0);
            }

            return result;
        } catch (err) {
            setUser(null);
            setVersion(0);
            // Retorna un error consistente
            return { success: false, message: err.message || "Error de inicio de sesión." };
        }
    };

    /**
     * Logout
     */
    const contextLogout = async () => {
        try {
            await logout(); // la cookie HttpOnly se borra desde el backend
        } finally {
            setUser(null);
            setVersion(0);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                version,
                loading,
                login: contextLogin,
                logout: contextLogout,
                update: contextUpdate, // Exponer también la función para uso interno si es necesario
            }}
        >
            {/* Mostrar un spinner de carga si es necesario antes de renderizar children */}
            {loading ? <SpinnerComponent></SpinnerComponent> : children}
        </AuthContext.Provider>
    );
}
