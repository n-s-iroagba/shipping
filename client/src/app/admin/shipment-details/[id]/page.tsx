'use client'

import { useState } from "react";
import { Shipment } from "../../dashboard/page";
import { DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals";


const AdminShipmentDetails = ()=>{
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
      const [shipments, setShipments] = useState<Shipment[]>([]);

    const onEdit =(id:string)=>{

      console.log(id)
      setSelectedShipment(null)
    }
    const onDelete =(id:string)=>{

      console.log(id)
    }
    const updateStep =(id:string)=>{
      console.log(id)

    }
    const deleteStep =(id:string)=>{
      console.log(id)
    }
    const handleEdit = async (updatedShipment: Shipment) => {
      try {
        const response = await fetch(`/api/shipments/${updatedShipment.shipmentID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedShipment),
        });
  
        if (!response.ok) throw new Error("Failed to update shipment");
  
        setShipments(shipments.map(s => (s.shipmentID === updatedShipment.shipmentID ? updatedShipment : s))); // Update UI
        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating shipment:", error);
      }
    };
  
    // Delete Shipment
    const handleDelete = async () => {
      if (!selectedShipment) return;
  
      try {
        const response = await fetch(`/api/shipments/${selectedShipment.shipmentID}`, {
          method: "DELETE",
        });
  
        if (!response.ok) throw new Error("Failed to delete shipment");
  
        setShipments(shipments.filter(s => s.shipmentID !== selectedShipment.shipmentID)); // Remove from UI
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting shipment:", error);
      }
    };
    const shipmentDetails = {
        id:'1',
        shipmentID: "SHIP123456",
        date: "2024-12-29",
        senderName: "John Doe",
        sendingAddress: "Port of Los Angeles",
        destination: "Shanghai Port",
        recipientName: "Jane Smith",
        currentLocation: "Pacific Ocean",
        shipmentDescription: "A white Hyundai Sonata car",
        steps:[
          { id:'1',orderStage: "Shippedddddddddddddddddddddddddddddddddddddddddddddddddddd", processedStatus:'blocked' },
          { id:'1',orderStage: "Processed", processedStatus:'blocked' },
          { id:'1',orderStage: "Processed", processedStatus:'blocked' },
          { id:'1',orderStage: "Processed", processedStatus:'blocked' },
          { id:'1',orderStage: "Processed", processedStatus:'blocked' },
          { id:'1',orderStage: "Current Location", processedStatus:'blocked' },
        ]
      };
    return(
    <div className="bg-white text-black">
 <h3 className="font-bold mb-2 mt-3 text-center text-black">Shipment Details</h3>
      <div className="space-y-2 text-black">
        <p className="rounded border-b-4 p-2">
          <strong>Shipment ID:</strong> {shipmentDetails.shipmentID}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Date:</strong> {shipmentDetails.date}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Sender:</strong> {shipmentDetails.senderName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Sending Port:</strong> {shipmentDetails.sendingAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Delivery Address:</strong> {shipmentDetails.destination}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Recipient:</strong> {shipmentDetails.recipientName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Current Location:</strong> {shipmentDetails.currentLocation}
        </p>
        <div className="my-2">
        <button onClick={() => onEdit(shipmentDetails.id)} className="bg-red-500 text-white p-1 rounded">Edit Shipment</button>
      </div>
      <div className="my-2">
        <button onClick={() => onDelete(shipmentDetails.id)} className="bg-red-500 text-white p-1 rounded">Delete Shipment</button>
      </div>
      <h3 className="text-md font-semibold">Shipment Steps</h3>
      <button onClick={() => onEdit(shipmentDetails.id)} className="bg-red-500 text-white p-1 rounded">Add Step</button>
      <ul>
        {shipmentDetails.steps.map((step) => (
          <li key={step.id} className="flex justify-evenly items-center border-b p-1">
            <span className="w-[40%] min-h-[40px] break-words whitespace-normal">Stage: {step.orderStage}</span>
            <div className="flex flex-col">
            <span>Processed Status: {step.processedStatus}</span>
            <div>
           
              <button onClick={() => updateStep(step.id)} className="bg-yellow-500 text-white p-1 mx-2">Edit</button>
              <button onClick={() => deleteStep(step.id)} className="bg-red-500 text-white p-1">Delete</button>
            </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    {showEditModal && selectedShipment && <EditShipmentModal shipment={selectedShipment} onClose={() => setShowEditModal(false)} onEdit={handleEdit} />}
      {showDeleteModal && selectedShipment && <DeleteShipmentModal onClose={() => setShowDeleteModal(false)} onDelete={handleDelete} />}
    </div>
    )
}
export default AdminShipmentDetails