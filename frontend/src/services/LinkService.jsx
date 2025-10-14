import api from './AxiosService';

/**
 * Servicio encargado de hacer las llamadas al servidor 
 * sobre las acciones que afectan a los enlaces
 * 
 * Proporciona metodos para:
 *  - Listar todos los enlaces
 *  - Listar enlaces por departamento
 *  - Crear un enlace
 *  - Modificar un enlace
 *  - Eliminar un enlace
 * 
 */

/**
 * Solicitud para obtener la lista de todos los enlaces existentes
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getAllLinks = async (token) => {
    try {
        const res = await api.get('/link/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud para obtener la lista de todos los enlaces existentes asociados a un departamento
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {int} depId - ID del departamento del que se quieren obtener los enlaces
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getLinksByDepartment = async (depId, token) => {
    try {
        const res = await api.get(`/link/department/${depId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de creación de un nuevo enalce
 * @param {Object} link - la información del enlace que se quiere crear
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const createLink = async (link, token) => {
    try {
        const res = await api.post('/link/', link, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de modificación de un enlace existente
 * @param {int} linkId - ID del enlace que se va a modificar
 * @param {Object} link - la información del enlace que se quiere modificar
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyLink = async (linkId, link, token) => {
    try {
        const res = await api.put(`/link/${linkId}`, link, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de eliminación de un enlace
 * @param {Object} linkId - el ID del enlace que se quiere eliminar
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteLink = async (linkId, token) => {
    try {
        const res = await api.delete(`/link/${linkId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}