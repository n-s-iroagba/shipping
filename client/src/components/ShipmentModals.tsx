"use client";

import React, { useState } from "react";

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

export const CreateShipmentModal: React.FC<{
  onClose: () => void;
  onCreate: (shipment: Shipment) => void;
}> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState<Shipment>({
    shipmentID: "",
    date: "",
    senderName: "",
    sendingAddress: "",
    destination: "",
    recipientName: "",
    currentLocation: "",
    shipmentDescription: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to create shipment");

      const result = await response.json();
      onCreate(result); // Pass data back to parent
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  return (
    <div id="default-modal" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Create Shipment</h2>
        <input className="border p-2 w-full mb-2" name="shipmentID" placeholder="Shipment ID" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="date" type="date" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="senderName" placeholder="Sender Name" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="sendingAddress" placeholder="Sending Address" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="destination" placeholder="Destination" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="recipientName" placeholder="Recipient Name" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="currentLocation" placeholder="Current Location" onChange={handleChange} />
        <textarea className="border p-2 w-full mb-2" name="shipmentDescription" placeholder="Shipment Description" onChange={handleChange} />
        
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

export const EditShipmentModal: React.FC<{
  shipment: Shipment;
  onClose: () => void;
  onEdit: (shipment: Shipment) => void;
}> = ({ shipment, onClose, onEdit }) => {
  const [form, setForm] = useState<Shipment>(shipment);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/shipments/${form.shipmentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to update shipment");

      const result = await response.json();
      onEdit(result); // Pass updated data back to parent
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Edit Shipment</h2>
        <input className="border p-2 w-full mb-2" name="shipmentID" value={form.shipmentID} readOnly />
        <input className="border p-2 w-full mb-2" name="date" type="date" value={form.date} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="senderName" value={form.senderName} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="sendingAddress" value={form.sendingAddress} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="destination" value={form.destination} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="recipientName" value={form.recipientName} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="currentLocation" value={form.currentLocation} onChange={handleChange} />
        <textarea className="border p-2 w-full mb-2" name="shipmentDescription" value={form.shipmentDescription} onChange={handleChange} />

        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

  
export const DeleteShipmentModal: React.FC<{ onClose: () => void; onDelete: () => void; }> = ({ onDelete }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">Delete Shipment</h2>
          <p>Are you sure you want to delete this shipment?</p>
          <button className="bg-red-500 text-white px-4 py-2 mt-2" onClick={onDelete}>Delete</button>
        </div>
      </div>
    );
  };