
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { adminOnly } = require("../middlewares/Auth");

/**
 * Rutas para gestión de usuarios.
 *
 * Endpoints:
 * - POST   /login               → Iniciar sesión y obtener token JWT.
 * - GET    /                    → Listar todos los usuarios (solo ADMIN o SUPERADMIN).
 * - POST   /                    → Crear un nuevo usuario (solo ADMIN o SUPERADMIN).
 * - PUT    /:id                 → Actualizar datos de un usuario por ID (solo ADMIN o SUPERADMIN).
 * - DELETE /:id                 → Eliminar un usuario por ID (solo ADMIN o SUPERADMIN).
 * - PUT    /add-department/:id  → Añadir un departamento a un usuario (solo ADMIN o SUPERADMIN).
 * - PUT    /del-department/:id  → Eliminar un departamento a un usuario (solo ADMIN o SUPERADMIN).
 * 
 * Middleware:
 * - `adminOnly` → Restringe el acceso a usuarios con roles de administrador.
 */


router.post("/login", AuthController.login);

router.get("/", adminOnly, AuthController.list);
router.post("/", adminOnly, AuthController.create);
router.put("/:id", adminOnly, AuthController.update);
router.delete("/:id", adminOnly, AuthController.delete);

router.put("/add-department/:id", adminOnly, AuthController.addDepartment);
router.put("/del-department/:id", adminOnly, AuthController.delDepartment);

module.exports = router;
