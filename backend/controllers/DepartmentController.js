
const { Department } = require("../models/Relations");
const LoggerController = require("../controllers/LoggerController");

/**
 * Controlador de autenticación y gestión de usuarios.
 * 
 * Proporciona métodos estáticos para:                 // FALTA TERMINAR
 *  - Listar todos los departamentos                   // Ahora tiene que devolver sus links
 *  - Crear un departamento 
 *  - Modificar un departamento
 *  - Eliminar un departamento
 *  - Añadir links a un departamento                   // Falta terminar
 *  - Eliminar links de un departamento                // Falta terminar
 */
class DepartmentController {

    /**
     * Lista todos los departamentos existentes.
     * 
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Array de usuarios con sus atributos: id, username y usertype.
     */
    static async list(req, res) {
        try {
            const users = await Department.findAll({ attributes: ["id", "username", "usertype"] });
            res.json(users);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Crea un nuevo departamento en la base de datos.
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
                return res.status(400).json({ success: false, message: "Usuario y contraseña requeridos" });
            }

            if ((usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN") {
                return res.status(403).json({ success: false, message: "Solo un SUPERADMIN puede crear a otro SUPERADMIN" });
            }

            const user = await Department.create({ username, password, usertype });

            res.json({ success: true, message: "Usuario registrado correctamente", id: user.id });
            LoggerController.info('Nuevo usuario ' + username + ' creado correctamente');
        } catch (error) {
            LoggerController.error('Error en la creación de usuario: ' + error.message);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * Modifica un departamento existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { username, password, usertype } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. Solo un SUPERADMIN puede modificar otro SUPERADMIN.
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { username, password, usertype } = req.body;

            const user = await Department.findByPk(id);
            if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

            if ((user.usertype === "SUPERADMIN" || usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN") {
                return res.status(403).json({ success: false, message: "Solo un SUPERADMIN puede modificar a otro SUPERADMIN" });
            }

            if (username) user.username = username;
            if (password) user.password = password;
            if (usertype) user.usertype = usertype;

            await user.save();

            res.json({ success: true, message: "Usuario actualizado correctamente" });
            LoggerController.info('Usuario actualizado correctamente');
        } catch (error) {
            LoggerController.error('Error en el modificar usuario: ' + error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Elimina un departamento existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. No se puede eliminar al SUPERADMIN.
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await Department.findByPk(id);
            if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

            if (user.usertype === 'SUPERADMIN') {
                return res.status(403).json({ success: false, message: "No puedes eliminar al SUPERADMIN" });
            }

            await user.destroy();

            res.json({ success: true, message: "Usuario eliminado correctamente" });
            LoggerController.info('Usuario eliminado correctamente');
        } catch (error) {
            LoggerController.error('Error en la eliminación de usuario: ' + error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Añade un link a un departamento.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { linkId } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error.
     */
    static async addLink(req, res) {
        try {
            const { id } = req.params;
            const { linkId } = req.body;
            const department = await Department.findByPk(id);
           
        } catch (error) {
            LoggerController.error('Error al añadir link al departamento: ' + error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Elimina un departamento de un usuario.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { linkId } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error.
     */
    static async delLink(req, res) {
        try {
            const { id } = req.params;
            const { linkId } = req.body;
            const department = await Department.findByPk(id);

        } catch (error) {
            LoggerController.error('Error al eliminar el link del departamento: ' + error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = DepartmentController;
