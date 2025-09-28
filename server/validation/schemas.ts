import { z } from 'zod';
import { PaymentStatus } from '../types/payment.types';


// Common Schemas
const idSchema = z.number().int().positive();
const fileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number().positive(),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  buffer: z.instanceof(Buffer).optional(),
});

// Document Template Schemas
export const createDocumentTemplateSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  file: fileSchema.refine(
    file =>
      [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(file.mimetype),
    'Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX are allowed'
  ),
});

export const updateDocumentTemplateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const documentTemplateIdSchema = z.object({
  id: idSchema,
});

// Payment Schemas
export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  referenceNumber: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
  receipt: fileSchema
    .refine(
      file =>
        [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.mimetype),
      'Invalid file type. Only PDF, JPEG, PNG, DOC, DOCX are allowed'
    )
    .refine(
      file => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    ),
});

export const updatePaymentStatusSchema = z.object({
  status: z.nativeEnum(PaymentStatus),
  notes: z.string().max(500).optional(),
});

export const paymentIdSchema = z.object({
  id: idSchema,
});

// Export all schemas
export const validationSchemas = {
  documentTemplate: {
    create: createDocumentTemplateSchema,
    update: updateDocumentTemplateSchema,
    id: documentTemplateIdSchema,
  },
  payment: {
    create: createPaymentSchema,
    updateStatus: updatePaymentStatusSchema,
    id: paymentIdSchema,
  },
};
