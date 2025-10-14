
const { Department, Links } = require("../models/Relations");
const LoggerController = require("../controllers/LoggerController");

/**
 * Controlador de autenticación y gestión de usuarios.
 * 
 * Proporciona métodos estáticos para:           
 *  - Listar todos los departamentos                   
 *  - Crear un departamento 
 *  - Modificar un departamento
 *  - Eliminar un departamento
 *  - Añadir links a un departamento                   
 *  - Eliminar links de un departamento                
 */
class DepartmentController {

    /**
     * Lista todos los departamentos existentes.
     * 
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Array de departamentos o mensaje de error.
     */
    static async list(req, res) {
        try {
            const departments = await Department.findAll({
                include: [
                    {
                        model: Links,
                        as: 'links',
                        attributes: ['id', 'name', 'web'],
                        through: { attributes: [] }
                    },
                ],
            });

            const dFormatted = departments.map(department => ({
                id: department.id,
                name: department.name,
                links: department.links || [],
            }));

            res.json({ departments: dFormatted });
        } catch (error) {
            LoggerController.error('Error recogiendo los departamentos por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Crea un nuevo departamento en la base de datos.
     * 
     * @param {Object} req - Objeto de petición de Express, con { body: { name } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del departamento creado o mensaje de error.
     */
    static async create(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Debe indicar un nombre correcto" });
            }

            const department = await Department.create({ name });

            LoggerController.info('Nuevo departamento con id ' + department.id + ' creado correctamente por el usuario con id ' + req.user.id);
            res.json({ id: department.id });
        } catch (error) {
            LoggerController.error('Error en la creación del departamento por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Modifica un departamento existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { name } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del departamento o mensaje de error. 
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Debe indicar un nombre correcto" });
            }

            const department = await Department.findByPk(id);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });

            department.name = name;

            await department.save();

            LoggerController.info('Departamento con id ' + department.id + ' actualizado correctamente por el usuario con id ' + req.user.id);
            res.json({ id: department.id });
        } catch (error) {
            LoggerController.error('Error en la modificación del departamento por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Elimina un departamento existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del departamento o mensaje de error. 
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const department = await Department.findByPk(id);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });

            await department.destroy();

            LoggerController.info('Departamento con id ' + department.id + ' eliminado correctamente por el usuario con id ' + req.user.id);
            res.json({ id });
        } catch (error) {
            LoggerController.error('Error en la eliminación del departamento por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(400).json({ error: error.message });
        }
    }

    /**
    * Añade un link a un departamento.
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { linkId } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con id del departamento o mensaje de error. 
    */
    static async addLink(req, res) {
        try {
            const { id } = req.params;       
            const { linkId } = req.body;     

            const department = await Department.findByPk(id);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });
            const link = await Links.findByPk(linkId);
            if (!link) return res.status(404).json({ error: "Link no encontrado" });

            await department.addLink(link);
            const links = await department.getLinks();

            LoggerController.info('Link con id ' + linkId + ' añadido correctamente al departamento con id ' + id + ' por el usuario con id ' + req.user.id);
            res.json({ linksSize: links.length });

        } catch (error) {
            LoggerController.error('Error al añadir el link' +  linkId + ' al departamento' +  id +  'por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(400).json({ error: error.message });
        }
    }


    /**
     * Elimina un departamento de un usuario.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { linkId } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del departamento o mensaje de error. 
     */
    static async delLink(req, res) {
        try {
            const { id } = req.params;
            const { linkId } = req.body;

            const department = await Department.findByPk(id);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });
            const link = await Links.findByPk(linkId);
            if (!link) return res.status(404).json({ error: "Link no encontrado" });

            await department.removeLink(link);
            const links = await department.getLinks();

            LoggerController.info('Link con id ' + linkId + ' eliminado correctamente al departamento con id ' + id + ' por el usuario con id ' + req.user.id);
            res.json({ linksSize: links.length });

        } catch (error) {
            LoggerController.error('Error al eliminar el link con id ' + linkId + ' del departamento con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = DepartmentController;
