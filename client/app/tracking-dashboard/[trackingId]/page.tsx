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
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Spinner /></div>;
  if (activeError) return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-md mx-auto">
        <ErrorAlert message={activeError} />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full py-3 bg-[#0B1D3A] text-white rounded-xl font-medium shadow-lg"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const shipmentData = isSensitive ? fullInfo : publicInfo;
  if (!shipmentData) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0B1D3A] selection:bg-[#C9A84C]/20 pt-10 pb-20">
      {/* Premium Hero Section */}
      <div className="relative bg-[#0B1D3A] pt-24 pb-32 px-6 overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C9A84C] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[100px]" />
        </div>

        <div className="relative mt-5 max-w-4xl lg:max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-10 backdrop-blur-sm"
          >
            <FiLock className="w-3 h-3" />
            Secure Concierge Tracking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {shipmentData.shipmentID}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 text-white/50 text-xs font-medium tracking-widest uppercase"
          >
            <span className="w-12 h-px bg-white/10" />
            {shipmentData.status}
            <span className="w-12 h-px bg-white/10" />
          </motion.div>
        </div>
      </div>

      <main className="max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-8 -mt-16 space-y-12 md:space-y-16 relative z-20">

        {/* Global Routing Card */}
        <section className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">

            {/* Origin */}
            <div className="flex flex-col items-center md:items-start gap-4 z-10 w-full md:w-auto">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#F8F9FB] border border-slate-100 flex items-center justify-center mb-2 shadow-inner">
                <FiMapPin className="w-6 h-6 md:w-8 md:h-8 text-[#C9A84C]" />
              </div>
              <div className="text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] block mb-1">Departure</span>
                <h2 className="text-xl md:text-3xl font-light text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>{shipmentData.origin || "Origin Point"}</h2>
              </div>
            </div>

            {/* Animation Line */}
            <div className="hidden md:flex flex-1 items-center justify-center py-5 px-10">
              <div className="relative w-full h-px bg-slate-100">
                <motion.div
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[-4px] w-2 h-2 bg-[#C9A84C] rounded-full shadow-[0_0_12px_rgba(201,168,76,1)]"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="flex flex-col items-center md:items-end gap-4 py-5 z-10 w-full md:w-auto">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0B1D3A] flex items-center justify-center mb-2 shadow-[0_15px_30px_-5px_rgba(11,29,58,0.3)]">
                <FiMapPin className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-center md:text-right">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] block mb-1">Arrival</span>
                <h2 className="text-xl md:text-3xl font-light text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>{shipmentData.destination}</h2>
              </div>
            </div>
          </div>
        </section>

        {/* Sensitive Information Banner */}
        <AnimatePresence mode="wait">
          {!isSensitive ? (
            <motion.section
              key="minimal-banner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#0B1D3A] mb-5 rounded-[3rem] p-12 md:p-24 lg:p-32 text-white text-center shadow-2xl relative overflow-hidden border border-white/5"
            >
              {/* Background Art */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-50%] left-[-20%] w-full h-full bg-gradient-to-br from-[#C9A84C] to-transparent rounded-full blur-[150px]" />
              </div>

              <div className="relative z-10 max-w-2xl my-6 mx-auto">
                <div className="inline-flex items-center justify-center my-5 w-24 h-24 bg-white/5 rounded-full mb-10 border border-white/10 shadow-2xl backdrop-blur-md">
                  <FiLock className="w-10 h-10 text-[#C9A84C]" />
                </div>
                <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Private Client <br /> Access Required
                </h2>
                <p className="text-white/40 text-base md:text-lg mb-12 font-light leading-relaxed tracking-wide">
                  This consignment contains high-value assets and sensitive documentation. Please complete identity verification to access visual manifests and routing history.
                </p>
                <div className="flex justify-center w-full">
                  <button
                    onClick={handleRequestSensitive}
                    disabled={isInitiating}
                    className="group relative inline-flex items-center justify-center gap-4 px-8 md:px-16 py-6 md:py-8 bg-[#C9A84C] text-[#0B1D3A] rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all hover:bg-white hover:text-[#0B1D3A] active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_30px_60px_-10px_rgba(201,168,76,0.4)] overflow-hidden w-full sm:w-auto"
                  >
                    <span className="relative z-10">
                      {isInitiating ? "Initiating Protocol..." : "Unlock Secure Access"}
                    </span>
                    <FiChevronRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="sensitive-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12 md:space-y-16"
            >
              {/* Package Photos */}
              {fullInfo.packagePhotos && (
                <section className="space-y-5">
                  <div className="flex items-center gap-4 text-[#0B1D3A] font-bold text-[10px] uppercase tracking-[0.4em] px-4">
                    <FiImage className="w-4 h-4 text-[#C9A84C]" />
                    <span>Visual Asset Manifest</span>
                  </div>
                  <div className="rounded-[3rem] overflow-hidden border border-slate-100 bg-white shadow-2xl p-4">
                    <img
                      src={fullInfo.packagePhotos}
                      alt="Consignment"
                      className="w-full h-64 md:h-[600px] object-cover rounded-[2rem]"
                    />
                  </div>
                </section>
              )}

              {/* Sender & Receiver Info */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100%] transition-colors group-hover:bg-[#C9A84C]/10" />
                  <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] block mb-4">Originating Principal</span>
                  <p className="text-2xl font-light text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>{fullInfo.senderName}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100%] transition-colors group-hover:bg-[#C9A84C]/10" />
                  <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] block mb-4">Designated Receiver</span>
                  <p className="text-2xl font-light text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>{fullInfo.recipientName}</p>
                </div>
              </section>

              {/* Description */}
              <section className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4 mb-8 text-[#0B1D3A] font-bold text-[10px] uppercase tracking-[0.4em]">
                  <FiInfo className="w-4 h-4 text-[#C9A84C]" />
                  <span>Consignment Manifest</span>
                </div>
                <p className="text-[#0B1D3A]/70 leading-relaxed text-lg md:text-2xl font-light italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  "{fullInfo.shipmentDescription || "Manifest remains confidential."}"
                </p>
              </section>

              {/* Timeline (Sensitive) */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-[#0B1D3A] font-bold text-xs uppercase tracking-[0.2em] px-2 mb-8">
                  <div className="w-8 h-8 rounded-full bg-[#0B1D3A]/5 flex items-center justify-center">
                    <FiClock className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <span>Comprehensive Routing History</span>
                </div>
                <div className="space-y-6">
                  {displayStages.map((stage, idx) => {
                    const isPending = stage.paymentStatus !== ShippingStagePaymentStatus.PAID &&
                      stage.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white rounded-[2.5rem] p-8 md:p-12 border ${isPending ? 'border-amber-100 bg-amber-50/10' : 'border-slate-50 shadow-[0_15px_40px_rgba(0,0,0,0.03)]'} relative group overflow-hidden`}
                      >
                        {isPending && (
                          <div className="absolute top-8 right-8 animate-pulse">
                            <FiAlertCircle className="w-6 h-6 text-amber-500" />
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                          <div>
                            <h3 className="text-xl md:text-2xl font-light text-[#0B1D3A] mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>{stage.title}</h3>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]">
                              <FiMapPin className="w-3 h-3" /> {stage.location}
                              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
                              {new Date(stage.dateAndTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          {isPending && (
                            <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-200">
                              Action Required
                            </div>
                          )}
                        </div>

                        <div className="p-6 rounded-[1.5rem] bg-[#F8F9FB] border border-slate-100 text-sm md:text-base text-[#0B1D3A]/60 leading-relaxed mb-8 font-light italic">
                          "{stage.carrierNote || "Secure handling in progress."}"
                        </div>

                        {/* Payment Info */}
                        {stage.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED && (
                          <div className={`p-4 rounded-2xl border ${isPending ? 'bg-amber-100/50 border-amber-200' : 'bg-emerald-50 border-emerald-100'} flex items-start gap-3`}>
                            {isPending ? (
                              <FiAlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                            ) : (
                              <FiCheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Payment Status</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isPending ? 'text-amber-700' : 'text-emerald-700'}`}>
                                  {stage.paymentStatus}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium mb-2">
                                Fee: ${stage.feeInDollars} • Paid: ${stage.amountPaid}
                              </p>
                              {isPending && (
                                <div className="mt-2 flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200 text-[10px] text-amber-800 font-bold">
                                  <FiMail className="w-3 h-3" />
                                  Check your email for payment instructions.
                                </div>
                              )}
                            </div>
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
          <section className="space-y-12 md:space-y-16 pt-8">
            <div className="flex items-center gap-4 text-[#0B1D3A] font-bold text-[10px] uppercase tracking-[0.4em] px-4">
              <FiClock className="w-4 h-4 text-[#C9A84C]" />
              <span>Routing Overview</span>
            </div>
            <div className="relative pl-10 space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {shipmentData.shippingStages.slice(0, 3).map((stage, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-5 h-5 rounded-full border-4 border-white bg-[#C9A84C] shadow-lg" />
                  <h4 className="text-lg font-light text-[#0B1D3A] mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>{stage.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#0B1D3A]/40">
                    <span>{stage.location}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{new Date(stage.dateAndTime).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
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
      {/* Premium Footer */}
      <footer className="mt-32 border-t border-slate-100 bg-white py-20 px-6">
        <div className="max-w-4xl lg:max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-xl font-light tracking-widest text-[#0B1D3A]" style={{ fontFamily: "var(--font-playfair), serif" }}>ARBOR GLOBAL</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Secure Logistics & Concierge</p>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <p>© 2026 Arbor Global Private Ltd.</p>
            <p>Terms of Confidentiality • Privacy Protocol</p>
          </div>
        </div>
      </footer>
    </div>
  );
}