'use client'

import { useState } from "react";

import { DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals";
import EditStepModal, { AddStepModal, DeleteStepModal } from "@/components/StepModal";


type Step ={
  id: string,
  orderStage: string,
  processedStatus: string
}
const AdminShipmentDetails = ()=>{
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);
    const [selectedStep, setSelectedStep] = useState <Step|null>(null)
    const [showEditStepModal, setShowEditStepModal] = useState(false)
    const [showDeleteStepModal, setShowDeleteStepModal] = useState(false)
    const [showAddStepModal, setShowAddStepModal] = useState(false)



  
  
    
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
        <button onClick={() => {
          setShowEditModal(true);

        }} className="bg-red-500 text-white p-1 rounded">Edit Shipment</button>
      </div>
      <div className="my-2">
        <button onClick={() =>{
          setShowDeleteModal(true);
        }} className="bg-red-500 text-white p-1 rounded">Delete Shipment</button>
      </div>
      <h3 className="text-md font-semibold">Shipment Steps</h3>
      <button onClick={() => {
        setShowAddStepModal(true)
      }} className="bg-red-500 text-white p-1 rounded">Add Step</button>
      <ul>
        {shipmentDetails.steps.map((step) => (
          <>
          <li key={step.id} className="flex justify-evenly items-center border-b p-1">
            <span className="w-[40%] min-h-[40px] break-words whitespace-normal">Stage: {step.orderStage}</span>
            <div className="flex flex-col">
            <span>Processed Status: {step.processedStatus}</span>
            <div>
           
              <button onClick={() => {
                setShowEditStepModal(true);
                setSelectedStep(step);
              }} className="bg-yellow-500 text-white p-1 mx-2">Edit</button>
              <button onClick={() => {
                setShowDeleteStepModal(true);
                setSelectedStep(step);
              }} className="bg-red-500 text-white p-1">Delete</button>
            </div>
            </div>
          </li>
     
        </>
        ))}
      </ul>
    </div>
    {showEditModal &&  <EditShipmentModal shipment={shipmentDetails} onClose={() => setShowEditModal(false)}  />}
      {showDeleteModal && <DeleteShipmentModal shipment={shipmentDetails}  onClose={() => setShowDeleteModal(false)}  />}
        {showAddStepModal && <AddStepModal onClose={()=>setShowAddStepModal(false)} />}
        {showEditStepModal && selectedStep && <EditStepModal step={selectedStep} onClose={()=>setShowEditStepModal(false)} />}
        {showDeleteStepModal && selectedStep && <DeleteStepModal step={selectedStep}  onClose={()=>setShowDeleteStepModal(false)} />}
     
    </div>
    )
}
export default AdminShipmentDetails