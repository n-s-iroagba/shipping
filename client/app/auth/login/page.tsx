"use client";

import { routes } from "@/data/routes";
import { postRequest, setAccessToken } from "@/utils/apiUtils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await postRequest(routes.auth.login, formData);

      if (typeof data === 'string') {
        router.push(`/auth/verify-email/${data}`);
        return;
      }

      setAccessToken(data.loginToken);
      router.push(`/admin/dashboard`);
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center px-8 justify-center bg-gradient-to-br from-[#0B1D3A] via-[#0f2847] to-[#0B1D3A] p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="bg-[#0B1D3A] p-8 text-center border-b border-white/5">
            <Image
              src="/arbor-logo.png"
              alt="Arbor Global"
              width={56}
              height={56}
              className="mx-auto mb-4 rounded-lg"
            />
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Admin Portal
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C9A84C]">Secure Access</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[10px] font-semibold text-[#0B1D3A] mb-2 tracking-[0.2em] uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition duration-200 bg-slate-50"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-[10px] font-semibold text-[#0B1D3A] mb-2 tracking-[0.2em] uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition duration-200 bg-slate-50 pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-slate-400 hover:text-[#0B1D3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/auth/forgot-password" className="text-sm text-[#C9A84C] hover:text-[#b89540] transition duration-200 font-medium">
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0B1D3A] hover:bg-[#132d54] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}