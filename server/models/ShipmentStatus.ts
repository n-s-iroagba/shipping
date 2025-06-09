import { Model, DataTypes, type ForeignKey, type Optional, type NonAttribute } from "sequelize"
import { sequelize } from "../config/database"
import { ShipmentDetails } from "./ShipmentDetails"

// Main Attributes Interface
export interface ShipmentStatusAttributes {
  id: string
  shipmentDetailsId: ForeignKey<ShipmentDetails["id"]>
  shipmentDetails?: NonAttribute<ShipmentDetails>
  title: string
  location: string
  carrierNote: string
  dateAndTime: Date
  percentageNote?: string
  feeInDollars?: number | null
  paymentStatus: 'NO_PAYMENT_REQUIRED'|"UNPAID" | "PENDING" | "PAID"
  amountPaid?: number
  paymentDate?: Date
  supportingDocument?: Buffer
  paymentReceipt?:  Buffer
  longitude: number
  latitude: number
  createdAt: Date
  updatedAt: Date
}

// Creation Attributes Interface
export interface ShipmentStatusCreationAttributes
  extends Optional<
    ShipmentStatusAttributes,
    "id" | "amountPaid" | "feeInDollars" | "paymentReceipt" | "paymentDate" | "percentageNote" | "supportingDocument"|'createdAt'|'updatedAt'
  > {}

// Sequelize Model Class
export class ShipmentStatus
  extends Model<ShipmentStatusAttributes, ShipmentStatusCreationAttributes>
  implements ShipmentStatusAttributes
{
  id!: string
  shipmentDetailsId!: ForeignKey<ShipmentDetails["id"]>
  carrierNote!: string
  dateAndTime!: Date
  feeInDollars?: number | null
  paymentReceipt?: Buffer
  amountPaid?: number
  paymentDate?: Date
  percentageNote?: string
  paymentStatus!: 'NO_PAYMENT_REQUIRED'|"UNPAID" | "PENDING" | "PAID"
  shipmentDetails?: NonAttribute<ShipmentDetails>
  title!: string
  location!: string
  supportingDocument?: Buffer
  longitude!: number
  latitude!: number
  createdAt!: Date
  updatedAt!: Date
}

ShipmentStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipmentDetailsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ShipmentDetails",
        key: "id",
      },
    },
    carrierNote: DataTypes.TEXT,
    dateAndTime: DataTypes.DATE,
    feeInDollars: DataTypes.DECIMAL(10, 2),
    paymentReceipt: DataTypes.STRING,
    amountPaid: DataTypes.DECIMAL(10, 2),
    paymentDate: DataTypes.DATE,
    percentageNote: DataTypes.STRING,
    supportingDocument: DataTypes.BLOB('long'),
    title: DataTypes.STRING,
    location: DataTypes.STRING,
paymentStatus: DataTypes.ENUM("PAID", "UNPAID", "PENDING", "NO_PAYMENT_REQUIRED"),

    longitude: DataTypes.DECIMAL(10, 6),
    latitude: DataTypes.DECIMAL(10, 6),
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  },
  {
    sequelize,
    modelName: "ShipmentStatus",
  },
)

// Set up associations
ShipmentDetails.hasMany(ShipmentStatus, {
  foreignKey: "shipmentDetailsId",
  as: "shipmentStatus",
})
ShipmentStatus.belongsTo(ShipmentDetails, {
  foreignKey: "shipmentDetailsId",
  as: "shipmentDetails",
})