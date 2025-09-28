
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}

export interface Payment {
  id: number;
  shippingStageId: number;
  amount: number;
  dateAndTime: Date;
  status: PaymentStatus;
  receipt:string | ArrayBuffer | Uint8Array<ArrayBufferLike> | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdatePaymentStatus={
    id: number,
    status: PaymentStatus,
    amount:number,
        shippingStageStatus:PaymentStatus
}