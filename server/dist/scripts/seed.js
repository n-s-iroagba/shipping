"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDatabase;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = require("../models/Admin");
const Shipment_1 = require("../models/Shipment");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Running database seed...');
            // 1. Seed Admin
            const adminEmail = 'admin@arborglobal.com';
            let admin = yield Admin_1.Admin.findOne({ where: { email: adminEmail } });
            if (!admin) {
                const hashedPassword = yield bcryptjs_1.default.hash('Admin123!', 10);
                admin = yield Admin_1.Admin.create({
                    username: 'Arbor System Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    isEmailVerified: true,
                });
                console.log('✅ Default verified admin created (admin@arborglobal.com).');
            }
            else {
                console.log('ℹ️ Default admin already exists, skipping seed.');
            }
            // 2. Seed Shipment
            const sampleShipmentID = 'TRK-ARBOR-001';
            let shipment = yield Shipment_1.Shipment.findOne({ where: { shipmentID: sampleShipmentID } });
            if (!shipment) {
                shipment = yield Shipment_1.Shipment.create({
                    shipmentID: sampleShipmentID,
                    senderName: 'Arbor Concierge',
                    recipientName: 'Distinguished Client',
                    shipmentDescription: 'Confidential Secure Transport Asset',
                    origin: 'Geneva, Switzerland',
                    destination: 'London, United Kingdom',
                    pickupPoint: 'Arbor Secure Vault GVA',
                    dimensionInInches: '20x15x10',
                    expectedTimeOfArrival: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    receipientEmail: 'client@arborglobal.com',
                    weight: 15.5,
                    freightType: 'AIR',
                    status: 'RECEIVED (WAREHOUSE)',
                    adminId: admin.id,
                });
                console.log(`✅ Default sample shipment created (${sampleShipmentID}).`);
            }
            else {
                console.log('ℹ️ Sample shipment already exists, skipping seed.');
            }
            console.log('Database seeding completed successfully.');
        }
        catch (error) {
            console.error('Failed to seed database:', error);
        }
    });
}
