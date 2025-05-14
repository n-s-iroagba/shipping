"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faBox, faMapMarkerAlt, faInfoCircle, faDollarSign } from "@fortawesome/free-solid-svg-icons";
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




  if (!shipmentDetails) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faBox} className="text-indigo-600 h-6 w-6" />
            Shipment Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Tracking ID: {trackingId}</p>
        </div>

        {/* Payment Alert */}
        {shipmentDetails.shipmentStatus.some(s => s.shipmentStatus.includes('Fee')) && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 text-orange-800 p-4 mb-8 rounded-lg flex items-start gap-3">
            <FontAwesomeIcon icon={faDollarSign} className="text-lg mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm sm:text-base">Payment Required</p>
              <p className="text-xs sm:text-sm mt-1">Complete payment to continue shipment processing</p>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-600 h-5 w-5" />
            <h3 className="text-lg font-semibold text-gray-900">Live Location</h3>
          </div>
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden border-2 border-gray-100">
            <iframe
              title="Google Map"
              className="w-full h-full"
              src="https://www.google.com/maps/embed/v1/search?q=+1015+15th+St+NW+6th+Floor,+Washington,+DC,+20005,+USA+·+1050+Connecticut+Avenue+Northwest.&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
              loading="lazy"
            />
            <div className="absolute inset-0 border-[3px] border-white/20 rounded-xl pointer-events-none" />
          </div>
        </div>

    
      {/* Progress Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600" />
            Shipment Progress
          </h3>
          <div className="relative overflow-hidden">
            <div ref={scrollContainerRef} className="flex overflow-x-auto pb-4 scroll-smooth">
              <div className="flex min-w-max w-full">
                {shipmentDetails.shipmentStatus.map((step, index) => {
                  const isComplete = !['Fee Unpaid', 'Fee Partially Paid'].includes(step.shipmentStatus);
                  const isCurrent = index === shipmentDetails.shipmentStatus.length - 1;
                  
                  return (
                    <div key={index} className="flex flex-col items-center relative ">
                      <div className={`h-1 w-full absolute top-5 left-1/2  -translate-y-1/2 ${isComplete ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-4 
                        ${isComplete ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}
                        ${isCurrent ? 'ring-4 ring-indigo-200' : ''}`}>
                        <FontAwesomeIcon 
                          icon={isComplete ? faCheckCircle : faTimesCircle} 
                          className={isComplete ? 'text-white' : 'text-gray-400'}
                        />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {step.shipmentStatus}  <br/>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(step.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Details Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600 h-5 w-5" />
            Shipment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DetailItem label="Shipment ID" value={shipmentDetails.shipmentID} />
            <DetailItem label="Content" value={shipmentDetails.shipmentDescription} />
            <DetailItem label="Sender" value={shipmentDetails.senderName} />
            <DetailItem label="Sending Port" value={shipmentDetails.sendingAddress} />
            <DetailItem label="Delivery Address" value={shipmentDetails.receivingAddress} />
            <DetailItem label="Recipient" value={shipmentDetails.recipientName} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-indigo-100">
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-gray-900 truncate">{value}</dd>
  </div>
);
export default ShipmentTrackingDashboard
