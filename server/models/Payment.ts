import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import fs from 'fs';
import path from 'path';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
  UNPAID = 'UNPAID',
  INCOMPLETE_PAYMENT = 'INCOMPLETE_PAYMENT',
  REJECTED = 'REJECTED',
}

export interface PaymentAttributes {
  id: number;
  shippingStageId: number;
  amount: number;
  dateAndTime: Date;
  status: PaymentStatus;
  receiptPath: string;
  receiptType: string;
  receiptSize: number;
  referenceNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCreationAttributes
  extends Omit<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public shippingStageId!: number;
  public amount!: number;
  public dateAndTime!: Date;
  public status!: PaymentStatus;
  public receiptPath!: string;
  public receiptType!: string;
  public receiptSize!: number;
  public referenceNumber?: string;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly receiptUrl!: string;

  getReceiptUrl(): string {
    return `/uploads/payments/${path.basename(this.receiptPath)}`;
  }
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shippingStageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ShippingStages',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(PaymentStatus),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    },
    receiptPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiptType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiptSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    hooks: {
      beforeDestroy: async (payment: Payment) => {
        // Delete receipt file when payment is deleted
        if (fs.existsSync(payment.receiptPath)) {
          fs.unlinkSync(payment.receiptPath);
        }
      },
    },
  }
);
