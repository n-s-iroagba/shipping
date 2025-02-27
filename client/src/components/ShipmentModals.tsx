"use client";

import React, { useState } from 'react';

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

export const CreateShipmentModal: React.FC<{ onClose: () => void; onCreate: (shipment: Shipment) => void; }> = ({ onCreate }) => {
    const [form, setForm] = useState<Shipment>({
      shipmentID: '',
      date: '',
      senderName: '',
      sendingAddress: '',
      destination: '',
      recipientName: '',
      currentLocation: '',
      shipmentDescription: ''
    });
    return (
      <div id='default-modal' className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">Create Shipment</h2>
          <input className="border p-2 w-full mb-2" placeholder="Shipment ID" onChange={e => setForm({...form, shipmentID: e.target.value})} />
          <input className="border p-2 w-full mb-2" placeholder="Date" type="date" onChange={e => setForm({...form, date: e.target.value})} />
          <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={() => onCreate(form)}>Create</button>
        </div>
      </div>
    );
};

export const EditShipmentModal: React.FC<{ shipment: Shipment; onClose: () => void; onEdit: (shipment: Shipment) => void; }> = ({ shipment, onEdit }) => {
    const [form, setForm] = useState<Shipment>(shipment);
  
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">Edit Shipment</h2>
          <input className="border p-2 w-full mb-2" value={form.shipmentID} readOnly />
          <input className="border p-2 w-full mb-2" value={form.date} type="date" onChange={e => setForm({...form, date: e.target.value})} />
          <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={() => onEdit(form)}>Save Changes</button>
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