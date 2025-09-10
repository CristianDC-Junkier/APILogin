const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const { adminOnly } = require("../middlewares/auth");

// Loguear usuario
router.post('/login', AuthController.login);

// Obtener todos los usuarios
router.get('/', adminOnly, AuthController.listAll);
// Crear un nuevo usuario
router.post('/', adminOnly, AuthController.create);
// Modificar un usuario existente
router.put('/:id', adminOnly, AuthController.update);
// Eliminar un usuario
router.delete('/:id', adminOnly, AuthController.delete);

module.exports = router;
