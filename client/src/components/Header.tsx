import React, { useState } from "react";
import Navbar from "./Navbar";
import "../assets/styles/Header.css";

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipmentDetails, setShipmentDetails] = useState({
    shipmentID: "SHIP123456",
    date: "2024-12-29",
    senderName: "John Doe",
    sendingPort: "Port of Los Angeles",
    destination: "Shanghai Port",
    recipientName: "Jane Smith",
    shipmentWeight: "500 kg",
    currentLocation: "Pacific Ocean",
    duePayment: true, // If payment is due
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock shipment details
    setShipmentDetails({
      shipmentID: "SHIP123456",
      date: "2024-12-29",
      senderName: "John Doe",
      sendingPort: "Port of Los Angeles",
      destination: "Shanghai Port",
      recipientName: "Jane Smith",
      shipmentWeight: "500 kg",
      currentLocation: "Pacific Ocean",
      duePayment: true, // If payment is due
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="relative bg-cover bg-center h-screen lg:h-[80vh] bg-image flex flex-col">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <Navbar />
      <div className="flex flex-col justify-between flex-grow">
        <div className="text-center mt-8">
          <h1 className="text-4xl my-4 text-black">LEADER IN</h1>
          <h1 className="text-4xl font-bold mb-4 text-black">
            SHIPPING LOGISTICS
          </h1>
        </div>
        <div className="relative z-10 flex items-center justify-center mb-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-goldenrod"
          >
            <div className="mb-4">
              <h2 className="text-black text-center">TRACK YOUR SHIPMENT</h2>
            </div>
            <div className="mb-4">
              <label
                htmlFor="booking-id"
                className="block text-sm font-medium text-gray-700"
              >
                Booking ID
              </label>
              <input
                type="text"
                id="booking-id"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-"
                placeholder="Type something..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-goldenrod text-black py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && shipmentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Shipment Details</h2>
            <div className="space-y-2">
              <p className="rounded border-b-4 border-black p-2">
                <strong>Shipment ID:</strong> {shipmentDetails.shipmentID}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Date:</strong> {shipmentDetails.date}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Sender:</strong> {shipmentDetails.senderName}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Sending Port:</strong> {shipmentDetails.sendingPort}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Destination:</strong> {shipmentDetails.destination}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Recipient:</strong> {shipmentDetails.recipientName}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Weight:</strong> {shipmentDetails.shipmentWeight}
              </p>
              <p className="rounded border-b-4 border-goldenrod p-2">
                <strong>Current Location:</strong>{" "}
                {shipmentDetails.currentLocation}
              </p>
              {shipmentDetails.duePayment && (
                <div className="rounded border-b-4 border-black p-2 text-red-600">
                  <strong>Payment Due:</strong> Please{" "}
                  <a href="/login" className="text-blue-600 underline">
                    log in
                  </a>{" "}
                  to make payments.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

