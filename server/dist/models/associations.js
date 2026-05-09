"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTemplate = exports.Payment = exports.ShippingStage = exports.Shipment = exports.Admin = void 0;
const Shipment_1 = require("./Shipment");
Object.defineProperty(exports, "Shipment", { enumerable: true, get: function () { return Shipment_1.Shipment; } });
const Payment_1 = require("./Payment");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return Payment_1.Payment; } });
const DocumentTemplate_1 = require("./DocumentTemplate");
Object.defineProperty(exports, "DocumentTemplate", { enumerable: true, get: function () { return DocumentTemplate_1.DocumentTemplate; } });
const Admin_1 = __importDefault(require("./Admin"));
exports.Admin = Admin_1.default;
const ShippingStage_1 = require("./ShippingStage");
Object.defineProperty(exports, "ShippingStage", { enumerable: true, get: function () { return ShippingStage_1.ShippingStage; } });
console.log('Models loaded:', {
    Admin: !!Admin_1.default,
    Shipment: !!Shipment_1.Shipment,
    DocumentTemplate: !!DocumentTemplate_1.DocumentTemplate,
    shippingStage: !!ShippingStage_1.ShippingStage
});
// Admin associations
Admin_1.default.hasMany(Shipment_1.Shipment, {
    foreignKey: 'adminId',
    as: 'shipments',
});
Admin_1.default.hasMany(DocumentTemplate_1.DocumentTemplate, {
    foreignKey: 'adminId',
    as: 'documentTemplates',
});
// Shipment associations
Shipment_1.Shipment.belongsTo(Admin_1.default, {
    foreignKey: 'adminId',
    as: 'admin',
});
Shipment_1.Shipment.hasMany(ShippingStage_1.ShippingStage, {
    foreignKey: 'shipmentId',
    as: 'shippingStages',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
// ShippingStage associations
ShippingStage_1.ShippingStage.belongsTo(Shipment_1.Shipment, {
    foreignKey: 'shipmentId',
    as: 'shipment',
});
// DocumentTemplate associations
DocumentTemplate_1.DocumentTemplate.belongsTo(Admin_1.default, {
    foreignKey: 'adminId',
    as: 'admin',
});
