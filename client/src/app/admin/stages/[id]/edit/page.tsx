"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShippingStagePaymentStatus, Stage } from "@/types/stage.types";
import { useGetSingle } from "@/hooks/useGet";
import { routes } from "@/data/routes";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import {
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFileUpload,
} from "react-icons/fa";
import { putRequest } from "@/utils/apiUtils";

export default function EditStageForm() {
  const router = useRouter();
  const params = useParams();
  const stageId = params.id as string;
  const [formData, setFormData] = useState<Omit<Stage,'payments'>>({
    shipmentId: 0,
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "",
    carrierNote: "",
    dateAndTime: new Date(),
    paymentStatus: ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED,
    location: "",
    longitude: 0,
    latitude: 0,
    feeName: "",
    feeInDollars: 0,
    amountPaid: 0,
    supportingDocument: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        id: stage.id,
        shipmentId: stage.shipmentId,
        createdAt: stage.createdAt,
        updatedAt: stage.updatedAt,
        title: stage.title,
        carrierNote: stage.carrierNote,
        dateAndTime: stage.dateAndTime,
        paymentStatus: stage.paymentStatus,
        location: stage.location,
        longitude: stage.longitude,
        latitude: stage.latitude,
        feeName: stage.feeName || "",
        feeInDollars: stage.feeInDollars || 0,
        amountPaid: stage.amountPaid || 0,
        paymentDate: stage.paymentDate || new Date(),
        supportingDocument: stage.supportingDocument || undefined,
      });
    }
  }, [stage]);
  if (stageLoading) return <Spinner />;
  if (fetchError) return <ErrorAlert message={fetchError} />;
  if (!stage) return <ErrorAlert message="Stage not found" />;
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocument: e.target.files?.[0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append all fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(
            key,
            value instanceof Blob ? value : String(value),
          );
        }
      });

      await putRequest(routes.stage.update(stage.id), formDataToSend, true);
      router.push('/admin/shipment')
    } catch (error) {
      console.error(error);
    }finally{
      setIsSubmitting(false)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Stage</h2>
        <button
          onClick={() => router.push(`/admin/shipment/${stage.shipmentId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes className="w-5 h-5" />
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time*
              </label>
              <div className="relative">
                <input
                  required
                  type="datetime-local"
                  name="dateAndTime"
                  value={
                    formData.dateAndTime
                      ? new Date(formData.dateAndTime)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500 pl-10"
                />
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status*
              </label>
              <select
                required
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="NO_PAYMENT_REQUIRED">No Payment Required</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="INCOMPLETE_PAYMENT">Incomplete Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carrier Note*
              </label>
              <textarea
                required
                name="carrierNote"
                value={formData.carrierNote}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* Location & Payment */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <div className="relative">
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500 pl-10"
                />
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude*
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude*
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>

            {formData.paymentStatus !== "NO_PAYMENT_REQUIRED" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Name
                  </label>
                  <input
                    name="feeName"
                    value={formData.feeName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Amount ($)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="feeInDollars"
                        value={formData.feeInDollars}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500 pl-10"
                      />
                      <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Paid ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Document
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center px-4 py-6 bg-white text-slate-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <FaFileUpload className="w-8 h-8" />
                  <span className="mt-2 text-sm">Upload File</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {stage.supportingDocument && (
                  <span className="text-sm text-gray-600">
                    Document uploaded already
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <FaSave className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
