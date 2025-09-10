import {
  Model,
  DataTypes,
  type ForeignKey,
  type Optional,
  type NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database';
import { Shipment } from './associations';

// Main Attributes
export enum ShippingStagePaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
  UNPAID = 'UNPAID',
  INCOMPLETE_PAYMENT = 'INCOMPLETE_PAYMENT',
}
export interface ShippingStageAttributes {
  id: string;
  shipmentId: number;
  title: string;
  location: string;
  carrierNote: string;
  dateAndTime: Date;
  percentageNote?: string;
  feeInDollars?: number | null;
  paymentStatus: ShippingStagePaymentStatus;
  supportingDocument?: Buffer;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
}

// Creation Attributes Interface
export interface ShippingStageCreationAttributes
  extends Optional<
    ShippingStageAttributes,
    | 'id'
    | 'feeInDollars'
    | 'percentageNote'
    | 'supportingDocument'
    | 'createdAt'
    | 'updatedAt'
  > {}

// Sequelize Model Class
export class ShippingStage
  extends Model<ShippingStageAttributes, ShippingStageCreationAttributes>
  implements ShippingStageAttributes
{
  id!: string;
  shipmentId!: number;
  carrierNote!: string;
  dateAndTime!: Date;
  feeInDollars?: number | null;
  paymentReceipt?: Buffer;
  amountPaid?: number;
  paymentDate?: Date;
  percentageNote?: string;
  paymentStatus!: ShippingStagePaymentStatus;
  title!: string;
  location!: string;
  supportingDocument?: Buffer;
  longitude!: number;
  latitude!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

ShippingStage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Shipment',
        key: 'id',
      },
    },
    carrierNote: DataTypes.TEXT,
    dateAndTime: DataTypes.DATE,
    feeInDollars: DataTypes.DECIMAL(10, 2),
    percentageNote: DataTypes.STRING,
    supportingDocument: DataTypes.BLOB('long'),
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    paymentStatus: {
      type: DataTypes.ENUM,
      values: Object.values(ShippingStagePaymentStatus),
    },
    longitude: DataTypes.DECIMAL(10, 6),
    latitude: DataTypes.DECIMAL(10, 6),
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'ShippingStage',
    tableName: 'ShippingStages',
  }
);


