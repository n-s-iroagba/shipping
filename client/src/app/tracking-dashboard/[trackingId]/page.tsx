"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faMapMarkerAlt,  faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { Shipment } from "@/app/types/Shipment";
import { trackShipmentUrl } from "@/data/urls";
import Loading from "@/components/Loading";


const ShipmentTrackingDashboard: React.FC = () => {
  const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);

  const params = useParams();
  const trackingId = params.trackingId;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const mostRecentStage = shipmentDetails?.shipmentStatus?.[0];
  const long = mostRecentStage?.longitude || -119.417931;
  const lat = mostRecentStage?.latitude || 10.606619;

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
  }, [trackingId]);

  // Handle payment button click
  const handlePaymentSupport = () => {
    // Add your payment support logic here
    console.log("Payment support requested");
    // Example: redirect to support page or open email client
    window.location.href = "mailto:netlylogisticshelpservice247@outlook.com?subject=Payment Support Request";
  };

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
        {shipmentDetails.shipmentStatus.some(s => s.paymentStatus.includes('UNPAID')) && (
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
              src={`https://www.google.com/maps/embed/v1/view?center=${lat},${long}&zoom=12&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
              loading="lazy"
            />
            <div className="absolute inset-0 border-[3px] border-white/20 rounded-xl pointer-events-none" />
          </div>
        </div>
     

        {/* Current Status Section */}
        {mostRecentStage && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-6">
              <div className="flex-none">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBox} className="text-indigo-600 h-5 w-5" />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    Current Status
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{mostRecentStage.title}</h4>
                <p className="text-gray-600 mb-1">Location: {mostRecentStage.location}</p>
                <p className="text-gray-600 mb-2">Carrier note: {mostRecentStage.carrierNote}</p>
                <small className="text-sm text-gray-500">{new Date(mostRecentStage.dateAndTime).toLocaleString()}</small>

                {mostRecentStage.feeInDollars && mostRecentStage.feeInDollars > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-gray-600">
                      Fee is required
                    </div>
                    {mostRecentStage.paymentStatus !== 'NO_PAYMENT_REQUIRED' &&<div className="text-gray-600">
                      Payment Status:{" "}
                      <span
                        className={`font-medium ${
                          mostRecentStage.paymentStatus === "PAID"
                            ? "text-green-600"
                            : mostRecentStage.paymentStatus === "PENDING"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {mostRecentStage.paymentStatus}
                      </span>
                    </div>
}
                    {mostRecentStage.percentageNote && (
                      <small className="text-sm text-gray-600">{mostRecentStage.percentageNote}% of shipment value</small>
                    )}

                    {mostRecentStage.amountPaid && (
                      <>
                    
                        <small className="text-sm text-gray-600">
                          Payment Date: {mostRecentStage.paymentDate && new Date(mostRecentStage.paymentDate).toLocaleDateString()}
                        </small>
                      </>
                    )}
                    
                    <div className="flex flex-col lg:flex-row gap-4">
                      {mostRecentStage.paymentStatus === "UNPAID" && (
                     <button
                            onClick={handlePaymentSupport}
                            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Mail Support to Make Payment
                          </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {shipmentDetails.shipmentStatus.length>1 &&
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipment Progress Time line</h3>
          <div className="space-y-6">
           {shipmentDetails.shipmentStatus.slice(1).map((stat, index) => (
              <div key={stat.id} className="flex gap-6 relative">
                <div className="flex-none">
                  <div className="flex flex-col items-center h-full">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBox} className="text-gray-500 h-5 w-5" />
                    </div>
                    {index < shipmentDetails.shipmentStatus.length - 1 && (
                      <div className="w-0.5 bg-blue-600 flex-1 mt-1 min-h-[2rem]"></div>
                    )}
                  </div>
                </div>

                <div className="flex-1 pb-6">
                  <h4 className="text-lg font-semibold text-gray-900">{stat.title}</h4>
                  <p className="text-gray-600 mb-1">Location: {stat.location}</p>
                  <p className="text-gray-600 mb-2">Carrier note: {stat.carrierNote}</p>
                  <small className="text-sm text-gray-500">{new Date(stat.dateAndTime).toLocaleString()}</small>

                  {stat.feeInDollars && stat.feeInDollars > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-gray-600">
                        Fee Required: <span className="text-lg font-medium text-amber-600">${stat.feeInDollars}</span>
                      </div>
                               {stat.paymentStatus !== 'NO_PAYMENT_REQUIRED' &&<div className="text-gray-600">
                      Payment Status:{" "}
                      <span
                        className={`font-medium ${
                          stat.paymentStatus === "PAID"
                            ? "text-green-600"
                            : stat.paymentStatus === "PENDING"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {stat.paymentStatus}
                      </span>
                    </div>
}
                

                      {stat.amountPaid && (
                        <>
                     
                          <small className="text-sm text-gray-600">
                            Payment Date: {stat.paymentDate && new Date(stat.paymentDate).toLocaleDateString()}
                          </small>
                        </>
                      )}
                      
                      <div className="flex flex-col lg:flex-row gap-4">
                        {stat.paymentStatus === "UNPAID" && (
                          <button
                            onClick={handlePaymentSupport}
                            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Mail Support to Make Payment
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
}

      </div>
    </div>
  );
};



export default ShipmentTrackingDashboard;