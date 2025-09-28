"use client";

import { routes } from "@/data/routes";
import { deleteRequest } from "@/utils/apiUtils";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface DeleteModalProps {
  id: number | string;
  onClose: () => void;
  type: "shipment" | "wallet" | "stage" | "document-template" | "bank";
  message: string;
}

const API_ROUTES_MAP = {
  shipment: routes.shipment.delete,
  wallet: routes.cryptoWallet.delete,
  stage: routes.stage.delete,
  bank: (id: number | string) => `/bank/${id}`,
  "document-template": routes.templates.delete,
};

export function DeleteConfirmationModal({
  id,
  onClose,
  type,
  message,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const endpoint = API_ROUTES_MAP[type](Number(id));
      if (!endpoint) throw new Error("Invalid deletion type");

      await deleteRequest(endpoint);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Deletion failed:", err);
      setError("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Delete
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 break-words">
              {message}
            </span>
            ? This action cannot be undone.
          </p>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Deleting...</span>
              </>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}