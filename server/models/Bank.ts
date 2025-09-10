import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../config/database';
import Admin from './Admin';

class BankDetails extends Model {
  declare id: number;
  declare adminId:number
  declare bankName: string;
  declare accountName: string;
  declare accountNumber: string;
  declare swiftCode: string;
  declare routingNumber: string;
}

BankDetails.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    adminId: { type: DataTypes.INTEGER, allowNull:false},
    bankName: { type: DataTypes.STRING, allowNull: false },
    accountName: { type: DataTypes.STRING, allowNull: false },
    accountNumber: { type: DataTypes.STRING, allowNull: false },
    swiftCode: { type: DataTypes.STRING, allowNull: true },
    routingNumber: { type: DataTypes.STRING, allowNull: true }
  },
  {
    sequelize,
    tableName: 'bank_details',
    timestamps: true
  }
);

BankDetails.belongsTo(Admin,{
  foreignKey:'adminId',
  as:'bankOwner'
})
Admin.hasOne(BankDetails,{
  as:'bank',
  foreignKey:'adminId'
})

export default BankDetails;
