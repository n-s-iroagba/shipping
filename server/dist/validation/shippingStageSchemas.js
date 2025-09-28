"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingStageCreateSchema = void 0;
// schemas/shippingStageSchemas.ts
const zod_1 = require("zod");
const payment_types_1 = require("../types/payment.types");
const decimalSchema = zod_1.z.preprocess(val => Number(val), zod_1.z.number());
exports.shippingStageCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(100),
    location: zod_1.z.string().min(2).max(100),
    carrierNote: zod_1.z.string().max(1000).optional(),
    dateAndTime: zod_1.z.string().datetime(),
    percentageNote: zod_1.z.string().max(50).optional(),
    feeInDollars: decimalSchema.optional().nullable(),
    paymentStatus: zod_1.z.nativeEnum(payment_types_1.PaymentStatus),
    longitude: decimalSchema.refine(val => val >= -180 && val <= 180, {
        message: 'Longitude must be between -180 and 180',
    }),
    latitude: decimalSchema.refine(val => val >= -90 && val <= 90, {
        message: 'Latitude must be between -90 and 90',
    }),
});
