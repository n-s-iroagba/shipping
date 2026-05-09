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
    <div className="min-h-screen bg-slate-50 text-[#0B1D3A] selection:bg-[#C9A84C]/20 pb-20">
      {/* Hero Header */}
      <header className="relative bg-white border-b border-slate-200 pt-12 pb-8 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FiPackage className="w-3 h-3" />
            Tracking Active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight mb-2"
          >
            {shipmentData.shipmentID}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium"
          >
            {shipmentData.status}
          </motion.p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Origin & Destination Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col items-center gap-2 z-10 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-slate-600" />
              </div>
              <span className="text-sm font-bold uppercase tracking-tight">{shipmentData.origin || "Origin"}</span>
            </div>

            <div className="absolute left-12 right-12 top-6 h-px bg-slate-100 flex items-center justify-center">
              <motion.div
                animate={{ x: [0, 40, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 bg-[#C9A84C] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.8)]"
              />
            </div>

            <div className="flex flex-col items-center gap-2 z-10 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1D3A] flex items-center justify-center shadow-lg shadow-[#0B1D3A]/20">
                <FiMapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-tight text-[#0B1D3A]">{shipmentData.destination}</span>
            </div>
          </div>
        </section>

        {/* Sensitive Information Banner */}
        <AnimatePresence mode="wait">
          {!isSensitive ? (
            <motion.section
              key="minimal-banner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B1D3A] rounded-3xl p-8 text-white text-center shadow-xl shadow-[#0B1D3A]/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl" />
              <FiLock className="w-10 h-10 mx-auto mb-4 text-[#C9A84C]" />
              <h2 className="text-xl font-bold mb-2">Access Full Details</h2>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Verification is required to view package photos, sender details, and full consignment history.
              </p>
              <button
                onClick={handleRequestSensitive}
                disabled={isInitiating}
                className="w-full py-4 bg-[#C9A84C] text-[#0B1D3A] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d4b55c] transition-colors shadow-lg active:scale-95"
              >
                {isInitiating ? "Sending OTP..." : "Verify Identity"}
                <FiChevronRight className="w-5 h-5" />
              </button>
            </motion.section>
          ) : (
            <motion.div
              key="sensitive-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Package Photos */}
              {fullInfo.packagePhotos && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest px-2">
                    <FiImage className="w-4 h-4" />
                    <span>Package Photos</span>
                  </div>
                  <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm p-4">
                    <img
                      src={fullInfo.packagePhotos}
                      alt="Package"
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  </div>
                </section>
              )}

              {/* Sender & Receiver Info */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sender</span>
                  <p className="font-bold text-slate-800">{fullInfo.senderName}</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Receiver</span>
                  <p className="font-bold text-slate-800">{fullInfo.recipientName}</p>
                </div>
              </section>

              {/* Description */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <FiInfo className="w-4 h-4" />
                  <span>Shipment Description</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {fullInfo.shipmentDescription || "No description provided."}
                </p>
              </section>

              {/* Timeline (Sensitive) */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest px-2">
                  <FiClock className="w-4 h-4" />
                  <span>Detailed History</span>
                </div>
                <div className="space-y-4">
                  {displayStages.map((stage, idx) => {
                    const isPending = stage.paymentStatus !== ShippingStagePaymentStatus.PAID &&
                      stage.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white rounded-3xl p-6 border ${isPending ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'} shadow-sm relative`}
                      >
                        {isPending && (
                          <div className="absolute top-4 right-4 animate-pulse">
                            <FiAlertCircle className="w-5 h-5 text-amber-500" />
                          </div>
                        )}
                        <h3 className="font-bold text-slate-800 mb-1">{stage.title}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-1">
                          <FiMapPin className="w-3 h-3" /> {stage.location} • {new Date(stage.dateAndTime).toLocaleDateString()}
                        </p>

                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-sm text-slate-600 leading-relaxed mb-4">
                          {stage.carrierNote || "No carrier notes for this stage."}
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
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest px-2">
              <FiClock className="w-4 h-4" />
              <span>Timeline Highlights</span>
            </div>
            <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              {shipmentData.shippingStages.slice(0, 3).map((stage, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-slate-50 bg-[#C9A84C] shadow-[0_0_0_4px_rgba(248,250,252,1)]" />
                  <h4 className="font-bold text-slate-800 text-sm">{stage.title}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {stage.location} • {new Date(stage.dateAndTime).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {shipmentData.shippingStages.length > 3 && (
                <div className="text-xs font-bold text-slate-400 italic">
                  + {shipmentData.shippingStages.length - 3} more stages hidden...
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