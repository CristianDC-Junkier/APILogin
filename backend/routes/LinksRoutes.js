
const express = require("express");
const router = express.Router();

const LinksController = require("../controllers/LinksController");
const { adminOnly, isAuthenticated } = require("../middlewares/Auth");

/**
 * Rutas para gestión de links.
 *
 * Endpoints:
 * - GET    /                → Listar todos los links (Solo administradores).
 * - POST   /                → Crear un nuevo link (Solo administradores).
 * - PUT    /:id             → Actualizar datos de un link por ID (Solo administradores).
 * - DELETE /:id             → Eliminar un link por ID (Solo administradores).
 * 
 * Middleware:
 * - `adminOnly` → Restringe el acceso a usuarios con roles de administrador.
 * - `isAuthenticated` → Restringe el acceso a usuarios autenticados.
 */

router.get("/", adminOnly, LinksController.list);
router.post("/", adminOnly, LinksController.create);
router.put("/:id", adminOnly, LinksController.update);
router.delete("/:id", adminOnly, LinksController.delete);

module.exports = router;
