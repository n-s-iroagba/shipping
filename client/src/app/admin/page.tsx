'use client'
import { useState, useEffect } from "react";
import { CreateShipmentModal, DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals";

interface Shipment {
  shipmentID: string;
  date: string;
  senderName: string;
  sendingAddress: string;
  destination: string;
  recipientName: string;
  currentLocation: string;
  shipmentDescription: string;
}

export default function Dashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShipments([
        {
          shipmentID: "SHIP123456",
          date: "2024-12-29",
          senderName: "John Doe",
          sendingAddress: "Port of Los Angeles",
          destination: "Shanghai Port",
          recipientName: "Jane Smith",
          currentLocation: "Pacific Ocean",
          shipmentDescription: "A white Hyundai Sonata car",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const handleCreate = (newShipment: Shipment) => {
    setShipments([...shipments, newShipment]);
    setIsCreateOpen(false);
  };

  const handleEdit = (updatedShipment: Shipment) => {
    setShipments(shipments.map(s => s.shipmentID === updatedShipment.shipmentID ? updatedShipment : s));
    setIsEditOpen(false);
  };

  const handleDelete = (shipmentID: string) => {
    setShipments(shipments.filter(s => s.shipmentID !== shipmentID));
    setIsDeleteOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shipments</h1>
      <button onClick={() => setIsCreateOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Create New Shipment</button>
      {loading ? (
        <p>Loading shipments...</p>
      ) : shipments.length === 0 ? (
        <p>No shipments available.</p>
      ) : (
        <ul className="space-y-4">
          {shipments.map((shipment) => (
            <li key={shipment.shipmentID} className="border p-4 rounded-lg shadow-md">
              <p><strong>ID:</strong> {shipment.shipmentID}</p>
              <p><strong>Sender:</strong> {shipment.senderName}</p>
              <p><strong>Destination:</strong> {shipment.destination}</p>
              <p><strong>Current Location:</strong> {shipment.currentLocation}</p>
              <div className="mt-2">
                <button onClick={() => { setSelectedShipment(shipment); setIsEditOpen(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button onClick={() => { setSelectedShipment(shipment); setIsDeleteOpen(true); }} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {isCreateOpen && <CreateShipmentModal onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />}
      {isEditOpen && selectedShipment && <EditShipmentModal shipment={selectedShipment} onClose={() => setIsEditOpen(false)} onEdit={handleEdit} />}
      {isDeleteOpen && selectedShipment && <DeleteShipmentModal onClose={() => setIsDeleteOpen(false)} onDelete={() => handleDelete(selectedShipment.shipmentID)} />}
    </div>
  );
}
