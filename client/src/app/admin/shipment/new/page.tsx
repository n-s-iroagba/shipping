"use client";
import { routes } from "@/data/routes";
import { CreateShipmentDto } from "@/types/shipment.types";
import {
  ShippingStagePaymentStatus,
  StageCreationDto,
} from "@/types/stage.types";
import { postRequest } from "@/utils/apiUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ValidationErrors {
  [key: string]: string;
}

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  step?: string;
}

// Move InputField component outside to prevent recreation on every render
const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  required = false,
  error,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default function CreateShipmentPage() {
  const [form, setForm] = useState<CreateShipmentDto>({
    senderName: "",
    pickupPoint: "",
    recipientName: "",
    receipientEmail: "",
    destination: "",
    origin: "",
    status: "RECEIVED (WAREHOUSE)",
    shipmentDescription: "",
    expectedTimeOfArrival: new Date(),
    freightType: "LAND",
    weight: 0,
    dimensionInInches: "",
    shippingStages: [
      {
        title: "Initial Pickup",
        shipmentId: 0,
        carrierNote: "",
        dateAndTime: new Date(),
        paymentStatus: ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED,
        location: "",
        longitude: 0,
        latitude: 0,
        supportingDocument: null,
        feeName: "",
        feeInDollars: 0,
        amountPaid: 0,
        paymentDate: new Date(),
      },
    ],
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const router = useRouter();

  // Initialize with one stage by default
  const initializeDefaultStage = (): StageCreationDto => ({
    title: "Initial Pickup",
    shipmentId: 0,
    carrierNote: "",
    dateAndTime: new Date(),
    paymentStatus: ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED,
    location: "",
    longitude: 0,
    latitude: 0,
    supportingDocument: null,
    feeName: "",
    feeInDollars: 0,
    amountPaid: 0,
    paymentDate: new Date(),
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCoordinates = (value: number): boolean => {
    return !isNaN(value) && isFinite(value);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Basic shipment validation
    if (!form.senderName.trim()) errors.senderName = "Sender name is required";
    if (!form.pickupPoint.trim())
      errors.pickupPoint = "Pickup point is required";
    if (!form.recipientName.trim())
      errors.recipientName = "Recipient name is required";
    if (!form.receipientEmail.trim()) {
      errors.receipientEmail = "Recipient email is required";
    } else if (!validateEmail(form.receipientEmail)) {
      errors.receipientEmail = "Invalid email format";
    }
    if (!form.destination.trim())
      errors.destination = "Destination is required";
    if (!form.origin.trim()) errors.origin = "Origin is required";
    if (!form.shipmentDescription.trim())
      errors.shipmentDescription = "Shipment description is required";
    if (!form.weight || form.weight <= 0)
      errors.weight = "Weight must be greater than 0";
    if (!form.dimensionInInches.trim())
      errors.dimensionInInches = "Dimensions are required";

    // Stage validation
    form.shippingStages.forEach((stage, index) => {
      if (!stage.title.trim())
        errors[`stage_${index}_title`] = `Stage ${index + 1} title is required`;
      if (!stage.carrierNote.trim())
        errors[`stage_${index}_carrierNote`] =
          `Stage ${index + 1} carrier note is required`;
      if (!stage.location.trim())
        errors[`stage_${index}_location`] =
          `Stage ${index + 1} location is required`;
      if (!validateCoordinates(stage.longitude))
        errors[`stage_${index}_longitude`] =
          `Stage ${index + 1} longitude is invalid`;
      if (!validateCoordinates(stage.latitude))
        errors[`stage_${index}_latitude`] =
          `Stage ${index + 1} latitude is invalid`;

      if (stage.paymentStatus !== "NO_PAYMENT_REQUIRED") {
        if (!stage.feeInDollars || stage.feeInDollars <= 0) {
          errors[`stage_${index}_feeInDollars`] =
            `Stage ${index + 1} fee amount is required`;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "expectedTimeOfArrival"
          ? new Date(value)
          : type === "number"
            ? parseFloat(value)
            : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleStageChange = (
    index: number,
    field: string,
    value: string | File | null,
  ): void => {
    setForm((prev) => {
      const updatedShippingStages = [...prev.shippingStages];
      const updatedValue =
        (field === "dateAndTime" || field === "paymentDate") &&
        typeof value === "string"
          ? new Date(value)
          : value;

      updatedShippingStages[index] = {
        ...updatedShippingStages[index],
        [field]: updatedValue,
      };

      return { ...prev, shippingStages: updatedShippingStages };
    });

    const errorKey = `stage_${index}_${field}`;
    if (validationErrors[errorKey]) {
      setValidationErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const addStage = (): void => {
    setForm((prev) => ({
      ...prev,
      shippingStages: [
        ...prev.shippingStages,
        {
          ...initializeDefaultStage(),
          title: ``,
        },
      ],
    }));
  };

  const removeStage = (index: number): void => {
    if (form.shippingStages.length <= 1) {
      setError("At least one stage is required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setForm((prev) => {
      const updatedShippingStages = [...prev.shippingStages];
      updatedShippingStages.splice(index, 1);
      return { ...prev, shippingStages: updatedShippingStages };
    });
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0] || null;
    handleStageChange(index, "supportingDocument", file);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // Append shipment data
      formData.append("senderName", form.senderName);
      formData.append("pickupPoint", form.pickupPoint);
      formData.append("destination", form.destination);
      formData.append("origin", form.origin);
      formData.append("recipientName", form.recipientName);
      formData.append("receipientEmail", form.receipientEmail);
      formData.append("shipmentDescription", form.shipmentDescription);
      formData.append(
        "expectedTimeOfArrival",
        new Date(form.expectedTimeOfArrival).toISOString(),
      );
      formData.append("freightType", form.freightType);
      formData.append("weight", form.weight.toString());
      formData.append("dimensionInInches", form.dimensionInInches);
      formData.append("status", form.status);

      // Append shippingStages data
      form.shippingStages.forEach((stage, index) => {
        formData.append(`shippingStages[${index}][title]`, stage.title);
        formData.append(
          `shippingStages[${index}][carrierNote]`,
          stage.carrierNote,
        );
        formData.append(
          `shippingStages[${index}][dateAndTime]`,
          new Date(stage.dateAndTime).toISOString(),
        );
        formData.append(
          `shippingStages[${index}][paymentStatus]`,
          stage.paymentStatus,
        );
        formData.append(`shippingStages[${index}][location]`, stage.location);
        formData.append(
          `shippingStages[${index}][longitude]`,
          stage.longitude.toString(),
        );
        formData.append(
          `shippingStages[${index}][latitude]`,
          stage.latitude.toString(),
        );

        if (stage.feeName)
          formData.append(`shippingStages[${index}][feeName]`, stage.feeName);
        if (stage.feeInDollars)
          formData.append(
            `shippingStages[${index}][feeInDollars]`,
            stage.feeInDollars.toString(),
          );
        if (stage.amountPaid)
          formData.append(
            `shippingStages[${index}][amountPaid]`,
            stage.amountPaid.toString(),
          );
        if (stage.paymentDate)
          formData.append(
            `shippingStages[${index}][paymentDate]`,
            new Date(stage.paymentDate).toISOString(),
          );
        if (stage.supportingDocument instanceof File) {
          formData.append(
            `shippingStages[${index}][supportingDocument]`,
            stage.supportingDocument,
          );
        }
      });

      // Simulate API call
      const response = await postRequest(
        routes.shipment.create(1),
        formData,
        true,
      );

      setSuccessMessage("Shipment created successfully! Tracking ID: ");

      // Reset form
      setForm({
        senderName: "",
        pickupPoint: "",
        recipientName: "",
        receipientEmail: "",
        destination: "",
        origin: "",
        status: "RECEIVED (WAREHOUSE)",
        shipmentDescription: "",
        expectedTimeOfArrival: new Date(),
        freightType: "LAND",
        weight: 0,
        dimensionInInches: "",
        shippingStages: [initializeDefaultStage()],
      });
      router.push(`/admin/shipment/${response.data.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create shipment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto lg:px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg lg:p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Create New Shipment
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              />
            </svg>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Shipment Information */}
          <div className="bg-gray-50 lg:p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Shipment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Sender Name"
                name="senderName"
                value={form.senderName}
                onChange={handleChange}
                required
                error={validationErrors.senderName}
              />

              <InputField
                label="Pickup Point"
                name="pickupPoint"
                value={form.pickupPoint}
                onChange={handleChange}
                required
                error={validationErrors.pickupPoint}
              />

              <InputField
                label="Recipient Name"
                name="recipientName"
                value={form.recipientName}
                onChange={handleChange}
                required
                error={validationErrors.recipientName}
              />

              <InputField
                label="Recipient Email"
                name="receipientEmail"
                type="email"
                value={form.receipientEmail}
                onChange={handleChange}
                required
                error={validationErrors.receipientEmail}
              />

              <InputField
                label="Origin"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                required
                error={validationErrors.origin}
              />

              <InputField
                label="Destination"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                error={validationErrors.destination}
              />

              <InputField
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.01"
                value={String(form.weight)}
                onChange={handleChange}
                required
                error={validationErrors.weight}
              />

              <InputField
                label="Dimensions (inches)"
                name="dimensionInInches"
                value={form.dimensionInInches}
                onChange={handleChange}
                required
                error={validationErrors.dimensionInInches}
                placeholder="e.g., 12x8x6"
              />

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Freight Type<span className="text-red-500">*</span>
                </label>
                <select
                  name="freightType"
                  value={form.freightType}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LAND">Land</option>
                  <option value="AIR">Air</option>
                  <option value="SEA">Sea</option>
                </select>
              </div>

              <InputField
                label="Expected Arrival"
                name="expectedTimeOfArrival"
                type="datetime-local"
                value={
                  form.expectedTimeOfArrival instanceof Date
                    ? form.expectedTimeOfArrival.toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Shipment Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="shipmentDescription"
                value={form.shipmentDescription}
                onChange={handleChange}
                required
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  validationErrors.shipmentDescription
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Describe the shipment contents..."
              />
              {validationErrors.shipmentDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.shipmentDescription}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Stages */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Shipping Stages
              </h2>
              <button
                type="button"
                onClick={addStage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Stage
              </button>
            </div>

            {form.shippingStages.map((stage, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-lg text-gray-800">
                    Stage {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeStage(index)}
                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    disabled={form.shippingStages.length <= 1}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    name="title"
                    value={stage.title}
                    onChange={(e) =>
                      handleStageChange(index, "title", e.target.value)
                    }
                    required
                    error={validationErrors[`stage_${index}_title`]}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Date & Time<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={stage.dateAndTime.toISOString().slice(0, 16)}
                      onChange={(e) =>
                        handleStageChange(index, "dateAndTime", e.target.value)
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Payment Status<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={stage.paymentStatus}
                      onChange={(e) =>
                        handleStageChange(
                          index,
                          "paymentStatus",
                          e.target.value,
                        )
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.values(ShippingStagePaymentStatus).map(
                        (status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <InputField
                    label="Location"
                    name="location"
                    value={stage.location}
                    onChange={(e) =>
                      handleStageChange(index, "location", e.target.value)
                    }
                    required
                    error={validationErrors[`stage_${index}_location`]}
                  />

                  <InputField
                    label="Longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={String(stage.longitude)}
                    onChange={(e) =>
                      handleStageChange(index, "longitude", e.target.value)
                    }
                    required
                    error={validationErrors[`stage_${index}_longitude`]}
                  />

                  <InputField
                    label="Latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={String(stage.latitude)}
                    onChange={(e) =>
                      handleStageChange(index, "latitude", e.target.value)
                    }
                    required
                    error={validationErrors[`stage_${index}_latitude`]}
                  />

                  <InputField
                    label="Fee Name"
                    name="feeName"
                    value={stage.feeName}
                    onChange={(e) =>
                      handleStageChange(index, "feeName", e.target.value)
                    }
                  />

                  <InputField
                    label="Fee Amount ($)"
                    name="feeInDollars"
                    type="number"
                    step="0.01"
                    value={String(stage.feeInDollars)}
                    onChange={(e) =>
                      handleStageChange(index, "feeInDollars", e.target.value)
                    }
                    error={validationErrors[`stage_${index}_feeInDollars`]}
                  />

                  {stage.paymentStatus !== "NO_PAYMENT_REQUIRED" && (
                    <>
                      <InputField
                        label="Amount Paid ($)"
                        name="amountPaid"
                        type="number"
                        step="0.01"
                        value={String(stage.amountPaid)}
                        onChange={(e) =>
                          handleStageChange(index, "amountPaid", e.target.value)
                        }
                      />

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Payment Date
                        </label>
                        <input
                          type="datetime-local"
                          value={
                            stage.paymentDate instanceof Date
                              ? stage.paymentDate.toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            handleStageChange(
                              index,
                              "paymentDate",
                              e.target.value,
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Carrier Note<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={stage.carrierNote}
                      onChange={(e) =>
                        handleStageChange(index, "carrierNote", e.target.value)
                      }
                      required
                      rows={3}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        validationErrors[`stage_${index}_carrierNote`]
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter carrier notes..."
                    />
                    {validationErrors[`stage_${index}_carrierNote`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors[`stage_${index}_carrierNote`]}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Supporting Document
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {stage.supportingDocument && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {stage.supportingDocument.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Shipment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
