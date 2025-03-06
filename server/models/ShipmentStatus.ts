import { DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ShipmentDetails } from "./ShipmentDetails";

export class ShipmentStatus extends Model {
  public id!: number;
  public status!: string;
  public shipmentStatus!: string;
  public date!:string;
  public shipmentDetailsId!: ForeignKey<ShipmentDetails["id"]>;
}

ShipmentStatus.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, allowNull: false },
    shipmentStatus: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    shipmentDetailsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ShipmentDetails", // Ensure this matches the actual table name
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, modelName: "ShipmentStatus" }
);


