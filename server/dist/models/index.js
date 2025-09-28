"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.DocumentTemplate = exports.CryptoWallet = exports.Payment = exports.ShippingStage = exports.Shipment = exports.Admin = void 0;
// Export all models
var Admin_1 = require("./Admin");
Object.defineProperty(exports, "Admin", { enumerable: true, get: function () { return Admin_1.Admin; } });
var Shipment_1 = require("./Shipment");
Object.defineProperty(exports, "Shipment", { enumerable: true, get: function () { return Shipment_1.Shipment; } });
var ShippingStage_1 = require("./ShippingStage");
Object.defineProperty(exports, "ShippingStage", { enumerable: true, get: function () { return ShippingStage_1.ShippingStage; } });
var Payment_1 = require("./Payment");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return Payment_1.Payment; } });
var CryptoWallet_1 = require("./CryptoWallet");
Object.defineProperty(exports, "CryptoWallet", { enumerable: true, get: function () { return CryptoWallet_1.CryptoWallet; } });
var DocumentTemplate_1 = require("./DocumentTemplate");
Object.defineProperty(exports, "DocumentTemplate", { enumerable: true, get: function () { return DocumentTemplate_1.DocumentTemplate; } });
// Import sequelize instance
var database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
// Initialize associations
require("./associations");
