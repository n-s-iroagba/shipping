import { Request, Response } from "express";
import { Step } from "../models/Step";
import { ShipmentDetails } from "../models/ShipmentDetails";


export const createStep = async (req: Request, res: Response):Promise<any> => {
  console.log('aaaaaaa')
  try {
    const { orderStage, processedStatus } = req.body;
    const { shipmentDetailsId } = req.params; // Get from URL params

    // Check if shipmentDetails exists
    const shipment = await ShipmentDetails.findByPk(shipmentDetailsId);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment details not found" });
    }

    // Create the Step
    const step = await Step.create({ orderStage, processedStatus, shipmentDetailsId });
    
    return res.status(201).json(step);
  } catch (error) {
    console.error("Error creating step:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateStep = async (req: Request, res: Response):Promise<any> => {
 
  try {
    const { id } = req.params; // Step ID
    const { orderStage, processedStatus } = req.body;

    const step = await Step.findByPk(id);
    if (!step) {
      return res.status(404).json({ message: "Step not found" });
    }

    // Update fields
    step.orderStage = orderStage || step.orderStage;
    step.processedStatus = processedStatus || step.processedStatus;
    await step.save();

    return res.status(200).json(step);
  } catch (error) {
    console.error("Error updating step:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a step
export const deleteStep = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;

    const step = await Step.findByPk(id);
    if (!step) {
      return res.status(404).json({ message: "Step not found" });
    }

    await step.destroy();
    return res.status(200).json({ message: "Step deleted successfully" });
  } catch (error) {
    console.error("Error deleting step:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
