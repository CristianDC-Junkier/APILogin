
const express = require("express");
const router = express.Router();

const UserAccountController = require("../controllers/UserAccountController");
const { isAuthenticated, adminOnly } = require("../middlewares/Auth");

/**
 * Rutas para la gestión de cuentas de usuario.
 *
 * Endpoints:
 * - PUT    /profile/update                        → Modificar la cuenta del usuario identificado. (Usuarios identificados)
 * - DELETE /profile/delete                        → Eliminar la cuenta del usuario identificado. (Usuarios identificados)
 * - PATCH  /profile/PWD                           → Modificar solo la contraseña del usuario identificado. (Usuarios identificados)
 * - POST   /profile/add-department/:departmentId  → Añadir departamento a un usuario. (Solo administradores)
 * - DELETE /profile/del-department/:departmentId  → Eliminar departamento de un usuario. (Solo administradores)
 * 
 * - GET    /                                      → Listar todos los usuarios. (Solo administradores)
 * - GET    /:id                                   → Obtener los datos completos de un usuario por ID. (Solo administradores)
 * 
 * - POST   /                                      → Crear un nuevo usuario. (Solo administradores)
 * - PUT    /:id                                   → Actualizar un usuario existente. (Solo administradores)
 * - DELETE /:id                                   → Eliminar un usuario. (Solo administradores)
 * - PATCH  /:id/forcePwdChange                    → Forzar cambio de contraseña al usuario. (Solo administradores)
 * 
 * - POST   /:id/add-department/:departmentId      → Añadir departamento a un usuario. (Solo administradores)
 * - DELETE /:id/del-department/:departmentId      → Eliminar departamento de un usuario. (Solo administradores)
 *
 * Middlewares:
 * - `adminOnly`        → Restringe acceso a usuarios con rol de administrador o superior.
 * - `isAuthenticated`  → Restringe el acceso a usuarios autenticados.
 */

router.put("/profile/update", isAuthenticated, UserAccountController.updateMyAccount);
router.delete("/profile/delete", isAuthenticated, UserAccountController.deleteMyAccount);
router.patch("/profile/PWD", isAuthenticated, UserAccountController.forcedPasswordChange);
router.post("/profile/add-department/:departmentId", adminOnly, UserAccountController.addDepartmentProfile);
router.delete("/profile/del-department/:departmentId", adminOnly, UserAccountController.delDepartmentProfile);

router.get("/", adminOnly, UserAccountController.list);
router.get("/:id", adminOnly, UserAccountController.getOne);

router.post("/", adminOnly, UserAccountController.create);
router.put("/:id", adminOnly, UserAccountController.update);
router.delete("/:id", adminOnly, UserAccountController.delete);
router.patch("/:id/forcepwd", adminOnly, UserAccountController.forcePasswordChange);

router.post("/:id/add-department/:departmentId", adminOnly, UserAccountController.addDepartment);
router.delete("/:id/del-department/:departmentId", adminOnly, UserAccountController.delDepartment);

module.exports = router;
