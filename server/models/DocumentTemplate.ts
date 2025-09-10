// models/DocumentTemplate.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import path from 'path';
import fs from 'fs';

export interface DocumentTemplateAttributes {
  id: number;
  adminId: number;
  name: string;
  description?: string;
  file: Buffer;
 
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTemplateCreationAttributes
  extends Omit<DocumentTemplateAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class DocumentTemplate
  extends Model<DocumentTemplateAttributes, DocumentTemplateCreationAttributes>
  implements DocumentTemplateAttributes
{
  public id!: number;
  public adminId!: number;
  public name!: string;
  public description?: string;
  public file!: Buffer;
  createdAt!: Date;
  updatedAt!: Date

  public readonly url!: string;

}

DocumentTemplate.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'document_templates',
 
    },

);
