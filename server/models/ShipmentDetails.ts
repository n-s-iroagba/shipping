import { DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User";

export class ShipmentDetails extends Model {
  public id!: number;
  public sender!: string;
  public receiver!: string;
  public address!: string;
  public userd1!: ForeignKey<User['id']>;
}

ShipmentDetails.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sender: { type: DataTypes.STRING, allowNull: false },
    receiver: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    userd1: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "ShipmentDetails" }
);
