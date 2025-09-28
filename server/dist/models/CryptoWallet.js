"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoWallet = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class CryptoWallet extends sequelize_1.Model {
}
exports.CryptoWallet = CryptoWallet;
CryptoWallet.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    adminId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    walletAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'CryptoWallet',
    tableName: 'CryptoWallets',
    timestamps: true,
});
