"use client";

import { Shipment } from "@/app/types/Shipment";
import { CreateShipmentModal } from "@/components/ShipmentModals";
import { adminShipmentUrl } from "@/data/urls";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";



const adminId = "1"; // Replace with actual adminId from context or state

const ShipmentDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(`${adminShipmentUrl}/${adminId}`);
        if (!response.ok) throw new Error("Failed to fetch shipments");
        const data = await response.json();
        setShipments(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching shipments");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const updateUI = async (newShipment: Shipment) => {
    setShipments([...shipments, newShipment]);
    setShowCreateModal(false);
  };

  if (loading) return <p className="text-center text-lg">Loading shipments...</p>;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-full overflow-x-auto bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Shipment Dashboard</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 mb-4 w-full md:w-auto"
        onClick={() => setShowCreateModal(true)}
      >
        Create Shipment
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Shipment ID</th>
              <th className="border p-2">Sender</th>
              <th className="border p-2">Recipient</th>
              <th className="border p-2">Destination</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.shipmentID} className="border text-center">
                <td className="border p-2">{shipment.shipmentID}</td>
                <td className="border p-2">{shipment.senderName}</td>
                <td className="border p-2">{shipment.recipientName}</td>
                <td className="border p-2">{shipment.receivingAddress}</td>
                <td className="border p-2">
                  <button className="bg-blue-500 text-white px-2 py-1 mr-2 w-full md:w-auto"
                  onClick={()=>router.push(`/admin/shipment-details/${shipment.id}`)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateShipmentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={updateUI}
        />
      )}
    </div>
  );
};

export default ShipmentDashboard;
