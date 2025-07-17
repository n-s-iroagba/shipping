import { Stage, StageCreationDto } from "./stage.types";

export type FreightType = "LAND" | "AIR" | "SEA";
export type ShipmentStatus = "RECEIVED (WAREHOUSE)" | "ONBOARD" | "IN TRANSIT";

export interface Shipment {
  id: number;
  shipmentID: string;
  adminId: number;
  senderName: string;
  origin: string;
  destination: string;
  recipientName: string;
  expectedTimeOfArrival: Date;
  status: ShipmentStatus;
  freightType: FreightType;
  createdAt: Date;
  updatedAt: Date;
  shipmentDescription: string;
  pickupPoint: string;
  weight: number;
  dimensionInInches: string;
  receipientEmail: string;
  shippingStages: Stage[];
}

export type CreateShipmentDto = Omit<
  Shipment,
  "id" | "shipmentID" | "adminId" | "createdAt" | "updatedAt" | "shippingStages"
> & { shippingStages: StageCreationDto[] };
