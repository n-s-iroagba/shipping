"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { trackShipmentUrl } from "@/data/urls";
import { Shipment } from "@/app/types/Shipment";

const ShipmentTrackingDashboard: React.FC = () => {
   const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);

 const params = useParams();
    const trackingId = params.trackingId;


    useEffect(() => {
      if (!trackingId) {
        return;
}
      
const fetchShipmentDetails = async () => {
  try {
    const response = await fetch(`${trackShipmentUrl}/${trackingId}`);

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
    }, [trackingId]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);


  if (!shipmentDetails) return <p>Loading shipment details...</p>;




  return (
    <div className="bg-white py-5">
      <h2 className="text-xl font-semibold mb-4 text-center text-black">Shipment Tracking</h2>
      
      {/* Google Maps Embed */}
      <div className="d-flex justify-content-center px-4 my-5">
        <iframe
          title="Google Map"
          style={{ width: "100%", height: "6cm" }}
          src="https://www.google.com/maps/embed/v1/search?q=+1015+15th+St+NW+6th+Floor,+Washington,+DC,+20005,+USA+·+1050+Connecticut+Avenue+Northwest.&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
        />
      </div>
      <div className="flex flex-col items-center justify-center mt-10 w-full">
  <div
    ref={scrollContainerRef}
    className="flex overflow-x-auto whitespace-nowrap w-full scroll-smooth"
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    <div className="flex flex-row min-w-screen justify-center w-full px-20 items-stretch">
      {shipmentDetails.steps.map((step, index) => (
        <div key={index} className="flex flex-col justify-start items-center">
          <div className="flex items-center">
            {/* Line Connecting to Previous Tick */}
            {index !== 0 && <div className="w-[68px] h-1 bg-goldenrod -ml-px flex-shrink-0"></div>}
            
            <FontAwesomeIcon
              icon={step.processedStatus==='blocked' ? faTimesCircle : faCheckCircle}
              size="lg"
              className={`text-2xl ${step.processedStatus==='blocked' ? "text-red-500" : "text-goldenrod"} ${index === 0 ? "pl-20" : index === shipmentDetails.steps.length - 1 ? "pr-20" : ""}`}
            />
            
            {/* Line Connecting to Next Tick */}
            {index !== shipmentDetails.steps.length - 1 && <div className="w-[68px] h-1 bg-goldenrod -ml-px flex-shrink-0"></div>}
          </div>
          <p className="text-black">Status:</p>
          <div className="text-black text-xs mt-2 text-center w-[80px] min-h-[40px] break-words whitespace-normal">
            {step.orderStage}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Shipment Details */}
      <h3 className="font-bold mb-2 mt-3 text-center text-black">Shipment Details</h3>
      <div className="space-y-2 text-black">
        <p className="rounded border-b-4 p-2 ">
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
        
      </div>
    </div>
  );
};

export default ShipmentTrackingDashboard;
