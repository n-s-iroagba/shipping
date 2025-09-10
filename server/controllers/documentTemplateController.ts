// controllers/DocumentTemplateController.ts
import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors/errors';
import { DocumentTemplateService } from '../services/documentTemplateService';

const templateService = new DocumentTemplateService();

export class DocumentTemplateController {
  async createTemplate(req: Request, res: Response) {
    const adminId = req.params.adminId
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const { name, description } = req.body;
      const template = await templateService.createTemplate(
        Number(adminId),
        name,
        req.file,
        description
      );

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to create template',
        });
      }
    }
  }

  async getAllTemplates(req: Request, res: Response) {
    const adminId = req.params.adminId
    try {
      const templates = await templateService.getAllTemplates(Number(adminId));
      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch templates',
      });
    }
  }

  async getTemplateById(req: Request, res: Response) {
    try {
      const template = await templateService.getTemplateById(
        Number(req.params.id)
      );
      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch template',
        });
      }
    }
  }

  async updateTemplate(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const template = await templateService.updateTemplate(
        Number(req.params.id),
        {
          name,
          description,
        }
      );

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to update template',
        });
      }
    }
  }



  async deleteTemplate(req: Request, res: Response) {
    try {
      await templateService.deleteTemplate(Number(req.params.id));
      res.json({
        success: true,
        message: 'Template deleted successfully',
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete template',
        });
      }
    }
  }
}
