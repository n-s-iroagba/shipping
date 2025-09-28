"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class BankDetails extends sequelize_1.Model {
}
BankDetails.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    adminId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    bankName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    accountName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    accountNumber: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    swiftCode: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    routingNumber: { type: sequelize_1.DataTypes.STRING, allowNull: true }
}, {
    sequelize: database_1.sequelize,
    tableName: 'bank_details',
    timestamps: true
});
exports.default = BankDetails;
