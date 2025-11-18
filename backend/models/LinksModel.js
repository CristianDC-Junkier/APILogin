const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { encrypt, decrypt, hash } = require("../utils/Crypto");

/**
 * Modelo Sequelize para los enlaces.
 * Todos los campos tipo STRING se guardan cifrados para proteger datos sensibles.
 * 
 * Campos:
 * - id   → Identificador único autoincremental.
 * - name → Nombre del link, único (encriptado).
 * - name_hash → Hash del nombre para búsquedas rápidas y únicas.
 * - web  → Ip de la web externa (encriptada).
 * - web_hash → Hash de la web para búsquedas rápidas y únicas.
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
        set(value) {
            this.setDataValue("name", encrypt(value));
            this.setDataValue("name_hash", hash(value));
        },
        get() {
            const val = this.getDataValue("name");
            return val ? decrypt(val) : null;
        },
    },
    name_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: {
            name: 'unique_linkname',
            msg: 'Nombre del link ya existente'
        },
    },
    web: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue("web", encrypt(value));
            this.setDataValue("web_hash", hash(value));
        },
        get() {
            const val = this.getDataValue("web");
            return val ? decrypt(val) : null;
        },
    },
    web_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: {
            name: 'unique_webname',
            msg: 'Link de la web ya existente'
        },
    },
});


module.exports = Links;
