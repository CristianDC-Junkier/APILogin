const express = require('express');
const router = express.Router();

const SystemController = require('../controllers/SystemController');
const { adminOnly } = require("../middlewares/auth");

// Obtener los logs del sistema
router.get('/logs', adminOnly, SystemController.getLogs);
// Obtener contenido de un archivo log
router.get('/logs/:log', adminOnly, SystemController.getLog);
// Descargar un archivo log
router.get('/logs/:log/download', adminOnly, SystemController.downloadLog);
// Obtener métricas del sistema
router.get('/system', adminOnly, SystemController.getSystemMetrics);

module.exports = router;
