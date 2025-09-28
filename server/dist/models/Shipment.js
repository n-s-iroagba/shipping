"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shipment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Shipment extends sequelize_1.Model {
}
exports.Shipment = Shipment;
Shipment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    shipmentID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    senderName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    recipientName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    shipmentDescription: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    pickupPoint: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dimensionInInches: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expectedTimeOfArrival: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    receipientEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    freightType: {
        type: sequelize_1.DataTypes.ENUM('LAND', 'SEA', 'AIR'),
        allowNull: false,
    },
    viewCode: {
        type: sequelize_1.DataTypes.STRING
    },
    viewToken: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('RECEIVED (WAREHOUSE)', 'ONBOARD', 'IN TRANSIT'),
        allowNull: false,
        defaultValue: 'RECEIVED (WAREHOUSE)',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'Shipment',
    timestamps: true,
});
