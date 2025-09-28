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
exports.cryptoWalletController = void 0;
const CryptoWallet_1 = require("../models/CryptoWallet");
const logger_1 = __importDefault(require("../utils/logger"));
// Unified error handler using plain Error
function handleError(error, context, res) {
    let message = 'Internal server error';
    if (error instanceof Error) {
        message = error.message;
    }
    logger_1.default.error(`Failed to ${context}: ${message}`);
    res.status(400).json({
        success: false,
        message,
    });
}
exports.cryptoWalletController = {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const adminId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { page = 1, limit = 10 } = req.query;
                if (!adminId) {
                    throw new Error('Valid admin ID is required');
                }
                const offset = (Number(page) - 1) * Number(limit);
                const wallets = yield CryptoWallet_1.CryptoWallet.findAll({
                    where: { adminId },
                });
                logger_1.default.info(`Listed ${wallets.length} crypto wallets for admin ${adminId}`);
                res.json(wallets);
            }
            catch (error) {
                handleError(error, 'list crypto wallets', res);
            }
        });
    },
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = Number(req === null || req === void 0 ? void 0 : req.params.adminId);
                if (!adminId) {
                    throw new Error('Valid admin ID is required');
                }
                const { currency, walletAddress } = req.body;
                const wallet = yield CryptoWallet_1.CryptoWallet.create({
                    adminId,
                    currency,
                    walletAddress,
                });
                logger_1.default.info(`Crypto wallet created successfully for admin ${adminId}`);
                res.status(201).json({
                    success: true,
                    message: 'Crypto wallet created successfully',
                    data: wallet,
                });
            }
            catch (error) {
                handleError(error, 'create crypto wallet', res);
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const adminId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!adminId) {
                    throw new Error('Valid admin ID is required');
                }
                if (!id || isNaN(Number(id))) {
                    throw new Error('Valid wallet ID is required');
                }
                // Example: validate request body
                // validateCryptoWalletUpdate(req.body);
                const wallet = yield CryptoWallet_1.CryptoWallet.findByPk(id);
                if (!wallet) {
                    throw new Error('Crypto wallet not found');
                }
                if (wallet.adminId !== adminId) {
                    throw new Error('Not authorized to update this wallet');
                }
                yield wallet.update(req.body);
                const updatedWallet = yield CryptoWallet_1.CryptoWallet.findByPk(id);
                if (!updatedWallet) {
                    throw new Error('Failed to retrieve updated wallet');
                }
                logger_1.default.info(`Crypto wallet updated successfully: ${id}`);
                res.json({
                    success: true,
                    message: 'Crypto wallet updated successfully',
                    data: updatedWallet,
                });
            }
            catch (error) {
                handleError(error, 'update crypto wallet', res);
            }
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const adminId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!adminId) {
                    throw new Error('Valid admin ID is required');
                }
                if (!id || isNaN(Number(id))) {
                    throw new Error('Valid wallet ID is required');
                }
                const wallet = yield CryptoWallet_1.CryptoWallet.findByPk(id);
                if (!wallet) {
                    throw new Error('Crypto wallet not found');
                }
                if (wallet.adminId !== adminId) {
                    throw new Error('Not authorized to delete this wallet');
                }
                yield wallet.destroy();
                logger_1.default.info(`Crypto wallet deleted successfully: ${id}`);
                res.json({
                    success: true,
                    message: 'Crypto wallet deleted successfully',
                });
            }
            catch (error) {
                handleError(error, 'delete crypto wallet', res);
            }
        });
    },
};
