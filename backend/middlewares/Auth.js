const LoggerController = require("../controllers/LoggerController");
const { verifyToken } = require("../utils/JWT");

/**
 * Función auxiliar para validar accessToken del header Authorization
 */
async function getTokenPayload(req, res) {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token requerido" });
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = await verifyToken(token, "access"); // ahora usamos accessToken
        if (!payload || !payload.id) {
            res.status(401).json({ error: "Token inválido" });
            return null;
        }
        return payload;
    } catch (err) {
        LoggerController.warn(`Token inválido: ${err.message}`);
        res.status(401).json({ error: "Token inválido o expirado" });
        return null;
    }
}

/**
 * Middleware: Solo usuarios autenticados
 */
async function isAuthenticated(req, res, next) {
    const payload = await getTokenPayload(req, res);
    if (!payload) return; // ya respondió con 401

    req.user = payload;
    next();
}

/**
 * Middleware: Solo administradores
 */
async function adminOnly(req, res, next) {
    const payload = await getTokenPayload(req, res);
    if (!payload) return;

    if (payload.usertype !== "ADMIN" && payload.usertype !== "SUPERADMIN") {
        LoggerController.error(`Acceso denegado: usuario no administrador (${payload.username} - ID ${payload.id})`);
        return res.status(403).json({ error: "No tienes permisos" });
    }

    req.user = payload;
    next();
}

module.exports = { adminOnly, isAuthenticated };
