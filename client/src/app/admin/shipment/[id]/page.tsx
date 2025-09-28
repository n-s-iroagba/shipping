"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Shipment } from "@/types/shipment.types";
import { useGetSingle } from "@/hooks/useGet";
import { routes } from "@/data/routes";
import { useAuthContext } from "@/hooks/useAuthContext";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import AdminStageList from "@/components/AdminStageList";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBalanceScale,
  FaCube,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaFlag,
  FaMailchimp,
} from "react-icons/fa";

const AdminShipment = () => {
  const [showShipmentDeleteModal, setShowShipmentDeleteModal] = useState(false);

  const router = useRouter();
  const params = useParams();
  const shipmentId = Number(params.id);
  const { displayName, loading } = useAuthContext();
  const {
    error,
    loading: detailsLoading,
    data: shipment,
  } = useGetSingle<Shipment>(routes.shipment.details(shipmentId));

  useEffect(() => {
    if (!loading && !displayName) {
      router.push("/login");
    }
  }, [displayName, loading, router]);

  if (detailsLoading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!shipment) return <ErrorAlert message={"No shipment found"} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <FaTruck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  Shipment Details
                </h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">
                  Managed by {displayName}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() =>
                  router.push(`/admin/shipment/${shipmentId}/edit`)
                }
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <FaEdit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Shipment</span>
                <span className="sm:hidden">Edit</span>
              </button>
                 <button
                onClick={() =>
                  router.push(`/admin/send-mail/?email=${shipment.receipientEmail}`)
                }
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <FaMailchimp className="w-4 h-4" />
                <span className="hidden sm:inline">Send Mail To Client</span>
                <span className="sm:hidden">Edit</span>
              </button>
              <button
                onClick={() => setShowShipmentDeleteModal(true)}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <FaTrash className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shipment Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="truncate">Basic Information</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  Shipment ID:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {shipment.shipmentID}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  Sender:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {shipment.senderName}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  Recipient:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {shipment.recipientName}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  Email:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-all">
                  {shipment.receipientEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="truncate">Location Details</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1 text-sm sm:text-base">
                  Pickup Point:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                  {shipment.pickupPoint}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1 text-sm sm:text-base">
                  Takeoff Address:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                  {shipment.origin}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1 text-sm sm:text-base">
                  Destination:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                  {shipment.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaCube className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="truncate">Shipment Specifications</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  Freight Type:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {shipment.freightType}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  <FaBalanceScale className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  Weight:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {shipment.weight} kg
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  Dimensions:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {shipment.dimensionInInches} inches
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1 text-sm sm:text-base">
                  Description:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                  {shipment.shipmentDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="truncate">Timeline</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 text-sm sm:text-base sm:w-32 flex-shrink-0">
                  ETA:
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {shipment.expectedTimeOfArrival
                    ? new Date(
                        shipment.expectedTimeOfArrival,
                      ).toLocaleDateString()
                    : "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stage List */}
        <div className="w-full">
          <h2>Stages</h2>
          <button
            onClick={() => router.push(`/admin/shipment/${shipmentId}/stages`)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <FaFlag className="w-4 h-4" />
            <span className="hidden sm:inline">View All Stages</span>
            <span className="sm:hidden"></span>
          </button>
          <AdminStageList stages={shipment.shippingStages} />
        </div>

        {/* Delete Confirmation Modal */}
        {showShipmentDeleteModal && (
          <DeleteConfirmationModal
            message="Shipment"
            type={"shipment"}
            id={shipment.id}
            onClose={() => setShowShipmentDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminShipment;
