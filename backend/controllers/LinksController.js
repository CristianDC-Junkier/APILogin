const { Links } = require("../models/Relations");

const LoggerController = require("./LoggerController");

/**
 * Controlador de autenticación y gestión de links.
 * 
 * Proporciona métodos estáticos para:              
 *  - Listar todos los links
 *  - Crear un link
 *  - Modificar un link
 *  - Eliminar un link
 */
class LinksController {

    //#region Métodos CRUD para gestión de links
    /**
     * Lista todos los link existentes.
     * 
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Array de links o mensaje de error.
     */
    static async list(req, res) {
        try {
            const links = await Links.findAll();
            return res.json({ links });
        } catch (error) {
            LoggerController.error('Error recogiendo los links por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Crea un nuevo link en la base de datos.
     * 
     * @param {Object} req - Objeto de petición de Express, con { body: { name, web } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del link creado o mensaje de error.
     */
    static async create(req, res) {
        try {
            const { name, web } = req.body;

            if (!name || !web) {
                return res.status(400).json({ error: "Datos requeridos" });
            }

            const link = await Links.create({ name, web });

            LoggerController.info('Nuevo link con id ' + link.id + ' creado correctamente por el usuario con id ' + req.user.id);
            return res.json({ id: link.id });
        } catch (error) {
            LoggerController.error('Error en la creación del link por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Modifica un link existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { name, web } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} -  Mensaje de éxito con id del link modificadop o mensaje de error. 
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, web } = req.body;

            const link = await Links.findByPk(id);
            if (!link) return res.status(404).json({ error: "Link no encontrado" });

            if (name) link.name = name;
            if (web) link.web = web;

            await link.save();

            LoggerController.info('Link con id ' + link.id + ' modificado correctamente por el usuario con id ' + req.user.id);
            return res.json({ id: link.id });
        } catch (error) {
            LoggerController.error('Error en la modificación del link con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina un link existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. 
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const link = await Links.findByPk(id);
            if (!link) return res.status(404).json({ error: "Link no encontrado" });

            await link.destroy();

            LoggerController.info('Link con id ' + link.id + ' modificado correctamente por el usuario con id ' + req.user.id);
            return res.json({ id });
        } catch (error) {
            LoggerController.error('Error en la eliminación del link con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    //#endregion

}

module.exports = LinksController;
