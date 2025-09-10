"use client";

import { postRequest } from "@/utils/apiUtils";
import { useState } from "react";

interface VerificationModalProps {
  onClose: () => void;
  token:string
}

export default function VerificationModal({ onClose,token }: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await postRequest('/shipment/sensitive/access',{code,token})
      sessionStorage.setItem("temp-shipping-view", response)
      window.location.reload(); // reload to fetch full details
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">Verify Access</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter the code sent to your email to view complete shipment details.
        </p>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={loading || !code}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
