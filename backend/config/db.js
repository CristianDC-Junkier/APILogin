const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const MODE = process.env.NODE_ENV || 'development';
let sequelize;

/**
 * Configuración y conexión a la base de datos con Sequelize.
 *
 * Esta configuración realiza lo siguiente:
 *  1. Crea una instancia de Sequelize según el modo:
 *     - Production: se conecta a MariaDB usando credenciales de entorno.
 *     - Development: usa SQLite local en la carpeta 'database' del proyecto.
 *  2. Desactiva los logs de SQL para ambos modos.
 *
 * Variables internas importantes:
 *  - MODE: define si la app está en 'production' o 'development'.
 *  - sequelize: instancia de Sequelize exportada para usar en otros módulos.
 *
 * Exporta:
 *  - sequelize: instancia lista para definir modelos y realizar consultas.
 */
if (MODE === 'production') {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mariadb',
            logging: false,
        }
    );
} else {
    const baseDir = process.cwd().endsWith('backend') ? process.cwd() : path.join(process.cwd(), 'backend');
    const dbDir = path.join(baseDir, 'database');
    const dbPath = path.join(dbDir, 'data.db');

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false,
    });
}

module.exports = sequelize;
