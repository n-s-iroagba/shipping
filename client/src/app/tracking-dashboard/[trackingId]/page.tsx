"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { useGetList, useGetSingle } from "@/hooks/useGet";
import { Shipment } from "@/types/shipment.types";
import { routes } from "@/data/routes";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import VerificationModal from "@/components/VerificationModal";
import { handleError } from "@/utils/utils";
import { getRequest } from "@/utils/apiUtils";
import PaymentModal from "@/components/PaymentModal";
import { Stage } from "@/types/stage.types";
import { CryptoWallet } from "@/types/crypto-wallet.types";
import { Bank } from "@/types/bank.types";


const ShipmentTrackingDashboard: React.FC = () => {
  const params = useParams();
  const trackingId = params.trackingId as string;

  const {
    data: shipment,
    loading,
    error:loadingError,
  } = useGetSingle<Shipment>(routes.shipment.trackPublic(trackingId));

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const  [showPaymentStage, setPaymentStage] = useState<Stage|null>(null);
  const [error, setError] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState('')
  const [viewToken, setViewToken]= useState('')
    const {
      data: wallets,
      loading:walletLoading,
      error:walletErro,
    } = useGetList<CryptoWallet>(shipment?routes.cryptoWallet.list(shipment?.adminId):'')
        const {
      data: bank,
      loading:bankLoading,
      error:bankErro,
    } = useGetSingle<Bank>(shipment?`/bank/${shipment.adminId}`:'')
  console.log(shipment)
  const mostRecentStage = shipment?.shippingStages?.[0];
  const long = mostRecentStage?.longitude || -119.417931;
  const lat = mostRecentStage?.latitude || 10.606619;

  useEffect(() => {
    const scrollToEnd = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth;
      }
    };
    if (window.innerWidth < 768) {
      setTimeout(scrollToEnd, 100);
    }
   setViewToken( sessionStorage.getItem("temp-shipping-view")||'')
  }, []);
  const initateTracking=async()=>{
    try{
const data =await getRequest(`/shipment/initiate/${shipment?.id}`)
setToken(data)


  setShowVerifyModal(true)

    }catch(error){
      console.error(error)
      handleError(error,setError)
      
    }
  }

  const startPayment=async (stage:Stage)=>{
    setPaymentStage(stage)
  }
  if (loading) return <Spinner />;
  if (loadingError||error)
    return (
      <ErrorAlert message="Failed to retrieve tracking details, please try again later." />
    );
  if (!shipment)
    return (
      <ErrorAlert message="Tracking details not found, please try again later." />
    );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Request Full Details Button */}
      

        {showVerifyModal && (
          <VerificationModal token={token} onClose={() => setShowVerifyModal(false)} />
        )}

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faBox} className="text-indigo-600 h-6 w-6" />
            Shipment Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Tracking ID: {trackingId}
          </p>
            <div className="text-center mt-6">
          <button
            onClick={() => initateTracking()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Request Full Shipment Details
          </button>
        </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-indigo-600 h-5 w-5"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              Live Location
            </h3>
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

        {/* Current Status */}
        {mostRecentStage && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-6">
              <div className="flex-none">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faBox}
                    className="text-indigo-600 h-5 w-5"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    Current Status
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {mostRecentStage.title}
                </h4>
                <p className="text-gray-600 mb-1">
                  Location: {mostRecentStage.location}
                </p>
                <p className="text-gray-600 mb-2">
                  Carrier note: {mostRecentStage.carrierNote}
                </p>
                      {viewToken&&(<> { mostRecentStage.feeInDollars&& <p className="text-gray-600 mb-1">
                      Fee: {mostRecentStage.feeInDollars}
                    </p>
}  <p className="text-gray-600 mb-2">
                      Amount Paid: ${mostRecentStage.amountPaid||0}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Payment Status: {mostRecentStage.paymentStatus=='INCOMPLETE_PAYMENT'?'PARTIAL PAYMENT':mostRecentStage.paymentStatus}
                    </p>
                    {mostRecentStage.paymentStatus!=='PAID'&&<button
                    onClick={()=>startPayment(mostRecentStage)}
                    >Make Payment</button>}
                    </>
                  )}
                <small className="text-sm text-gray-500">
                  {new Date(mostRecentStage.dateAndTime).toLocaleString()}
                </small>
                        {viewToken&&mostRecentStage.payments.length !==0 && <div className="mt-3">
                      <h5 className="font-semibold text-sm text-gray-800 mb-2">
                        Payments for this stage
                      </h5>
                      {mostRecentStage.payments && mostRecentStage.payments.length > 0 ? (
                        <ul className="space-y-2">
                          {mostRecentStage.payments.map((payment) => (
                            <li
                              key={payment.id}
                              className="flex justify-between items-center border rounded px-3 py-2 bg-gray-50"
                            >
                              <span className="text-sm text-gray-700">
                                {new Date(
                                  payment.dateAndTime
                                ).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-900 font-medium">
                                ${payment.amount}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  payment.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : payment.status === "PAID"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Payments not available (verify access to see)
                        </p>
                      )}
                    </div>}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {shipment.shippingStages.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Shipment Progress Timeline
            </h3>
            <div className="space-y-6">
              {shipment.shippingStages.slice(1).map((stat, index) => (
                <div key={stat.id} className="flex gap-6 relative">
                  <div className="flex-none">
                    <div className="flex flex-col items-center h-full">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faBox}
                          className="text-gray-500 h-5 w-5"
                        />
                      </div>
                      {index < shipment.shippingStages.slice(1).length - 1 && (
                        <div className="w-0.5 bg-blue-600 flex-1 mt-1 min-h-[2rem]" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 pb-6">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {stat.title}
                    </h4>
                    <p className="text-gray-600 mb-1">
                      Location: {stat.location}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Carrier note: {stat.carrierNote}
                    </p>
                    {viewToken&&(<> { stat.feeInDollars&& <p className="text-gray-600 mb-1">
                      Fee: {stat.feeInDollars}
                    </p>
}  <p className="text-gray-600 mb-2">
                      Amount Paid: {stat.amountPaid}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Payment Status: {stat.paymentStatus}
                    </p>
                      {stat.paymentStatus!=='PAID'&&<button
                    onClick={()=>startPayment(stat)}
                    >Make Payment</button>}
                    </>)}

                    <small className="text-sm text-gray-500">
                      {new Date(stat.dateAndTime).toLocaleString()}
                    </small>

                    {/* Payments Section */}
                   {viewToken&&stat.payments.length !==0 && <div className="mt-3">
                      <h5 className="font-semibold text-sm text-gray-800 mb-2">
                        Payments for this stage
                      </h5>
                      {stat.payments && stat.payments.length > 0 ? (
                        <ul className="space-y-2">
                          {stat.payments.map((payment) => (
                            <li
                              key={payment.id}
                              className="flex justify-between items-center border rounded px-3 py-2 bg-gray-50"
                            >
                              <span className="text-sm text-gray-700">
                                {new Date(
                                  payment.dateAndTime
                                ).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-900 font-medium">
                                ${payment.amount}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  payment.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : payment.status === "PAID"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Payments not available (verify access to see)
                        </p>
                      )}
                    </div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showPaymentStage&&<PaymentModal bank={bank} statusId={String(showPaymentStage.id)} onClose={()=>setPaymentStage(null)} feeInDollars={((showPaymentStage.feeInDollars)||0)-(showPaymentStage.amountPaid||0)} cryptoWallets={wallets}/>}
    </div>
  );
};

export default ShipmentTrackingDashboard;


