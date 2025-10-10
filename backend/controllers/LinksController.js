
const { Department, Links } = require("../models/Relations");
const LoggerController = require("./LoggerController");

/**
 * Controlador de autenticación y gestión de links.
 * 
 * Proporciona métodos estáticos para:              // FALTA TERMINAR
 *  - Listar todos los links
 *  - Crear un link
 *  - Modificar un link
 *  - Eliminar un link
 *  - Obtener links por departamento               
 */
class LinksController {

    /**
     * Lista todos los link existentes.
     * 
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Array de usuarios con sus atributos: id, username y usertype.
     */
    static async list(req, res) {
        try {
            const users = await Links.findAll({ attributes: ["id", "username", "usertype"] });
            res.json(users);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Crea un nuevo link en la base de datos.
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

            const user = await Links.create({ username, password, usertype });

            res.json({ success: true, message: "Usuario registrado correctamente", id: user.id });
            LoggerController.info('Nuevo usuario ' + username + ' creado correctamente');
        } catch (error) {
            LoggerController.error('Error en la creación de usuario: ' + error.message);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * Modifica un link existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { username, password, usertype } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. Solo un SUPERADMIN puede modificar otro SUPERADMIN.
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { username, password, usertype } = req.body;

            const user = await Links.findByPk(id);
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
     * Elimina un link existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. No se puede eliminar al SUPERADMIN.
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await Links.findByPk(id);
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
    * Obtiene los links asociados a un departamento.
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Array de links asociados al departamento o mensaje de error.
    */
    static async getLinksByDepartments(req, res) {
        try {
            const { departmentIds } = req.body; // recibir array de IDs de departamentos

            // Validación básica
            if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
                return res.status(400).json({ error: "Se requiere un array de IDs de departamentos" });
            }

            // Buscar departamentos con sus links asociados
            const departments = await Department.findAll({
                where: { id: departmentIds },
                include: [
                    {
                        model: Links,
                        as: 'links',          
                        attributes: ['id', 'name', 'url'],
                        through: { attributes: [] } 
                    }
                ],
                attributes: ['id', 'name']
            });

            const departments = departments.map(dep => ({
                id: dep.id,
                name: dep.name,
                links: dep.links
            }));

            res.json({ departments });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

}

module.exports = LinksController;
