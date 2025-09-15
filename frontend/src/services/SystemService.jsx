import api from './AxiosService';

// Obtener todos los logs
export const getLogs = async (token) => {
    try {
        const res = await api.get('/logs', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};

// Obtener contenido de un log
export const getLog = async (log,token) => {
    try {
        const res = await api.get(`/logs/${encodeURIComponent(log)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};

// Descargar un log
export const downloadLog = async (log,token) => {
    try {
        const res = await api.get(
            `/logs/${encodeURIComponent(log)}/download`,
            {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', log);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

// Obtener métricas del sistema
export const getSystemMetrics = async (token) => {
    try {
        const res = await api.get('/system',{
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, error };
    }
};
