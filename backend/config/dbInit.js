const { sequelize, UserAccount, Department } = require("../models/Relations");

const LoggerController = require("../controllers/LoggerController");

const USER_TYPE = ['USER', 'ADMIN', 'SUPERADMIN'];

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
        await sequelize.authenticate();
        await sequelize.sync();

        LoggerController.info('✅ Base de datos sincronizada correctamente');

        // Comprobar si ya existen departamentos
        const existingDepartments = await Department.count();
        let departments = [];

        /*if (existingDepartments === 0) {
            // Crear departamentos de ejemplo
            const departmentsData = [
                { name: 'Ventanilla (SAC)' }, { name: 'Estadística' },
                { name: 'Informática' }, { name: 'Rentas' }, { name: 'Tesorería' },
                { name: 'Intervención' }, { name: 'Patrimonio' }, { name: 'Personal' },
                { name: 'Contratación' }, { name: 'Archivo Municipal' }, { name: 'Secretaría' },
                { name: 'Equipo de Gobierno' }, { name: 'Salud y Consumo' }, { name: 'Servicios Inseccion' },
                { name: 'Servicios Sociales' }, { name: 'Turismo' }, { name: 'Policía Local' },
                { name: 'Concejalía Matalascañas' }, { name: 'Desarrollo Local' }, { name: 'Agricultura' },
                { name: 'Urbanismo' }, { name: 'Concejalía El Rocío' }, { name: 'Alcaldía' },
                { name: 'Ciudad de la Cultura' }, { name: 'Otros' }, { name: 'Moviles Coporativos' },
                { name: 'Escuelas Infatiles' }, { name: 'Part. Ciudadana y Dllo. Comunitario' },
                { name: 'Institutos' }, { name: 'Centro Sociocultural Barrio Obrero' }
            ];

            for (const dep of departmentsData) {
                const created = await Department.create(dep);
                departments.push(created);
            }
            LoggerController.info('✅ Departamentos de ejemplo creados');
        } else {
            LoggerController.warn('ℹ️ Departamentos ya existentes, no se crean nuevos');
        }*/

        // Comprobar si existe el superadmin
        const superAdminType = USER_TYPE[USER_TYPE.length - 1];

        const existing = await UserAccount.findOne({ where: { usertype: superAdminType } });

        if (!existing) {

            await UserAccount.create({
                username: 'admin',//InformaticaAlcaldia
                password: 'admin',//InformaticaAlcaldia#Almonte
                usertype: superAdminType,
                forcePwdChange: false,
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
