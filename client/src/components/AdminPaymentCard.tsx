"use client";
import { useState } from "react";
import {
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiEdit,

  FiHash,

  FiClock,
} from "react-icons/fi";
import { Payment, PaymentStatus } from "@/types/payment.types";
import  DocumentModal  from "./DocumentModal";

interface PaymentCardProps {
  payment: Payment;

  onEdit: (payment: Payment) => void;
}

export default function PaymentCard({ payment, onEdit }: PaymentCardProps) {
  const [receiptToView, setReceiptToView] = useState<string | ArrayBuffer | Uint8Array<ArrayBufferLike> | null>(null);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusLabel = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.PAID:
        return "Paid";
      case PaymentStatus.UNPAID:
        return "Unpaid";
      case PaymentStatus.PENDING:
        return "Pending";
      case PaymentStatus.NO_PAYMENT_REQUIRED:
        return "No Payment Required";
      case PaymentStatus.INCOMPLETE_PAYMENT:
        return "Incomplete Payment";
      case PaymentStatus.REJECTED:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusBadgeColor = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.PAID:
        return "bg-green-100 text-green-800";
      case PaymentStatus.UNPAID:
        return "bg-red-100 text-red-800";
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PaymentStatus.NO_PAYMENT_REQUIRED:
        return "bg-gray-100 text-gray-800";
      case PaymentStatus.INCOMPLETE_PAYMENT:
        return "bg-orange-100 text-orange-800";
      case PaymentStatus.REJECTED:
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <FiDollarSign className="w-5 h-5 text-white" />
          </div>
       
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
            payment.status
          )}`}
        >
          {getStatusLabel(payment.status)}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-gray-700">
            <FiHash className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-medium">Stage ID</span>
              <p className="text-sm">{payment.shippingStageId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FiDollarSign className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-medium">Amount</span>
              <p className="text-sm">${payment.amount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FiCalendar className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-medium">Payment Date</span>
              <p className="text-sm">{formatDate(payment.dateAndTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FiClock className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-medium">Created At</span>
              <p className="text-sm">{formatDate(payment.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
            <p className="text-gray-700 text-sm">{payment.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {payment.receipt ? (
            <button
              onClick={() =>
                setReceiptToView(payment.receipt)
              }
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <FiFileText className="w-4 h-4" /> View Receipt
            </button>
          ) : (
            <span className="text-sm text-gray-500">No receipt uploaded</span>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(payment)}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
            >
              <FiEdit className="w-4 h-4" />
            </button>
           
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptToView && (
        <DocumentModal
          onClose={() => setReceiptToView(null)}
          document={receiptToView}
          title="Payment Receipt"
        />
      )}
    </div>
  );
}
