'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';

import { shipmentUrl } from '@/data/urls';
import { Shipment } from '@/app/types/Shipment';
import { ShippingStatus } from '@/app/types/ShipmentStatus';

import Loading from '@/components/Loading';
import {
  EditShipmentModal,
  DeleteShipmentModal,
} from '@/components/ShipmentModals';
import {
  AddShipmentStatusModal,
  EditShipmentStatusModal,
  DeleteShipmentStatusModal,
} from '@/components/ShipmentStatusModal';

const AdminShipmentDetails = () => {
  const params = useParams();
  const shipmentId = params.id;

  const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddShipmentStatusModal, setShowAddShipmentStatusModal] = useState(false);
  const [showEditShipmentStatusModal, setShowEditShipmentStatusModal] = useState(false);
  const [showDeleteShipmentStatusModal, setShowDeleteShipmentStatusModal] = useState(false);
  const [selectedShipmentStatus, setSelectedShipmentStatus] = useState<ShippingStatus | null>(null);

  useEffect(() => {
    if (!shipmentId) return;

    const fetchShipmentDetails = async () => {
      try {
        const res = await fetch(`${shipmentUrl}/${shipmentId}`);
        if (!res.ok) throw new Error('Failed to fetch shipment details');

        const data = await res.json();
        setShipmentDetails(data);
      } catch (error) {
        alert('An error occurred, try again later');
        console.error(error);
      }
    };

    fetchShipmentDetails();
  }, [shipmentId]);

  if (!shipmentDetails) return <Loading />;

  return (
    <div className="bg-white text-black p-4">
      <h2 className="text-center text-xl font-bold mb-4">Shipment Details</h2>

      <div className="space-y-2">
        <Detail label="Shipment ID" value={shipmentDetails.shipmentID} />
        <Detail label="Sender" value={shipmentDetails.senderName} />
        <Detail label="Sending Port" value={shipmentDetails.sendingAddress} />
        <Detail label="Delivery Address" value={shipmentDetails.receivingAddress} />
        <Detail label="Recipient" value={shipmentDetails.recipientName} />
        <Detail label="Description" value={shipmentDetails.shipmentDescription} />
      </div>

      <div className="flex justify-evenly my-4">
        <button onClick={() => setShowEditModal(true)} className="bg-blue-500 text-white px-4 py-1 rounded">
          Edit Shipment
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="bg-red-500 text-white px-4 py-1 rounded">
          Delete Shipment
        </button>
      </div>

      <h3 className="text-md font-semibold text-center mt-6 mb-2">Shipment Status</h3>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowAddShipmentStatusModal(true)}
          className="bg-goldenrod text-white px-4 py-1 rounded"
        >
          Add Shipment Status
        </button>
      </div>

      <div className="space-y-4">
        {shipmentDetails.shipmentStatus?.map((stat, index) => (
          <div key={stat.id} className="flex gap-4 relative">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faBox} className="text-gray-500 h-5 w-5" />
              </div>
              {index < shipmentDetails.shipmentStatus.length - 1 && (
                <div className="w-0.5 bg-blue-600 flex-1 mt-1 min-h-[2rem]"></div>
              )}
            </div>

            <div className="flex-1 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{stat.title}</h4>
                  <p className="text-gray-600 mb-1">Location: {stat.location}</p>
                  <p className="text-gray-600 mb-2">Carrier Note: {stat.carrierNote}</p>
                  <small className="text-sm text-gray-500">
                    {new Date(stat.dateAndTime).toLocaleString()}
                  </small>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedShipmentStatus(stat);
                      setShowEditShipmentStatusModal(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedShipmentStatus(stat);
                      setShowDeleteShipmentStatusModal(true);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {stat.feeInDollars && stat.feeInDollars > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600">
                    Fee Required:{' '}
                    <span className="text-lg font-medium text-amber-600">${stat.feeInDollars}</span>
                  </p>
                  <p className="text-gray-600">
                    Payment Status:{' '}
                    <span
                      className={`font-medium ${
                        stat.paymentStatus === 'PAID'
                          ? 'text-green-600'
                          : stat.paymentStatus === 'PENDING'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.paymentStatus}
                    </span>
                  </p>
                  {stat.percentageNote && (
                    <p className="text-sm text-gray-600">{stat.percentageNote}% of shipment value</p>
                  )}
                  {stat.amountPaid && (
                    <>
                      <p className="text-gray-600">
                        Amount Paid:{' '}
                        <span className="text-lg font-medium text-green-600">${stat.amountPaid}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Payment Date:{' '}
                        {stat.paymentDate && new Date(stat.paymentDate).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditShipmentModal shipment={shipmentDetails} onClose={() => setShowEditModal(false)} />
      )}
      {showDeleteModal && (
        <DeleteShipmentModal shipment={shipmentDetails} onClose={() => setShowDeleteModal(false)} />
      )}
      {showAddShipmentStatusModal && (
        <AddShipmentStatusModal
          onClose={() => setShowAddShipmentStatusModal(false)}
          shipmentId={Number(shipmentDetails.id)}
        />
      )}
      {showEditShipmentStatusModal && selectedShipmentStatus && (
        <EditShipmentStatusModal
          step={selectedShipmentStatus}
          onClose={() => setShowEditShipmentStatusModal(false)}
        />
      )}
      {showDeleteShipmentStatusModal && selectedShipmentStatus && (
        <DeleteShipmentStatusModal
          step={selectedShipmentStatus}
          onClose={() => setShowDeleteShipmentStatusModal(false)}
        />
      )}
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string | number }) => (
  <p className="rounded border-b-4 border-goldenrod p-2">
    <strong>{label}:</strong> {value}
  </p>
);

export default AdminShipmentDetails;
