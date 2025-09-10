import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { sequelize } from '../config/database';
import { ShippingStage } from './ShippingStage';

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
  declare status: ShipmentStatus;
  declare dimensionInInches: string;
  declare expectedTimeOfArrival: Date;
  declare receipientEmail: string;
  declare weight: number;
  declare viewCode:string
   declare viewToken:string
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
    viewCode:{
      type:DataTypes.STRING
    },
    viewToken:{
      type:DataTypes.STRING
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
Shipment.hasMany(ShippingStage, {
  foreignKey: 'shipmentId',
  as: 'shippingStages',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// ShippingStage associations
ShippingStage.belongsTo(Shipment, {
  foreignKey: 'shipmentId',
  as: 'shipment',
});