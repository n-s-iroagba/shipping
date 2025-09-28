"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchemas = exports.paymentIdSchema = exports.updatePaymentStatusSchema = exports.createPaymentSchema = exports.documentTemplateIdSchema = exports.updateDocumentTemplateSchema = exports.createDocumentTemplateSchema = void 0;
const zod_1 = require("zod");
const payment_types_1 = require("../types/payment.types");
// Common Schemas
const idSchema = zod_1.z.number().int().positive();
const fileSchema = zod_1.z.object({
    fieldname: zod_1.z.string(),
    originalname: zod_1.z.string(),
    encoding: zod_1.z.string(),
    mimetype: zod_1.z.string(),
    size: zod_1.z.number().positive(),
    destination: zod_1.z.string(),
    filename: zod_1.z.string(),
    path: zod_1.z.string(),
    buffer: zod_1.z.instanceof(Buffer).optional(),
});
// Document Template Schemas
exports.createDocumentTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().max(500).optional(),
    file: fileSchema.refine(file => [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ].includes(file.mimetype), 'Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX are allowed'),
});
exports.updateDocumentTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
});
exports.documentTemplateIdSchema = zod_1.z.object({
    id: idSchema,
});
// Payment Schemas
exports.createPaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    referenceNumber: zod_1.z.string().max(50).optional(),
    notes: zod_1.z.string().max(500).optional(),
    receipt: fileSchema
        .refine(file => [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(file.mimetype), 'Invalid file type. Only PDF, JPEG, PNG, DOC, DOCX are allowed')
        .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB'),
});
exports.updatePaymentStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(payment_types_1.PaymentStatus),
    notes: zod_1.z.string().max(500).optional(),
});
exports.paymentIdSchema = zod_1.z.object({
    id: idSchema,
});
// Export all schemas
exports.validationSchemas = {
    documentTemplate: {
        create: exports.createDocumentTemplateSchema,
        update: exports.updateDocumentTemplateSchema,
        id: exports.documentTemplateIdSchema,
    },
    payment: {
        create: exports.createPaymentSchema,
        updateStatus: exports.updatePaymentStatusSchema,
        id: exports.paymentIdSchema,
    },
};
