
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

/**
 * Rutas para gestión de usuarios.
 *
 * Endpoints:
 * - POST   /login               → Iniciar sesión y obtener token JWT.
 * - GET    /logout              → Desconectar Usuario (Usuarios Autentificados).
 * - GET    /refresh             → Recoger y renovar el refreshtoken (Usuarios Autentificados).
 * 
 * Middleware:
 * - `isAuthenticated` → Restringe el acceso a usuarios conectados.
 */


router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.get("/refresh", AuthController.refreshToken);

module.exports = router;
