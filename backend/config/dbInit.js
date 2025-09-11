const sequelize = require('./db');
const Login = require('../models/AuthModel');

const USER_TYPE = ['USER', 'ADMIN', 'SUPERADMIN'];
const LoggerController = require("../controllers/LoggerController");

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
