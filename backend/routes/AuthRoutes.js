
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { isAuthenticated } = require("../middlewares/Auth");

/**
 * Rutas para gestión de usuarios.
 *
 * Endpoints:
 * - POST   /login               → Iniciar sesión y obtener token JWT.
 * - GET    /logout              → Desconectar Usuario (Usuarios Autentificados).
 * 
 * - GET    /profile             → Recoger datos del usuario (Usuarios Autentificados).
 * - GET    /version             → Recoger datos de la version del usuario (Usuarios Autentificados).
 * 
 * Middleware:
 * - `isAuthenticated` → Restringe el acceso a usuarios conectados.
 */


router.post("/login", AuthController.login);
router.get("/logout", isAuthenticated, AuthController.logout);

router.get("/profile", isAuthenticated, AuthController.getProfile);
router.get("/version", isAuthenticated, AuthController.getVersion);

module.exports = router;
