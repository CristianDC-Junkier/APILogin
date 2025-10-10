
const express = require("express");
const router = express.Router();

const UserAccountController = require("../controllers/UserAccountController");
const { adminOnly } = require("../middlewares/Auth");

/**
 * Rutas para la gestión de cuentas de usuario.
 *
 * Endpoints:
 * - GET    /                     → Listar todos los usuarios. (Solo administradores)
 * - GET    /:id                  → Obtener los datos completos de un usuario por ID. (Solo administradores)
 * - POST   /                     → Crear un nuevo usuario. (Solo administradores)
 * - PUT    /:id                  → Actualizar un usuario existente. (Solo administradores)
 * - DELETE /:id                  → Eliminar un usuario. (Solo administradores)
 * - PATCH  /:id/forcePwdChange   → Forzar cambio de contraseña al usuario. (Solo administradores)
 * - POST   /:id/department       → Añadir departamento a un usuario. (Solo administradores)
 * - DELETE /:id/department       → Eliminar departamento de un usuario. (Solo administradores)
 *
 * Middlewares:
 * - `adminOnly` → Restringe acceso a usuarios con rol de administrador o superior.
 */

router.get("/", adminOnly, UserAccountController.list);
router.get("/:id", adminOnly, UserAccountController.getOne);

router.post("/", adminOnly, UserAccountController.create);
router.put("/:id", adminOnly, UserAccountController.update);
router.delete("/:id", adminOnly, UserAccountController.delete);
router.patch("/:id/forcepwd", adminOnly, UserAccountController.forcePasswordChange);

router.post("/:id/add-department/:departmentId", adminOnly, UserAccountController.addDepartment);
router.delete("/:id/add-department/:departmentId", adminOnly, UserAccountController.delDepartment);

module.exports = router;
