"use client";

import React, { useState, Suspense } from "react";
import nextDynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMail,
  FiSend,
  FiTrash2,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiEye
} from "react-icons/fi";
import { postRequest } from "@/utils/apiUtils";
import { handleError } from "@/utils/utils";

// Dynamically import the editor with no SSR
const CustomEditor = nextDynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
      Loading professional editor...
    </div>
  )
});

function EmailForm() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";

  const [editorContent, setEditorContent] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Please enter an email subject");
      return;
    }

    if (!editorContent.trim() || editorContent === "<p><br></p>") {
      setError("Email content cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await postRequest("/shipment/send/mail", {
        subject,
        content: editorContent,
        email,
      });

      setSuccess(true);
      setSubject("");
      setEditorContent("");

      // Reset success after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <FiArrowLeft />
            Back to Shipments
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-400 font-medium">Recipient:</span>
            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm">
              {email || "No recipient selected"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <FiMail className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Compose Email</h1>
                <p className="text-slate-400 text-sm">Draft a professional message to your client</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Status Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm font-medium"
              >
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600 text-sm font-medium"
              >
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Email sent successfully! Your message is on its way.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Update on Shipment #TRK123456"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200 outline-none text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message Body</label>
                <div className="rounded-2xl border-2 border-slate-100 overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all duration-200">
                  <CustomEditor
                    value={editorContent}
                    onChange={(content: string) => setEditorContent(content)}
                    placeholder="Write your professional message here..."
                  />
                </div>
                <p className="text-[10px] text-slate-400 ml-1 italic uppercase tracking-wider font-bold">
                  Note: Your message will be automatically wrapped in a professional template
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <FiSend className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FiSend className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubject("");
                    setEditorContent("");
                    setError("");
                  }}
                  className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-3"
                >
                  <FiTrash2 />
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <FiEye className="w-4 h-4" />
          <span>All outgoing emails are logged for security purposes</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function SendMailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EmailForm />
    </Suspense>
  );
}
