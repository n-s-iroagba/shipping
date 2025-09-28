"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingStage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const payment_types_1 = require("../types/payment.types");
// Sequelize Model Class
class ShippingStage extends sequelize_1.Model {
}
exports.ShippingStage = ShippingStage;
ShippingStage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shipmentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Shipment',
            key: 'id',
        },
    },
    carrierNote: sequelize_1.DataTypes.TEXT,
    dateAndTime: sequelize_1.DataTypes.DATE,
    feeInDollars: sequelize_1.DataTypes.DECIMAL(10, 2),
    percentageNote: sequelize_1.DataTypes.STRING,
    supportingDocument: sequelize_1.DataTypes.BLOB('long'),
    title: sequelize_1.DataTypes.STRING,
    location: sequelize_1.DataTypes.STRING,
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(payment_types_1.PaymentStatus), // Updated to use PaymentStatus enum
        allowNull: false,
        defaultValue: payment_types_1.PaymentStatus.PENDING,
    },
    longitude: sequelize_1.DataTypes.DECIMAL(10, 6),
    latitude: sequelize_1.DataTypes.DECIMAL(10, 6),
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'ShippingStage',
    tableName: 'ShippingStages',
});
