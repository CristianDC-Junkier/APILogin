const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { encrypt, decrypt } = require("../utils/Crypto");

/**
 * Modelo Sequelize para los enlaces.
 * Todos los campos tipo STRING se guardan cifrados para proteger datos sensibles.
 * 
 * Campos:
 * - id   → Identificador único autoincremental.
 * - name → Nombre del link, único (encriptado).
 * - web  → Ip de la web externa (encriptada).
 */
const Links = sequelize.define("Links", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'unique_linkname',
            msg: 'Nombre del link ya existente'
        },
        set(value) { this.setDataValue("name", encrypt(value)); },
        get() {
            const val = this.getDataValue("name");
            return val ? decrypt(val) : null;
        },
    },
    web: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) { this.setDataValue("web", encrypt(value)); },
        get() {
            const val = this.getDataValue("web");
            return val ? decrypt(val) : null;
        },
    },
});


module.exports = Links;
