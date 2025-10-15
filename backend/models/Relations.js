const sequelize = require("../config/db");

// Importar modelos
const UserAccount = require("./AuthModel");
const Department = require("./DepartmentModel");
const Links = require("./LinksModel");
const RefreshToken = require("./RefreshTokenModel");
const UserDepartments = require("./UserDepartmentsModel");

// ----------- DEFINIR RELACIONES -----------

// Relaciones UserAccount 1 ↔ 0..* RefreshToken
UserAccount.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens"
});
RefreshToken.belongsTo(UserAccount, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

// Relacion UserAccount 0..* ↔ 0..* Department
UserAccount.belongsToMany(Department, {
    through: UserDepartments,
    foreignKey: "userId",
    as: "departments"
});
Department.belongsToMany(UserAccount, {
    through: UserDepartments,
    foreignKey: "departmentId",
    as: "useraccounts"
});

// Relacion Department 0..* ↔ 0..* Links
Department.belongsToMany(Links, { through: "DepartmentLinks", foreignKey: "departmentId", as: "links"  });
Links.belongsToMany(Department, { through: "DepartmentLinks", foreignKey: "linkId", as: "departments" });

// ----------- EXPORTAR MODELOS -----------

module.exports = {
    sequelize,
    UserAccount,
    RefreshToken,
    Department,
    Links,
    UserDepartments
};

// ----------- REGISTRAR HOOKS -----------
require("./Hooks");
