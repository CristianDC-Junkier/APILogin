const { Links } = require("../models/Relations");

const LoggerController = require("./LoggerController");
const path = require("path");
const fs = require("fs");
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
    * Crea un nuevo link en la base de datos con imagen subida.
    * Se espera que multer haya procesado la imagen en req.file
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { name, web }, file  }.
    * @param {Object} res - Objeto de respuesta de Express
    * @returns {JSON} - Mensaje de éxito con id del link creado o mensaje de error
    */
    static async create(req, res) {
        try {
            const { name, web, description } = req.body;

            if (!name || !web) {
                return res.status(400).json({ error: "Datos requeridos: nombre y web" });
            }
            if (description !== null && description.length > 128) {
                return res.status(400).json({ error: "La descripción no puede superar los 128 carácteres" });
            }
            const fileName = req.file ? req.file.filename : null;

            const link = await Links.create({
                name,
                web,
                description: description || null,
                image: fileName
            });

            LoggerController.info(`Nuevo link con id ${link.id} creado correctamente por el usuario con id ${req.user.id}`);
            return res.json({ id: link.id });

        } catch (error) {
            LoggerController.error(`Error en la creación del link por el usuario con id ${req.user.id}`);
            LoggerController.error('Error - ' + error.message);
            return res.status(500).json({ error: error.message });
        }
    }


    /**
     * Modifica un link existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { name, web }, file  }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} -  Mensaje de éxito con id del link modificadop o mensaje de error. 
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, web, description } = req.body;

            const link = await Links.findByPk(id);
            if (!link) return res.status(404).json({ error: "Link no encontrado" });

            if (description !== null && description.length > 128) {
                return res.status(400).json({ error: "La descripción no puede superar los 128 caracteres" });
            }

            // Actualizar campos básicos
            link.name = name ?? link.name;
            link.web = web ?? link.web;
            link.description = description ?? null;

            // SOLO si llega archivo nuevo
            if (req.file) {
                // borrar vieja si existía
                if (link.image) {
                    const oldPath = path.join(__dirname, "../images/links/", link.image);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }

                // guardar nuevo nombre de archivo
                link.image = req.file.filename;
            }

            // si NO llega req.file → NO tocar la imagen
            await link.save();

            LoggerController.info(
                `Link con id ${link.id} modificado correctamente por el usuario con id ${req.user.id}`
            );

            return res.json({ id: link.id });

        } catch (error) {
            LoggerController.error(
                `Error en la modificación del link con id ${req.params.id} por el usuario con id ${req.user.id}`
            );
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

            // Eliminar imagen si existe
            if (link.image) {
                const imagePath = path.join(__dirname, "../images/links/", link.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

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
