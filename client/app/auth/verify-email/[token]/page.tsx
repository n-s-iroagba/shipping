"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiShield,
  FiMail,
  FiRefreshCw,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { postRequest, setAccessToken } from "@/utils/apiUtils";
import { routes } from "@/data/routes";
import { handleError } from "@/utils/utils";

export default function VerifyEmailPage() {
  const params = useParams();
  const urlToken = params.token as string;
  const router = useRouter();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState<string | null>("");
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute countdown
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ----------  Timer Logic  ---------- */
  useEffect(() => {
    if (!urlToken) {
      router.push("/auth/login");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [urlToken, router]);

  /* ----------  Handlers  ---------- */
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...code];
    pastedData.forEach((char, idx) => {
      if (/^\d$/.test(char)) newCode[idx] = char;
    });
    setCode(newCode);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some(digit => !digit)) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await postRequest(routes.auth.verifyEmail, {
        verificationCode: code.join(""),
        verificationToken: urlToken,
      });

      setAccessToken(response.accessToken);
      setMessage("Email verified successfully! Redirecting...");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const newToken = await postRequest(routes.auth.resendVerificationCode, {
        verificationToken: urlToken,
      });

      router.push(`/auth/verify-email/${newToken}`);
      setTimeLeft(300);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      setMessage("A new code has been sent to your email.");
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
          {/* Header */}
          <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
              <p className="text-slate-400 text-sm">We've sent a 6-digit code to your inbox</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Messages */}
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

            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600 text-sm"
              >
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </motion.div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-full h-14 sm:h-16 text-center text-xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200 outline-none text-slate-800"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || code.some(d => !d)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <FiRefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  "Verify Account"
                )}
              </button>
            </form>

            {/* Footer Actions */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-slate-500">
                  {canResend ? "Didn't receive the code?" : `Resend code in ${formatTime(timeLeft)}`}
                </span>
                <button
                  onClick={handleResendCode}
                  disabled={!canResend || isResending}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700 disabled:text-slate-400 transition-colors flex items-center gap-2"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                  Resend Verification Code
                </button>
              </div>

              <button
                onClick={() => router.push("/auth/login")}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Need help? <a href="mailto:support@klitzcybersecurity.com" className="font-bold text-slate-700 hover:underline">Contact Support</a>
        </p>
      </motion.div>
    </div>
  );
}
