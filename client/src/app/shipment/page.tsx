"use client"
import React, { useState } from "react";
import Image from "next/image";

interface Shipment {
  id: number;
  status: "Delivered" | "Yet to be delivered" | "Pending";
  picture: string;
  description: string;
}

const Shipment: React.FC = () => {
  // const router = useRouter()
  // const id = router.query.id
  // console.log(id)
  // Local shipments data
  const shipments: Shipment[] = [
    {
      id: 1,
      status: "Delivered",
      picture: "/path/to/delivered-image.jpg",
      description: "Shipment 1 delivered to address A",
    },
    {
      id: 2,
      status: "Yet to be delivered",
      picture: "/path/to/yet-to-be-delivered-image.jpg",
      description: "Shipment 2 yet to be delivered",
    },
    {
      id: 3,
      status: "Pending",
      picture: "/path/to/pending-image.jpg",
      description: "Shipment 3 is pending",
    },
    // Add more shipments as needed
  ];

  const [selectedStatus, setSelectedStatus] = useState<"Delivered" | "Yet to be delivered" | "Pending">("Delivered");

  const handleStatusChange = (status: "Delivered" | "Yet to be delivered" | "Pending") => {
    setSelectedStatus(status);
  };

  const filteredShipments = shipments.filter(
    (shipment) => shipment.status === selectedStatus
  );

  return (
    <div className="container mx-auto p-6 bg-white">
      {/* Status Tabs */}
      <div className="flex justify-center space-x-6 mb-6">
        {["Delivered", "Yet to be delivered", "Pending"].map((status) => (
          <div
            key={status}
            onClick={() => handleStatusChange(status as "Delivered" | "Yet to be delivered" | "Pending")}
            className={`cursor-pointer text-xl font-semibold py-2 px-4 ${
              selectedStatus === status
                ? "border-b-4 border-blue-600"
                : "text-gray-700"
            }`}
          >
            {status}
          </div>
        ))}
      </div>

      {/* Shipment List */}
      <div className="space-y-4">
        {filteredShipments.length > 0 ? (
          filteredShipments.map((shipment) => (
            <div key={shipment.id} className="border-b border-gray-300 pb-4">
              <div className="flex items-center space-x-4">
                {/* Image */}
                <Image
                  height={100}
                  width={100}
                  src={shipment.picture}
                  alt={shipment.description}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Shipment Details */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{shipment.description}</p>
                  <p className="text-gray-600">{shipment.status}</p>
                </div>
              </div>

              {/* More Button */}
              <div className="text-center mt-4">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md">
                  More
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No shipments found for this status.</p>
        )}
      </div>
    </div>
  );
};

export default Shipment;
