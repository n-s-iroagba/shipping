import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from './User'; // Ensure correct import
import { sequelize } from '../config/database';

type FreightType = 'LAND' | 'AIR' | 'SEA';
export type ShipmentStatus = 'RECEIVED (WAREHOUSE)' | 'ONBOARD' | 'IN TRANSIT';

export class Shipment extends Model<
  InferAttributes<Shipment>,
  InferCreationAttributes<Shipment>
> {
  [x: string]: any;
  declare id?: number;
  declare shipmentID: string;
  declare senderName: string;
  declare origin: string;
  declare destination: string;
  declare recipientName: string;
  declare pickupPoint: string;
  declare shipmentDescription: string;
  declare adminId: number;
  declare status: ShipmentStatus;
  declare dimensionInInches: string;
  declare expectedTimeOfArrival: Date;
  declare receipientEmail: string;
  declare weight: number;
  declare freightType: FreightType;
}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    shipmentID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipmentDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dimensionInInches: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectedTimeOfArrival: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receipientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    freightType: {
      type: DataTypes.ENUM('LAND', 'SEA', 'AIR'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('RECEIVED (WAREHOUSE)', 'ONBOARD', 'IN TRANSIT'),
      allowNull: false,
      defaultValue: 'RECEIVED (WAREHOUSE)',
    },
  },
  {
    sequelize,
    tableName: 'Shipment',
    timestamps: true,
  }
);
