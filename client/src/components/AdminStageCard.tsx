"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiTruck,
  FiCalendar,
  FiDollarSign,
  FiEdit,
  FiTrash,
  FiEye,
  FiUser,
  FiHash,
  FiClock,
} from "react-icons/fi";

import  DocumentModal  from "./DocumentModal";
import { ShippingStagePaymentStatus, Stage } from "@/types/stage.types";
import { useRouter } from "next/navigation";

interface AdminStageCardProps {
  stage: Stage;
  onDelete: (stage: Stage) => void;
  onPaymentStatusChange?: (stage: Stage) => void;
}

export default function AdminStageCard({
  stage,
  onDelete,
}: AdminStageCardProps) {
  const [documentToView, setDocumentToView] = useState<string | ArrayBuffer | Uint8Array<ArrayBufferLike> | null|undefined>(null);
  const router = useRouter();

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleViewDocument = (document: string | ArrayBuffer | Uint8Array<ArrayBufferLike> | undefined) => {
    setDocumentToView(document);
  };

  const onEdit = (stage: Stage) => {
    router.push(`/admin/stages/${stage.id}/edit`);
  };

  const getStatusLabel = (status: ShippingStagePaymentStatus): string => {
    switch (status) {
      case ShippingStagePaymentStatus.PAID:
        return "Paid";
      case ShippingStagePaymentStatus.UNPAID:
        return "Unpaid";
      case ShippingStagePaymentStatus.PENDING:
        return "Pending";
      case ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED:
        return "No Payment Required";
      case ShippingStagePaymentStatus.INCOMPLETE_PAYMENT:
        return "Incomplete Payment";
      default:
        return "Unknown";
    }
  };

  const getStatusBadgeColor = (status: ShippingStagePaymentStatus): string => {
    switch (status) {
      case ShippingStagePaymentStatus.PAID:
        return "bg-green-100 text-green-800";
      case ShippingStagePaymentStatus.UNPAID:
        return "bg-red-100 text-red-800";
      case ShippingStagePaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED:
        return "bg-gray-100 text-gray-800";
      case ShippingStagePaymentStatus.INCOMPLETE_PAYMENT:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FiTruck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {stage.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMapPin className="w-4 h-4" />
                <span>{stage.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(stage.paymentStatus)}`}
            >
              {getStatusLabel(stage.paymentStatus)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(stage)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit Stage"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(stage)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete Stage"
              >
                <FiTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stage Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FiCalendar className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-medium">Date & Time</span>
                <p className="text-sm">{formatDate(stage.dateAndTime)}</p>
              </div>
            </div>

            {stage.feeName && (
              <div className="flex items-center gap-3 text-gray-700">
                <FiDollarSign className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium">Fee</span>
                  <p className="text-sm">{stage.feeName}</p>
                </div>
              </div>
            )}

            {stage.paymentDate && (
              <div className="flex items-center gap-3 text-gray-700">
                <FiClock className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium">Payment Date</span>
                  <p className="text-sm">{formatDate(stage.paymentDate)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Technical Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FiHash className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-medium">Stage ID</span>
                <p className="text-sm font-mono">{stage.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FiUser className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-medium">Shipment ID</span>
                <p className="text-sm font-mono">{stage.shipmentId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FiMapPin className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm font-medium">Coordinates</span>
                <p className="text-sm">
                  {stage.latitude || "N/A"}, {stage.longitude || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carrier Note */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <FiTruck className="w-4 h-4" />
            Carrier Note
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {stage.carrierNote || "No notes available"}
          </p>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
              <FiDollarSign className="w-4 h-4" />
              Payment Actions
            </h4>
            {stage.paymentStatus !==
              ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    router.push(`/admin/stage/${stage.id}/payments`)
                  }
                  className="px-3 py-2 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                ></button>
              </div>
            )}
          </div>

          {/* Documents & Additional Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
              <FiEye className="w-4 h-4" />
              Documents & Info
            </h4>
            <div className="space-y-2">
              {stage.supportingDocument ? (
                <button
                  onClick={() =>
                    handleViewDocument(stage.supportingDocument)
                  }
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                  View Supporting Document
                </button>
              ) : (
                <p className="text-sm text-gray-500">No documents available</p>
              )}

              <div className="text-xs text-gray-500">
                <span className="font-medium">Created:</span>{" "}
                {formatDate(stage.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {documentToView && (
        <DocumentModal
          onClose={() => setDocumentToView(null)}
          document={documentToView}
          title="Supporting Document"
        />
      )}
    </div>
  );
}
