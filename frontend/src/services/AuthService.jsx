// Servicio de autenticación para la aplicación frontend
// Proporciona métodos para login, logout y verificación de autenticación

import axios from './AxiosService';

const API_URL = 'http://localhost:5000/api/auth/';

class AuthService {
  // Inicia sesión con usuario y contraseña
  login(username, password) {
    return axios
      .post(API_URL + 'login', { username, password })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  // Cierra sesión eliminando el usuario del localStorage
  logout() {
    localStorage.removeItem('user');
  }

  // Registra un nuevo usuario
  register(username, email, password) {
    return axios.post(API_URL + 'register', {
      username,
      email,
      password,
    });
  }

  // Obtiene el usuario autenticado actual
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();