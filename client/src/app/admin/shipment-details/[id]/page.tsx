'use client'
import { useEffect, useState } from "react";
import { DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals";
import EditStepModal, { AddStepModal, DeleteStepModal } from "@/components/StepModal";
import { useParams } from "next/navigation";
import { Step } from "@/app/types/Steps";
import { Shipment } from "@/app/types/Shipment";
import { shipmentUrl } from "@/data/urls";


const AdminShipmentDetails = ()=>{
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);
    const [selectedStep, setSelectedStep] = useState <Step|null>(null)
    const [showEditStepModal, setShowEditStepModal] = useState(false)
    const [showDeleteStepModal, setShowDeleteStepModal] = useState(false)
    const [showAddStepModal, setShowAddStepModal] = useState(false)
    const params = useParams();
    const shipmentId = params.id;;

useEffect(() => {
      if (!shipmentId) {
        return;
}
      
const fetchShipmentDetails = async () => {
  try {
    const response = await fetch(`${shipmentUrl}/${shipmentId}`);

    if (!response.ok) throw new Error("Failed to fetch shipment details");

    const data = await response.json();
    console.log("Fetched Shipment Details:", data); 

    setShipmentDetails(data);
  } catch (error) {
    alert("An error occurred, try again later");
    console.error("Fetch Error:", error);
  }
};  
      fetchShipmentDetails();
    }, [shipmentId]);
  
  // get the shipmentDetails.id from the url and write a useEffect hook to query the server and fetch the user details based off the
  if (!shipmentDetails) return <p>Loading shipment details...</p>;
    

    return(
    <div className="bg-white text-black">
      <h2 className="font-bold mb-2 mt-3 text-center text-black">Shipment Details</h2>
      <div className="space-y-2 text-black">
        <p className="rounded border-b-4 p-2">
          <strong>Shipment ID:</strong> {shipmentDetails.shipmentID}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Sender:</strong> {shipmentDetails.senderName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Sending Port:</strong> {shipmentDetails.sendingAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Delivery Address:</strong> {shipmentDetails.receivingAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Recipient:</strong> {shipmentDetails.recipientName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Description:</strong> {shipmentDetails.shipmentDescription}
        </p>
     
        <div className="flex justify-evenly">
        <div className="my-2 ">
        <button onClick={() => {
          setShowEditModal(true);

        }} className="bg-blue-500 text-white p-1 rounded">Edit Shipment</button>
      </div>
      <div className="my-2">
        <button onClick={() =>{
          setShowDeleteModal(true);
        }} className="bg-red-500 text-white p-1 rounded">Delete Shipment</button>
      </div>
      </div>
      <p className="rounded border-b-4 border-goldenrod p-2"></p>
      <h2 className="text-md font-semibold text-center">Shipment Steps</h2>
     
      <div className="flex justify-center">
      <button onClick={() => {
        setShowAddStepModal(true)
      }} className="text-white p-1 rounded bg-goldenrod">Add Step</button>
        </div>
      <ul>
    
        {shipmentDetails?.steps?.map((step:Step) => (
          <>
          <li key={step.id} className="flex justify-evenly border-b p-1">

          <div className="flex flex-col w-[60%] justify-between ">
            <h4 className="text-center font-bold">Status: </h4>
            <span className="min-h-[40px] break-words whitespace-normal text-black">{step.status}</span>
            <div className="flex justify-center">
            <button onClick={() => {
                setShowEditStepModal(true);
                setSelectedStep(step);
              }} className="bg-yellow-500 w-[10rem] text-white p-1 mx-2">Edit</button>
            </div>
            </div>


          <div className="flex flex-col justify-start">
            <h4 className="text-center font-bold">Processed Status: </h4>
            <span className="min-h-[40px] break-words whitespace-normal">{step.processedStatus}</span>
            <div className="flex justify-center">
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
    {showAddStepModal && <AddStepModal onClose={() => setShowAddStepModal(false)} shipmentId={Number(shipmentDetails.id)} />}
    {showEditStepModal && selectedStep && <EditStepModal step={selectedStep} onClose={()=>setShowEditStepModal(false)} />}
    {showDeleteStepModal && selectedStep && <DeleteStepModal step={selectedStep}  onClose={()=>setShowDeleteStepModal(false)} />}
     
    </div>
    )
}
export default AdminShipmentDetails