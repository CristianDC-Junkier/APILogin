
const { Department, Links } = require("../models/Relations");
const LoggerController = require("./LoggerController");

/**
 * Controlador de autenticación y gestión de links.
 * 
 * Proporciona métodos estáticos para:              
 *  - Listar todos los links
 *  - Crear un link
 *  - Modificar un link
 *  - Eliminar un link
 *  - Obtener todos los links por lista de departamentos               
 */
class LinksController {

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
            res.json({ links });
        } catch (error) {
            LoggerController.error('Error recogiendo los links por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
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

            LoggerController.info('Nuevo link con id' + link.id + ' creado correctamente por el usuario con id ' + req.user.id);
            res.json({ id: link.id });
        } catch (error) {
            LoggerController.error('Error en la creación del link por el usuario con id ' + req.user.id);
            LoggerController.error('Error - '+ error.message);
            res.status(500).json({ error: error.message });
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
            res.json({ id: link.id });
        } catch (error) {
            LoggerController.error('Error en la modificación del link con id ' + id +  ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
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
            res.json({ id });
        } catch (error) {
            LoggerController.error('Error en la eliminación del link con id ' + id +  ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

   /**
    * Obtiene los links asociados a un departamento.
    * 
    * @param {Object} req - Objeto de petición de Express, con { body: { departmentIds } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Array de links asociados al departamento o mensaje de error.
    */
    static async getLinksByDepartment(req, res) {
        try {
            const { departmentId } = req.body; // recibir array de IDs de departamentos

            // Validación básica
            if (!Array.isArray(departmentId) || departmentId.length === 0) {
                return res.status(400).json({ error: "Se requiere un array de IDs de departamentos" });
            }

            // Buscar departamentos con sus links asociados
            const departmentsAll = await Department.findAll({
                where: { id: departmentId },
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

            const formattedDepartments = departments.map(dep => ({
                id: dep.id,
                name: dep.name,
                links: dep.links
            }));

            res.json({ departments: formattedDepartments });

        } catch (error) {
            LoggerController.error('Error en la busqueda del links de departamentos por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = LinksController;
