
const { UserAccount, Department, Links } = require("../models/Relations");
const LoggerController = require("../controllers/LoggerController");
const { Op } = require("sequelize");
const { generateToken } = require("../utils/JWT");

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

    //#region Métodos recuperación de usuarios

    /**
     * Lista todos los usuarios existentes.
     * 
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Array de usuarios o mensaje de error.
     */
    static async list(req, res) {
        try {
            // Traer todos los usuarios con sus departamentos asociados
            const users = await UserAccount.findAll({
                attributes: ['id', 'username', 'usertype', 'forcePwdChange', 'version'],
                include: [
                    {
                        model: Department,
                        as: 'departments',
                        attributes: ['id', 'name'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Links,
                                as: 'links',
                                attributes: ['id', 'name', 'web'],
                                through: { attributes: [] } 
                            }
                        ]
                    }
                ]
            });

            // Formatear la respuesta
            const formattedUsers = users.map(user => ({
                user: {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    forcePwdChange: user.forcePwdChange,
                    version: user.version,
                },
                departments: user.departments.map(dep => ({
                    id: dep.id,
                    name: dep.name,
                    links: dep.links.map(link => ({
                        id: link.id,
                        name: link.name,
                        url: link.url
                    }))
                }))
            }));

            res.json({ users: formattedUsers });


        } catch (error) {
            LoggerController.error('Error recogiendo los usuarios por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }


    /**
    * Recupera los datos completos de un usuario por su ID.
    * 
    * @param {Object} req - Objeto de petición de Express con { params: { id } , query: { version } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Usuario con sus departamentos o mensaje de error.
    */
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const { version } = req.query;

            const user = await UserAccount.findByPk(id, {
                attributes: ['id', 'username', 'usertype', 'forcePwdChange', 'version'],
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
            LoggerController.error('Error recogiendo el usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    //#endregion

    //#region Métodos añadir/modificar/eliminar/forzar contraseña de usuarios
    /**
     * Crea un nuevo usuario en la base de datos.
     * 
     * @param {Object} req - Objeto de petición de Express, con { body: { username, password, usertype } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con id del usuario creado o mensaje de error.
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

            LoggerController.info('Usuario con id ' + user.id + 'creado correctamente por el usuario con id ' + req.user.id);
            res.json({ id: user.id });
        } catch (error) {
            LoggerController.error('Error creando un usuario por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Modifica un usuario existente.
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id }, body: { username, password, usertype } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito con el id del usuario modificado o mensaje de error. 
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { username, password, usertype, version } = req.body;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if ((user.usertype === "SUPERADMIN" || usertype === "SUPERADMIN") && req.user.usertype !== "SUPERADMIN") {
                return res.status(403).json({ error: "Solo un SUPERADMIN puede modificar a otro SUPERADMIN" });
            }
            if (user.version != version) return res.status(403).json({ error: "El usuario ha sido modificado anteriormente" });

            // No se puede cambiar el tipo de usuario del SUPERADMIN por defecto (id=1)
            if (user.id !== 1 ) {
                if (usertype) user.usertype = usertype;
            }
            if (username) user.username = username;
            if (password) user.password = password;

            await user.save();

            LoggerController.info('Usuario con id ' + user.id + ' actualizado correctamente por el usuario con id ' + req.user.id);
            res.json({ id: user.id });
        } catch (error) {
            LoggerController.error('Error modificando al usuario con id ' + user.id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
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

            LoggerController.info('Usuario con id ' + user.id + ' marcado para cambio de contraseña por el usuario con id ' + req.user.id);
            res.json({ id });
        } catch (error) {
            LoggerController.error('Error forzando la recuperación de contraseña del un usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Elimina un usuario existente (No se puede eliminar al SUPERADMIN).
     * 
     * @param {Object} req - Objeto de petición de Express, con { params: { id } }.
     * @param {Object} res - Objeto de respuesta de Express.
     * @returns {JSON} - Mensaje de éxito o error. 
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

            LoggerController.info('Usuario con id ' + user.id + ' eliminado por el usuario con id ' + req.user.id);
            res.json({ id });

        } catch (error) {
            LoggerController.error('Error eliminando un usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    //#endregion

    //#region Métodos gestión de su propia cuenta
    /**
    * Permite al usuario autenticado modificar su propia cuenta.
    * 
    * @param {Object} req - Objeto de petición con {  body: { username, usertype, oldPassword, newPassword, version }, query: { version } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con id del usuario modificado o mensaje de error.
    */
    static async updateMyAccount(req, res) {
        try {
            const currentUser = req.user;
            const { username, usertype, oldPassword, newPassword } = req.body;
            const { version } = req.query;

            const user = await UserAccount.findByPk(currentUser.id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
            if (user.version != version) return res.status(409).json({ error: "Su usuario ha sido modificado anteriormente" });

            const updates = {};

            // --- Contraseña ---
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ error: "Ambas contraseñas son requeridas para actualizarla" });
            }
            if (oldPassword === newPassword) {
                return res.status(400).json({ error: "La contraseña nueva debe ser diferente a la actual" });
            }
            if (user.password !== oldPassword) {
                return res.status(400).json({ error: "La contraseña actual no es correcta" });
            }

            updates.password = newPassword;
            updates.forcePwdChange = false;


            // --- Nombre de Usuario ---
            if (!username) return res.status(400).json({ error: "El nombre de usuario es obligatorio" });

            const exists = await UserAccount.findOne({
                where: { username, id: { [Op.ne]: currentUser.id } }
            });
            if (exists) return res.status(400).json({ error: "El nombre de usuario ya existe" });

            updates.username = username;

            // --- Tipo de Usuario ---
            if (currentUser.usertype === "SUPERADMIN") {
                if (!usertype) return res.status(400).json({ error: "El tipo de usuario es obligatorio" });
                if (currentUser.id !== 1) {
                    updates.usertype = usertype;
                }
            } else if (currentUser.usertype === "ADMIN") {
                if (!usertype) return res.status(400).json({ error: "El tipo de usuario es obligatorio" });
                if (usertype !== "SUPERADMIN") {
                    updates.usertype = usertype;
                }
            }

            // Aplicar cambios
            await user.update(updates);

            const token = await generateToken({ id: user.id, username: user.username, usertype: user.usertype, remember: remember });
            LoggerController.info('El usuario con id' + user.id + ' actualizó su perfil correctamente');

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    forcePwdChange: user.forcePwdChange,
                    version: user.version,
                }
            });


        } catch (error) {
            LoggerController.error('Error modificando su perfil del usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Permite al usuario autenticado eliminar su propia cuenta.
    * 
    * @param {Object} req - Objeto de petición con { query: { version } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con id del usuario eliminado o mensaje de error.
    */
    static async deleteMyAccount(req, res) {
        try {
            const { id } = req.user.id;
            const { version } = req.query;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if (user.version != version) return res.status(409).json({ error: "Su usuario ha sido modificado anteriormente" });

            if (user.usertype === "SUPERADMIN") {
                return res.status(403).json({ error: "Un SUPERADMIN no puede eliminarse" });
            }

            await user.destroy();

            LoggerController.info('El usuario con id ' + req.user.id + ' se elimino a si mismo correctamente');
            res.json({ id });
        } catch (error) {
            LoggerController.error('Error eliminando su perfil del usuario con id ' + req.user.id);
            LoggerController.error('Error en la eliminación de usuario: ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Permite al usuario autenticado cambiar su contraseña tras ser marcado.
    * 
    * @param {Object} req - Objeto de petición con {  body: { newPassword }, query: { version } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con id del usuario con la contraseña cambiada o mensaje de error.
    */
    static async forcedPasswordChange(req, res) {
        try {
            const { id } = req.user;
            const { newPassword } = req.body;
            const { version } = req.query;

            if (!newPassword) {
                return res.status(400).json({ error: "Nueva contraseña requerida" });
            }

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

            if (user.version != version) return res.status(409).json({ error: "Su usuario ha sido modificado anteriormente" });

            // Actualizar contraseña
            user.password = newPassword;
            user.forcePwdChange = false;
            await user.save();

            res.json({ id });
            LoggerController.info('El usuario con id ' + id + ' cambió su contraseña correctamente');
        } catch (error) {
            LoggerController.error('Error actualizando la contraseña de su perfil del usuario con id ' + req.user.id);
            LoggerController.error(`Error actualizando contraseña: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
    //#endregion

    //#region Métodos gestión de departamentos de usuarios
    /**
    * Añade un departamento a un usuario.
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { id, departmentId } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con numero de departamentos o mensaje de error.
    */
    static async addDepartment(req, res) {
        try {
            const { id, departmentId } = req.params;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
            const department = await Department.findByPk(departmentId);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });

            await user.addDepartment(department);
            await user.increment('version', { by: 1 });
            await user.changed('updatedAt', true);
            await user.save({ skipRefreshTokens: true });
            const departments = await user.getDepartments();

            LoggerController.info('Departamento con id ' + departmentId + ' añadido correctamente al usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            res.json({ departmentsSize: departments.length });


        } catch (error) {
            LoggerController.error('Error al añadir el departamento con id ' + departmentId + ' al usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Elimina un departamento de un usuario.
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { id, departmentId } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con numero de departamentos o mensaje de error.
    */
    static async delDepartment(req, res) {
        try {
            const { id } = req.params;
            const { departmentId } = req.params;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
            const department = await Department.findByPk(departmentId);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });

            await user.removeDepartment(department);
            await user.increment('version', { by: 1 });
            await user.changed('updatedAt', true);
            await user.save({ skipRefreshTokens: true });
            const departments = await user.getDepartments();

            LoggerController.info('Departamento con id ' + departmentId + ' eliminado correctamente del usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            res.json({ departmentsSize: departments.length });

        } catch (error) {
            LoggerController.error('Error al eliminar el departamento con id ' + departmentId + ' al usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Un admin añade un departamento a su perfil.
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { departmentId }, query: { version } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con numero de departamentos o mensaje de error.
    */
    static async addDepartmentProfile(req, res) {
        try {
            const { id } = req.user;
            const { departmentId } = req.params;
            const { version } = req.query;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(409).json({ error: "Su usuario no ha sido encontrado" });
            if (user.version != version) return res.status(409).json({ error: "Su usuario ha sido modificado anteriormente" });

            const department = await Department.findByPk(departmentId);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });

            await user.addDepartment(department);
            await user.increment('version', { by: 1 }); 
            await user.changed('updatedAt', true); 
            await user.save({ skipRefreshTokens: true }); 

            LoggerController.info('Departamento con id ' + departmentId + ' añadido correctamente al usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    forcePwdChange: user.forcePwdChange,
                    version: user.version,
                }
            });
        } catch (error) {
            LoggerController.error('Error al añadir el departamento con id ' + departmentId + ' al usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Un admin elimina un departamento de su perfil.
    * 
    * @param {Object} req - Objeto de petición de Express, con { params: { departmentId }, query: { version } }.
    * @param {Object} res - Objeto de respuesta de Express.
    * @returns {JSON} - Mensaje de éxito con numero de departamentos o mensaje de error.
    */
    static async delDepartmentProfile(req, res) {
        try {
            const { id } = req.user;
            const { departmentId } = req.params;
            const { version } = req.query;

            const user = await UserAccount.findByPk(id);
            if (!user) return res.status(409).json({ error: "Su usuario no ha sido encontrado" });
            if (user.version != version) return res.status(409).json({ error: "Su usuario ha sido modificado anteriormente" });

            const department = await Department.findByPk(departmentId);
            if (!department) return res.status(404).json({ error: "Departamento no encontrado" });

            await user.removeDepartment(department);
            await user.increment('version', { by: 1 }); 
            await user.changed('updatedAt', true); 
            await user.save({ skipRefreshTokens: true }); 

            LoggerController.info('Departamento con id ' + departmentId + ' eliminado correctamente del usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    forcePwdChange: user.forcePwdChange,
                    version: user.version,
                }
            });
        } catch (error) {
            LoggerController.error('Error al eliminar el departamento con id ' + departmentId + ' al usuario con id ' + id + ' por el usuario con id ' + req.user.id);
            LoggerController.error('Error - ' + error.message);
            res.status(500).json({ error: error.message });
        }
    }
    //#endregion
}

module.exports = UserAccountController;
