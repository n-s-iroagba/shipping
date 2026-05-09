"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiSend
} from "react-icons/fi";
import { postRequest } from "@/utils/apiUtils";
import { routes } from "@/data/routes";
import { handleError } from "@/utils/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await postRequest(routes.auth.forgotPassword, { email });
      setSuccess(true);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#0f2847] to-[#0B1D3A] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative">
          {/* Header */}
          <div className="bg-[#0B1D3A] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#C9A84C]/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#C9A84C]/20">
                <FiMail className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>Reset Password</h1>
              <p className="text-white/50 text-sm">We&apos;ll send you a secure link to reset your password</p>
            </div>
          </div>

          <div className="p-8">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-800">Check Your Email</h2>
                  <p className="text-slate-500 text-sm">
                    We've sent a password reset link to <br />
                    <span className="font-bold text-slate-700">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full py-4 bg-[#0B1D3A] text-white rounded-2xl font-bold hover:bg-[#132d54] transition-all active:scale-[0.98]"
                >
                  Return to Login
                </button>
                <p className="text-xs text-slate-400">
                  Didn't receive the email? Check your spam folder.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
                  >
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-[#0B1D3A] ml-1 tracking-[0.2em] uppercase">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#C9A84C] focus:bg-white focus:ring-4 focus:ring-[#C9A84C]/10 transition-all duration-200 outline-none text-[#0B1D3A]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#0B1D3A] text-white rounded-2xl font-bold shadow-lg shadow-[#0B1D3A]/20 hover:bg-[#132d54] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <FiSend className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <FiSend className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors pt-2"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
