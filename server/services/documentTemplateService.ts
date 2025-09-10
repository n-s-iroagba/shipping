// services/DocumentTemplateService.ts
import { NotFoundError } from '../errors/errors';
import { DocumentTemplate } from '../models/DocumentTemplate';

export class DocumentTemplateService {
  async createTemplate(
    adminId:number,
    name: string,
    file: any,
    description?: string
  ): Promise<DocumentTemplate> {
    return DocumentTemplate.create({
      adminId,
      name,
      description,
      file: file,
    });
  }

  async getAllTemplates(adminId:number): Promise<DocumentTemplate[]> {
    return DocumentTemplate.findAll({where:{adminId}});
  }

  async getTemplateById(id: number): Promise<DocumentTemplate> {
    const template = await DocumentTemplate.findByPk(id);
    if (!template) {
      throw new NotFoundError('Template not found');
    }
    return template;
  }

  async updateTemplate(
    id: number,
    updates: Partial<{
      name: string;
      description: string;
    }>
  ): Promise<DocumentTemplate> {
    const template = await this.getTemplateById(id);
    return template.update(updates);
  }

  async deleteTemplate(id: number): Promise<void> {
    const template = await this.getTemplateById(id);
    await template.destroy();
  }


}
