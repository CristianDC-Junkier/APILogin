
const LoggerController = require("../controllers/LoggerController");
const { verifyToken } = require("../utils/JWT");

/**
 * Middleware que restringe el acceso únicamente a usuarios con rol de administrador.
 * 
 * Verifica el token JWT en la cabecera `Authorization`:
 *  - Si no existe o es inválido → responde con 401 (no autorizado).
 *  - Si el usuario no tiene rol `ADMIN` o `SUPERADMIN` → responde con 401 (sin permisos).
 *  - Si el token es válido y el rol es correcto → añade los datos del usuario a `req.user`
 *    y continúa con el siguiente middleware/controlador.
 * 
 * @param {Object} req - Objeto de petición de Express, con cabecera Authorization.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
async function adminOnly(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token requerido" });
    }

    try {
        const payload = await verifyToken(token);

        if (!payload || !payload.usertype) {
            return res.status(401).json({ error: "Token inválido" });
        }

        if (payload.usertype !== "ADMIN" && payload.usertype !== "SUPERADMIN") {
            LoggerController.error('Token inválido, no es administador, del usuario: ' + payload.username + " con id " + payload.id);
            return res.status(401).json({ error: "No tienes permisos" });
        }

        req.user = payload; 
        next();
    } catch (err) {
        LoggerController.warn('Token inválido: ' + err.message);
        return res.status(401).json({ error: "Token inválido" });
    }
}

/**
 * Middleware que restringe el acceso únicamente a usuarios cconectados.
 * 
 * Verifica el token JWT en la cabecera `Authorization`:
 *  - Si no existe o es inválido → responde con 401 (no autorizado).
 *  - Si el token es válido → añade los datos del usuario a `req.user`
 *    y continúa con el siguiente middleware/controlador.
 * 
 * @param {Object} req - Objeto de petición de Express, con cabecera Authorization.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
async function isAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ error: "Token requerido" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token requerido" });

        const payload = await verifyToken(token);
        if (!payload || !payload.id) {
            return res.status(401).json({ error: "Token inválido" });
        }
        req.user = payload;
        next();
    } catch (err) {
        LoggerController.warn(`Token inválido: ${err.message}`);
        return res.status(401).json({ error: "Token inválido" });
    }
}

module.exports = { adminOnly, isAuthenticated };
