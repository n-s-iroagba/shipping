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
exports.AuthService = void 0;
exports.createAuthService = createAuthService;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const AdminService_1 = require("./AdminService");
const EmailService_1 = __importDefault(require("./EmailService"));
// import { EmailService } from './EmailService'
const PasswordService_1 = require("./PasswordService");
const TokenService_1 = require("./TokenService");
const VerificationService_1 = require("./VerificationService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthService {
    constructor(config) {
        this.config = config;
        this.tokenService = new TokenService_1.TokenService(config.jwtSecret);
        this.passwordService = new PasswordService_1.PasswordService();
        this.adminService = new AdminService_1.AdminService();
        this.emailService = EmailService_1.default;
        this.verificationService = new VerificationService_1.VerificationService(this.tokenService, this.adminService, this.emailService, config);
        logger_1.default.info('AuthService initialized successfully');
    }
    /**
     * Registers a new user and initiates email verification.
     * @param data - User sign-up data.
     * @param roles - Optional array of user roles.
     * @returns Sign-up response with verification token.
     */
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Sign up process started', { email: data.email });
                const hashedPassword = yield this.passwordService.hashPassword(data.password);
                const user = yield this.adminService.createUser(Object.assign(Object.assign({}, data), { password: hashedPassword }));
                const result = yield this.verificationService.generateVerificationDetails(user);
                logger_1.default.info('Sign up completed successfully', { userId: user.id });
                return result.verificationToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Logs a user in by validating credentials and returning tokens.
     * @param data - Login DTO containing email and password.
     * @returns LoginAuthServiceReturn or SignUpResponseDto for unverified users.
     */
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Login attempt started', { email: data.email });
                const user = yield this.adminService.findUserByEmail(data.email, true);
                console.log('PASSWORD', user === null || user === void 0 ? void 0 : user.password);
                yield this.validatePassword(user, data.password);
                if (!user) {
                    throw new errors_1.NotFoundError('user not found');
                }
                if (!user.isEmailVerified) {
                    logger_1.default.warn('Login attempted by unverified user', { userId: user.id });
                    return (yield this.verificationService.generateVerificationDetails(user)).verificationToken;
                }
                const { accessToken, refreshToken } = this.generateTokenPair(user);
                logger_1.default.info('Login successful', { userId: user === null || user === void 0 ? void 0 : user.id });
                const returnUser = Object.assign({}, user.get({ plain: true }));
                user.refreshToken = refreshToken;
                yield user.save();
                return { user: returnUser, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Issues a new access token from a refresh token.
     * @param refreshToken - JWT refresh token.
     * @returns Object containing a new access token.
     */
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Token refresh attempted');
                const { decoded } = this.tokenService.verifyToken(refreshToken, 'refresh');
                console.log(decoded);
                if (!decoded.id) {
                    logger_1.default.warn('Invalid refresh token provided');
                    throw new errors_1.BadRequestError('Invalid refresh token');
                }
                const user = yield this.adminService.findUserById(decoded.id);
                const newAccessToken = this.tokenService.generateAccessToken(user);
                logger_1.default.info('Token refreshed successfully', { userId: user.id });
                return { accessToken: newAccessToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Verifies a user's email using a token and code.
     * @param data - DTO containing token and verification code.
     * @returns Auth tokens for the verified user.
     */
    verifyEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Email verification started');
                const { decoded } = this.tokenService.verifyToken(data.verificationToken, 'email_verification');
                console.log(decoded);
                const userId = decoded.AdminId;
                if (!userId) {
                    logger_1.default.warn('Invalid verification token provided');
                    throw new errors_1.BadRequestError('Unsuitable token');
                }
                const user = yield this.adminService.findUserById(userId);
                this.verificationService.validateVerificationCode(user, data.verificationCode);
                yield this.adminService.markUserAsVerified(user);
                const { accessToken, refreshToken } = this.generateTokenPair(user);
                logger_1.default.info('Email verification successful', { userId: user.id });
                const returnUser = Object.assign({}, user.get({ plain: true }));
                user.refreshToken = refreshToken;
                yield user.save();
                return { user: returnUser, accessToken, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Generates a new email verification code.
     * @param token - JWT token associated with the verification.
     * @returns A new verification code string.
     */
    generateNewCode(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('New verification code generation requested');
                return yield this.verificationService.regenerateVerificationCode(token);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Sends a password reset email to the user.
     * @param email - User's email address.
     */
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Password reset requested', { email });
                const user = yield this.adminService.findUserByEmail(email);
                if (!user) {
                    logger_1.default.error('Password reset requested for non-existent email', { email });
                    throw new errors_1.NotFoundError('user for forgot password not found');
                }
                const { token, hashedToken } = this.passwordService.generateResetToken();
                yield this.adminService.setPasswordResetDetails(user, hashedToken);
                yield this.emailService.sendPasswordResetEmail(user.email, token);
                logger_1.default.info('Password reset email sent', { userId: user.id });
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Resets the user's password using the reset token.
     * @param data - DTO with new password and reset token.
     * @returns New auth tokens.
     */
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Password reset process started');
                const user = yield this.adminService.findUserByResetToken(data.resetPasswordToken);
                const hashedPassword = yield this.passwordService.hashPassword(data.password);
                yield this.adminService.updateUserPassword(user, hashedPassword);
                const { accessToken, refreshToken } = this.generateTokenPair(user);
                logger_1.default.info('Password reset successful', { userId: user.id });
                return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Retrieves a user by ID.
     * @param userId - ID of the user.
     * @returns User object.
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Get user by ID requested', { userId });
                const user = yield this.adminService.findUserById(userId);
                logger_1.default.info('User retrieved successfully', { userId: user.id });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Returns the current authenticated user's details.
     * @param userId - Authenticated user's ID.
     * @returns User object.
     */
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info('Get current user requested', { userId });
                const user = yield this.adminService.findUserById(userId);
                logger_1.default.info('Current user retrieved successfully', { userId });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Compares the given password with the user's stored password.
     * @param user - User instance.
     * @param password - Plain text password to validate.
     */
    validatePassword(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMatch = yield this.passwordService.comparePasswords(password, user.password);
            if (!isMatch) {
                logger_1.default.warn('Password validation failed', { userId: user.id });
                throw new errors_1.BadRequestError('Invalid credentials', 'INVALID_CREDENTIALS');
            }
            logger_1.default.info('Password validated successfully', { userId: user.id });
        });
    }
    /**
     * Generates a new access/refresh token pair.
     * @param userId - ID of the user.
     * @returns Object containing access and refresh tokens.
     */
    generateTokenPair(user) {
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = this.tokenService.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }
    /**
     * Saves the refresh token on the user and returns the full auth response.
     * @param user - User instance.
     * @param accessToken - JWT access token.
     * @param refreshToken - JWT refresh token.
     * @returns Full login/auth return object.
     */
    saveRefreshTokenAndReturn(passedUser, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            passedUser.refreshToken = refreshToken;
            yield passedUser.save();
            const user = Object.assign({}, passedUser);
            return { accessToken, user, refreshToken };
        });
    }
}
exports.AuthService = AuthService;
// factory/auth.factory.ts
function createAuthService() {
    const config = {
        jwtSecret: process.env.JWT_SECRET || 'udorakpuenyi',
        clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
        tokenExpiration: {
            verification: 86400,
            login: 3600,
            refresh: 86400 * 7,
        },
    };
    logger_1.default.info('AuthService factory creating new instance');
    return new AuthService(config);
}
