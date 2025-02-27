import { Request, Response } from "express";
import { ShipmentDetails } from "../models/ShipmentDetails";

export const createShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const shipment = await ShipmentDetails.create(req.body);
    res.status(201).json({ message: "Shipment details created", shipment });
  } catch (error) {
    res.status(500).json({ message: "Error creating shipment", error });
  }
};


export const editShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { shipmentDetailsId } = req.params;
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);

    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    await shipment.update(req.body);
    res.json({ message: "Shipment details updated", shipment });
  } catch (error) {
    res.status(500).json({ message: "Error updating shipment", error });
  }
};


export const deleteShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { shipmentDetailsId } = req.params;
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);

    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    await shipment.destroy();
    res.json({ message: "Shipment details deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shipment", error });
  }
};

export const fetchShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { shipmentDetailsId } = req.params;
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);

    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    res.json({ shipment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shipment", error });
  }
};
