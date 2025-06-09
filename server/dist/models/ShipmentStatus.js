"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const ShipmentDetails_1 = require("./ShipmentDetails");
// Sequelize Model Class
class ShipmentStatus extends sequelize_1.Model {
}
exports.ShipmentStatus = ShipmentStatus;
ShipmentStatus.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shipmentDetailsId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "ShipmentDetails",
            key: "id",
        },
    },
    carrierNote: sequelize_1.DataTypes.TEXT,
    dateAndTime: sequelize_1.DataTypes.DATE,
    feeInDollars: sequelize_1.DataTypes.DECIMAL(10, 2),
    paymentReceipt: sequelize_1.DataTypes.STRING,
    amountPaid: sequelize_1.DataTypes.DECIMAL(10, 2),
    paymentDate: sequelize_1.DataTypes.DATE,
    percentageNote: sequelize_1.DataTypes.STRING,
    supportingDocument: sequelize_1.DataTypes.BLOB('long'),
    title: sequelize_1.DataTypes.STRING,
    location: sequelize_1.DataTypes.STRING,
    paymentStatus: sequelize_1.DataTypes.ENUM("PAID", "UNPAID", "PENDING", "NO_PAYMENT_REQUIRED"),
    longitude: sequelize_1.DataTypes.DECIMAL(10, 6),
    latitude: sequelize_1.DataTypes.DECIMAL(10, 6),
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: "ShipmentStatus",
});
// Set up associations
ShipmentDetails_1.ShipmentDetails.hasMany(ShipmentStatus, {
    foreignKey: "shipmentDetailsId",
    as: "shipmentStatus",
});
ShipmentStatus.belongsTo(ShipmentDetails_1.ShipmentDetails, {
    foreignKey: "shipmentDetailsId",
    as: "shipmentDetails",
});
