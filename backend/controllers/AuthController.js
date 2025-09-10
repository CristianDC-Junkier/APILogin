const Login = require("../models/AuthModel");
const { generateToken } = require("../utils/JWT");

class AuthController {

    // Login de usuario
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Usuario y contraseña requeridos" });
            }

            const user = await Login.findOne({ where: { username } });

            if (!user) return res.status(401).json({ success: false, message: "Credenciales incorrectas" });

            if (user.password !== password) {
                return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }

            const token = generateToken({ id: user.id, username: user.username, usertype: user.usertype });
            
            res.json({
                success: true,
                user: {
                    username: user.username,
                    usertype: user.usertype,
                    token: token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Registrar usuario
    static async create(req, res) {
        try {
            const { username, password, usertype } = req.body;

            if (!username || !password) {
                return res.status(400).json({ success: false, message: "Usuario y contraseña requeridos" });
            }

            const user = await Login.create({ username, password, usertype });
            if ((user.usertype === "SUPERADMIN" || usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN") {
                return res.status(403).json({
                    success: false,
                    message: "Solo un SUPERADMIN puede modificar a otro SUPERADMIN"
                });
            }

            res.json({
                success: true,
                message: "Usuario registrado correctamente",
                id: user.id,
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // Listar usuarios
    static async listAll(req, res) {
        try {
            const users = await Login.findAll({ attributes: ["id", "username", "usertype"] });
            res.json(users);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Modificar usuario
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { username, password, usertype } = req.body;

            const user = await Login.findByPk(id);
            if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

            if ((user.usertype === "SUPERADMIN" || usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN" ) {
                return res.status(403).json({
                    success: false,
                    message: "Solo un SUPERADMIN puede modificar a otro SUPERADMIN"
                });
            }

            if (username) user.username = username;
            if (password) user.password = password;
            if (usertype) user.usertype = usertype;

            await user.save();

            

            res.json({
                success: true,
                message: "Usuario actualizado correctamente"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Eliminar usuario
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await Login.findByPk(id);
            if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

            if (user.usertype === 'SUPERADMIN') {
                re.save.status(403).json({ success: false, message: "No puedes eliminar al SUPERADMIN" })
            }

            await user.destroy();

            res.json({
                success: true,
                message: "Usuario eliminado correctamente"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = AuthController;
