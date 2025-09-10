export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
  UNPAID = 'UNPAID',
  INCOMPLETE_PAYMENT = 'INCOMPLETE_PAYMENT',
  REJECTED = 'REJECTED',
}

export interface Payment {
  id: number;
  shippingStageId: number;
  amount: number;
  dateAndTime: Date;
  status: PaymentStatus;
  receipt: Blob;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}