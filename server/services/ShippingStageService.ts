import { ShippingStage } from '../models/ShippingStage';

export class ShippingStageService {
  public async bulkCreate(stagesData: any[]): Promise<ShippingStage[]> {
    return await ShippingStage.bulkCreate(stagesData);
  }

  public async get(id: number) {
    return await ShippingStage.findByPk(id);
  }

  public async getPaginated(
    page: number,
    limit: number,
    shipmentId: string
  ): Promise<ShippingStage[]> {
    const offset = (page - 1) * limit;
    const whereClause = { shipmentId };

    const stages = await ShippingStage.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['dateAndTime', 'ASC']],
    });

    return stages;
  }

  public async update(stageId: string, stageData: any): Promise<ShippingStage> {
    const stage = await ShippingStage.findByPk(stageId);
    if (!stage) {
      throw new Error('Stage not found');
    }

    return await stage.update({ ...stageData });
  }

  public async delete(stageId: string): Promise<void> {
    const stage = await ShippingStage.findByPk(stageId);
    if (!stage) {
      throw new Error('Stage not found');
    }

    await stage.destroy();
  }
}
