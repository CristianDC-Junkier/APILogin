const { verifyToken } = require("../utils/JWT");

function adminOnly(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.status(401).json({ success: false, message: "Token requerido" });

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ success: false, message: "Token requerido" });

    try {
        const payload = verifyToken(token);

        if (payload.usertype !== "ADMIN" && payload.usertype !== "SUPERADMIN") {
            return res.status(403).json({ success: false, message: "No tienes permisos" });
        }

        req.user = payload; 
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Token inválido" });
    }
}

module.exports = { adminOnly };
