"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Shipment } from "@/types/shipment.types";
import Link from "next/link";
import { routes } from "@/data/routes";
import { useGetSingle } from "@/hooks/useGet";
import ErrorAlert from "@/components/ErrorAlert";
import { Spinner } from "@/components/Spinner";
import { putRequest } from "@/utils/apiUtils";

export default function EditShipmentPage() {
  const router = useRouter();
  const { id } = useParams();
  const { error, loading, data } = useGetSingle<Shipment>(
    routes.shipment.details(Number(id)),
  );
  const [shipment, setShipment] = useState<Shipment | null>(null);

  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (data) {
      setShipment(data);
    }
  }, [data]);
  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (!shipment) return;
    const { name, value, type } = e.target;
    setShipment((prev) => ({
      ...prev!,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!shipment) return;
    setShipment((prev) => ({
      ...prev!,
      expectedTimeOfArrival: new Date(e.target.value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;

    setSubmitting(true);

    try {
      await putRequest(routes.shipment.update(shipment.id), shipment);

      router.push(`/admin/shipment/${shipment.id}`);
    } catch (err) {
      console.error(err);
      alert("sorry an error occured, contact developer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Edit Shipment {shipment?.shipmentID}
        </h1>
        <Link
          href={`/admin/shipment/${id}/stages`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Manage Stages
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {shipment && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Sender Name
              </label>
              <input
                required
                name="senderName"
                value={shipment.senderName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pickup Point
              </label>
              <input
                required
                name="pickupPoint"
                value={shipment.pickupPoint}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Name
              </label>
              <input
                required
                name="recipientName"
                value={shipment.recipientName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Email
              </label>
              <input
                required
                type="email"
                name="receipientEmail"
                value={shipment.receipientEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Origin</label>
              <input
                required
                name="origin"
                value={shipment.origin}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Destination Address
              </label>
              <input
                required
                name="destination"
                value={shipment.destination}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Freight Type
              </label>
              <select
                name="freightType"
                value={shipment.freightType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="LAND">Land</option>
                <option value="SEA">Sea</option>
                <option value="AIR">Air</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (kg)
              </label>
              <input
                required
                type="number"
                name="weight"
                value={shipment.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Dimensions (LxWxH in inches)
              </label>
              <input
                required
                name="dimensionInInches"
                value={shipment.dimensionInInches}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Expected Arrival
              </label>
              <input
                required
                type="datetime-local"
                name="expectedTimeOfArrival"
                value={new Date(shipment.expectedTimeOfArrival)
                  .toISOString()
                  .slice(0, 16)}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Shipment Description
            </label>
            <textarea
              required
              name="shipmentDescription"
              value={shipment.shipmentDescription}
              onChange={handleChange}
              className="w-full p-2 border rounded h-24"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push(`/shipments/${id}`)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
