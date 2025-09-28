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
exports.ShipmentService = void 0;
const Shipment_1 = require("../models/Shipment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ShippingStage_1 = require("../models/ShippingStage");
const database_1 = require("../config/database");
const errors_1 = require("../errors/errors");
const generateTrackingId_1 = require("../utils/generateTrackingId");
const codeHelper_1 = require("../utils/codeHelper");
const crpto_util_1 = require("../utils/crpto.util");
const models_1 = require("../models");
const EmailService_1 = __importDefault(require("./EmailService"));
class ShipmentService {
    createWithStages(shipmentData, stagesData) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.sequelize.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                // Generate tracking ID
                const trackingId = (0, generateTrackingId_1.generateTrackingId)();
                // Create shipment
                const shipment = yield Shipment_1.Shipment.create(Object.assign(Object.assign({}, shipmentData), { shipmentID: trackingId }), { transaction });
                // Create stages with shipment ID
                const stages = yield ShippingStage_1.ShippingStage.bulkCreate(stagesData.map((stage) => (Object.assign(Object.assign({}, stage), { shipmentId: shipment.id }))), { transaction });
                // ✅ return a proper object
                return shipment;
            }));
        });
    }
    getAll(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Shipment_1.Shipment.findAll({
                where: { adminId },
                include: [
                    {
                        model: ShippingStage_1.ShippingStage,
                        as: 'shippingStages',
                    },
                ],
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield Shipment_1.Shipment.findByPk(id, {
                include: [
                    {
                        model: ShippingStage_1.ShippingStage,
                        as: 'shippingStages',
                    },
                ],
            });
            if (!shipment) {
                throw new errors_1.NotFoundError('Shipment not found');
            }
            return shipment;
        });
    }
    update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield this.getById(id);
            return shipment.update(updates);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield this.getById(id);
            yield shipment.destroy();
            return { message: 'Shipment deleted successfully' };
        });
    }
    trackShipment(trackingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield Shipment_1.Shipment.findOne({
                where: { shipmentID: trackingId },
                include: [
                    {
                        model: ShippingStage_1.ShippingStage,
                        as: 'shippingStages',
                        order: [['dateAndTime', 'DESC']],
                        include: [
                            {
                                model: models_1.Payment,
                                as: 'payments'
                            },
                        ],
                    },
                ],
            });
            if (!shipment) {
                throw new errors_1.NotFoundError('Shipment not found');
            }
            return shipment;
        });
    }
    getPublicTrackingInfo(trackingId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const shipment = yield this.trackShipment(trackingId);
            // Filter sensitive data
            return {
                id: shipment.id,
                shipmentID: shipment.shipmentID,
                senderName: shipment.senderName,
                receivingAddress: shipment.destination,
                recipientName: shipment.recipientName,
                status: shipment.status,
                shippingStages: (_a = shipment.shippingStages) === null || _a === void 0 ? void 0 : _a.map((stage) => ({
                    title: stage.title,
                    location: stage.location,
                    dateAndTime: stage.dateAndTime,
                    carriernote: stage.paymentStatus,
                    longitude: stage.longitude,
                    latitude: stage.latitude,
                })),
            };
        });
    }
    getSensitiveTrackingInfo(trackingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield this.trackShipment(trackingId);
            return shipment;
        });
    }
    initiateSensitiveTracking(shipmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield Shipment_1.Shipment.findByPk(shipmentId);
            if (!shipment) {
                throw new Error('Shipment not found.');
            }
            console.log('email', shipment.receipientEmail);
            const viewToken = crpto_util_1.CryptoUtil.generateSecureToken();
            const viewCode = codeHelper_1.CodeHelper.generateVerificationCode(6);
            shipment.viewToken = viewToken.token;
            shipment.viewCode = viewCode;
            yield shipment.save();
            yield EmailService_1.default.sendInitialiseSensitiveTrackingEmail(shipment, viewCode);
            return viewToken.token;
        });
    }
    issueSenstiveViewToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipment = yield Shipment_1.Shipment.findOne({ where: {
                    viewToken: data.token
                } });
            if (!shipment) {
                throw new Error('shipment not found');
            }
            if (shipment.viewCode !== data.code) {
                throw new Error('Unauthorised to view shipment');
            }
            return jsonwebtoken_1.default.sign({ name: shipment.recipientName }, '1h');
        });
    }
    getCurrentStatus(stages) {
        if (!stages || stages.length === 0)
            return 'PENDING';
        return stages[stages.length - 1].paymentStatus;
    }
}
exports.ShipmentService = ShipmentService;
