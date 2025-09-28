"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTemplate = exports.CryptoWallet = exports.Payment = exports.ShippingStage = exports.Shipment = exports.Admin = void 0;
const Shipment_1 = require("./Shipment");
Object.defineProperty(exports, "Shipment", { enumerable: true, get: function () { return Shipment_1.Shipment; } });
const Payment_1 = require("./Payment");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return Payment_1.Payment; } });
const CryptoWallet_1 = require("./CryptoWallet");
Object.defineProperty(exports, "CryptoWallet", { enumerable: true, get: function () { return CryptoWallet_1.CryptoWallet; } });
const DocumentTemplate_1 = require("./DocumentTemplate");
Object.defineProperty(exports, "DocumentTemplate", { enumerable: true, get: function () { return DocumentTemplate_1.DocumentTemplate; } });
const Admin_1 = __importDefault(require("./Admin"));
exports.Admin = Admin_1.default;
const Bank_1 = __importDefault(require("./Bank"));
const ShippingStage_1 = require("./ShippingStage");
Object.defineProperty(exports, "ShippingStage", { enumerable: true, get: function () { return ShippingStage_1.ShippingStage; } });
console.log('Models loaded:', {
    Admin: !!Admin_1.default,
    Shipment: !!Shipment_1.Shipment,
    CryptoWallet: !!CryptoWallet_1.CryptoWallet,
    DocumentTemplate: !!DocumentTemplate_1.DocumentTemplate,
    BankDetails: !!Bank_1.default,
    shippingStage: !!ShippingStage_1.ShippingStage
});
// Admin associations
Admin_1.default.hasMany(Shipment_1.Shipment, {
    foreignKey: 'adminId',
    as: 'shipments',
});
Admin_1.default.hasMany(CryptoWallet_1.CryptoWallet, {
    foreignKey: 'adminId',
    as: 'cryptoWallets',
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
// CryptoWallet associations
CryptoWallet_1.CryptoWallet.belongsTo(Admin_1.default, {
    foreignKey: 'adminId',
    as: 'admin',
});
// DocumentTemplate associations
DocumentTemplate_1.DocumentTemplate.belongsTo(Admin_1.default, {
    foreignKey: 'adminId',
    as: 'admin',
});
Bank_1.default.belongsTo(Admin_1.default, {
    foreignKey: 'adminId',
    as: 'bankOwner'
});
Admin_1.default.hasOne(Bank_1.default, {
    as: 'bank',
    foreignKey: 'adminId'
});
