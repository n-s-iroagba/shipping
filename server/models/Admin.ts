

import { DataTypes, Model, type Optional } from 'sequelize'
import {sequelize} from '../config/database'


export interface AuthUser {
  id: number
  username: string
  email: string
}

interface AdminAttributes {
  id: number
  username: string
  email: string
  password: string
  isEmailVerified: boolean
  verificationCode?: string | null
  verificationToken?: string | null
  passwordResetToken?: string | null
  refreshToken?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface AdminCreationAttributes
  extends Optional<
    AdminAttributes,
    | 'id'
    | 'isEmailVerified'
    | 'verificationCode'
    | 'verificationToken'
    | 'passwordResetToken'
    | 'createdAt'
    | 'refreshToken'
    | 'updatedAt'
    | 'password'
  > { }

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number
  public username!: string
  public email!: string
  public password!: string
  public isEmailVerified!: boolean
  public verificationToken!: string | null
  public refreshToken?: string | null
  public verificationCode!: string | null
  public passwordResetToken!: string | null


  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date


}
Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    passwordResetToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Admins',
    paranoid: true, // Enable soft deletes
  }
)

export default Admin