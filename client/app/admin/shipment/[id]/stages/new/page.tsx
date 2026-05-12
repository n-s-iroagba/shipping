"use client";

import React, { FormEvent, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle
} from "react-icons/fi";
import { ShippingStagePaymentStatus } from "@/types/stage.types";
import { postRequest } from "@/utils/apiUtils";
import { routes } from "@/data/routes";
import { handleError } from "@/utils/utils";

/** ------------  Type helpers  ------------ */
interface Stage {
  title: string;
  shipmentId: string;
  carrierNote: string;
  dateAndTime: string;
  paymentStatus: ShippingStagePaymentStatus;
  location: string;
  longitude: number;
  latitude: number;
  feeName: string;
  feeInDollars: number;
  amountPaid: number;
  paymentDate: string;
  supportingDocument: File | null;
}

/** ------------  Utilities  ------------ */
const nowLocalIso = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const buildDefaultStage = (shipmentId: string): Stage => ({
  title: "",
  shipmentId,
  carrierNote: "",
  dateAndTime: nowLocalIso(),
  paymentStatus: ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED,
  location: "",
  longitude: 0,
  latitude: 0,
  feeName: "",
  feeInDollars: 0,
  amountPaid: 0,
  paymentDate: nowLocalIso(),
  supportingDocument: null,
});

export default function BulkCreateStagesForm() {
  const params = useParams();
  const shipmentId = params.id as string;
  const router = useRouter();

  const [stages, setStages] = useState<Stage[]>([buildDefaultStage(shipmentId)]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateStage = useCallback((index: number, field: keyof Stage, value: any) => {
    setStages(prev => {
      const newStages = [...prev];
      newStages[index] = { ...newStages[index], [field]: value };
      return newStages;
    });
  }, []);

  const addStage = () => setStages(prev => [...prev, buildDefaultStage(shipmentId)]);

  const removeStage = (index: number) => {
    if (stages.length === 1) return;
    setStages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append stages as stringified JSON (without file)
      stages.forEach((stage, i) => {
        const stagePayload = { ...stage, supportingDocument: undefined };
        formData.append(`stages[${i}]`, JSON.stringify(stagePayload));

        // Append file with the key the backend expects: supportingDocument_index
        if (stage.supportingDocument) {
          formData.append(`supportingDocument_${i}`, stage.supportingDocument);
        }
      });

      await postRequest(routes.stage.create(shipmentId), formData, true);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/shipment/${shipmentId}/stages`);
      }, 2000);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-10"
      >
        {/* Header Section */}
        <div className="bg-[#0B1D3A] rounded-[2rem] shadow-xl text-white  px-6 pb-8 md:px-10 md:pb-10">
          <div className=" py-8 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-6 mb-8 md:mb-0">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl shrink-0">
                <FiPlus className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Add New Stages</h1>
                <p className="text-white/60 text-sm mt-1">Creating journey milestones for Shipment #{shipmentId}</p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl transition-all font-medium border border-white/10"
              >
                <FiArrowLeft />
                Cancel
              </button>
              <button
                type="button"
                onClick={addStage}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b89945] text-[#0B1D3A] px-6 py-4 rounded-xl transition-all font-bold shadow-lg"
              >
                <FiPlus />
                Add Another Stage
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 font-medium shadow-sm"
          >
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-start gap-3 font-medium shadow-sm"
          >
            <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Successfully created {stages.length} stages! Redirecting to dashboard...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <AnimatePresence>
            {stages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
              >
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs">Journey Milestone</h3>
                  </div>
                  {stages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStage(index)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">General Info</label>
                      <input
                        required
                        placeholder="Stage Title (e.g. In Transit)"
                        value={stage.title}
                        onChange={e => updateStage(index, "title", e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all"
                      />
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="datetime-local"
                          required
                          value={stage.dateAndTime}
                          onChange={e => updateStage(index, "dateAndTime", e.target.value)}
                          className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <textarea
                        placeholder="Carrier Note / Status Update"
                        value={stage.carrierNote}
                        onChange={e => updateStage(index, "carrierNote", e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all h-[106px] resize-none"
                      />
                    </div>

                    {/* Location Info */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location Details</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          placeholder="Current Location Name"
                          value={stage.location}
                          onChange={e => updateStage(index, "location", e.target.value)}
                          className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          step="any"
                          placeholder="Latitude"
                          value={stage.latitude || ""}
                          onChange={e => updateStage(index, "latitude", +e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all"
                        />
                        <input
                          type="number"
                          step="any"
                          placeholder="Longitude"
                          value={stage.longitude || ""}
                          onChange={e => updateStage(index, "longitude", +e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Upload Proof / Document</label>
                        <input
                          type="file"
                          onChange={e => updateStage(index, "supportingDocument", e.target.files?.[0] || null)}
                          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#0B1D3A]/5 file:text-[#0B1D3A] hover:file:bg-[#0B1D3A]/10"
                        />
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payment & Fees</label>
                      <select
                        value={stage.paymentStatus}
                        onChange={e => updateStage(index, "paymentStatus", e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                      >
                        {Object.values(ShippingStagePaymentStatus).map(v => (
                          <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                        ))}
                      </select>

                      <AnimatePresence>
                        {stage.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <input
                              placeholder="Fee Name (e.g. Tax)"
                              value={stage.feeName}
                              onChange={e => updateStage(index, "feeName", e.target.value)}
                              className="w-full px-5 py-3 bg-[#0B1D3A]/5/30 border border-[#0B1D3A]/10 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <div className="relative">
                                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                <input
                                  type="number"
                                  placeholder="Fee Amount"
                                  value={stage.feeInDollars || ""}
                                  onChange={e => updateStage(index, "feeInDollars", +e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 bg-[#0B1D3A]/5/30 border border-[#0B1D3A]/10 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all text-sm"
                                />
                              </div>
                              <div className="relative">
                                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                <input
                                  type="number"
                                  placeholder="Paid"
                                  value={stage.amountPaid || ""}
                                  onChange={e => updateStage(index, "amountPaid", +e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 bg-[#0B1D3A]/5/30 border border-[#0B1D3A]/10 rounded-2xl focus:border-[#C9A84C] focus:bg-white outline-none transition-all text-sm"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mt-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-6">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Creation Batch</p>
              <p className="text-xl font-bold text-[#0B1D3A]">{stages.length} Stages Ready</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 px-8 sm:px-12 py-4 bg-[#0B1D3A] text-[#C9A84C] rounded-2xl sm:rounded-3xl font-bold shadow-xl shadow-slate-300 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <FiLoader className="w-6 h-6 animate-spin" />
              ) : (
                <FiSave className="w-6 h-6" />
              )}
              <span className="text-lg">Deploy All Stages</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
