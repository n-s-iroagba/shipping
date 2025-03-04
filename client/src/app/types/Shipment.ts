import { Step } from "./Steps";

export interface Shipment {
  id: string;
  shipmentID: string;
  senderName: string;
  sendingAddress: string;
  receivingAddress: string;
  recipientName: string;
  currentLocation: string;
  shipmentDescription: string;
  steps: Step[]
}