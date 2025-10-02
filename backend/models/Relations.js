const sequelize = require("../config/db");

// Importar modelos
const UserAccount = require("./AuthModel");
const Department = require("./DepartmentModel");
const Links = require("./LinksModel");

// ----------- DEFINIR RELACIONES -----------


// Relacion UserAccount 0..* ↔ 0..* Department
UserAccount.belongsToMany(Department, { through: "UserDepartments", foreignKey: "userId" });
Department.belongsToMany(UserAccount, { through: "UserDepartments", foreignKey: "departmentId" });

// Relacion Department 0..* ↔ 0..* Links
Department.belongsToMany(Links, { through: "DepartmentLinks", foreignKey: "departmentId" });
Links.belongsToMany(Department, { through: "DepartmentLinks", foreignKey: "linkId" });

module.exports = { UserAccount, Department, Links };