import api from './AxiosService';

export const getUsersList = async (token) => {
    try {
        const res = await api.get('/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};
export const createUser = async (user, token) => {
    try {
        const res = await api.post('/', user, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};
export const modifyUser = async (user, token) => {
    try {
        const res = await api.put(`/${user.id}`, user, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};
export const deleteUser = async (userId, token) => {
    try {
        const res = await api.delete(`/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

