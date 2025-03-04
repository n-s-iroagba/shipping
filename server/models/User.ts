import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ShipmentDetails } from "./ShipmentDetails";

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public isVerified!: boolean;
  public verificationCode!: string | null;
  public verificationToken!: string | null;

}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verificationCode: { type: DataTypes.STRING, allowNull: true },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "User" }
);

// Define relationships
User.hasMany(ShipmentDetails, { foreignKey: "adminId", as: "shipments" });
