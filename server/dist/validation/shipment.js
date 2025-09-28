"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentSchema = void 0;
const zod_1 = require("zod");
const shippingStageSchemas_1 = require("./shippingStageSchemas");
// Shared schemas
const idSchema = zod_1.z.string().or(zod_1.z.number()).transform(Number);
const decimalSchema = zod_1.z.string().or(zod_1.z.number()).transform(Number);
const emailSchema = zod_1.z.string().email('Invalid email format');
const dateSchema = zod_1.z
    .string()
    .datetime()
    .or(zod_1.z.date())
    .transform(val => new Date(val));
const freightTypeSchema = zod_1.z.enum(['LAND', 'AIR', 'SEA']);
// ✨ Enforce at least one stage
const stagesSchema = zod_1.z
    .array(shippingStageSchemas_1.shippingStageCreateSchema)
    .min(1, 'At least one shipping stage is required');
// 🚚 Main shipment schema with stages
exports.shipmentSchema = zod_1.z.object({
    id: idSchema.optional(),
    senderName: zod_1.z
        .string()
        .min(2, 'Sender name must be at least 2 characters')
        .max(100),
    origin: zod_1.z.string().min(2, 'Origin must be at least 2 characters').max(100),
    destination: zod_1.z
        .string()
        .min(2, 'Destination must be at least 2 characters')
        .max(100),
    recipientName: zod_1.z
        .string()
        .min(2, 'Recipient name must be at least 2 characters')
        .max(100),
    pickupPoint: zod_1.z
        .string()
        .min(2, 'Pickup point must be at least 2 characters')
        .max(100),
    shipmentDescription: zod_1.z
        .string()
        .min(2, 'Description must be at least 2 characters')
        .max(500),
    dimensionInInches: zod_1.z.string(),
    expectedTimeOfArrival: dateSchema,
    receipientEmail: emailSchema,
    weight: zod_1.z.string(),
    freightType: freightTypeSchema,
    shippingStages: stagesSchema, // 👈 require at least one shipping stage
});
