// schemas/shippingStageSchemas.ts
import { z } from 'zod';
import { ShippingStagePaymentStatus } from '../models/ShippingStage';

const decimalSchema = z.preprocess(val => Number(val), z.number());

export const shippingStageCreateSchema = z.object({
  title: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  carrierNote: z.string().max(1000).optional(),
  dateAndTime: z.string().datetime(),
  percentageNote: z.string().max(50).optional(),
  feeInDollars: decimalSchema.optional().nullable(),
  paymentStatus: z.nativeEnum(ShippingStagePaymentStatus),
  longitude: decimalSchema.refine(val => val >= -180 && val <= 180, {
    message: 'Longitude must be between -180 and 180',
  }),
  latitude: decimalSchema.refine(val => val >= -90 && val <= 90, {
    message: 'Latitude must be between -90 and 90',
  }),
});
