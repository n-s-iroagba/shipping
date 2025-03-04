import { Step } from "./Steps";

export interface Shipment {
  id: string;
  shipmentID: string;
  senderName: string;
  sendingAddress: string;
  receivingAddress: string;
  recipientName: string;
  shipmentDescription: string;
  adminId:string;
  steps: Step[]
}