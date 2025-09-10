import api from './AxiosService';

export const generateToken = async (actionType) => {
    try {
        const response = await api.post('/api/security/action-token', {actionType});
        return response.data; 
    } catch (error) {
        alert(error)
        console.error('Error generating action token:', error);
        throw error;
    }
};