"use strict";
/**
 * Model initialization file
 * This file ensures all models and their associations are properly loaded
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAssociations = exports.syncModels = exports.DocumentTemplate = exports.CryptoWallet = exports.Payment = exports.ShippingStage = exports.Shipment = exports.Admin = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
// Import all models through the index file
const index_1 = require("./index");
Object.defineProperty(exports, "Admin", { enumerable: true, get: function () { return index_1.Admin; } });
Object.defineProperty(exports, "Shipment", { enumerable: true, get: function () { return index_1.Shipment; } });
Object.defineProperty(exports, "ShippingStage", { enumerable: true, get: function () { return index_1.ShippingStage; } });
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return index_1.Payment; } });
Object.defineProperty(exports, "CryptoWallet", { enumerable: true, get: function () { return index_1.CryptoWallet; } });
Object.defineProperty(exports, "DocumentTemplate", { enumerable: true, get: function () { return index_1.DocumentTemplate; } });
// Function to sync all models with the database
const syncModels = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.sequelize.sync(options);
        console.log('✅ All models synchronized successfully');
    }
    catch (error) {
        console.error('❌ Error synchronizing models:', error);
        throw error;
    }
});
exports.syncModels = syncModels;
// Function to test model associations
const testAssociations = () => {
    console.log('🔍 Testing model associations...');
    // Test User associations
    console.log('User associations:', Object.keys(index_1.Admin.associations));
    // Test Shipment associations
    console.log('Shipment associations:', Object.keys(index_1.Shipment.associations));
    // Test ShippingStage associations
    console.log('ShippingStage associations:', Object.keys(index_1.ShippingStage.associations));
    // Test Payment associations
    console.log('Payment associations:', Object.keys(index_1.Payment.associations));
    // Test CryptoWallet associations
    console.log('CryptoWallet associations:', Object.keys(index_1.CryptoWallet.associations));
    console.log('✅ Association test complete');
};
exports.testAssociations = testAssociations;
