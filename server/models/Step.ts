import { DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ShipmentDetails } from "./ShipmentDetails";

export class Step extends Model {
  public id!: number;
  public status!: string;
  public processedStatus!: string;
  public shipmentDetailsId!: ForeignKey<ShipmentDetails["id"]>;
}

Step.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, allowNull: false },
    processedStatus: { type: DataTypes.STRING, allowNull: false },
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
  { sequelize, modelName: "Step" }
);


