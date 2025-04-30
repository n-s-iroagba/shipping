"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { Shipment } from "@/app/types/Shipment";
import { trackShipmentUrl } from "@/data/urls";
import Loading from "@/components/Loading";


const ShipmentTrackingDashboard: React.FC = () => {
const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);
const params = useParams();
const trackingId =  params.trackingId;

const scrollContainerRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  };

  // Ensure it only scrolls on small screens (e.g., width < 768px)
  if (window.innerWidth < 768) {
    setTimeout(scrollToEnd, 100);
  }
}, []);
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
},[trackingId]);




  if (!shipmentDetails) return <Loading/>

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
      {shipmentDetails.shipmentStatus.map((step, index) => (
        <div key={index} className="flex flex-col justify-start items-center">
               <p className="text-black">Status:</p>
          <div className="text-black text-xs mt-2 text-center w-[80px] h-[6rem] break-words whitespace-normal">
            {step.status}
          </div>
          <div className="flex items-center">
            {/* Line Connecting to Previous Tick */}
            {index !== 0 && <div className="w-[68px] h-1 bg-goldenrod -ml-px flex-shrink-0"></div>}
            
             <FontAwesomeIcon
              icon={step.shipmentStatus==='Fee Unpaid'|| step.shipmentStatus ==='Fee Partially Paid' ? faTimesCircle : faCheckCircle}
              size="lg"
              className={`text-2xl ${step.shipmentStatus==='Fee Unpaid'|| step.shipmentStatus ==='Fee Partially Paid' ? "text-red-500" : "text-goldenrod"} ${index === 0 ? "" : index === shipmentDetails.shipmentStatus.length - 1 ? "pr-20" : ""}`}
            />
            
            {/* Line Connecting to Next Tick */}
            {index !== shipmentDetails.shipmentStatus.length - 1 && <div className="w-[68px] h-1 bg-goldenrod -ml-px flex-shrink-0"></div>}
          </div>
      
          <div className="text-black text-xs mt-2 text-center w-[80px] min-h-[40px] break-words whitespace-normal">
            {step.shipmentStatus}
          </div>
          <small className="text-black">{new Date(step.date).toDateString()}</small>
        </div>
      ))}
    </div>
  </div>
</div>

      <h3 className="font-bold mb-2 mt-3 text-center text-black">Shipment Details</h3>
      <div className="space-y-2 text-black">
        <p className="rounded border-b-4 p-2 ">
          <strong>Shipment ID:</strong> {shipmentDetails.shipmentID}
        </p>
          <p className="rounded border-b-4 p-2 ">
          <strong>Content:</strong> {shipmentDetails.shipmentDescription}
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
