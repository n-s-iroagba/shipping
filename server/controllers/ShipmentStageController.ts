import { Request, Response } from 'express';
import { ShippingStageService } from '../services/ShippingStageService';

import fs from 'fs';
import path from 'path';
export class ShippingStageController {
  private service: ShippingStageService;

  constructor() {
    this.service = new ShippingStageService();
  }

  public async bulkCreateStages(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    try {
      if (!req.body) {
        return res.status(400).json({ message: 'Stages array is required' });
      }

      const parsedStages = req.body.stages.map((stage: string) =>
        JSON.parse(stage)
      ); // stringified array of stage objects
      console.log(parsedStages);
      if (!Array.isArray(parsedStages)) {
        return res.status(400).json({ message: 'Stages should be an array' });
      }

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      const stagesData = parsedStages.map((stage: any, index: number) => {
        const fileKey = `supportingDocument_${index}`;
        const file = files?.[fileKey]?.[0];

        const fileBuffer = file ? fs.readFileSync(file.path) : null;

        if (file) fs.unlinkSync(file.path);

        return {
          ...stage,
          shipmentId: Number(id),
          supportingDocument: fileBuffer,
        };
      });

      const createdStages = await this.service.bulkCreate(stagesData);
      res.status(201).json(createdStages);
    } catch (error: any) {
      console.error('Bulk create error:', error);
      res.status(500).json({ error: error.message || 'Server error' });
    }
  }

  public async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const stages = await this.service.get(Number(id));
      res.json(stages);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  public async getStages(req: Request, res: Response): Promise<void> {
    const { shipmentId } = req.params;
    console.log('SHHHHHH', shipmentId);
    try {
      const { page = 1, limit = 10 } = req.query;
      const stages = await this.service.getPaginated(
        Number(page),
        Number(limit),
        shipmentId
      );
      res.json(stages);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  public async updateStage(req: Request, res: Response): Promise<void> {
    try {
      const stageId = req.params.id;
      const stageData = req.body;

      if (req.file) {
        stageData.supportingDocument = req.file.path;
      }

      const updatedStage = await this.service.update(stageId, stageData);
      console.log(updatedStage);
      res.json(updatedStage);
      
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  public async deleteStage(req: Request, res: Response): Promise<void> {
    try {
      const stageId = req.params.id;
      await this.service.delete(stageId);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
}
