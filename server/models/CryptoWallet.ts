import { Model, DataTypes, ForeignKey, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define which fields are required when creating a new CryptoWallet
interface CryptoWalletAttributes {
  id: number;
  adminId: number;
  currency: string;
  walletAddress: string;
}

interface CryptoWalletCreationAttributes
  extends Optional<CryptoWalletAttributes, 'id'> {}

export class CryptoWallet
  extends Model<CryptoWalletAttributes, CryptoWalletCreationAttributes>
  implements CryptoWalletAttributes
{
  public id!: number;
  public adminId!: number;
  public currency!: string;
  public walletAddress!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CryptoWallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CryptoWallet',
    tableName: 'CryptoWallets',
    timestamps: true,
  }
);
