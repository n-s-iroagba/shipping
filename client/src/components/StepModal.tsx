import { stepUrl } from "@/data/urls";
import React, { useState } from "react";

interface Step {
  id: string;
  orderStage: string;
  processedStatus: string;
}

interface ModalProps {

  onClose: () => void;
  shipmentId:number
}

export const  AddStepModal:React.FC<ModalProps> =({onClose,shipmentId})=> {
  const [formData, setFormData] = useState({
    orderStage: '',
    processedStatus:''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async()=>{

    try {
      const response = await fetch(`${stepUrl}/${shipmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg modal">
          <h2 className="text-lg font-semibold mb-4">Add Step</h2>
          <label className="block mb-2">
            Order Stage:
            <select
              name="orderStage"
              value={formData.orderStage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Processed">Processed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>
          <label className="block mb-4">
            Processed Status:
            <input
              type="text"
              name="processedStatus"
              value={formData.processedStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <div className="flex justify-between">
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => onClose()} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
      
          </div>
        </div>
      </div>
  
    </>
)}
export default function EditStepModal({ step, onClose }: {step:Step, onClose:()=>void}) {
  const [formData, setFormData] = useState(step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async()=>{
    try {
      const response = await fetch(`${stepUrl}/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      {/* Edit Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg modal">
          <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
          <label className="block mb-2">
            Order Stage:
            <select
              name="orderStage"
              value={formData.orderStage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Processed">Processed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>
          <label className="block mb-4">
            Processed Status:
            <input
              type="text"
              name="processedStatus"
              value={formData.processedStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <div className="flex justify-between">
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => onClose()} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
  
    </>
)}



export const DeleteStepModal: React.FC<{
  step: Step;
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
