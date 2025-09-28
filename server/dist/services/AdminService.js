"use strict";
// src/services/UserService.ts
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
exports.AdminService = void 0;
const AdminRepository_1 = __importDefault(require("../repositories/AdminRepository"));
const crpto_util_1 = require("../utils/crpto.util");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class AdminService {
    findUserByEmail(email_1) {
        return __awaiter(this, arguments, void 0, function* (email, shouldThrowError = false) {
            try {
                const user = yield AdminRepository_1.default.findUserByEmail(email);
                if (!user && shouldThrowError) {
                    logger_1.default.warn('User not found by email', { email });
                    throw new errors_1.BadRequestError('INVALID_CREDENTIALS');
                }
                if (user) {
                    logger_1.default.info('User found by email', { userId: user.id, email });
                }
                return user;
            }
            catch (error) {
                logger_1.default.error('Error finding user by email', { email, error });
                throw error;
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AdminRepository_1.default.findUserById(id);
                if (!user) {
                    logger_1.default.warn('User not found by ID', { userId: id });
                    throw new errors_1.NotFoundError('USER_NOT_FOUND');
                }
                logger_1.default.info('User found by ID', { userId: id });
                return user;
            }
            catch (error) {
                logger_1.default.error('Error finding user by ID', { userId: id, error });
                throw error;
            }
        });
    }
    findUserByResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedToken = crpto_util_1.CryptoUtil.hashString(token);
                const user = yield AdminRepository_1.default.findUserByResetToken(hashedToken);
                if (!user) {
                    const users = yield AdminRepository_1.default.getAllUsers();
                    console.log(users);
                    console.log(hashedToken);
                    logger_1.default.warn('User not found by reset token or token expired');
                    throw new errors_1.UnauthorizedError('Invalid or expired reset token', 'INVALID_RESET_TOKEN');
                }
                logger_1.default.info('User found by reset token', { userId: user.id });
                return user;
            }
            catch (error) {
                logger_1.default.error('Error finding user by reset token', { error });
                throw error;
            }
        });
    }
    findUserByVerificationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AdminRepository_1.default.findUserByVerificationToken(token);
                if (!user) {
                    logger_1.default.warn('User not found by verification token');
                    throw new errors_1.NotFoundError('User not found');
                }
                logger_1.default.info('User found by verification token', { userId: user.id });
                return user;
            }
            catch (error) {
                logger_1.default.error('Error finding user by verification token', { error });
                throw error;
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.findUserByEmail(userData.email);
                if (existingUser) {
                    logger_1.default.warn('Attempt to create user with existing email', { email: userData.email });
                    throw new errors_1.UnauthorizedError('User already exists', 'USER_EXISTS');
                }
                const user = yield AdminRepository_1.default.createUser(userData);
                logger_1.default.info('User created successfully', { userId: user.id, email: userData.email });
                return user;
            }
            catch (error) {
                logger_1.default.error('Error creating user', { email: userData.email, error });
                throw error;
            }
        });
    }
    updateUserVerification(user, verificationCode, verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updates = {
                    verificationCode,
                    verificationToken
                };
                console.log('CODE IS', verificationCode);
                const updatedUser = yield AdminRepository_1.default.updateUserById(user.id, updates);
                if (!updatedUser) {
                    throw new errors_1.NotFoundError('User not found for verification update');
                }
                logger_1.default.info('User verification details updated', { userId: user.id });
                return updatedUser;
            }
            catch (error) {
                logger_1.default.error('Error updating user verification', { userId: user.id, error });
                throw error;
            }
        });
    }
    markUserAsVerified(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updates = {
                    isEmailVerified: true,
                    verificationCode: null,
                    verificationToken: null
                };
                const updatedUser = yield AdminRepository_1.default.updateUserById(user.id, updates);
                if (!updatedUser) {
                    throw new errors_1.NotFoundError('User not found for verification');
                }
                logger_1.default.info('User marked as verified', { userId: user.id });
                return updatedUser;
            }
            catch (error) {
                logger_1.default.error('Error marking user as verified', { userId: user.id, error });
                throw error;
            }
        });
    }
    setPasswordResetDetails(user, hashedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updates = {
                    passwordResetToken: hashedToken
                };
                console.log('token', hashedToken);
                const updatedUser = yield AdminRepository_1.default.updateUserById(user.id, updates);
                if (!updatedUser) {
                    throw new errors_1.NotFoundError('User not found for password reset');
                }
                console.log(updatedUser);
                logger_1.default.info('Password reset details set', { userId: user.id });
                return updatedUser;
            }
            catch (error) {
                logger_1.default.error('Error setting password reset details', { userId: user.id, error });
                throw error;
            }
        });
    }
    updateUserPassword(user, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updates = {
                    password: hashedPassword,
                    passwordResetToken: null
                };
                const updatedUser = yield AdminRepository_1.default.updateUserById(user.id, updates);
                if (!updatedUser) {
                    throw new errors_1.NotFoundError('User not found for password update');
                }
                logger_1.default.info('User password updated successfully', { userId: user.id });
                return updatedUser;
            }
            catch (error) {
                logger_1.default.error('Error updating user password', { userId: user.id, error });
                throw error;
            }
        });
    }
}
exports.AdminService = AdminService;
