const sequelize = require('./db');
const Login = require('../models/AuthModel');

const USER_TYPE = ['USER', 'ADMIN', 'SUPERADMIN'];
const LoggerController = require("../controllers/LoggerController");


/**
 * Inicialización de la base de datos y creación de usuarios por defecto.
 *
 * Esta función realiza las siguientes tareas:
 *  1. Sincroniza todos los modelos de Sequelize con la base de datos (crea tablas si no existen).
 *  2. Comprueba si existe un usuario con tipo "SUPERADMIN".
 *  3. Si no existe, crea un usuario superadministrador por defecto.
 *  4. Registra información en LoggerController sobre la inicialización y la creación del superadmin.
 *
 * Variables internas importantes:
 *  - USER_TYPE: Array que define los tipos de usuario posibles ['USER', 'ADMIN', 'SUPERADMIN'].
 *  - superAdminType: Último elemento de USER_TYPE, usado para identificar al superadmin.
 *
 * Comportamiento en caso de error:
 *  - Registra el error en LoggerController.
 *  - Finaliza el proceso con process.exit(1).
 *
 * Exporta:
 *  - initDatabase: función asíncrona para inicializar la base de datos y crear el superadmin si no existe.
 */

async function initDatabase() {
    try {
        // Crear tabla si no existe
        await sequelize.sync();

        // Comprobar si existe el superadmin
        const superAdminType = USER_TYPE[USER_TYPE.length - 1];

        const existing = await Login.findOne({ where: { usertype: superAdminType } });

        if (!existing) {

            await Login.create({
                username: 'admin',
                password: 'Almonte#admin',
                usertype: superAdminType
            });
            LoggerController.info('✅ Superadmin creado correctamente');
        }
        LoggerController.info('✅ Base de datos inicializada correctamente');
    } catch (err) {
        LoggerController.error('❌ Error inicializando la base de datos:', err.message);
        process.exit(1);
    }
}

module.exports = { initDatabase };
