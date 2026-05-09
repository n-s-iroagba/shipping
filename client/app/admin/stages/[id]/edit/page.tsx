"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSave, 
  FiX, 
  FiCalendar, 
  FiMapPin, 
  FiDollarSign, 
  FiFileText, 
  FiTruck,
  FiNavigation,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiArrowLeft
} from "react-icons/fi";
import { ShippingStagePaymentStatus, Stage } from "@/types/stage.types";
import { useGetSingle } from "@/hooks/useGet";
import { routes } from "@/data/routes";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import { putRequest } from "@/utils/apiUtils";
import { uploadFile } from "@/components/DocumentTemplateForm";

export default function EditStageForm() {
  const router = useRouter();
  const params = useParams();
  const stageId = params.id as string;

  const [formData, setFormData] = useState<Partial<Stage>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch stage data
  const {
    data: stage,
    loading: stageLoading,
    error: fetchError,
  } = useGetSingle<Stage>(routes.stage.get(stageId));

  // Initialize form with fetched data
  useEffect(() => {
    if (stage) {
      setFormData({
        ...stage,
        // Ensure date is formatted correctly for datetime-local input
        dateAndTime: stage.dateAndTime ? new Date(stage.dateAndTime) : undefined,
        paymentDate: stage.paymentDate ? new Date(stage.paymentDate) : undefined,
      });
    }
  }, [stage]);

  if (stageLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner />
    </div>
  );
  
  if (fetchError) return <ErrorAlert message={fetchError} />;
  if (!stage) return <ErrorAlert message="Stage not found" />;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
    setError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        supportingDocument: url,
      }));
    } catch (err) {
      setError("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for JSON transmission
      const payload = {
        ...formData,
        // Convert dates back to ISO strings if they are Date objects
        dateAndTime: formData.dateAndTime instanceof Date ? formData.dateAndTime.toISOString() : formData.dateAndTime,
        paymentDate: formData.paymentDate instanceof Date ? formData.paymentDate.toISOString() : formData.paymentDate,
      };

      await putRequest(routes.stage.update(stage.id), payload);
      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/admin/shipment/${stage.shipmentId}/stages`);
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update stage. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                <FiTruck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Shipping Stage</h1>
                <p className="text-slate-400 text-sm mt-1">Update tracking details and status for Stage #{stage.id}</p>
              </div>
            </div>
            
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all font-medium text-sm border border-white/10"
            >
              <FiArrowLeft />
              Back
            </button>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 text-sm font-medium"
              >
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-start gap-3 text-sm font-medium"
              >
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Stage updated successfully! Redirecting...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Basic Info */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0B1D3A]/5 text-[#0B1D3A] rounded-lg flex items-center justify-center text-sm">01</span>
                    General Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Stage Title</label>
                      <input
                        required
                        name="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                        placeholder="e.g. Arrived at Sorting Facility"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Date & Time</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          type="datetime-local"
                          name="dateAndTime"
                          value={
                            formData.dateAndTime instanceof Date
                              ? formData.dateAndTime.toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, dateAndTime: new Date(e.target.value) }));
                          }}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Carrier Note</label>
                      <textarea
                        required
                        name="carrierNote"
                        value={formData.carrierNote || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none resize-none"
                        placeholder="Enter detailed status updates..."
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0B1D3A]/5 text-[#0B1D3A] rounded-lg flex items-center justify-center text-sm">02</span>
                    Location Details
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Location Name</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          name="location"
                          value={formData.location || ""}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                          placeholder="City, State, Country"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Latitude</label>
                        <div className="relative">
                          <FiNavigation className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-45" />
                          <input
                            required
                            type="number"
                            step="any"
                            name="latitude"
                            value={formData.latitude ?? ""}
                            onChange={handleChange}
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Longitude</label>
                        <div className="relative">
                          <FiNavigation className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 -rotate-45" />
                          <input
                            required
                            type="number"
                            step="any"
                            name="longitude"
                            value={formData.longitude ?? ""}
                            onChange={handleChange}
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Payment & Files */}
              <div className="space-y-8">
                <section className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0B1D3A]/10 text-[#0B1D3A] rounded-lg flex items-center justify-center text-sm">03</span>
                    Financial Status
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Payment Status</label>
                      <select
                        required
                        name="paymentStatus"
                        value={formData.paymentStatus || ""}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none appearance-none"
                      >
                        <option value={ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED}>No Payment Required</option>
                        <option value={ShippingStagePaymentStatus.PENDING}>Pending Approval</option>
                        <option value={ShippingStagePaymentStatus.PAID}>Fully Paid</option>
                        <option value={ShippingStagePaymentStatus.UNPAID}>Unpaid</option>
                        <option value={ShippingStagePaymentStatus.INCOMPLETE_PAYMENT}>Incomplete Payment</option>
                      </select>
                    </div>

                    {formData.paymentStatus !== ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Fee Name</label>
                          <div className="relative">
                            <FiFileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              name="feeName"
                              value={formData.feeName || ""}
                              onChange={handleChange}
                              className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                              placeholder="e.g. Customs Clearance Fee"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Fee Amount ($)</label>
                            <div className="relative">
                              <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="number"
                                step="0.01"
                                name="feeInDollars"
                                value={formData.feeInDollars ?? ""}
                                onChange={handleChange}
                                className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Amount Paid ($)</label>
                            <div className="relative">
                              <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="number"
                                step="0.01"
                                name="amountPaid"
                                value={formData.amountPaid ?? ""}
                                onChange={handleChange}
                                className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0B1D3A]/5 text-[#0B1D3A] rounded-lg flex items-center justify-center text-sm">04</span>
                    Supporting Documents
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="stage-document"
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor="stage-document"
                        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all cursor-pointer ${
                          isUploading 
                            ? "bg-slate-50 border-slate-200 cursor-not-allowed" 
                            : "bg-slate-50 border-slate-200 hover:border-[#C9A84C] hover:bg-[#0B1D3A]/5/30"
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <FiLoader className="w-10 h-10 text-[#C9A84C] animate-spin" />
                            <span className="text-sm font-bold text-[#0B1D3A]">Uploading to cloud...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#C9A84C] transition-colors">
                              <FiFileText className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-slate-700">Click to upload new document</p>
                              <p className="text-xs text-slate-500 mt-1">PDF, Image, or Word (Max 10MB)</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {formData.supportingDocument && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                            <FiCheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Document Ready</p>
                            <p className="text-[10px] text-emerald-600 truncate max-w-[200px]">{formData.supportingDocument}</p>
                          </div>
                        </div>
                        <a 
                          href={formData.supportingDocument} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:underline px-3"
                        >
                          Preview
                        </a>
                      </motion.div>
                    )}
                  </div>
                </section>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiSave className="w-5 h-5" />
                )}
                <span>Save Stage Details</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      
      <p className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
        Secured Shipping Management System v2.0
      </p>
    </div>
  );
}
