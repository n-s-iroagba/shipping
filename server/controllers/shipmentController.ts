import { Request, Response } from 'express';
import { NotFoundError } from '../errors/errors';
import { ShipmentService } from '../services/shipmentService';
import { ShippingStageService } from '../services/ShippingStageService';
import fs from 'fs';
const service = new ShipmentService();

export class ShipmentController {
  async createWithStages(req: Request, res: Response): Promise<void> {
    const { adminId } = req.params;
    try {
      const { shippingStages, ...rest } = req.body;
      console.log('rest is', rest);
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      const stagesData = shippingStages.map((stage: any, index: number) => {
        const fileKey = `supportingDocument_${index}`;
        const file = files?.[fileKey]?.[0];

        const fileBuffer = file ? fs.readFileSync(file.path) : null;

        if (file) fs.unlinkSync(file.path);

        return {
          ...stage,
          supportingDocument: fileBuffer,
        };
      });
      const shipment = await service.createWithStages(
        { ...rest, adminId },
        stagesData
      );

      res.status(201).json(shipment);
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ error: 'Failed to create shipment' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { adminId } = req.params;
    try {
      const shipments = await service.getAll(adminId);

      res.json(shipments);
      return;
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipments' });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const shipment = await service.getById(Number(req.params.id));
      console.log('shipment', shipment);
      return res.status(200).json(shipment);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ error: 'Failed to fetch shipment' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updatedShipment = await service.update(
        Number(req.params.id),
        req.body
      );
      res.json(updatedShipment);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ error: 'Failed to update shipment' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await service.delete(Number(req.params.id));
      res.json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ error: 'Failed to delete shipment' });
      }
    }
  }

  async trackPublic(req: Request, res: Response): Promise<void> {
    try {
      const trackingInfo = await service.getPublicTrackingInfo(
        req.params.trackingId
      );
      res.json(trackingInfo);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ error: 'Failed to track shipment' });
      }
    }
  }

  async trackSensitive(req: Request, res: Response): Promise<void> {
    try {
      const trackingInfo = await service.getSensitiveTrackingInfo(
        req.params.trackingId
      );
      res.json(trackingInfo);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ error: 'Failed to track shipment' });
      }
    }
  }
}
