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
exports.PasswordService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../utils/logger"));
const crpto_util_1 = require("../utils/crpto.util");
class PasswordService {
    constructor() {
        this.SALT_ROUNDS = 12;
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!password) {
                logger_1.default.error('Password hashing attempted with empty password');
                throw new Error('Password is required');
            }
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
                logger_1.default.info('Password hashed successfully');
                return hashedPassword;
            }
            catch (error) {
                logger_1.default.error('Password hashing failed', { error });
                throw new Error('Password hashing failed');
            }
        });
    }
    comparePasswords(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!plainPassword || !hashedPassword) {
                logger_1.default.error('Password comparison attempted with missing parameters');
                throw new Error('Both passwords are required for comparison');
            }
            try {
                const isMatch = yield bcryptjs_1.default.compare(plainPassword, hashedPassword);
                console.log('UUUUUUUUUUUUU', isMatch);
                logger_1.default.info('Password comparison completed', { isMatch });
                return isMatch;
            }
            catch (error) {
                logger_1.default.error('Password comparison failed', { error });
                throw new Error('Password comparison failed');
            }
        });
    }
    generateResetToken() {
        try {
            const tokens = crpto_util_1.CryptoUtil.generateSecureToken();
            logger_1.default.info('Password reset token generated successfully');
            return tokens;
        }
        catch (error) {
            logger_1.default.error('Reset token generation failed', { error });
            throw new Error('Reset token generation failed');
        }
    }
}
exports.PasswordService = PasswordService;
