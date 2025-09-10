import { Shipment } from '../models/Shipment';
import jwt  from 'jsonwebtoken';
import { ShippingStage } from '../models/ShippingStage';

import { sequelize } from '../config/database';
import { NotFoundError } from '../errors/errors';
import { generateTrackingId } from '../utils/generateTrackingId';
import { CodeHelper } from '../utils/codeHelper';
import { CryptoUtil } from '../utils/crpto.util';
import { Payment } from '../models'
import EmailService  from './EmailService';

export class ShipmentService {
 async createWithStages(shipmentData: any, stagesData: any[]) {
  return sequelize.transaction(async (transaction) => {
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
      stagesData.map((stage) => ({
        ...stage,
        shipmentId: shipment.id,
      })),
      { transaction }
    );

    // ✅ return a proper object
    return shipment
    
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
        include: [
          {
            model: Payment,
            as:'payments'
          },
        ],
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

    async initiateSensitiveTracking  (shipmentId:string){
      
      const shipment  =await Shipment.findByPk(shipmentId)
      if (!shipment){
          throw new Error('Shipment not found.')
      }
      console.log('email',shipment.receipientEmail)
      const viewToken =  CryptoUtil.generateSecureToken()
      const viewCode = CodeHelper.generateVerificationCode(6)
      shipment.viewToken = viewToken.token
      shipment.viewCode = viewCode
      await shipment.save()
  
     await EmailService.sendInitialiseSensitiveTrackingEmail(shipment,viewCode)
     return viewToken.token
  
  }
  
  async issueSenstiveViewToken(data:{token:string,code:string}){
    const shipment =await Shipment.findOne({where:{
      viewToken:data.token
    }})
    if(!shipment){
      throw new Error('shipment not found')
    }
    if(shipment.viewCode !== data.code){
      throw new Error('Unauthorised to view shipment')
    }
    return jwt.sign({name:shipment.recipientName},'1h')
  }

  private getCurrentStatus(stages: ShippingStage[]) {
    if (!stages || stages.length === 0) return 'PENDING';
    return stages[stages.length - 1].paymentStatus;
  }
}
