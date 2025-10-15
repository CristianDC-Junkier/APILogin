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
 * Solicitud para obtener la lista de todos los usuario existentes
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
 * Solicitud de creación de un nuevo usuario
 * @param {Object} user - la información del usuario que se quiere crear
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
 * Solicitud de modificación de un usuario existente
 * @param {Object} user - la información del usuario que se quiere modificar
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
 * Solicitud de eliminación de un usuario
 * @param {Object} userId - el ID del usuario que se quiere eliminar
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteDepartment = async (departmentId, token, version) => {
    try {
        const res = await api.delete(`/department/${departmentId}`, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};
//#endregion



