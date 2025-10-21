
const express = require("express");
const router = express.Router();

const DepartmentController = require("../controllers/DepartmentController");
const { isAuthenticated, adminOnly } = require("../middlewares/Auth");

/**
 * Rutas para gestión de departamentos.
 *
 * Endpoints:
 * - GET    /                       → Listar todos los departamento (solo ADMIN o SUPERADMIN).
 * - POST   /                       → Crear un nuevo departamento (solo ADMIN o SUPERADMIN).
 * - PUT    /:id                    → Actualizar datos de un departamento por ID (solo ADMIN o SUPERADMIN).
 * - DELETE /:id                    → Eliminar un departamento por ID (solo ADMIN o SUPERADMIN).
 * 
 * - GET    /profile                → Listar todos los departamento con sus links del usuario que realiza la petición (Usuario identificado).
 * - PUT    /:id/add-links/:linkId  → Añadir un link a un departamento (solo ADMIN o SUPERADMIN).
 * - PUT    /:id/del-links/:linkId  → Eliminar un link de un departamento (solo ADMIN o SUPERADMIN).
 * 
 * Middleware:
 * - `adminOnly`        → Restringe el acceso a usuarios con roles de administrador.
 * - `isAuthenticated`  → Restringe el acceso a usuarios autenticados.
 */

router.get("/", adminOnly, DepartmentController.list);
router.post("/", adminOnly, DepartmentController.create);
router.put("/:id", adminOnly, DepartmentController.update);
router.delete("/:id", adminOnly, DepartmentController.delete);

router.get("/profile", isAuthenticated, DepartmentController.getLinks);
router.put("/:id/add-links/:linkId", adminOnly, DepartmentController.addLink);
router.put("/:id/del-links/:linkId", adminOnly, DepartmentController.delLink);

module.exports = router;
