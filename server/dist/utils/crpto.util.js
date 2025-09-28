"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtil = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CryptoUtil {
    static generateRandomBytes(length = 32) {
        return crypto_1.default.randomBytes(length).toString('hex');
    }
    static hashString(data, algorithm = 'sha256') {
        return crypto_1.default.createHash(algorithm).update(data).digest('hex');
    }
    static generateSecureToken() {
        const token = this.generateRandomBytes(32);
        const hashedToken = this.hashString(token);
        return { token, hashedToken };
    }
}
exports.CryptoUtil = CryptoUtil;
