import { Request, Response } from "express";
import { ShipmentStatus } from "../models/ShipmentStatus";
import { ShipmentDetails } from "../models/ShipmentDetails";


export const createShipmentStatus = async (req: Request, res: Response):Promise<any> => {
  console.log('aaaaaaa')
  try {
    const { status, shipmentStatus,date } = req.body;
    const { shipmentDetailsId } = req.params; 

    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment details not found" });
    }

  
    
    const statusInUse = await ShipmentStatus.create({ status, shipmentStatus, shipmentDetailsId,date });
    
    return res.status(201).json(statusInUse);
  } catch (error) {
    console.error("Error creating statusInUse:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateShipmentStatus = async (req: Request, res: Response):Promise<any> => {
 
  try {
    const { id } = req.params; 
    const { status, shipmentStatus,date } = req.body;

    const statusInUse = await ShipmentStatus.findByPk(id);
    if (!statusInUse) {
      return res.status(404).json({ message: "ShipmentStatus not found" });
    }


    statusInUse.status = status || statusInUse.status;
    statusInUse.shipmentStatus = shipmentStatus || statusInUse.shipmentStatus;
    statusInUse.date = date || statusInUse.date;
    await statusInUse.save();

    return res.status(200).json(statusInUse);
  } catch (error) {
    console.error("Error updating statusInUse:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteShipmentStatus = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;

    const statusInUse = await ShipmentStatus.findByPk(id);
    if (!statusInUse) {
      return res.status(404).json({ message: "ShipmentStatus not found" });
    }

    await statusInUse.destroy();
    return res.status(200).json({ message: "ShipmentStatus deleted successfully" });
  } catch (error) {
    console.error("Error deleting statusInUse:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
