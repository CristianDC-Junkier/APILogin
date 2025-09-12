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

