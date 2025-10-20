const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { encrypt, decrypt } = require("../utils/Crypto");

/**
 * Modelo Sequelize para usuarios del sistema.
 * 
 * Campos:
 * - id             → Identificador único autoincremental.
 * - username       → Nombre de usuario único y obligatorio.
 * - password       → Contraseña cifrada automáticamente al guardar (encriptada). 
 *                      - Al asignar (set): se cifra usando utilidades de crypto.
 *                      - Al obtener (get): se descifra para su uso interno.
 * - usertype       → Rol del usuario. Valores posibles: 'USER' (por defecto), 'ADMIN', 'SUPERADMIN'.
 * - forcePwdChange → Booleano que designa si el usuario ha sido marcado para un cambio de contraseña.
 * - version        → Contador de modificaciones del usuario, entero entre 0 y 100000.
 *                      - Se incrementa automáticamente con cada cambio en este modelo.
 */
const User = sequelize.define("UserAccount", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue("password", encrypt(value));
        },
        get() {
            const encrypted = this.getDataValue("password");
            if (!encrypted) return null;
            return decrypt(encrypted);
        },
    },
    usertype: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "USER",
    },
    forcePwdChange: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 100000 },
    },
});

module.exports = User;
