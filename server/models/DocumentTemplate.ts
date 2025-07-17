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
  filePath: string;
  fileType: string;
  fileSize: number;
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
  public filePath!: string;
  public fileType!: string;
  public fileSize!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly url!: string;

  // Virtual getter for file URL
  public getUrl(): string {
    return `/uploads/templates/${path.basename(this.filePath)}`;
  }
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
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
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
    hooks: {
      beforeDestroy: async (template: DocumentTemplate) => {
        // Delete the file when template is deleted
        if (fs.existsSync(template.filePath)) {
          fs.unlinkSync(template.filePath);
        }
      },
    },
  }
);
