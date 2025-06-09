import {  CreateShippingStatus, ShippingStatus, } from "@/app/types/ShipmentStatus";
import { stepUrl } from "@/data/urls";
import React, { useState } from "react";

interface ModalProps {
  onClose: () => void;
  shipmentId: number; 
}

export const AddShipmentStatusModal: React.FC<ModalProps> = ({ onClose, shipmentId }) => {
  const [formData, setFormData] = useState<CreateShippingStatus>({
  title: '',
  location: '',
  carrierNote: '',
  dateAndTime: new Date (),
  percentageNote: null,
  feeInDollars:  null,
  paymentStatus: 'NO_PAYMENT_REQUIRED',
  longitude: 0,
  latitude: 0,
  });
  const [requiresFee, setRequiresFee] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  if (name === "dateAndTime") {
    setFormData({ ...formData, [name]: new Date(value) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  const handleSubmit = async () => {
    try {
      const response = await fetch(`${stepUrl}/${shipmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  return (
 <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Shipment Stage</h2>

        <label className="block mb-2">
          Title:
          <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>
 <label className="block mb-2">
          Location:
          <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>
        <label className="block mb-2">
          Carrier Note:
          <textarea name="carrierNote" value={formData.carrierNote} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Date:
          <input
            type="date"
            name="dateAndTime"
             value={formData.dateAndTime.toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

         <div>
              <label className="block font-medium">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

                   <div>
              <label className="block font-medium">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

        <label className="block mb-2">
          <input
            type="checkbox"
            name="requiresFee"
            checked={requiresFee}
            onChange={() => setRequiresFee((prev) => !prev)}
            className="mr-2"
          />
          Requires Fee?
        </label>

        {requiresFee && (
          <>
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Fee ($)"
              name="feeInDollars"
              value={formData.feeInDollars ?? 0}
              onChange={handleChange}
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Percentage Note"
              name="percentageNote"
              value={formData.percentageNote ?? ''}
              onChange={handleChange}
            />
          </>
        )}

        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Create
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export  function EditShipmentStatusModal({ step, onClose }: { step: ShippingStatus; onClose: () => void }) {
  const [formData, setFormData] = useState(step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement| HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${stepUrl}/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  return (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Edit Shipping Stage</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Date and Time</label>
            <input
              type="datetime-local"
              name="dateAndTime"
              value={formData.dateAndTime.toISOString()}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Carrier Note</label>
            <textarea
              name="carrierNote"
              value={formData.carrierNote}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="PAID">Paid</option>
              <option value="NO_PAYMENT_REQUIRED">No need for payment</option>
              <option value="PENDING">Pending</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Percentage Note</label>
              <input
                type="number"
                name="percentageNote"
                value={formData.percentageNote ?? ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Fee (USD)</label>
              <input
                type="number"
                name="feeInDollars"
                value={formData.feeInDollars ?? ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Amount Paid</label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block font-medium">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
           value={formData.paymentDate ? new Date(formData.paymentDate).toISOString().split("T")[0] : ''}

                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>  

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



export const DeleteShipmentStatusModal: React.FC<{
  step: ShippingStatus;
  onClose: () => void;
}> = ({ step, onClose, }) => {
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${stepUrl}/${step.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    
      });

      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload()
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  }
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg modal">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => handleSubmit()} className="bg-red-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
              <button onClick={() => onClose()} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
    </>
  );
}
