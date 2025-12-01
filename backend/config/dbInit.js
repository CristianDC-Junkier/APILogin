const { sequelize, UserAccount, Department } = require("../models/Relations");

const LoggerController = require("../controllers/LoggerController");

const USER_TYPE = ['USER', 'ADMIN', 'SUPERADMIN'];

/**
 * Inicialización de la base de datos y creación de usuarios por defecto.
 *
 * Esta función realiza las siguientes tareas:
 *  1. Sincroniza todos los modelos de Sequelize con la base de datos (crea tablas si no existen).
 *  2. Comprueba si existe un departamento público con id "1".
 *  3. Si no existe, crea el departamento público por defecto.
 *  4. Comprueba si existe un usuario con tipo "SUPERADMIN".
 *  5. Si no existe, crea un usuario superadministrador por defecto.
 *  6. Registra información en LoggerController sobre la inicialización y la creación del superadmin.
 *
 * Variables internas importantes:
 *  - existingPublicDepartment: Resultado de la búsqueda del departamento público en la base de datos.
 *  - USER_TYPE: Array que define los tipos de usuario posibles ['USER', 'ADMIN', 'SUPERADMIN'].
 *  - superAdminType: Último elemento de USER_TYPE, usado para identificar al superadmin.
 *  - existing: Resultado de la búsqueda del superadmin en la base de datos.
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
        await sequelize.authenticate();
        await sequelize.sync();

        LoggerController.info('✅ Base de datos sincronizada correctamente');

        // Comprobar si existe el departamento público
        const existingPublicDepartment = await Department.findOne({ where: { id: "1" } });

        if (!existingPublicDepartment) {
            await Department.create({
                name: 'Publico',
            });
            LoggerController.info('✅ Departamento Público creado correctamente');
        }

        // Comprobar si existe el superadmin
        const superAdminType = USER_TYPE[USER_TYPE.length - 1];

        const existing = await UserAccount.findOne({ where: { usertype: superAdminType } });

        if (!existing) {

            await UserAccount.create({
                username: 'admin',//InformaticaAlcaldia
                password: 'admin',//InformaticaAlcaldia#Almonte
                usertype: superAdminType,
                forcePwdChange: false,
                version: 1,
            });
            LoggerController.info('✅ Superadmin creado correctamente');
        }
        LoggerController.info('✅ Base de datos inicializada correctamente');
    } catch (err) {
        const message = err instanceof Error ? (err.message || err.stack) : JSON.stringify(err);
        LoggerController.errorCritical('❌ Error inicializando la base de datos:' + message);
        process.exit(1);
    }
}

module.exports = { initDatabase };
