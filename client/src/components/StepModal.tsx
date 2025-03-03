import { useState } from "react";

interface Order {
  id: string;
  orderStage: string;
  processedStatus: string;
}

interface ModalProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function EditOrderModal({ order, onSave, onDelete, onClose }: ModalProps) {
  const [formData, setFormData] = useState<Order>({ ...order });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            <button onClick={() => onSave(formData)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setIsDeleteConfirmOpen(true)} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg modal">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => onDelete(order.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
