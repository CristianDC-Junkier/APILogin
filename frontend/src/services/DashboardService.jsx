/* eslint-disable react-hooks/rules-of-hooks */
import api from './AxiosService';


export const getUsersDashboard = async (token) => {
    try {
        const res = await api.get('/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        console.log(error)
        return { success: false, error };
    }
};
export const getUserById = async (id) => {
    try {
        const res = await api.get(`/api/dashboard/user`, { params: { userId: id } });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};

export const modifyUser = async (user, client, token) => {
    try {
        const res = await api.put('/api/dashboard/user', {
            user,
            client,
            token
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};
export const deleteUser = async (userId, userRol, userSecurityStamp, token) => {
    try {
        const res = await api.delete('/api/dashboard/user', {
            data: {
                targetUserId: userId,
                userRol,
                userSecurityStamp,
                token
            }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};


export const getLogFolders = async () => {
    try {
        const res = await api.get('/api/dashboard/logs/folders');
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};
export const getLogFiles = async (folder) => {
    try {
        const res = await api.get(`/api/dashboard/logs/${encodeURIComponent(folder)}/files`);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};
export const getLogFileContent = async (folder, file) => {
    try {
        const res = await api.get(`/api/dashboard/logs/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`);
        return { success: true, data: res.data }; 
    } catch (error) {
        return { success: false, error };
    }
};
export const downloadLogFile = async (folder, file) => {
    try {
        const res = await api.get(
            `/api/dashboard/logs/${encodeURIComponent(folder)}/${encodeURIComponent(file)}/download`,
            { responseType: 'blob' } 
        );

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file); 
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

