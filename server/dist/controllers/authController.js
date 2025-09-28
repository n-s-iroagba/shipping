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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
// Helper function to get cookie options
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax'),
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        maxAge: 24 * 60 * 60 * 1000,
    };
};
class AuthController {
    constructor() {
        this.authService = (0, authService_1.createAuthService)();
        /**
         * Handles applicant sign-up and assigns the 'APPLICANT' role.
         * @param req Express request object
         * @param res Express response object
         * @param next Express next middleware function
         */
        this.signUpAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const verificationToken = yield this.authService.signUp(req.body);
                res.status(201).json(verificationToken);
                return;
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Resends email verification code.
         * @param req Express request object
         * @param res Express response object
         * @param next Express next middleware function
         */
        this.resendCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, id } = req.body;
                const newToken = yield this.authService.generateNewCode(token);
                res.json(newToken);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Sends password reset email.
         * @param req Express request object
         * @param res Express response object
         * @param next Express next middleware function
         */
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({ message: 'Email is required' });
                    return;
                }
                yield this.authService.forgotPassword(email);
                res.status(200).end();
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Returns currently authenticated user details.
         * @param req Express request object
         * @param res Express response object
         * @param next Express next middleware function
         */
        this.getMe = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const user = yield this.authService.getMe(userId);
                console.log('AUTH USER', user);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email and password are required' });
                    return;
                }
                const result = yield this.authService.login({ email, password });
                // Check if result has refreshToken property (verified user)
                if (typeof result !== 'string' && 'refreshToken' in result && 'accessToken' in result) {
                    // User is verified
                    const verified = result;
                    const cookieOptions = getCookieOptions();
                    console.log('Setting refresh token cookie with options:', cookieOptions);
                    res.cookie('refreshToken', verified.refreshToken, cookieOptions);
                    res.status(200).json({
                        user: verified.user,
                        accessToken: verified.accessToken,
                    });
                }
                else {
                    res.status(200).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Verifies user's email with improved cookie setting
         */
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.verifyEmail(req.body);
                const cookieOptions = getCookieOptions();
                console.log('Setting refresh token cookie after verification:', cookieOptions);
                res.cookie('refreshToken', result.refreshToken, cookieOptions);
                const authUser = result.user;
                console.log('auth user', authUser);
                res.status(200).json({
                    user: authUser,
                    accessToken: result.accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.resetPassword(req.body);
                const cookieOptions = getCookieOptions();
                console.log('Setting refresh token cookie after password reset:', cookieOptions);
                res.cookie('refreshToken', result.refreshToken, cookieOptions);
                // Extract only the properties you need from the user object
                const userResponse = {
                    id: result.user.id,
                    email: result.user.email,
                    username: result.user.username,
                    // Add other properties you need
                };
                res.status(200).json({
                    user: userResponse,
                    accessToken: result.accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('All cookies received:', req.cookies);
                console.log('Headers:', req.headers.cookie);
                const cookieHeader = req.headers.cookie;
                console.log('Raw cookie header:', cookieHeader);
                if (!cookieHeader) {
                    res.status(401).json({ message: 'No cookies provided' });
                    return;
                }
                // Extract the refreshToken value from the cookie string
                const refreshToken = (_a = cookieHeader
                    .split(';')
                    .find(cookie => cookie.trim().startsWith('refreshToken='))) === null || _a === void 0 ? void 0 : _a.split('=')[1];
                console.log('Extracted refresh token:', refreshToken ? 'Present' : 'Missing');
                console.log('Token preview:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None');
                if (!refreshToken) {
                    res.status(401).json({ message: 'No refresh token found in cookies' });
                    return;
                }
                // Now pass just the token value (not the whole cookie header)
                const accessToken = yield this.authService.refreshToken(refreshToken);
                res.status(200).json(accessToken);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Logout with improved cookie clearing
         */
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const isProduction = process.env.NODE_ENV === 'production';
                const clearOptions = {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: (isProduction ? 'none' : 'lax'),
                    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
                    path: '/', // Important: match the path used when setting
                };
                console.log('Clearing cookie with options:', clearOptions);
                res.clearCookie('refreshToken', clearOptions);
                res.status(200).json({ message: 'Logged out successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
