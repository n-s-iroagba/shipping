"use client";
import React, { useState, useEffect } from "react";
import { XMarkIcon, CreditCardIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Payment, PaymentStatus } from "@/types/payment.types";
import { postRequest, putRequest } from "@/utils/apiUtils";

interface PaymentFormProps {
  existingPayment?: Payment;
  patch?: boolean;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ existingPayment, patch = false, onClose }) => {
  const [formData, setFormData] = useState({
    shippingStageId: "",
    amount: "",
    status: PaymentStatus.PENDING,
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingPayment) {
      setFormData({
        shippingStageId: existingPayment.shippingStageId.toString(),
        amount: existingPayment.amount.toString(),
        status: existingPayment.status,
        notes: existingPayment.notes || "",
      });
    }
  }, [existingPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const adminId = localStorage.getItem("admin_id");
      if (!adminId) throw new Error("Admin ID not found");

      const formDataToSend = new FormData();
      formDataToSend.append("shippingStageId", formData.shippingStageId);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("status", formData.status);
      if (formData.notes) formDataToSend.append("notes", formData.notes);
      if (file) formDataToSend.append("receipt", file);

      if (patch && existingPayment) {
        await putRequest(`/admin/payments/${adminId}/${existingPayment.id}`, formDataToSend);
      } else {
        await postRequest(`/admin/payments/${adminId}`, formDataToSend);
      }

      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save payment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CreditCardIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {patch ? "Edit" : "Add"} Payment
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="shippingStageId" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Stage ID *
              </label>
              <input
                type="number"
                id="shippingStageId"
                name="shippingStageId"
                value={formData.shippingStageId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt (optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png,.jpeg" />
                  {file && (
                    <p className="text-sm text-green-600 font-medium">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {loading ? "Saving..." : patch ? "Update" : "Add"} Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
