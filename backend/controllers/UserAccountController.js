
const { UserAccount, Department } = require("../models/Relations");
const LoggerController = require("../controllers/LoggerController");

/**
 * Controlador de autenticación y gestión de usuarios.
 * 
 * Proporciona métodos estáticos para:      
 *  - Login de usuarios                     
 *  - Listar todos los usuarios             
 *  - Crear un usuario
 *  - Modificar un usuario
 *  - Eliminar un usuario
 *  - Añadir departamentos a un usuario     
 *  - Eliminar departamentos de un usuario  
 */
class UserAccountController {
    /**
     * Lista todos los usuarios existentes.
     * 
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Array de usuarios con sus atributos: id, username y usertype.
     */
    static async list(req, res) {
        try {
            const users = await UserAccount.findAll({ attributes: ["id", "username", "usertype"] });
            res.json({ users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Recupera los datos completos de un usuario por su ID.
    * 
    * @param {Object} req - req.params.id es el ID del usuario a consultar
    * @param {Object} res
    */
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const { version } = req.query;

            const user = await UserAccount.findByPk(id, {
                include: [
                    {
                        model: Department,
                        as: 'departments', 
                        attributes: ['id', 'name'],
                        through: { attributes: [] } 
                    },
                ],
            });

            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if (user.version != version) return res.status(403).json({ error: "El usuario ha sido modificado anteriormente" });
            
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
     * Crea un nuevo usuario en la base de datos.
     * 
     * @param {Object} req - Objeto de petición de Express, con { body: { username, password, usertype } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del usuario creado o mensaje de error.
     *                   Solo un SUPERADMIN puede crear otro SUPERADMIN.
     */
    static async create(req, res) {
        try {
            const { username, password, usertype } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Usuario y contraseña requeridos" });
            }

            if ((usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN") {
                return res.status(403).json({ error: "Solo un SUPERADMIN puede crear a otro SUPERADMIN" });
            }

            const user = await UserAccount.create({ username, password, usertype });

            LoggerController.info('Nuevo usuario ' + username + ' creado correctamente');
            res.json({ id: user.id });

        } catch (error) {
            LoggerController.error('Error en la creación de usuario: ' + error.message);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Modifica un usuario existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { username, password, usertype } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. Solo un SUPERADMIN puede modificar otro SUPERADMIN.
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { version } = req.query;
            const { username, password, usertype } = req.body;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if ((user.usertype === "SUPERADMIN" || usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN") {
                return res.status(403).json({ error: "Solo un SUPERADMIN puede modificar a otro SUPERADMIN" });
            }

            if (user.version != version) return res.status(403).json({ error: "El usuario ha sido modificado anteriormente" });

            if (username) user.username = username;
            if (password) user.password = password;
            if (usertype) user.usertype = usertype;

            await user.save();

            oggerController.info(`Usuario ${user.username} actualizado por ${req.user.username}`);
            res.json({ id: targetUserId });
        } catch (error) {
            LoggerController.error('Error en el modificar usuario: ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * Marca un usuario para que deba cambiar la contraseña en su próximo login.
    * 
   * @param {Object} req - Objeto de petición con { params: { id }, body: { password, version } }.
   * @param {Object} res 
   */
    static async forcePasswordChange(req, res) {
        try {
            const { id } = req.params;
            const { version } = req.query;
            const { password } = req.body;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if (user.version != version) return res.status(403).json({ error: "El usuario ha sido modificado anteriormente" });

            user.forcePwdChange = true;
            user.password = password;
            await user.save();

            LoggerController.info(`Usuario ${user.username} marcado para cambio de contraseña por ${req.user.username}`);
            res.json({ id });
        } catch (error) {
            LoggerController.error('Error en forzar cambio de contraseña: ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina un usuario existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. No se puede eliminar al SUPERADMIN.
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const { version } = req.query;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if (user.usertype === 'SUPERADMIN')  return res.status(403).json({ error: "No puedes eliminar al SUPERADMIN" });

            if (user.version != version) return res.status(403).json({ error: "El usuario ha sido modificado anteriormente" });

            await user.destroy();

            LoggerController.info(`Usuario Worker: ${user.username} y sus Datos de usuario, eliminado por ${req.user.username}`);
            res.json({ id });

        } catch (error) {
            LoggerController.error('Error en la eliminación de usuario: ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Añade un departamento a un usuario.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { departmentId } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error.
     */
    static async addDepartment(req, res) {
        try {
            const { id } = req.params;
            const { departmentId } = req.body;
            const user = await UserAccount.findByPk(id);

        } catch (error) {
            LoggerController.error('Error al añadir departamento al usuario: ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina un departamento de un usuario.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { departmentId } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error.
     */
    static async delDepartment(req, res) {
        try {
            const { id } = req.params;
            const { departmentId } = req.body;
            const user = await UserAccount.findByPk(id);

        } catch (error) {
            LoggerController.error('Error al añadir departamento al usuario: ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserAccountController;
