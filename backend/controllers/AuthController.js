
const { UserAccount, Department, RefreshToken } = require("../models/Relations");

const { generateToken } = require("../utils/JWT");
const LoggerController = require("../controllers/LoggerController");

/**
 * Controlador de autenticación y gestión de usuarios.
 * 
 * Proporciona métodos estáticos para:      
 *  - Login de usuarios                                
 *  - Login de usuario
 *  - Recoger perfil del usuario
 *  - Recoger version del usuario 
 */
class AuthController {

    /**
    * Inicia sesión con un usuario existente.
    * 
    * @param {Object} req - Objeto de petición de Express, con { body: { username, password } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - JSON con información del usuario y token si es exitoso,
    *                   o mensajes de error en caso de credenciales inválidas o falta de datos.
    */
    static async login(req, res) {
        try {
            const { username, password, remember } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Usuario y contraseña requeridos" });
            }


            const user = await UserAccount.findByPk(userId, {
                include: [
                    {
                        model: Department,
                        as: 'departments',
                        attributes: ['id', 'name'],
                        through: { attributes: [] }
                    },
                ],
            });

            if (!user || user.password !== password) {
                return res.status(404).json({ error: "Credenciales incorrectas" });
            }

            const token = generateToken({ id: user.id, username: user.username, usertype: user.usertype, remember: remember });

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    forcePwdChange: user.forcePwdChange,
                    version: user.version,
                },
                departments: user.departments,
            });
            LoggerController.info('Sesion iniciada por ' + user.username);
        } catch (error) {
            LoggerController.error('Error en el login: ' + error.message);
            res.status(500).json({error: error.message });
        }
    }
    /**
    * Cierra la sesión de un usuario eliminando su refresh token.
    * 
    * El access token (JWT de 1h) no se elimina explícitamente, ya que expira
    * automáticamente. El refresh token asociado al usuario se borra de la base
    * de datos para evitar que se puedan generar nuevos access tokens.
    *
    * @param {Object} req - Objeto de petición de Express.
    *   - Debe contener la cabecera "Authorization: Bearer <token>".
    * @param {Object} res - Objeto de respuesta de Express.
    */
    static async logout(req, res) {
        try {
            const userId = req.user.id;
            const userName = req.user.username;

            // Buscar todos los refresh tokens del usuario
            const userTokens = await RefreshToken.findAll({ where: { userId } });

            // Buscar el token exacto comparando desencriptado
            const tokenToDelete = userTokens.find(t => t.token === token);

            LoggerController.info("Sesión cerrada correctamente por " + userName);

            if (tokenToDelete) {
                // Eliminar el token correspondiente
                await RefreshToken.destroy({ where: { id: tokenToDelete.id } });
                return res.json({ message: "Logout exitoso" });
            } else {
                // No existe token de refresco asociado (no "recordar sesión")
                return res.json({ message: "Logout exitoso" });
            }
        } catch (error) {
            LoggerController.error("Error en el logout: " + error.message);
            res.status(500).json({ error: "Error al cerrar sesión" });
        }
    }

    /**
    * Recoge el perfil del usuario.
    * 
    * @param {Object} req - Objeto de petición de Express.
    * @param {Object} res - Objeto de respuesta de Express.
    */
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;

            const user = await UserAccount.findByPk(userId, {
                include: [
                    {
                        model: Department,
                        as: 'departments',
                        attributes: ['id', 'name'],
                        through: { attributes: [] }
                    },
                ],
            });

            if (!user) return res.status(409).json({ error: "Usuario no encontrado" });

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    forcePwdChange: user.forcePwdChange,
                    version: user.version,
                },
                departments: user.departments,
            });


        } catch (error) {
            LoggerController.error(`Error obteniendo usuario: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Recoge la versión del usuario.
    * 
    * @param {Object} req - Objeto de petición de Express.
    * @param {Object} res - Objeto de respuesta de Express.
    */
    static async getVersion(req, res) {
        try {
            const userVersion = await UserAccount.findByPk(req.user.id, {
                attributes: ['version']
            });

            const version = userVersion?.version;

            return res.json({ version });

        } catch (error) {
            LoggerController.error("Error recuperando la versión del usuario: " + error.message);
            res.status(500).json({ error: "Error recuperando la fecha del listín" });
        }
    }
}

module.exports = AuthController;
