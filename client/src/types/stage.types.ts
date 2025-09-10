import { Payment } from "./payment.types";

export enum ShippingStagePaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  NO_PAYMENT_REQUIRED = "NO_PAYMENT_REQUIRED",
  UNPAID = "UNPAID",
  INCOMPLETE_PAYMENT = "INCOMPLETE_PAYMENT",
}

export interface Stage {
  id: number;
  shipmentId: number;
  carrierNote: string;
  dateAndTime: Date;
  feeName?: string;
  feeInDollars?: number;
  amountPaid?: number;
  paymentDate?: Date;
  supportingDocument?: string | File;
  paymentStatus: ShippingStagePaymentStatus;
  title: string;
  payments:Payment[]
  location: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export type StageCreationDto = Omit<
  Stage,
  "id" | "createdAt" | "updatedAt" | "supportingDocument"|'payments'
> & { supportingDocument?: File | null };
