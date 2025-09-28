"use client";

import { useState } from "react";
import Image from "next/image";
import {
  XMarkIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface DocumentModalProps {
  onClose: () => void;
  fileBase64: string | null; // backend always returns base64 string or null
  title: string;
}

export default function DocumentModal({
  onClose,
  fileBase64,
  title,
}: DocumentModalProps) {
  const [error, setError] = useState<string>("");

  if (!fileBase64) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 text-center">
          <DocumentTextIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-medium">No document provided</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Simple detection: PDF starts with "%PDF" which encodes to "JVBER"
  const isPdf = fileBase64.startsWith("JVBER");
  const mimeType = isPdf ? "application/pdf" : "image/png"; // fallback to PNG for images
  const docUrl = `data:${mimeType};base64,${fileBase64}`;

  const handleDownload = () => {
    try {
      const link = window.document.createElement("a");
      link.href = docUrl;
      link.download = `${title.replace(/\s+/g, "_")}.${isPdf ? "pdf" : "png"}`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download document");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              title="Download"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          {error ? (
            <div className="flex flex-col items-center text-center">
              <DocumentTextIcon className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : isPdf ? (
            <iframe
              src={docUrl}
              className="w-full h-[70vh] border rounded-lg"
              title="PDF Document"
            />
          ) : (
            <div className="max-h-[70vh] overflow-auto">
              <Image
                src={docUrl}
                alt={title}
                width={800}
                height={600}
                className="rounded-lg shadow-md max-w-full h-auto"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
