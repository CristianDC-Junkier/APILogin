const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserDepartments = sequelize.define("UserDepartments", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "UserDepartments",
});

module.exports = UserDepartments;
