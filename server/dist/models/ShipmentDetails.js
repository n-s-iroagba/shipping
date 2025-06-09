"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentDetails = void 0;
const sequelize_1 = require("sequelize");
const User_1 = require("./User"); // Ensure correct import
const database_1 = require("../config/database");
class ShipmentDetails extends sequelize_1.Model {
}
exports.ShipmentDetails = ShipmentDetails;
ShipmentDetails.init({
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
    sendingAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    receivingAddress: {
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
    adminId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: "id",
        },
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "ShipmentDetails",
    timestamps: true,
});
