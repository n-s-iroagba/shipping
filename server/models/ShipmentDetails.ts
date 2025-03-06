import { Model, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes } from "sequelize";
import { User } from "./User"; // Ensure correct import
import { ShipmentStatus } from "./ShipmentStatus"; // Import related ShipmentStatus model
import { sequelize } from "../config/database";

export class ShipmentDetails extends Model<
  InferAttributes<ShipmentDetails>,
  InferCreationAttributes<ShipmentDetails>
> {
  declare id?: string;
  declare shipmentID: string;
  declare senderName: string;
  declare sendingAddress: string;
  declare receivingAddress: string;
  declare recipientName: string;
  declare shipmentDescription: string;
  declare adminId: ForeignKey<User["id"]>;

  // One ShipmentDetails has many ShipmentStatus
  declare shipmentStatus?: ShipmentStatus[];
}

ShipmentDetails.init(
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
    sendingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receivingAddress: {
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
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "ShipmentDetails",
    timestamps: true,
  }
);
ShipmentDetails.hasMany(ShipmentStatus, { foreignKey: "shipmentDetailsId", as: "shipmentStatus" });
ShipmentStatus.belongsTo(ShipmentDetails, { foreignKey: "shipmentDetailsId", as: "shipment" });



