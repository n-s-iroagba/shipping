import { Request, Response } from "express";
import { ShipmentDetails } from "../models/ShipmentDetails";
import { Step } from "../models/Step";

export const createShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  const { adminId } = req.params;

  const {
  senderName,
  sendingAddress,
  receivingAddress,
  recipientName,
  shipmentDescription,
  } = req.body;

  try {
    const  id = String( Math.random()*1000000000) + 'WPCFJJ'
   const shipment = await ShipmentDetails.create(
      {
        shipmentID: id,
        senderName,
        sendingAddress,
        receivingAddress,
        recipientName,
        shipmentDescription,
        adminId: Number(adminId),
      },
    );
    await Step.create({
      status:'Request to ship',
      processedStatus:'Processed',
      shipmentDetailsId:shipment.id
    })
    await Step.create({
      status:'Onboarded',
      processedStatus:'Processed',
      shipmentDetailsId:shipment.id

    })

    res.status(201).json({ message: "Shipment details created", shipment });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating shipment", error });
  }
};


export const editShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id} = req.params;
    const shipment = await ShipmentDetails.findByPk(id);

    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    await shipment.update(req.body);
    res.json({ message: "Shipment details updated", shipment });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error updating shipment", error });
  }
};


export const deleteShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const shipment = await ShipmentDetails.findByPk(id);

    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    await shipment.destroy();
    res.json({ message: "Shipment details deleted" });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error deleting shipment", error });
  }
};

export const fetchShipmentDetails = async (req: Request, res: Response):Promise<any> => {

  console.log('helloo')
  try {
    const { id } = req.params;
    const shipment = await ShipmentDetails.findByPk(id, {
      include: [
        {
          model: Step, // Include related steps
          as: "steps", // Ensure this matches your association alias
        },
      ],
    })

    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    res.status(200).json(shipment );
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching shipment", error });
  }
};

export const fetchShipmentTrackingDetails = async (req: Request, res: Response): Promise<void> => {
  console.log("Fetching shipment details...");

  try {
    const { trackingID } = req.params;

    const shipment = await ShipmentDetails.findOne({
      where: { shipmentID: trackingID },
      include: [
        {
          model: Step,
          as: "steps", // Ensure this alias matches your Sequelize association
        },
      ],
    });

    if (!shipment) {
      throw  Error('shipment not found')
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error("Error fetching shipment:", error);
    res.status(500).json({ message: "Error fetching shipment", error });
  }
};

export const fetchAllAdminShipmentDetails = async (req: Request, res: Response):Promise<any> => {
  try {
    const { adminId } = req.params;
    const shipments = await ShipmentDetails.findAll({
      where: {
        adminId,
    }});
    res.json( shipments );
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching shipment", error });
  }
};