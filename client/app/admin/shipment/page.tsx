"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Shipment } from "@/types/shipment.types";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetList } from "@/hooks/useGet";
import { routes } from "@/data/routes";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import { FiPlus, FiEye, FiUser, FiMapPin, FiPackage } from "react-icons/fi";
import { motion } from "framer-motion";

const ShipmentDashboard: React.FC = () => {
  const { adminId, displayName } = useAuthContext();
  const {
    error,
    loading,
    data: shipments,
  } = useGetList<Shipment>(routes.shipment.list(adminId));
  const router = useRouter();

  if (error) return <ErrorAlert message={error} />;
  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-slate-600">
              Shipment Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Welcome back, {displayName}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/shipment/new")}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-slate-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-md text-sm sm:text-base"
          >
            <FiPlus className="text-lg" />
            <span className="hidden sm:inline">Create New Shipment</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </motion.div>

        {/* Shipments Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {shipments.length ? (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiPackage /> Shipment
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiUser /> Sender
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiUser /> Recipient
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FiMapPin /> Destination
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shipments.map((shipment) => (
                      <motion.tr
                        key={shipment.shipmentID}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                        className="hover:bg-indigo-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <FiPackage className="text-indigo-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-indigo-600">
                                {shipment.shipmentID}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {shipment.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800 font-medium">
                            {shipment.senderName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {shipment.pickupPoint}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800 font-medium">
                            {shipment.recipientName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800">
                            {shipment.destination}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              router.push(`/admin/shipment/${shipment.id}`)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200"
                          >
                            <FiEye /> View
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet View - Hidden on mobile and desktop */}
              <div className="hidden sm:block lg:hidden">
                <div className="space-y-4 p-4">
                  {shipments.map((shipment) => (
                    <motion.div
                      key={shipment.shipmentID}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FiPackage className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-indigo-600">
                              {shipment.shipmentID}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {shipment.id}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            router.push(`/admin/shipment/${shipment.id}`)
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 text-sm"
                        >
                          <FiEye /> View
                        </motion.button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Sender</div>
                          <div className="text-gray-800 font-medium">{shipment.senderName}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Recipient</div>
                          <div className="text-gray-800 font-medium">{shipment.recipientName}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-gray-500 text-xs mb-1">Destination</div>
                          <div className="text-gray-800">{shipment.destination}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View - Only visible on mobile */}
              <div className="sm:hidden space-y-3 p-4">
                {shipments.map((shipment) => (
                  <motion.div
                    key={shipment.shipmentID}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FiPackage className="text-indigo-600 text-sm" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-indigo-600">
                            {shipment.shipmentID}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          router.push(`/admin/shipment/${shipment.id}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 text-sm"
                      >
                        <FiEye size={14} /> View
                      </motion.button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">From:</span>{" "}
                        <span className="text-gray-800 font-medium">{shipment.senderName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">To:</span>{" "}
                        <span className="text-gray-800 font-medium">{shipment.recipientName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Destination:</span>{" "}
                        <span className="text-gray-800">{shipment.destination}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Table Footer - Only show on desktop */}
              <div className="hidden lg:block px-6 py-4 bg-gradient-to-r from-indigo-50 to-slate-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{shipments.length}</span> of{" "}
                    <span className="font-medium">{shipments.length}</span>{" "}
                    shipments
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded-md bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                      1
                    </button>
                    <button className="px-3 py-1 rounded-md bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new shipment.</p>
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/admin/shipment/new")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-slate-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <FiPlus />
                  New Shipment
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShipmentDashboard;