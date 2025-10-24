import api from './AxiosService';
import { setAccessToken } from './AuthService';

/**
 * Servicio encargado de hacer las llamadas al servidor 
 * sobre las acciones que afectan a los usuarios
 * 
 * Proporciona metodos para:
 *  - Listar todos los usuarios
 *  - Crear un usuario
 *  - Modificar un usuario
 *  - Eliminar un usuario
 * 
 */

//#region Get Lists Functions

/**
 * Solicitud para obtener la lista de todos los usuario existentes
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getUsersList = async () => {
    try {
        const res = await api.get('/user/');
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

//#endregion

//#region Generic User Action
/**
 * Solicitud de creación de un nuevo usuario
 * @param {Object} user - la información del usuario que se quiere crear
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const createUser = async (user) => {
    try {
        const res = await api.post('/user/', user);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de modificación de un usuario existente
 * @param {int} userId - ID del usuario que se va a modificar
 * @param {Object} user - la información del usuario que se quiere modificar
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyUser = async (userId, user) => {
    try {
        const res = await api.put(`/user/${userId}`, user);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de eliminación de un usuario
 * @param {Object} userId - el ID del usuario que se quiere eliminar
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteUser = async (userId, version) => {
    try {
        const res = await api.delete(`/user/${userId}`, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
* Solicitud para añadir un departamento a un usuario
* @param {String} userId - ID del usuario al que se va a añadir el departamento
* @param {String} departmentId - ID del departamento a añadir al usuario
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const addDepartment = async (userId, departmentId, version) => {
    try {
        const res = await api.post(`/user/${userId}/add-department/${departmentId}`, {}, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
* Solicitud para eliminar un departamento a un usuario
* @param {String} userId - ID del usuario al que se va a eliminar el departamento
* @param {String} departmentId - Departamento a eliminar del usuario
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const deleteDepartment = async (userId, departmentId, version) => {
    try {
        const res = await api.delete(`/user/${userId}/del-department/${departmentId}`, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}
//#endregion

//#region Profile Actions
/**
 * Solicitud para obtener la información del usuario conectado
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getProfile = async (version) => {
    try {
        const res = await api.get('/user/profile', {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de eliminación del perfil conectado
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteProfile = async (version) => {
    try {
        const res = await api.delete(`/user/profile/delete`, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de cambio de infromación de la cuenta del perfil conectado
 * @param {String} useraccount - Nueva información de inicio de sesion para el perfil conectado
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyProfile = async (useraccount, version) => {
    try {
        const res = await api.put(`/user/profile/update`, useraccount, {
            params: { version }
        });
        if (res.data?.accessToken) {
            setAccessToken(res.data.accessToken);
        }
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
* Solicitud para añadir un departamento al perfil conectado
* @param {String} departmentId - ID del departamento a añadir al perfil conectado
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const addDepartmentProfile = async (departmentId, version) => {
    try {
        const res = await api.post(`/user/profile/add-department/${departmentId}`, {}, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
* Solicitud para eliminar un departamento del perfil conectado
* @param {String} departmentId - ID del departamento a eliminar del perfil conectado
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const deleteDepartmentProfile = async (departmentId, version) => {
    try {
        const res = await api.delete(`/user/profile/del-department/${departmentId}`, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

//#endregion

//#region Forced Password Change Actions
/**
 * Solicitud para marcar a un usuario para forzar un cambio de contraseña
 * @param {Object} userId - el ID del usuario que se quiere va a marcar
 * @param {Object} password - la constraseña temporal establecida por el usuario que realizó la marcación 
 * @param {String} version - Version del usuario a modificar para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const markPWDCUser = async (userId, password, version) => {
    try {
        const res = await api.patch(`/user/${userId}/forcepwd`, password, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de cambio de contraseña para un usuario que ha sido marcado para cambio de contraseña
 * @param {String} newPassword - Nueva contraseña para el usuario marcado para el cambio de contraseña
 * @param {String} version - Version del usuario a modificar para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const changePasswordPWD = async (newPassword, version) => {
    try {
        const res = await api.patch(`/user/profile/PWD`, newPassword, {
            params: { version }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

//#endregion


