const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { encrypt, decrypt } = require("../utils/crypto");

const Login = sequelize.define("Login", {
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
        defaultValue: 'USER'
    },
});

module.exports = Login;
