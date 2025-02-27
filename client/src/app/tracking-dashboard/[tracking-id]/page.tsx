"use client";

import React from // useState
"react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faTruck,
  faCheckCircle,
  //  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const ShipmentTrackingDashboard: React.FC = () => {
  //   if (status === "not_found") {
    //   return (
    //     <div className="flex flex-col items-center justify-center min-h-screen">
    //       <div className="bg-white shadow-md rounded-lg p-6 text-center">
    //         <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-yellow-500 mb-3" />
    //         <h3 className="text-lg font-semibold">Shipment Not Found</h3>
    //         <p className="text-gray-500">We couldn not find your shipment. Please check your tracking number or contact support.</p>
    //       </div>
    //     </div>
    //   );
    // }

  const steps = [
    { label: "Processed", icon: faBox, reached: true, date: "3rd August 2022" },
    { label: "Shipped", icon: faTruck, reached: true, date: "4th August 2022" },
    {
      label: "Delivered",
      icon: faCheckCircle,
      reached: false,
      date: "5th August 2025",
    },
  ];
  const shipmentDetails = {
    shipmentID: "SHIP123456",
    date: "2024-12-29",
    senderName: "John Doe",
    sendingAddress: "Port of Los Angeles",
    destination: "Shanghai Port",
    recipientName: "Jane Smith",
    currentLocation: "Pacific Ocean",
    shipmentDescription: "A white hyundai sonata car"
  }

  return (
    <>
    <h3 className="text-xl font-semibold mb-4">Shipment Tracking</h3>
    <div 
    style={{height:'10cm'}}
    className="flex items-center justify-evenly mt-10">
        <div className="flex flex-col  h-full max-w-lg justify-between items-center mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex h-20 justify-center flex-col items-center">
            <FontAwesomeIcon
              icon={step.icon}
              size="2x"
              className={step.reached ? "text-green-500" : "text-gray-400"}
            />
            <span className="mt-2 text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
     
      <div className="h-full w-2 bg-gray-400">
        <div
          className={` bg-green-500 transition-all duration-500`}
          style={{
            height: `${
              (steps.filter((s) => s.reached).length / steps.length) * 100
            }%`,
          }}
        ></div>
      </div>

      <div className="flex flex-col h-full  max-w-lg justify-between items-center mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col h-20 justify-center items-center">
            <span className="mt-2 text-sm font-small ">{step.date}</span>
          </div>
        ))}
      </div>
    </div>
    <h2 className="text-2xl font-bold mb-4">Shipment Details</h2>
            <div className="space-y-2">
              <p className="rounded border-b-4 border-black p-2">
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
                <strong>Destination:</strong> {shipmentDetails.destination}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Recipient:</strong> {shipmentDetails.recipientName}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Current Location:</strong>{" "}
                {shipmentDetails.currentLocation}
              </p>
              </div>
    </>
  );
};

export default ShipmentTrackingDashboard;
