"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendCodeSchema = exports.resetPasswordSchema = exports.verifyEmailCodeSchema = exports.forgotPasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string();
// .min(8, 'Password must be at least 8 characters long')
// .regex(
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
// )
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: passwordSchema,
    username: zod_1.z
        .string()
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name must be less than 50 characters'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
exports.verifyEmailCodeSchema = zod_1.z.object({
    verificationCode: zod_1.z
        .string()
        .length(6, 'Verification code must be 6 digits')
        .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
    verificationToken: zod_1.z.string(),
});
exports.resetPasswordSchema = zod_1.z
    .object({
    password: passwordSchema,
    resetPasswordToken: zod_1.z.string(),
});
exports.resendCodeSchema = zod_1.z.object({
    verificationToken: zod_1.z.string(),
});
