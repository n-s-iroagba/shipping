import { z } from 'zod';
import { ShippingStagePaymentStatus } from '../models/ShippingStage';
import { shippingStageCreateSchema } from './shippingStageSchemas';

// Shared schemas
const idSchema = z.string().or(z.number()).transform(Number);
const decimalSchema = z.string().or(z.number()).transform(Number);
const emailSchema = z.string().email('Invalid email format');
const dateSchema = z
  .string()
  .datetime()
  .or(z.date())
  .transform(val => new Date(val));
const freightTypeSchema = z.enum(['LAND', 'AIR', 'SEA']);

// ✨ Enforce at least one stage
const stagesSchema = z
  .array(shippingStageCreateSchema)
  .min(1, 'At least one shipping stage is required');

// 🚚 Main shipment schema with stages
export const shipmentSchema = z.object({
  id: idSchema.optional(),

  senderName: z
    .string()
    .min(2, 'Sender name must be at least 2 characters')
    .max(100),
  origin: z.string().min(2, 'Origin must be at least 2 characters').max(100),
  destination: z
    .string()
    .min(2, 'Destination must be at least 2 characters')
    .max(100),
  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100),
  pickupPoint: z
    .string()
    .min(2, 'Pickup point must be at least 2 characters')
    .max(100),
  shipmentDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500),

  dimensionInInches: z.string(),
  expectedTimeOfArrival: dateSchema.refine(
    date => date > new Date(),
    'ETA must be in the future'
  ),
  receipientEmail: emailSchema,
  weight: z.string(),
  freightType: freightTypeSchema,
  shippingStages: stagesSchema, // 👈 require at least one shipping stage
});
