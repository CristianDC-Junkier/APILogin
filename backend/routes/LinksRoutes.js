
const express = require("express");
const router = express.Router();

const LinksController = require("../controllers/LinksController");
const { adminOnly, isAuthenticated } = require("../middlewares/Auth");

/**
 * Rutas para gestión de links.
 *
 * Endpoints:
 * - GET    /                → Listar todos los links (solo ADMIN o SUPERADMIN).
 * - POST   /                → Crear un nuevo link (solo ADMIN o SUPERADMIN).
 * - PUT    /:id             → Actualizar datos de un link por ID (solo ADMIN o SUPERADMIN).
 * - DELETE /:id             → Eliminar un link por ID (solo ADMIN o SUPERADMIN).
 * - GET    /department/:id  → Obtener Links por departamento (Solo Usuarios identificados).
 * 
 * Middleware:
 * - `adminOnly` → Restringe el acceso a usuarios con roles de administrador.
 * - `isAuthenticated` → Restringe el acceso a usuarios autenticados.
 */


router.get("/", adminOnly, LinksController.list);
router.post("/", adminOnly, LinksController.create);
router.put("/:id", adminOnly, LinksController.update);
router.delete("/:id", adminOnly, LinksController.delete);

router.get("/department/:id", isAuthenticated, LinksController.getLinksByDepartment);

module.exports = router;
