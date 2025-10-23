import axios from "axios";
import Swal from "sweetalert2";
import { getAccessToken, setAccessToken, refreshAccessToken, clearAccessToken } from "./AuthService";
import { getUpdateUserState } from '../utils/AuthInterceptorHelper';

const api = axios.create({
    baseURL: "/IDEE-Almonte/api",
    withCredentials: true,
});

let isRefreshing = false;

// --- INTERCEPTOR DE REQUEST ---
api.interceptors.request.use((config) => {
    const token = getAccessToken();

    // No adjuntar token a login, logout o refresh
    const skipAuth = config.url.includes("/auth/login") || config.url.includes("/auth/logoout") || config.url.includes("/auth/refresh");

    if (token && !skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// --- INTERCEPTOR DE RESPUESTA ---
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // ✅ --- CASO 401 (Access token expirado) ---
        if (status === 401 && !originalRequest._retry &&
            !originalRequest.url.includes("/auth/login") &&
            !originalRequest.url.includes("/auth/refresh")) {

            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const ok = await refreshAccessToken();
                    isRefreshing = false;

                    if (ok?.success && ok.data?.accessToken) {
                        const newToken = ok.data.accessToken;
                        setAccessToken(newToken); 
                        window.location.reload();
                        return;
                    } else {
                        clearAccessToken();
                        await Swal.fire({
                            icon: "warning",
                            title: "Sesión expirada",
                            html: "Por motivos de seguridad su sesión expiró.<br>Por favor, vuelve a iniciar sesión.",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });
                        window.location.href = "/IDEE-Almonte/login";
                        return Promise.reject(error);
                    }
                } catch (err) {
                    isRefreshing = false;
                    clearAccessToken();
                    return Promise.reject(err);
                }
            }
        }


        // ✅ --- CASO 409 (versión de usuario desactualizada) ---
        if (
            status === 409 &&
            !originalRequest.url.includes("/auth/login") &&
            !originalRequest.url.includes("/auth/logout") &&
            !originalRequest._retry
        ) {
            const latestUser = error.response.data?.latestUser;
            const updateUserState = getUpdateUserState();

            if (latestUser && updateUserState) {
                updateUserState(latestUser);
            }
            return Promise.reject(error);
        }

        // Cualquier otro error
        return Promise.reject(error);
    }
);

export default api;
