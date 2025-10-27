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

//#region Recoger departamentos

/**
 * Solicitud para obtener la lista de todos los departamentos existentes
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getDepartmentList = async () => {
    try {
        const res = await api.get('/department/');
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

//#endregion

//#region Operaciones CRUD en departamentos
/**
 * Solicitud de creación de un nuevo departamento
 * @param {Object} department - la información del departamento que se quiere crear
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const createDepartment = async (department) => {
    try {
        const res = await api.post('/department/', department);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de modificación de un departamento existente
 * @param {String} id - ID del departamento que se quiere modificar
 * @param {Object} department - la información del departamento que se quiere modificar
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyDepartment = async (id, department) => {
    try {
        const res = await api.put(`/department/${id}`, department);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de eliminación de un departamento
 * @param {Object} departmentId - ID del departamento que se quiere eliminar
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteDepartment = async (departmentId) => {
    try {
        const res = await api.delete(`/department/${departmentId}`,);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};
//#endregion

//#region Operaciones sobre enlaces en departamentos
/**
 * Solicitud para añadir un enlace a un departamento
 * @param {String} depId - ID del departamento al que se va a añadir el enlace
 * @param {String} linkId - ID del enlace
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const addLinkToDepartment = async (depId, linkId) => {
    try {
        const res = await api.put(`/department/${depId}/add-links/${linkId}`, {});
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud para eliminar un enlace de un departamento
 * @param {String} depId - ID del departamento del que se va a eliminar el enlace
 * @param {String} linkId - ID del enlace
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteLinkToDepartment = async (depId, linkId) => {
    try {
        const res = await api.put(`/department/${depId}/del-links/${linkId}`, {});
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud para obtener la lista de todos los departamentos del usuario que realiza la petición
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getLinksByProfileList = async (version) => {
    try {
        const res = await api.get('/department/profile', {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

//#endregion

