import { Shipment } from '../models/Shipment';
import { ShippingStage } from '../models/ShippingStage';

import { sequelize } from '../config/database';
import { NotFoundError } from '../errors/errors';
import { generateTrackingId } from '../utils/generateTrackingId';

export class ShipmentService {
  async createWithStages(shipmentData: any, stagesData: any[]) {
    return sequelize.transaction(async transaction => {
      // Generate tracking ID
      const trackingId = generateTrackingId();

      // Create shipment
      const shipment = await Shipment.create(
        {
          ...shipmentData,
          shipmentID: trackingId,
        },
        { transaction }
      );

      // Create stages with shipment ID
      const stages = await ShippingStage.bulkCreate(
        stagesData.map(stage => ({
          ...stage,
          shipmentId: shipment.id,
        })),
        { transaction }
      );

      shipment;
    });
  }

  async getAll(adminId: string) {
    return await Shipment.findAll({
      where: { adminId },
      include: [
        {
          model: ShippingStage,
          as: 'shippingStages',
        },
      ],
    });
  }

  async getById(id: number) {
    const shipment = await Shipment.findByPk(id, {
      include: [
        {
          model: ShippingStage,
          as: 'shippingStages',
        },
      ],
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return shipment;
  }

  async update(id: number, updates: Partial<Shipment>) {
    const shipment = await this.getById(id);
    return shipment.update(updates);
  }

  async delete(id: number) {
    const shipment = await this.getById(id);
    await shipment.destroy();
    return { message: 'Shipment deleted successfully' };
  }

  async trackShipment(trackingId: string) {
    const shipment = await Shipment.findOne({
      where: { shipmentID: trackingId },
      include: [
        {
          model: ShippingStage,
          as: 'shippingStages',
          order: [['dateAndTime', 'DESC']],
        },
      ],
    });

    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return shipment;
  }

  async getPublicTrackingInfo(trackingId: string) {
    const shipment = await this.trackShipment(trackingId);

    // Filter sensitive data
    return {
      id: shipment.id,
      shipmentID: shipment.shipmentID,
      senderName: shipment.senderName,
      receivingAddress: shipment.destination,
      recipientName: shipment.recipientName,
      status: shipment.status,
      shippingStages: shipment.shippingStages?.map((stage: ShippingStage) => ({
        title: stage.title,
        location: stage.location,
        dateAndTime: stage.dateAndTime,
        carriernote: stage.paymentStatus,
        longitude: stage.longitude,
        latitude: stage.latitude,
      })),
    };
  }

  async getSensitiveTrackingInfo(trackingId: string) {
    const shipment = await this.trackShipment(trackingId);
    return shipment;
  }

  private getCurrentStatus(stages: ShippingStage[]) {
    if (!stages || stages.length === 0) return 'PENDING';
    return stages[stages.length - 1].paymentStatus;
  }
}
