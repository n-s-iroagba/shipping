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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const errors_1 = require("../errors/errors");
const Payment_1 = require("../models/Payment");
const paymentService_1 = require("../services/paymentService");
const models_1 = require("../models");
const payment_types_1 = require("../types/payment.types");
const paymentService = new paymentService_1.PaymentService();
class PaymentController {
    createPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stageId = Number(req.params.stageId);
            try {
                const { amount, receipt } = req.body;
                const payment = yield paymentService.createPayment(stageId, amount, receipt);
                res.status(201).json({
                    success: true,
                    data: payment,
                });
            }
            catch (error) {
                if (error instanceof errors_1.BadRequestError) {
                    res.status(400).json({
                        success: false,
                        error: error,
                    });
                }
                else {
                    console.error('Create payment error:', error);
                    res.status(500).json({
                        success: false,
                        error: 'Failed to create payment',
                    });
                }
            }
        });
    }
    updatePaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, amount, shippingStageStatus } = req.body;
                if (!Object.values(payment_types_1.PaymentStatus).includes(status)) {
                    throw new errors_1.BadRequestError('Invalid payment status');
                }
                const payment = yield paymentService.updatePaymentStatus(parseInt(req.params.id), status, amount, shippingStageStatus);
                res.json({
                    success: true,
                    data: payment,
                });
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json({
                        success: false,
                        error: error,
                    });
                }
                else if (error instanceof errors_1.BadRequestError) {
                    res.status(400).json({
                        success: false,
                        error: error,
                    });
                }
                else {
                    console.error('Update payment error:', error);
                    res.status(500).json({
                        success: false,
                        error: 'Failed to update payment',
                    });
                }
            }
        });
    }
    listPending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adminId } = req.params;
            try {
                const payments = yield paymentService.getPendingPayments(Number(adminId));
                res.json(payments);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to list pending payments',
                });
            }
        });
    }
    listAllPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adminId } = req.params;
            try {
                const payments = yield Payment_1.Payment.findAll({
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
                });
                console.log('PAYMENTS HERE', payments);
                res.json(payments);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch payments',
                });
            }
        });
    }
    deletePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield paymentService.deletePayment(parseInt(req.params.id));
                res.json({
                    success: true,
                    message: 'Payment deleted successfully',
                });
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    res.status(404).json({
                        success: false,
                        error: error,
                    });
                }
                else {
                    console.error('Delete payment error:', error);
                    res.status(500).json({
                        success: false,
                        error: 'Failed to delete payment',
                    });
                }
            }
        });
    }
}
exports.PaymentController = PaymentController;
