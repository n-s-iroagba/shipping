"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faMapMarkerAlt, faClock, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
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

  // Main shipment data
  const {
    data: shipment,
    loading,
    error: loadingError,
  } = useGetSingle<Shipment>(routes.shipment.trackPublic(trackingId));

  // Payment-related data (only fetch when needed)
  const {
    data: wallets,
    loading: walletLoading,
  } = useGetList<CryptoWallet>(shipment ? routes.cryptoWallet.list(shipment.adminId) : '');
  
  const {
    data: bank,
    loading: bankLoading,
  } = useGetSingle<Bank>(shipment ? `/bank/${shipment.adminId}` : '');

  // State management
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPaymentStage, setPaymentStage] = useState<Stage | null>(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [viewToken, setViewToken] = useState('');
  const [isInitiating, setIsInitiating] = useState(false);

  // Computed values - sort stages by date (most recent first)
  const sortedStages = shipment?.shippingStages?.sort((a, b) => 
    new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime()
  ) || [];
  const mostRecentStage = sortedStages[0];
  const lng = mostRecentStage?.longitude || -119.417931;
  const lat = mostRecentStage?.latitude || 10.606619;
  const hasPaymentAccess = Boolean(viewToken);
  const isPaymentDataLoading = hasPaymentAccess && (walletLoading || bankLoading);

  useEffect(() => {
    setViewToken(sessionStorage.getItem("temp-shipping-view") || '');
  }, []);

  const initiateTracking = useCallback(async () => {
    if (!shipment?.id || isInitiating) return;
    
    setIsInitiating(true);
    setError('');

    try {
      const data = await getRequest(`/shipment/initiate/${shipment.id}`);
      setToken(data);
      setShowVerifyModal(true);
    } catch (error) {
      console.error(error);
      handleError(error, setError);
    } finally {
      setIsInitiating(false);
    }
  }, [shipment?.id, isInitiating]);

  const startPayment = useCallback((stage: Stage) => {
    setPaymentStage(stage);
  }, []);

  const closePaymentModal = useCallback(() => {
    setPaymentStage(null);
  }, []);

  const closeVerifyModal = useCallback(() => {
    setShowVerifyModal(false);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Spinner className="w-12 h-12 text-indigo-600 mx-auto" />
            <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-25"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Loading shipment details...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error states
  if (loadingError || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorAlert message={error || "Failed to retrieve tracking details, please try again later."} />
          {error && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setError('')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorAlert message="Tracking details not found, please try again later." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faBox} className="text-indigo-600 h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Shipment Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 break-all">
            Tracking ID: <span className="font-mono font-semibold">{trackingId}</span>
          </p>
          
          {/* Request Details Button */}
          <div className="mb-8">
            <button
              onClick={initiateTracking}
              disabled={isInitiating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
            >
              {isInitiating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Requesting...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
                  <span>Request Full Details</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-600 h-5 w-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Live Location
            </h3>
          </div>
          <div className="relative h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden border border-gray-200">
            <iframe
              title="Shipment Location Map"
              className="w-full h-full"
              src={`https://www.google.com/maps/embed/v1/view?center=${lat},${lng}&zoom=12&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
              loading="lazy"
              style={{ border: 0 }}
            />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
              Live Location
            </div>
          </div>
        </div>

        {/* Current Status */}
        {mostRecentStage && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center ring-4 ring-green-50">
                  <FontAwesomeIcon icon={faClock} className="text-green-600 h-5 w-5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    Current Status
                  </span>
                </div>
                
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">
                  {mostRecentStage.title}
                </h4>
                
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-gray-600 break-words">
                    <span className="font-medium">Location:</span> {mostRecentStage.location}
                  </p>
                  <p className="text-gray-600 break-words">
                    <span className="font-medium">Carrier Note:</span> {mostRecentStage.carrierNote}
                  </p>
                  
                  {/* Payment Information (only if user has access) */}
                  {hasPaymentAccess && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-3">Payment Information</h5>
                      
                      {isPaymentDataLoading ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="w-4 h-4" />
                          <span className="text-gray-600 text-sm">Loading payment details...</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {mostRecentStage.feeInDollars && (
                            <p className="text-gray-700">
                              <span className="font-medium">Fee:</span> ${mostRecentStage.feeInDollars}
                            </p>
                          )}
                          <p className="text-gray-700">
                            <span className="font-medium">Amount Paid:</span> ${mostRecentStage.amountPaid || 0}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                              mostRecentStage.paymentStatus === 'PAID' 
                                ? 'bg-green-100 text-green-800' 
                                : mostRecentStage.paymentStatus === 'INCOMPLETE_PAYMENT'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {mostRecentStage.paymentStatus === 'INCOMPLETE_PAYMENT' ? 'PARTIAL PAYMENT' : mostRecentStage.paymentStatus}
                            </span>
                          </p>
                          
                          {mostRecentStage.paymentStatus !== 'PAID' && (
                            <button
                              onClick={() => startPayment(mostRecentStage)}
                              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                              Make Payment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                  <span>{new Date(mostRecentStage.dateAndTime).toLocaleString()}</span>
                </div>

                {/* Recent Payments */}
                {hasPaymentAccess && mostRecentStage.payments?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-sm text-gray-800 mb-2">
                      Recent Payments
                    </h5>
                    <div className="space-y-2">
                      {mostRecentStage.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg bg-gray-50"
                        >
                          <div className="text-sm text-gray-700">
                            {new Date(payment.dateAndTime).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              ${payment.amount}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              payment.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : payment.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {sortedStages.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              Shipment Timeline
            </h3>
            
            <div className="space-y-6">
              {sortedStages.slice(1).map((stage, index) => (
                <div key={stage.id} className="flex gap-4 sm:gap-6 relative">
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBox} className="text-gray-500 h-4 w-4" />
                      </div>
                      {index < sortedStages.slice(1).length - 1 && (
                        <div className="w-0.5 bg-gray-300 flex-1 mt-2 min-h-[3rem]" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pb-6">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {stage.title}
                    </h4>
                    
                    <div className="space-y-1 text-sm sm:text-base mt-2">
                      <p className="text-gray-600 break-words">
                        <span className="font-medium">Location:</span> {stage.location}
                      </p>
                      <p className="text-gray-600 break-words">
                        <span className="font-medium">Note:</span> {stage.carrierNote}
                      </p>
                      
                      {hasPaymentAccess && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                          {stage.feeInDollars && (
                            <p className="text-gray-700 mb-1">
                              <span className="font-medium">Fee:</span> ${stage.feeInDollars}
                            </p>
                          )}
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Amount Paid:</span> ${stage.amountPaid || 0}
                          </p>
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">Status:</span> {stage.paymentStatus}
                          </p>
                          
                          {stage.paymentStatus !== 'PAID' && (
                            <button
                              onClick={() => startPayment(stage)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
                            >
                              Make Payment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                      <span>{new Date(stage.dateAndTime).toLocaleString()}</span>
                    </div>

                    {/* Stage Payments */}
                    {hasPaymentAccess && stage.payments?.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-semibold text-xs text-gray-800 mb-2">
                          Payments for this stage
                        </h5>
                        <div className="space-y-1">
                          {stage.payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 border rounded bg-white text-xs"
                            >
                              <span className="text-gray-600">
                                {new Date(payment.dateAndTime).toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  ${payment.amount}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  payment.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : payment.status === "PAID"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {payment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showVerifyModal && (
        <VerificationModal token={token} onClose={closeVerifyModal} />
      )}

      {showPaymentStage && (
        <PaymentModal
          bank={bank}
          statusId={String(showPaymentStage.id)}
          onClose={closePaymentModal}
          feeInDollars={((showPaymentStage.feeInDollars) || 0) - (showPaymentStage.amountPaid || 0)}
          cryptoWallets={wallets}
        />
      )}
    </div>
  );
};

export default ShipmentTrackingDashboard;