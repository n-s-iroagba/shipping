import React from 'react';
import Image from 'next/image';
import image  from '../../assets/images/header.jpg'
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
interface Shipment {
  id: string;
  items: string[];
  pictures: unknown[];
  currentLocation: string;
  portOfDeparture: string;
  portOfArrival: string;
  shippingCarrier: string;
  eta: string;
}

const ShipmentDashboard: React.FC = () => {
  const shipments: Shipment[] = [
    {
      id: '123456',
      items: ['Electronics', 'Furniture'],
      pictures: [
       
        
      ],
      currentLocation: 'Mid-Pacific Ocean',
      portOfDeparture: 'Port of Shanghai',
      portOfArrival: 'Port of Los Angeles',
      shippingCarrier: 'Oceanic Freights Ltd.',
      eta: '2023-10-20',
    },
    {
      id: '789123',
      items: ['Clothing', 'Machinery'],
      pictures: [
        image,image
      ],
      currentLocation: 'Docked at Rotterdam',
      portOfDeparture: 'Port of Hamburg',
      portOfArrival: 'Port of Rotterdam',
      shippingCarrier: 'EuroCargo Shipping Co.',
      eta: '2023-10-22',
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg rounded-lg min-h-[800px]">
      <header className="bg-[goldenrod] text-neutral-950 p-6 rounded-t-lg text-center">
        <h1 className="text-3xl font-title">Shipment Dashboard</h1>
      </header>
      <div className="p-4 md:p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-950 mb-4">Your Shipments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="p-4 border border-neutral-300 rounded-md bg-neutral-50">
                <h3 className="text-lg font-semibold text-neutral-950 mb-2">Shipment ID: {shipment.id}</h3>
                <p className="text-neutral-950 mb-2">Items:</p>
                <ul className="text-neutral-950 list-disc list-inside mb-4">
                  {shipment.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div className="flex gap-4 mb-4">
                  {shipment.pictures.map((picture, index) => (
                    <Image
                      key={index}
                      src={picture as StaticImport}
                      alt={`Item ${index + 1}`}
                      width={100}
                      height={100}
                      className="h-[100px] w-[150px] object-cover rounded-md"
                    />
                  ))}
                </div>
                <p className="text-neutral-950 mb-2">Current Location: {shipment.currentLocation}</p>
                <p className="text-neutral-950 mb-2">Port of Departure: {shipment.portOfDeparture}</p>
                <p className="text-neutral-950 mb-2">Port of Arrival: {shipment.portOfArrival}</p>
                <p className="text-neutral-950 mb-2">Shipping Carrier: {shipment.shippingCarrier}</p>
                <p className="text-neutral-950 mb-4">ETA: {shipment.eta}</p>
               
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShipmentDashboard;