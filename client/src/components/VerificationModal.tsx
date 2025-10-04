"use client";

import { postRequest } from "@/utils/apiUtils";
import { useState, useCallback, useEffect } from "react";
import { XMarkIcon, ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface VerificationModalProps {
  onClose: () => void;
  token: string;
}

export default function VerificationModal({ onClose, token }: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      const input = document.getElementById('verification-code-input');
      input?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const handleClose = useCallback(() => {
    if (loading) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [loading, onClose]);
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [loading,handleClose]);



  const handleVerify = useCallback(async () => {
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await postRequest('/shipment/sensitive/access', {
        code: code.trim(),
        token
      });
      
      sessionStorage.setItem("temp-shipping-view", response);
      
      // Show success state briefly before reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [code, token, loading]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  }, [handleVerify]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setCode(value);
    if (error) setError(''); // Clear error when user starts typing
  }, [error]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        role="dialog"
        aria-labelledby="verification-title"
        aria-describedby="verification-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 id="verification-title" className="text-lg font-semibold text-gray-900">
                Verify Access
              </h3>
              <p className="text-sm text-gray-500">Security verification required</p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close verification modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="verification-description" className="text-gray-600 mb-6 leading-relaxed">
            Enter the verification code sent to your email to access complete shipment details including payment information.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm font-medium">Verification Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="verification-code-input" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="verification-code-input"
                type="text"
                value={code}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center text-lg font-mono tracking-widest"
                disabled={loading}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <p className="mt-1 text-xs text-gray-500">
                Check your email for the 6-digit verification code
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Didn't receive the code?</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Check your spam folder or wait a few minutes before requesting a new code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}