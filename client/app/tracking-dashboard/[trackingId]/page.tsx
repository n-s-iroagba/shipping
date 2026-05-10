"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiMapPin,
  FiClock,
  FiLock,
  FiChevronRight,
  FiInfo,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiMail
} from "react-icons/fi";
import { useGetSingle } from "@/hooks/useGet";
import { routes } from "@/data/routes";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import VerificationModal from "@/components/VerificationModal";
import { getRequest } from "@/utils/apiUtils";
import { handleError } from "@/utils/utils";
import type { Shipment } from "@/types/shipment.types";
import { ShippingStagePaymentStatus } from "@/types/stage.types";

/** ------------  Types  ------------ */
interface PublicTrackingInfo {
  id: number;
  shipmentID: string;
  status: string;
  origin: string;
  destination: string;
  shippingStages: {
    title: string;
    location: string;
    dateAndTime: string;
  }[];
}

export default function ShipmentTrackingDashboard() {
  const params = useParams();
  const trackingId = params.trackingId as string;
  const [viewToken, setViewToken] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [initToken, setInitToken] = useState("");
  const [isInitiating, setIsInitiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ----------  Check for session token ---------- */
  useEffect(() => {
    setViewToken(sessionStorage.getItem("temp-shipping-view"));
  }, []);

  /* ----------  Data Fetching ---------- */
  // Minimal info (always fetch if no token)
  const {
    data: publicInfo,
    loading: publicLoading,
    error: publicError,
  } = useGetSingle<PublicTrackingInfo>(
    !viewToken ? routes.shipment.trackPublic(trackingId) : ""
  );

  // Full info (fetch if token exists)
  const {
    data: fullInfo,
    loading: fullLoading,
    error: fullError,
  } = useGetSingle<Shipment>(
    viewToken ? routes.shipment.trackSensitive(trackingId) : "",
    { headers: { Authorization: `Bearer ${viewToken}` } }
  );

  /* ----------  Handlers ---------- */
  const handleRequestSensitive = async () => {
    const shipmentId = fullInfo?.id || publicInfo?.id;
    if (!shipmentId) return;

    setIsInitiating(true);
    setError("");
    try {
      const token = await getRequest(`/shipment/initiate/${shipmentId}`);
      setInitToken(token);
      setShowVerifyModal(true);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsInitiating(false);
    }
  };

  /* ----------  Computed Values ---------- */
  const isLoading = publicLoading || fullLoading;
  const activeError = publicError || fullError || error;
  const isSensitive = !!viewToken && !!fullInfo;

  // Sort stages for full info: pending payments first, then by date
  const displayStages = useMemo(() => {
    if (!fullInfo?.shippingStages) return [];

    return [...fullInfo.shippingStages].sort((a, b) => {
      // Pending/Incomplete payments first
      const isAPending = a.paymentStatus !== ShippingStagePaymentStatus.PAID &&
        a.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED;
      const isBPending = b.paymentStatus !== ShippingStagePaymentStatus.PAID &&
        b.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED;

      if (isAPending && !isBPending) return -1;
      if (!isAPending && isBPending) return 1;

      // Then by date descending
      return new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime();
    });
  }, [fullInfo]);

  /* ----------  Render Helpers ---------- */
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><Spinner /></div>;
  if (activeError) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA]">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 shadow-xl">
        <ErrorAlert message={activeError} />
        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full py-3 bg-[#0B1D3A] text-[#C9A84C] font-semibold tracking-widest uppercase text-sm border border-[#0B1D3A] hover:bg-[#C9A84C] hover:text-[#0B1D3A] transition-colors"
        >
          Re-Authenticate
        </button>
      </div>
    </div>
  );

  const shipmentData = isSensitive ? fullInfo : publicInfo;
  if (!shipmentData) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0B1D3A] selection:bg-[#C9A84C]/20 pb-20 font-sans">
      {/* Premium Header */}
      <header className="bg-[#0B1D3A] border-b border-[#C9A84C]/30 pt-16 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#C9A84C]/10 blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 border border-[#C9A84C]/40 text-[#C9A84C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-8 bg-[#0B1D3A]/50 backdrop-blur-sm"
          >
            <FiPackage className="w-4 h-4" />
            Active Consignment
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-normal text-white mb-6 tracking-wide"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {shipmentData.shipmentID}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C9A84C] font-medium tracking-[0.2em] uppercase text-xs md:text-sm"
          >
            Status: {shipmentData.status}
          </motion.p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-12">

        {/* Origin & Destination Card (Minimalist Luxury) */}
        <section className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-14 relative z-10 -mt-20 md:-mt-28">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col items-center gap-4 z-10 bg-white px-2">
              <div className="w-10 h-10 md:w-14 md:h-14 border border-slate-200 flex items-center justify-center">
                <FiMapPin className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center max-w-[120px] md:max-w-[180px] break-words leading-relaxed">
                {shipmentData.origin || "Origin"}
              </span>
            </div>

            <div className="absolute left-16 right-16 md:left-28 md:right-28 top-5 md:top-7 h-[1px] bg-slate-200 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ x: [-150, 150, -150] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_8px_rgba(201,168,76,0.8)]"
              />
            </div>

            <div className="flex flex-col items-center gap-4 z-10 bg-white px-2">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-[#0B1D3A] flex items-center justify-center shadow-lg shadow-[#0B1D3A]/20">
                <FiMapPin className="w-4 h-4 md:w-5 md:h-5 text-[#C9A84C]" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1D3A] text-center max-w-[120px] md:max-w-[180px] break-words leading-relaxed">
                {shipmentData.destination}
              </span>
            </div>
          </div>
        </section>

        {/* Sensitive Information Banner */}
        <AnimatePresence mode="wait">
          {!isSensitive ? (
            <motion.section
              key="minimal-banner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-[#C9A84C]/30 p-8 md:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-white pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0B1D3A] flex items-center justify-center mb-8 shadow-lg">
                  <FiLock className="w-6 h-6 text-[#C9A84C]" />
                </div>
                
                <h2 className="text-2xl md:text-4xl font-normal mb-6 text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Classified Consignment
                </h2>
                
                <p className="text-slate-500 text-sm md:text-base mb-10 leading-loose">
                  Due to the confidential nature of this shipment, verification is required. Proceed to authenticate your identity and access sensitive documentation, routing logs, and visual assets.
                </p>
                
                <button
                  onClick={handleRequestSensitive}
                  disabled={isInitiating}
                  className="w-full sm:w-auto px-12 py-4 bg-[#0B1D3A] text-[#C9A84C] font-semibold text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-[#132d54] transition-all disabled:opacity-70 flex items-center justify-center gap-4 group"
                >
                  {isInitiating ? "Initiating Protocol..." : "Verify Identity"}
                  <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="sensitive-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Package Photos */}
              {fullInfo.packagePhotos && (
                <section>
                  <div className="flex items-center gap-4 text-[#0B1D3A] font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 border-b border-slate-200 pb-4">
                    <FiImage className="w-4 h-4 text-[#C9A84C]" />
                    <span>Visual Documentation</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 shadow-sm">
                    <img
                      src={fullInfo.packagePhotos}
                      alt="Consignment Documentation"
                      className="w-full h-72 md:h-[500px] object-cover"
                    />
                  </div>
                </section>
              )}

              {/* Sender & Receiver Info */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 md:p-10 border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative">
                  <div className="w-8 h-[2px] bg-[#C9A84C] mb-6" />
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] block mb-4">Originating Party</span>
                  <p className="text-2xl md:text-3xl font-normal text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    {fullInfo.senderName}
                  </p>
                </div>
                
                <div className="bg-[#0B1D3A] p-8 md:p-10 border border-[#132d54] shadow-xl relative">
                  <div className="w-8 h-[2px] bg-[#C9A84C] mb-6" />
                  <span className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.2em] block mb-4">Receiving Party</span>
                  <p className="text-2xl md:text-3xl font-normal text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    {fullInfo.recipientName}
                  </p>
                </div>
              </section>

              {/* Description */}
              <section className="bg-white p-8 md:p-12 border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex items-center gap-4 text-[#0B1D3A] font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6">
                  <FiInfo className="w-4 h-4 text-[#C9A84C]" />
                  <span>Manifest Description</span>
                </div>
                <p className="text-slate-600 leading-loose text-sm md:text-base font-serif italic">
                  "{fullInfo.shipmentDescription || "No manifestation notes recorded."}"
                </p>
              </section>

              {/* Timeline (Sensitive) */}
              <section>
                <div className="flex items-center gap-4 text-[#0B1D3A] font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-8 border-b border-slate-200 pb-4">
                  <FiClock className="w-4 h-4 text-[#C9A84C]" />
                  <span>Comprehensive Routing History</span>
                </div>
                
                <div className="space-y-6">
                  {displayStages.map((stage, idx) => {
                    const isPending = stage.paymentStatus !== ShippingStagePaymentStatus.PAID &&
                      stage.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white p-8 md:p-10 border ${isPending ? 'border-amber-300' : 'border-slate-200'} shadow-sm relative`}
                      >
                        {isPending && (
                          <div className="absolute top-6 right-6">
                            <span className="flex h-3 w-3 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                          </div>
                        )}
                        <h3 className="text-xl md:text-2xl font-normal text-[#0B1D3A] mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
                          {stage.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold tracking-[0.1em] uppercase mb-6 flex items-center gap-2">
                          <FiMapPin className="w-3 h-3 text-[#C9A84C]" /> {stage.location} &nbsp;|&nbsp; {new Date(stage.dateAndTime).toLocaleDateString()}
                        </p>

                        <div className="pl-4 border-l-2 border-slate-200 text-sm text-slate-600 leading-relaxed mb-6 italic">
                          {stage.carrierNote || "No carrier notes for this stage."}
                        </div>

                        {/* Payment Info */}
                        {stage.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED && (
                          <div className={`mt-6 p-6 border ${isPending ? 'bg-amber-50/30 border-amber-200' : 'bg-slate-50 border-slate-200'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                            <div className="flex items-center gap-3">
                              {isPending ? (
                                <FiAlertCircle className="w-5 h-5 text-amber-600" />
                              ) : (
                                <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                              )}
                              <div>
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Payment Status</span>
                                <span className={`text-xs font-bold uppercase tracking-[0.1em] ${isPending ? 'text-amber-700' : 'text-emerald-700'}`}>
                                  {stage.paymentStatus}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                               <p className="text-xs text-slate-600 font-medium mb-1">
                                 Fee: ${stage.feeInDollars}
                               </p>
                               <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                                 Paid: ${stage.amountPaid}
                               </p>
                            </div>

                            {isPending && (
                              <div className="w-full md:w-auto mt-2 md:mt-0 flex items-center gap-2 p-3 bg-white border border-amber-200 text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                                <FiMail className="w-3 h-3" />
                                Check Email for Invoice
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline (Minimal) */}
        {!isSensitive && (
          <section className="bg-white p-8 md:p-12 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-4 text-[#0B1D3A] font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-8 border-b border-slate-100 pb-4">
              <FiClock className="w-4 h-4 text-[#C9A84C]" />
              <span>Routing Highlights</span>
            </div>
            
            <div className="relative pl-8 space-y-10 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              {shipmentData.shippingStages.slice(0, 3).map((stage, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[36px] top-1.5 w-2.5 h-2.5 bg-[#C9A84C] outline outline-4 outline-white" />
                  <h4 className="text-lg md:text-xl font-normal text-[#0B1D3A] mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    {stage.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mt-2">
                    {stage.location} &nbsp;|&nbsp; {new Date(stage.dateAndTime).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {shipmentData.shippingStages.length > 3 && (
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-6">
                  + {shipmentData.shippingStages.length - 3} classified stages hidden
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* Verification Modal */}
      {showVerifyModal && (
        <VerificationModal
          token={initToken}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
}