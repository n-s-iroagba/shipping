"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Admin extends sequelize_1.Model {
}
exports.Admin = Admin;
Admin.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verificationToken: {
        type: sequelize_1.DataTypes.STRING(400),
        allowNull: true,
    },
    verificationCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    passwordResetToken: {
        type: sequelize_1.DataTypes.STRING(400),
        allowNull: true,
    },
    refreshToken: {
        type: sequelize_1.DataTypes.STRING(400),
        allowNull: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'Admins',
    paranoid: true, // Enable soft deletes
});
exports.default = Admin;
