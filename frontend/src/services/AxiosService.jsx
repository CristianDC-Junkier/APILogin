// src/services/AxiosService.js
import axios from 'axios';
import { getSession } from './SessionStateService';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
});

let isRefreshing = false;
let refreshFailed = false;
let failedQueue = [];

const processQueue = (error = null) => {
    failedQueue.forEach(prom => {
        error ? prom.reject(error) : prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isRefreshRequest = originalRequest.url.includes('/auth/refresh');

        const isOnAuthPage =
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/accessdenied') ||
            window.location.pathname.includes('/notfound');

        const hadUserBefore = !!getSession();

        // Si ya falló el refresh y no estamos en páginas de login/acceso denegado/not found,
        // redirigimos a login SOLO si había usuario antes (cookie válida)
        if (refreshFailed && hadUserBefore && !isOnAuthPage) {
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Manejo del 401 para refrescar token
        if (status === 401 || status === 403 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(api(originalRequest)),
                        reject: err => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await api.post('/auth/refresh');

                if (refreshResponse.status === 200) {
                    refreshFailed = false;
                    processQueue();
                    return api(originalRequest);
                } else {
                    refreshFailed = true;
                    processQueue(new Error('Refresh failed'));
                    if (!isOnAuthPage && hadUserBefore) window.location.href = '/login';
                    return Promise.reject(error);
                }
            } catch (err) {
                const refreshStatus = err.response?.status;
                if ((refreshStatus === 433 || refreshStatus === 500) && !isOnAuthPage && hadUserBefore) {
                    refreshFailed = true;
                    processQueue(err);
                    window.location.href = '/login';
                    return Promise.reject(err);
                }

                refreshFailed = true;
                processQueue(err);
                if (!isOnAuthPage && hadUserBefore) window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;