// services/DocumentTemplateService.ts
import { NotFoundError } from '../errors/errors';
import { DocumentTemplate } from '../models/DocumentTemplate';
import fs from 'fs';

export class DocumentTemplateService {
  // async createTemplate(
  //   name: string,
  //   file: Express.Multer.File,
  //   description?: string
  // ): Promise<DocumentTemplate> {
  //   return DocumentTemplate.create({
  //     name,
  //     description,
  //     filePath: file.path,
  //     fileType: file.mimetype,
  //     fileSize: file.size,
  //   });
  // }

  // async getAllTemplates(): Promise<DocumentTemplate[]> {
  //   return DocumentTemplate.findAll();
  // }

  // async getTemplateById(id: number): Promise<DocumentTemplate> {
  //   const template = await DocumentTemplate.findByPk(id);
  //   if (!template) {
  //     throw new NotFoundError('Template not found');
  //   }
  //   return template;
  // }

  // async updateTemplate(
  //   id: number,
  //   updates: Partial<{
  //     name: string;
  //     description: string;
  //   }>
  // ): Promise<DocumentTemplate> {
  //   const template = await this.getTemplateById(id);
  //   return template.update(updates);
  // }

  // async deleteTemplate(id: number): Promise<void> {
  //   const template = await this.getTemplateById(id);
  //   await template.destroy();
  // }

  // async updateTemplateFile(
  //   id: number,
  //   file: Express.Multer.File
  // ): Promise<DocumentTemplate> {
  //   const template = await this.getTemplateById(id);

  //   // Delete old file
  //   if (fs.existsSync(template.filePath)) {
  //     fs.unlinkSync(template.filePath);
  //   }

  //   return template.update({
  //     filePath: file.path,
  //     fileType: file.mimetype,
  //     fileSize: file.size,
  //   });
  // }
}
