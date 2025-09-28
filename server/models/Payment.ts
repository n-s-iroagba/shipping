import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ShippingStage } from '.';
import { PaymentStatus } from '../types/payment.types';



export interface PaymentAttributes {
  id: number;
  shippingStageId: number;
  amount: number;
  dateAndTime: Date;
  status: PaymentStatus;
  receipt: Buffer;
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
  public receipt!: Buffer;
  public referenceNumber?: string;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly receiptUrl!: string;


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
    receipt: {
      type: DataTypes.BLOB,
      allowNull: false,
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
  
  }
);
Payment.belongsTo(ShippingStage, {
  foreignKey: 'shippingStageId',
  as: 'paymentStage'
});
ShippingStage.hasMany(Payment, {
  foreignKey: 'shippingStageId',
  as: 'payments',
});