"use client";

import { useState } from "react";
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Payment,
  PaymentStatus,
  UpdatePaymentStatus,
} from "@/types/payment.types";
import { putRequest } from "@/utils/apiUtils";

interface PaymentApprovalModalProps {
  onClose: () => void;
  payment: Payment;
}

export function PaymentApprovalModal({
  onClose,
  payment,
}: PaymentApprovalModalProps) {
  const [formData, setFormData] = useState<UpdatePaymentStatus>({
    id: payment.id,
    status: PaymentStatus.UNPAID,
    amount: 0,
    shippingStageStatus:PaymentStatus.UNPAID
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" ? Number(value) : (value as PaymentStatus),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isNaN(formData.amount) || formData.amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      await putRequest(`/payment/${payment.id}`, formData);

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Approve Payment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount Paid *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Payment Status Dropdown */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Payment Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

                 <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Shipping stage payment status *
              </label>
              <select
                id="shippingStageStatus"
                name="shippingStageStatus"
                value={formData.shippingStageStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Approve Payment
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentApprovalModal;
