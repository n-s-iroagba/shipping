"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTemplate = void 0;
// models/DocumentTemplate.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class DocumentTemplate extends sequelize_1.Model {
}
exports.DocumentTemplate = DocumentTemplate;
DocumentTemplate.init({
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
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    file: {
        type: sequelize_1.DataTypes.BLOB,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'document_templates',
});
