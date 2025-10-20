import api from './AxiosService';

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
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getUsersList = async (token) => {
    try {
        const res = await api.get('/user/', {
            headers: { Authorization: `Bearer ${token}` }
        });
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
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const createUser = async (user, token) => {
    try {
        const res = await api.post('/user/', user, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de modificación de un usuario existente
 * @param {int} userId - ID del usuario que se va a modificar
 * @param {Object} user - la información del usuario que se quiere modificar
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyUser = async (userId, user, token) => {
    try {
        const res = await api.put(`/user/${userId}`, user, {
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
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteUser = async (userId, token, version) => {
    try {
        const res = await api.delete(`/user/${userId}`, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
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
* @param {String} token - Token del usuario conectado para comprobar si tiene autorización
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const addDepartment = async (userId, departmentId, token, version) => {
    try {
        const res = await api.post(`/user/${userId}/add-department/${departmentId}`, {}, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
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
* @param {String} token - Token del usuario conectado para comprobar si tiene autorización
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const deleteDepartment = async (userId, departmentId, token, version) => {
    try {
        const res = await api.delete(`/user/${userId}/del-department/${departmentId}`, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
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
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const getProfile = async (token, version) => {
    try {
        const res = await api.get('/profile', {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de eliminación del perfil conectado
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const deleteProfile = async (token, version) => {
    try {
        const res = await api.delete(`/user/profile/delete`, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
};

/**
 * Solicitud de cambio de infromación de la cuenta del perfil conectado
 * @param {String} useraccount - Nueva información de inicio de sesion para el perfil conectado
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const modifyProfile = async (useraccount, token, version) => {
    try {
        const res = await api.put(`/user/profile/update`, useraccount, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
* Solicitud para añadir un departamento al perfil conectado
* @param {String} departmentId - ID del departamento a añadir al perfil conectado
* @param {String} token - Token del usuario conectado para comprobar si tiene autorización
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const addDepartmentProfile = async (departmentId, token, version) => {
    try {
        const res = await api.post(`/user/profile/add-department/${departmentId}`, {}, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
* Solicitud para eliminar un departamento del perfil conectado
* @param {String} departmentId - ID del departamento a eliminar del perfil conectado
* @param {String} token - Token del usuario conectado para comprobar si tiene autorización
* @param {String} version - Version del usuario conectado para comprobar si ya fue modificado
* @returns {JSON} - Devuelve la información recibida de la llamada
*/
export const deleteDepartmentProfile = async (departmentId, token, version) => {
    try {
        const res = await api.delete(`/user/profile/del-department/${departmentId}`, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
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
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {String} version - Version del usuario a modificar para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const markPWDCUser = async (userId, password, token, version) => {
    try {
        const res = await api.patch(`/user/${userId}/forcepwd`, password, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

/**
 * Solicitud de cambio de contraseña para un usuario que ha sido marcado para cambio de contraseña
 * @param {String} newPassword - Nueva contraseña para el usuario marcado para el cambio de contraseña
 * @param {String} token - Token del usuario conectado para comprobar si tiene autorización
 * @param {String} version - Version del usuario a modificar para comprobar si ya fue modificado
 * @returns {JSON} - Devuelve la información recibida de la llamada
 */
export const changePasswordPWD = async (newPassword, token, version) => {
    try {
        const res = await api.patch(`/user/profile/PWD`, newPassword, {
            params: { version },
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error };
    }
}

//#endregion


