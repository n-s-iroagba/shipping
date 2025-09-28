"use client";

import type React from "react";

import { useState } from "react";
import { XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Spinner } from "./Spinner";
import toast from "react-hot-toast";

// Email Modal
interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorId?: number;
  investorName: string;
  investorEmail: string;
  onSend: (
    mail: { subject: string; message: string },
    investorId?: number,
  ) => Promise<void>;
}

export function EmailModal({
  isOpen,
  onClose,
  investorName,
  investorEmail,
  investorId,
  onSend,
}: EmailModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSending(true);
    try {
      await onSend({ subject, message }, investorId);
      toast.success("Email sent successfully!");
      onClose();
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-50 relative max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <EnvelopeIcon className="w-6 h-6" />
            Send Email
          </h3>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-1 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-700">
            <span className="font-medium">To:</span> {investorName} (
            {investorEmail})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border-2 border-slate-100 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Enter email subject..."
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full p-3 border-2 border-slate-100 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 resize-none"
              placeholder="Enter your message..."
              disabled={isSending}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-5 py-2 border-2 border-slate-200 text-slate-800 rounded-xl hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 disabled:bg-slate-400 flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
