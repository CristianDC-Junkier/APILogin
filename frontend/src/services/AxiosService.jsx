// Axios.jsx
// Servicio para configurar y exportar una instancia de Axios personalizada

import axios from './AxiosService';

// Configuración base de Axios
const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambia la URL según tu backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación si existe
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores globales
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes manejar errores globales aquí, por ejemplo redirección en caso de 401
    return Promise.reject(error);
  }
);

export default instance;