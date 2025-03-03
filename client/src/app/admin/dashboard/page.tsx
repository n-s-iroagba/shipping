"use client";

import { CreateShipmentModal } from "@/components/ShipmentModals";
import React, { useEffect, useState } from "react";


export interface Shipment {
  shipmentID: string;
  date: string;
  senderName: string;
  sendingAddress: string;
  destination: string;
  recipientName: string;
  currentLocation: string;
  shipmentDescription: string;
}

const adminId = "123"; // Replace with actual adminId from context or state

export const ShipmentDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);


  // Fetch shipments from backend
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(`/api/shipments?adminId=${adminId}`);
        if (!response.ok) throw new Error("Failed to fetch shipments");
        
        const data = await response.json();
        setShipments(data);
      } catch (err) {
        console.error(err)
        setError("Error fetching shipments");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Create Shipment
  const handleCreate = async (newShipment: Shipment) => {
    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipment),
      });

      if (!response.ok) throw new Error("Failed to create shipment");

      const createdShipment = await response.json();
      setShipments([...shipments, createdShipment]); // Update UI
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  // Edit Shipment


  if (loading) return <p>Loading shipments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shipment Dashboard</h1>
      <button className="bg-green-500 text-white px-4 py-2 mb-4" onClick={() => setShowCreateModal(true)}>Create Shipment</button>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Shipment ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Sender</th>
            <th className="border p-2">Recipient</th>
            <th className="border p-2">Destination</th>
            <th className="border p-2">Actions</th>
          </tr>

        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.shipmentID} className="border">
              <td className="border p-2">{shipment.shipmentID}</td>
              <td className="border p-2">{shipment.date}</td>
              <td className="border p-2">{shipment.senderName}</td>
              <td className="border p-2">{shipment.recipientName}</td>
              <td className="border p-2">{shipment.destination}</td>
              <td className="border p-2">
            <button className="bg-blue-500 text-white px-2 py-1 mr-2">View More</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {showCreateModal && <CreateShipmentModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />}
      
    </div>
  );
};
