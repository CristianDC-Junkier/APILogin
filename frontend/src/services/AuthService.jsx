import api from './AxiosService';

export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error };
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
        return { success: true };
    } catch {
        return { success: false };
    }
};

export const recoverPass = async (credentials) => {
    try {
        await api.post('/auth/recoverpass', credentials);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

export const resetPass = async (credentials) => {
    try {
        await api.post('/auth/resetpass', credentials);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

export const getProfile = async () => {
    try {
        const res = await api.get('/auth/profile');
        return { success: true, data: res.data };
    } catch {
        return { success: false, data: null };
    }
};

export const getRecoveryToken = async (tokenParam) => {
    try {
        const res = await api.get(`/auth/validatetoken?token=${tokenParam}`);
        return { success: true, data: res.data };
    } catch {
        return { success: false, data: null };
    }
};