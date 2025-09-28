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
exports.PaymentService = void 0;
const Payment_1 = require("../models/Payment");
const errors_1 = require("../errors/errors");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const payment_types_1 = require("../types/payment.types");
class PaymentService {
    constructor() {
        this.storagePath = path_1.default.join(__dirname, '../../uploads/payments');
        // Ensure upload directory exists
        if (!fs_1.default.existsSync(this.storagePath)) {
            fs_1.default.mkdirSync(this.storagePath, { recursive: true });
        }
    }
    createPayment(stageId, amount, receiptFile, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!receiptFile) {
                throw new errors_1.BadRequestError('Receipt file is required');
            }
            if (amount <= 0) {
                throw new errors_1.BadRequestError('Amount must be greater than 0');
            }
            let payment;
            try {
                // Create payment record
                const paymentData = {
                    amount,
                    shippingStageId: stageId,
                    dateAndTime: new Date(),
                    status: payment_types_1.PaymentStatus.PENDING,
                    receipt: receiptFile,
                };
                payment = yield Payment_1.Payment.create(paymentData, { transaction });
                const stage = yield models_1.ShippingStage.findByPk(stageId);
                if (!stage) {
                    throw new errors_1.NotFoundError('stage not found');
                }
                stage.paymentStatus = payment_types_1.PaymentStatus.PENDING;
                yield stage.save();
                return payment;
            }
            catch (error) {
                console.error('Payment creation failed:', error);
                throw new Error('Failed to create payment');
            }
        });
    }
    updatePaymentStatus(id, status, amount, shippingStageStatus, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate status
            if (!Object.values(payment_types_1.PaymentStatus).includes(status)) {
                throw new errors_1.BadRequestError('Invalid payment status');
            }
            console.log('amount', amount);
            try {
                const payment = yield Payment_1.Payment.findOne({
                    where: { id },
                    transaction,
                });
                if (!payment) {
                    throw new errors_1.NotFoundError('Payment not found');
                }
                const stage = yield models_1.ShippingStage.findOne({
                    where: {
                        id: payment.shippingStageId
                    }
                });
                if (!stage) {
                    throw new errors_1.NotFoundError('stage not found');
                }
                payment.amount = payment.amount;
                payment.status = status;
                stage.amountPaid = (stage.amountPaid || 0) + amount;
                stage.paymentStatus = shippingStageStatus;
                yield stage.save();
                yield payment.save({ transaction });
                return payment;
            }
            catch (error) {
                console.error('Payment status update failed:', error);
                throw new Error('Failed to update payment status');
            }
        });
    }
    deletePayment(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield Payment_1.Payment.findOne({
                where: { id },
                transaction,
            });
            if (!payment) {
                throw new errors_1.NotFoundError('Payment not found');
            }
            try {
                // Delete will automatically trigger the beforeDestroy hook
                yield payment.destroy({ transaction });
            }
            catch (error) {
                console.error('Payment deletion failed:', error);
                throw new Error('Failed to delete payment');
            }
        });
    }
    getPaymentById(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payment_1.Payment.findOne({
                where: { id },
                transaction,
            });
        });
    }
    getAllPayments(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payment_1.Payment.findAll({
                order: [['dateAndTime', 'DESC']],
                transaction,
            });
        });
    }
    getPendingPayments(adminId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payment_1.Payment.findAll({
                where: { status: payment_types_1.PaymentStatus.PENDING },
                include: [
                    {
                        model: models_1.ShippingStage,
                        as: 'paymentStage',
                        include: [
                            {
                                model: models_1.Shipment,
                                as: 'shipment',
                                where: { adminId }, // filter by adminId
                            },
                        ],
                    },
                ],
                order: [['dateAndTime', 'DESC']],
                transaction,
            });
        });
    }
}
exports.PaymentService = PaymentService;
