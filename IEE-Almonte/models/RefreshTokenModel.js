const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { encrypt, decrypt } = require("../utils/Crypto");

/**
 * Modelo Sequelize para generar token.
 * Todos los campos tipo STRING se guardan cifrados para proteger datos sensibles.
 * 
 * Campos:
 * - id         → Identificador único autoincremental.
 * - token      → Cadena que representa el token (encriptado).
 * - expireDate → Fecha de caducidad para el token.
 * - userId     → ID del usuario al que está asociado.
 */
const RefreshToken = sequelize.define("RefreshToken", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue("token", encrypt(value));
        },
        get() {
            const encrypted = this.getDataValue("token");
            return encrypted ? decrypt(encrypted) : null;
        },
    },
    expireDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "UserAccounts", key: "id" },
        onDelete: "CASCADE",
    },
});


module.exports = RefreshToken;
