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
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getAllLinks = async () => {
    try {
        const res = await api.get('/link/');
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de creación de un nuevo enalce
 * @param {Object} link - la información del enlace que se quiere crear
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const createLink = async (link) => {
    try {
        const res = await api.post('/link/', link);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de modificación de un enlace existente
 * @param {int} linkId - ID del enlace que se va a modificar
 * @param {Object} link - la información del enlace que se quiere modificar
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyLink = async (linkId, link,) => {
    try {
        const res = await api.put(`/link/${linkId}`, link);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de eliminación de un enlace
 * @param {Object} linkId - el ID del enlace que se quiere eliminar
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteLink = async (linkId) => {
    try {
        const res = await api.delete(`/link/${linkId}`);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}