import api from './AxiosService';

// Token en memoria
let accessToken = null;

/**
 * Devuelve el accessToken actual
 */
export const getAccessToken = () => accessToken;

/**
 * Guarda el accessToken
 */
export const setAccessToken = (token) => {
    accessToken = token;
};

/**
 * Limpia el accessToken
 */
export const clearAccessToken = () => {
    accessToken = null;
};

/**
 * Login
 * credentials: { username, password, remember }
 */
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);

        // Guardar el accessToken recibido
        if (response.data?.accessToken) {
            setAccessToken(response.data.accessToken);
        }

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'Error al iniciar sesión',
        };
    }
};

/**
 * Llamada al backend para refrescar el accessToken usando la cookie refreshToken
 */
export const refreshAccessToken = async () => {
    try {
        const response = await api.get('/auth/refresh', {});
        if (response.data?.accessToken) {
            setAccessToken(response.data.accessToken);
        }
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'Error al recargar Token',
        };
    }
};

/**
 * Logout
 */
export const logout = async () => {
    try {
        await api.get('/auth/logout'); // el backend borra la cookie refreshToken
        clearAccessToken();
        return { success: true };
    } catch (error) {
        clearAccessToken();
        return {
            success: false,
            error: error.response?.data?.error || 'Error al cerrar sesión',
        };
    }
};
