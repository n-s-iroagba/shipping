"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const ShipmentDetails_1 = require("./ShipmentDetails");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    isVerified: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    verificationCode: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    verificationToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: "User" });
// Define relationships
User.hasMany(ShipmentDetails_1.ShipmentDetails, { foreignKey: "adminId", as: "shipments" });
