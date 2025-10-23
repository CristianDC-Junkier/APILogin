import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook para acceder al contexto de autenticación.
 *
 * Devuelve:
 * - user: Objeto del usuario autenticado (o null si no hay sesión).
 * - version: String que contiene la versión actual del usuario autentificado
 * - loading: Boolean que indica si el estado de autenticación se está cargando.
 * - login: Función para iniciar sesión con credenciales.
 * - logout: Función para cerrar sesión.
 * - update: Función que se encarga de actualizar la información del usuario conectado en caso de que haya sido modificada
 *
 * Uso:
 * const { user, version, loading, login, logout, update } = useAuth();
 *
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
    return useContext(AuthContext);
};
