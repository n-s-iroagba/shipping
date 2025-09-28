"use client";

import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShippingStagePaymentStatus } from "@/types/stage.types";
import { postRequest } from "@/utils/apiUtils";
import { routes } from "@/data/routes";

/** ------------  Type helpers  ------------ */
interface Stage {
  title: string;
  shipmentId: string;
  carrierNote: string;
  dateAndTime: string; // ISO string "yyyy‑MM‑ddTHH:mm"
  paymentStatus: ShippingStagePaymentStatus;
  location: string;
  longitude: number;
  latitude: number;
  feeName: string;
  feeInDollars: number;
  amountPaid: number;
  paymentDate: string; // ISO string
  supportingDocument: File | null;
}

interface FormState {
  stages: Stage[];
  error: string | null;
  isSubmitting: boolean;
}

/** ------------  Utilities  ------------ */
const nowLocalIso = () => new Date().toISOString().slice(0, 16); // strips seconds+Z

const buildDefaultStage = (shipmentId: string): Stage => ({
  title: "",
  shipmentId,
  carrierNote: "",
  dateAndTime: nowLocalIso(),
  paymentStatus: ShippingStagePaymentStatus.NO_PAYMENT_REQUIRED,
  location: "",
  longitude: 0,
  latitude: 0,
  feeName: "",
  feeInDollars: 0,
  amountPaid: 0,
  paymentDate: nowLocalIso(),
  supportingDocument: null,
});

/** ------------  Component  ------------ */
export default function BulkCreateStagesForm() {
  /* ----------  URL param handling ---------- */
  const params = useParams();
  const shipmentId = params.id as string;
  const router = useRouter();

  /* ----------  State ---------- */
  const [state, setState] = useState<FormState>({
    stages: [buildDefaultStage(shipmentId)],
    error: null,
    isSubmitting: false,
  });

  /* ----------  Handlers ---------- */
  const updateStage = useCallback(
    (index: number, field: keyof Stage, value: unknown) =>
      setState((prev) => {
        const stages = [...prev.stages];
        stages[index] = { ...stages[index], [field]: value } as Stage;
        return { ...prev, stages };
      }),
    [],
  );

  const addStage = () =>
    setState((prev) => ({
      ...prev,
      stages: [...prev.stages, buildDefaultStage(shipmentId)],
    }));

  const removeStage = (index: number) =>
    setState((prev) => {
      if (prev.stages.length === 1)
        return { ...prev, error: "At least one stage is required." };
      const stages = prev.stages.filter((_, i) => i !== index);
      return { ...prev, stages, error: null };
    });

  const onFileChange = (idx: number, e: ChangeEvent<HTMLInputElement>) =>
    updateStage(idx, "supportingDocument", e.target.files?.[0] ?? null);

  /* ----------  Submit ---------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState((p) => ({ ...p, isSubmitting: true, error: null }));

    try {
      /* Build multipart payload so files go through */
      const formData = new FormData();

      state.stages.forEach((stage, i) =>
        formData.append(
          `stages[${i}]`,
          JSON.stringify({ ...stage, supportingDocument: undefined }),
        ),
      );
      state.stages.forEach((stage, i) => {
        if (stage.supportingDocument) {
          formData.append(
            `supportingDocument[${i}]`,
            stage.supportingDocument,
            stage.supportingDocument.name,
          );
        }
      });

      const res = await postRequest(routes.stage.create(shipmentId), formData);

      if (!res.ok) throw new Error("Failed to create stages");

      /* Success – you can redirect, toast, etc. */
      router.refresh(); // revalidate current route if you have server components
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setState((p) => ({ ...p, error: errorMessage }));
    } finally {
      setState((p) => ({ ...p, isSubmitting: false }));
    }
  };

  // Early return after hooks to avoid conditional hook usage
  if (!shipmentId) {
    return (
      <p className="text-red-600">
        ❌ Shipment ID missing. Provide it as <code>?shipmentId=123</code> in
        the URL.
      </p>
    );
  }

  /* ----------  Render ---------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Add Stages to Shipment #{shipmentId}
        </h2>
        <button
          type="button"
          onClick={addStage}
          className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
        >
          + Add Stage
        </button>
      </header>

      {state.error && (
        <p className="rounded bg-red-100 px-4 py-2 text-red-700">
          {state.error}
        </p>
      )}

      {state.stages.map((stage, index) => (
        <section key={index} className="rounded border p-4">
          <header className="mb-4 flex items-start justify-between">
            <h3 className="font-medium">Stage {index + 1}</h3>
            <button
              type="button"
              disabled={state.stages.length === 1}
              onClick={() => removeStage(index)}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-40"
            >
              Remove
            </button>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium">Title *</label>
              <input
                required
                value={stage.title}
                onChange={(e) => updateStage(index, "title", e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            {/* Carrier Note */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Carrier Note
              </label>
              <input
                value={stage.carrierNote}
                onChange={(e) =>
                  updateStage(index, "carrierNote", e.target.value)
                }
                className="w-full rounded border p-2"
              />
            </div>

            {/* Date/Time */}
            <div>
              <label className="mb-1 block text-sm font-medium">Date *</label>
              <input
                type="datetime-local"
                required
                value={stage.dateAndTime}
                onChange={(e) =>
                  updateStage(index, "dateAndTime", e.target.value)
                }
                className="w-full rounded border p-2"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment Status
              </label>
              <select
                value={stage.paymentStatus}
                onChange={(e) =>
                  updateStage(
                    index,
                    "paymentStatus",
                    e.target.value as ShippingStagePaymentStatus,
                  )
                }
                className="w-full rounded border p-2"
              >
                {Object.values(ShippingStagePaymentStatus).map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Document */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Supporting Document
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => onFileChange(index, e)}
                className="block"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                value={stage.location}
                onChange={(e) => updateStage(index, "location", e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            {/* Fee Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">Fee Name</label>
              <input
                value={stage.feeName}
                onChange={(e) => updateStage(index, "feeName", e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            {/* Fee in Dollars */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Fee (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={stage.feeInDollars}
                onChange={(e) =>
                  updateStage(index, "feeInDollars", +e.target.value)
                }
                className="w-full rounded border p-2"
              />
            </div>

            {/* Amount Paid */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Amount Paid
              </label>
              <input
                type="number"
                step="0.01"
                value={stage.amountPaid}
                onChange={(e) =>
                  updateStage(index, "amountPaid", +e.target.value)
                }
                className="w-full rounded border p-2"
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment Date
              </label>
              <input
                type="datetime-local"
                value={stage.paymentDate}
                onChange={(e) =>
                  updateStage(index, "paymentDate", e.target.value)
                }
                className="w-full rounded border p-2"
              />
            </div>
          </div>
        </section>
      ))}

      <footer className="flex justify-end">
        <button
          type="submit"
          disabled={state.isSubmitting}
          className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-60"
        >
          {state.isSubmitting ? "Saving…" : "Save All Stages"}
        </button>
      </footer>
    </form>
  );
}
