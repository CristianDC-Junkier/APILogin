import api from './AxiosService';

/**
 * Servicio encargado de hacer las llamadas al servidor 
 * sobre las acciones que afectan a los usuarios
 * 
 * Proporciona metodos para:
 *  - Listar todos los departamentos
 *  - Crear un departamento
 *  - Modificar un departamento
 *  - Eliminar un usuario
 * 
 */

//#region Get Lists Functions

/**
 * Solicitud para obtener la lista de todos los departamentos existentes
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getDepartmentList = async (token) => {
    try {
        const res = await api.get('/department/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

//#endregion

//#region Generic Department Action
/**
 * Solicitud de creación de un nuevo departamento
 * @param {Object} department - la información del departamento que se quiere crear
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const createDepartment = async (department, token) => {
    try {
        const res = await api.post('/department/', department, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de modificación de un departamento existente
 * @param {String} id - ID del departamento que se quiere modificar
 * @param {Object} department - la información del departamento que se quiere modificar
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyDepartment = async (id, department, token) => {
    try {
        const res = await api.put(`/department/${id}`, department, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de eliminación de un departamento
 * @param {Object} departmentId - ID del departamento que se quiere eliminar
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteDepartment = async (departmentId, token) => {
    try {
        const res = await api.delete(`/department/${departmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};
//#endregion

//#region Link Association Actions
/**
 * Solicitud para añadir un enlace a un departamento
 * @param {String} depId - ID del departamento al que se va a añadir el enlace
 * @param {String} linkId - ID del enlace
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const addLinkToDepartment = async (depId, linkId, token) => {
    try {
        const res = await api.put(`/department/${depId}/add-links/${linkId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud para eliminar un enlace de un departamento
 * @param {String} depId - ID del departamento del que se va a eliminar el enlace
 * @param {String} linkId - ID del enlace
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteLinkToDepartment = async (depId, linkId, token) => {
    try {
        const res = await api.put(`/department/${depId}/del-links/${linkId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud para obtener la lista de todos los departamentos del usuario que realiza la petición
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getLinksByProfileList = async (token, version) => {
    try {
        const res = await api.get('/department/profile', {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

//#endregion

