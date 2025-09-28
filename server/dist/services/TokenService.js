"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const errors_1 = require("../utils/errors");
// Extended interfaces for specialized tokens
class TokenService {
    constructor(secret, refreshSecret, resetPasswordSecret, emailVerificationSecret) {
        this.secret = secret;
        this.refreshSecret = refreshSecret;
        this.resetPasswordSecret = resetPasswordSecret;
        this.emailVerificationSecret = emailVerificationSecret;
        this.defaultOptions = {
            issuer: 'your-app-name',
            audience: 'your-app-admins',
        };
        // Token expiration defaults
        this.tokenExpirations = {
            access: '15m',
            refresh: '7d',
            resetPassword: '1h',
            emailVerification: '24h',
        };
        if (!secret) {
            logger_1.default.error('JWT secret is required for TokenService initialization');
            throw new Error('JWT secret is required');
        }
        logger_1.default.info('TokenService initialized successfully', {
            hasRefreshSecret: !!refreshSecret,
            hasResetPasswordSecret: !!resetPasswordSecret,
            hasEmailVerificationSecret: !!emailVerificationSecret,
        });
    }
    /**
     * Generate an access token with Admin authentication info
     */
    generateAccessToken(payload, customExpiresIn) {
        var _a;
        try {
            // Create minimal payload with only essential fields
            const accessTokenPayload = {
                id: payload.id,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions,
                tokenType: 'access',
            };
            const options = {
                expiresIn: customExpiresIn || this.tokenExpirations.access,
                issuer: this.defaultOptions.issuer,
                audience: this.defaultOptions.audience,
                subject: (_a = payload.id) === null || _a === void 0 ? void 0 : _a.toString(),
            };
            const signOptions = {
                expiresIn: options.expiresIn,
                issuer: options.issuer,
                audience: options.audience,
                subject: options.subject,
                algorithm: 'HS256',
            };
            const token = jsonwebtoken_1.default.sign(accessTokenPayload, this.secret, signOptions);
            logger_1.default.info('Access token generated successfully', {
                AdminId: payload.id,
                email: payload.email,
                role: payload.role,
                expiresIn: options.expiresIn,
                hasPermissions: !!(payload.permissions && payload.permissions.length > 0),
                tokenLength: token.length,
            });
            return token;
        }
        catch (error) {
            logger_1.default.error('Access token generation failed', {
                error,
                email: payload.email,
                role: payload.role,
            });
            throw new Error('Access token generation failed');
        }
    }
    /**
     * Generate a password reset token
     */
    generateResetPasswordToken(payload, customExpiresIn) {
        var _a, _b;
        try {
            // Create minimal payload with only essential fields
            const resetTokenPayload = {
                id: payload.id,
                email: payload.email,
                tokenType: 'reset_password',
                purpose: 'password_reset',
            };
            const secret = this.resetPasswordSecret || this.secret;
            const options = {
                expiresIn: customExpiresIn || this.tokenExpirations.resetPassword,
                issuer: this.defaultOptions.issuer,
                audience: this.defaultOptions.audience,
                subject: ((_a = payload.id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = payload.id) === null || _b === void 0 ? void 0 : _b.toString()),
            };
            const signOptions = {
                expiresIn: options.expiresIn,
                issuer: options.issuer,
                audience: options.audience,
                subject: options.subject,
                algorithm: 'HS256',
            };
            const token = jsonwebtoken_1.default.sign(resetTokenPayload, secret, signOptions);
            logger_1.default.info('Reset password token generated successfully', {
                AdminId: payload.id || payload.id,
                email: payload.email,
                expiresIn: options.expiresIn,
                requestId: payload.requestId,
                tokenLength: token.length,
            });
            return token;
        }
        catch (error) {
            logger_1.default.error('Reset password token generation failed', {
                error,
                email: payload.email,
            });
            throw new Error('Reset password token generation failed');
        }
    }
    /**
     * Generate an email verification token
     */
    generateEmailVerificationToken(Admin, customExpiresIn) {
        var _a;
        try {
            // Extract only essential fields from the Admin model
            const verificationTokenPayload = {
                AdminId: Admin.id,
                email: Admin.email,
                verificationCode: Admin.verificationCode,
                tokenType: 'email_verification',
                purpose: 'email_verification',
            };
            const secret = this.emailVerificationSecret || this.secret;
            const options = {
                expiresIn: customExpiresIn || this.tokenExpirations.emailVerification,
                issuer: this.defaultOptions.issuer,
                audience: this.defaultOptions.audience,
                subject: (_a = Admin.id) === null || _a === void 0 ? void 0 : _a.toString(),
            };
            const signOptions = {
                expiresIn: options.expiresIn,
                issuer: options.issuer,
                audience: options.audience,
                subject: options.subject,
                algorithm: 'HS256',
            };
            const token = jsonwebtoken_1.default.sign(verificationTokenPayload, secret, signOptions);
            logger_1.default.info('Email verification token generated successfully', {
                AdminId: Admin.id,
                email: Admin.email,
                expiresIn: options.expiresIn,
                verificationCode: Admin.verificationCode,
                tokenLength: token.length,
            });
            return token;
        }
        catch (error) {
            logger_1.default.error('Email verification token generation failed', {
                error,
                email: Admin.email,
            });
            throw new Error('Email verification token generation failed');
        }
    }
    /**
     * Generate refresh token with different secret (if provided)
     */
    generateRefreshToken(payload, expiresIn = '7d') {
        // Create minimal payload with only essential fields
        const refreshPayload = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            tokenType: 'refresh',
        };
        const secret = this.refreshSecret || this.secret;
        const options = {
            expiresIn,
            issuer: this.defaultOptions.issuer,
            audience: this.defaultOptions.audience,
        };
        try {
            const signOptions = {
                expiresIn: options.expiresIn,
                issuer: options.issuer,
                audience: options.audience,
                algorithm: 'HS256',
            };
            const token = jsonwebtoken_1.default.sign(refreshPayload, secret, signOptions);
            logger_1.default.info('Refresh token generated successfully', {
                AdminId: payload.AdminId || payload.adminId,
                tokenLength: token.length,
            });
            return token;
        }
        catch (error) {
            logger_1.default.error('Refresh token generation failed', { error });
            throw new Error('Refresh token generation failed');
        }
    }
    /**
     * Verify token with comprehensive expiration and error handling
     * Now supports different token types with their respective secrets
     * Throws errors to be handled by middleware
     */
    verifyToken(token, tokenType) {
        try {
            let secret = this.secret;
            // Select appropriate secret based on token type
            switch (tokenType) {
                case 'refresh':
                    secret = this.refreshSecret || this.secret;
                    break;
                case 'reset_password':
                    secret = this.resetPasswordSecret || this.secret;
                    break;
                case 'email_verification':
                    secret = this.emailVerificationSecret || this.secret;
                    break;
                default:
                    secret = this.secret;
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret, {
                algorithms: ['HS256'],
            });
            console.log('decoded is', decoded);
            // Validate token type matches expected type
            if (decoded.tokenType && decoded.tokenType !== tokenType) {
                logger_1.default.warn('Token type mismatch', {
                    expected: tokenType,
                    actual: decoded.tokenType,
                    AdminId: decoded.Admin.id,
                });
                throw new errors_1.UnauthorizedError(`Invalid token type. Expected ${tokenType} but got ${decoded.tokenType}`, 'TOKEN_TYPE_MISMATCH', { expected: tokenType, actual: decoded.tokenType });
            }
            // Additional expiration check
            const now = Math.floor(Date.now() / 1000);
            const isExpired = decoded.exp ? decoded.exp < now : false;
            if (isExpired) {
                logger_1.default.warn('Token is expired (manual check)', {
                    AdminId: decoded.AdminId,
                    tokenType: decoded.tokenType,
                    exp: decoded.exp,
                    now,
                });
                throw new errors_1.UnauthorizedError('Token has expired', 'TOKEN_EXPIRED', {
                    exp: decoded.exp,
                    now,
                    expiredAt: new Date(decoded.exp * 1000),
                });
            }
            // Check not before claim
            if (decoded.nbf && decoded.nbf > now) {
                logger_1.default.warn('Token not yet valid', {
                    AdminId: decoded.AdminId,
                    tokenType: decoded.tokenType,
                    nbf: decoded.nbf,
                    now,
                });
                throw new errors_1.UnauthorizedError('Token not yet valid', 'TOKEN_NOT_BEFORE', {
                    nbf: decoded.nbf,
                    now,
                    validFrom: new Date(decoded.nbf * 1000),
                });
            }
            const expiresIn = decoded.exp ? decoded.exp - now : undefined;
            const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : undefined;
            logger_1.default.info('Token verified successfully', {
                AdminId: decoded.AdminId,
                tokenType: decoded.tokenType,
                expiresIn,
                expiresAt,
            });
            return { decoded };
        }
        catch (error) {
            // Handle JWT library errors
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                logger_1.default.warn('JWT verification failed', {
                    error: error.message,
                    tokenType,
                });
                if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    throw new errors_1.UnauthorizedError('Token has expired', 'TOKEN_EXPIRED', {
                        expiredAt: error.expiredAt,
                    });
                }
                if (error instanceof jsonwebtoken_1.default.NotBeforeError) {
                    throw new errors_1.UnauthorizedError('Token not active', 'TOKEN_NOT_BEFORE', { date: error.date });
                }
                // Generic JWT error (malformed, invalid signature, etc.)
                throw new errors_1.UnauthorizedError('Invalid token', 'TOKEN_INVALID', { reason: error.message });
            }
            // Re-throw our custom errors
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            // Unexpected error
            logger_1.default.error('Unexpected error during token verification', {
                error: error instanceof Error ? error.message : String(error),
                tokenType,
            });
            throw new errors_1.InternalServerError('Token verification failed', 'TOKEN_VERIFICATION_ERROR', {
                originalError: error instanceof Error ? error.message : String(error),
            });
        }
    }
    /**
     * Verify access token specifically
     */
    verifyAccessToken(token) {
        return this.verifyToken(token, 'access');
    }
    /**
     * Verify refresh token specifically
     */
    verifyRefreshToken(token) {
        return this.verifyToken(token, 'refresh');
    }
    /**
     * Verify reset password token specifically
     */
    verifyResetPasswordToken(token) {
        return this.verifyToken(token, 'reset_password');
    }
    /**
     * Verify email verification token specifically
     */
    verifyEmailVerificationToken(token) {
        return this.verifyToken(token, 'email_verification');
    }
    /**
     * Check if token is expired without full verification
     */
    isTokenExpired(token) {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) {
                return true;
            }
            const now = Math.floor(Date.now() / 1000);
            return decoded.exp < now;
        }
        catch (error) {
            logger_1.default.warn('Error checking token expiration', { error });
            return true;
        }
    }
    /**
     * Get token expiration info without verification
     */
    getTokenExpirationInfo(token) {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded) {
                return { isExpired: true };
            }
            const now = Math.floor(Date.now() / 1000);
            const isExpired = decoded.exp ? decoded.exp < now : true;
            const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : undefined;
            const expiresIn = decoded.exp && !isExpired ? decoded.exp - now : undefined;
            const issuedAt = decoded.iat ? new Date(decoded.iat * 1000) : undefined;
            return {
                isExpired,
                expiresAt,
                expiresIn,
                issuedAt,
            };
        }
        catch (error) {
            logger_1.default.warn('Error getting token expiration info', { error });
            return { isExpired: true };
        }
    }
    /**
     * Decode token without verification (enhanced version)
     */
    decodeToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token, { complete: false });
            return decoded;
        }
        catch (error) {
            logger_1.default.warn('Token decoding failed', {
                error,
                tokenPreview: token.substring(0, 20) + '...',
            });
            return null;
        }
    }
    /**
     * Check if token needs refresh (within refresh threshold)
     */
    shouldRefreshToken(token, refreshThresholdMinutes = 15) {
        const info = this.getTokenExpirationInfo(token);
        if (info.isExpired) {
            return true;
        }
        if (!info.expiresIn) {
            return false;
        }
        const thresholdSeconds = refreshThresholdMinutes * 60;
        return info.expiresIn <= thresholdSeconds;
    }
    /**
     * Extract Admin info from token safely
     */
    extractAdminInfo(token) {
        const decoded = this.decodeToken(token);
        if (!decoded)
            return null;
        return {
            AdminId: decoded.AdminId,
            adminId: decoded.adminId,
            email: decoded.email,
            role: decoded.role,
            tokenType: decoded.tokenType,
            permissions: decoded.permissions,
            purpose: decoded.purpose,
        };
    }
    /**
     * Generate complete authentication token set (access + refresh)
     */
    generateAuthTokens(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        return {
            accessToken,
            refreshToken,
            accessExpiresIn: 15 * 60, // 15 minutes in seconds
            refreshExpiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
        };
    }
    /**
     * Generate token pair (access + refresh) - legacy method
     */
    generateTokenPair(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload, '7d');
        return {
            accessToken,
            refreshToken,
            accessExpiresIn: 15 * 60,
            refreshExpiresIn: 7 * 24 * 60 * 60,
        };
    }
    /**
     * Validate token format before verification
     */
    isValidTokenFormat(token) {
        const parts = token.split('.');
        return parts.length === 3 && parts.every(part => part.length > 0);
    }
    /**
     * Get token expiration defaults
     */
    getTokenExpirationDefaults() {
        return Object.assign({}, this.tokenExpirations);
    }
    /**
     * Update token expiration defaults
     */
    updateTokenExpirationDefaults(updates) {
        Object.assign(this.tokenExpirations, updates);
        logger_1.default.info('Token expiration defaults updated', updates);
    }
}
exports.TokenService = TokenService;
