import React from "react";
import Navbar from "./Navbar";
import "../assets/styles/Header.css";

const Header: React.FC = () => {
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
          <form className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-indigo-600">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type something..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
