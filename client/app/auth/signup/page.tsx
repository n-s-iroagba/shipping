"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ErrorAlert from "@/components/ErrorAlert";
import { postRequest } from "@/utils/apiUtils";
import { routes } from "@/data/routes";
import { handleError } from "@/utils/utils";

export default function SignupPage() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-slate-200";
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-amber-500";
    if (passwordStrength <= 75) return "bg-[#C9A84C]";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setError("Please choose a stronger password");
      setIsLoading(false);
      return;
    }

    const data = { email, password, username };

    try {
      const response = await postRequest(routes.auth.signup, data);
      router.push(`/auth/verify-email/${response}`);
    } catch (err) {
      console.error("Signup error:", err);
      handleError(err, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#0f2847] to-[#0B1D3A] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="bg-[#0B1D3A] p-6 text-center border-b border-white/5">
            <Image
              src="/arbor-logo.png"
              alt="Arbor Global"
              width={48}
              height={48}
              className="mx-auto mb-3 rounded-lg"
            />
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Create Account
            </h2>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#C9A84C] mt-1">
              Client Registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && <ErrorAlert message={error} />}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#0B1D3A] mb-2 tracking-[0.2em] uppercase">
                  Full Name
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  data-cy="name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition duration-200 bg-slate-50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0B1D3A] mb-2 tracking-[0.2em] uppercase">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  data-cy="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition duration-200 bg-slate-50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0B1D3A] mb-2 tracking-[0.2em] uppercase">
                  Password
                </label>
                <input
                  name="password"
                  type="text"
                  required
                  data-cy="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition duration-200 bg-slate-50"
                  placeholder="Create a strong password"
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Strength:</span>
                      <span className="text-[10px] font-semibold text-[#0B1D3A]">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#0B1D3A] mb-2 tracking-[0.2em] uppercase">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="text"
                  required
                  data-cy="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition duration-200 bg-slate-50"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              data-cy="submit"
              disabled={isLoading}
              className="w-full bg-[#0B1D3A] hover:bg-[#132d54] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="text-[#C9A84C] hover:text-[#b89540] font-medium transition duration-200"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Password requirements */}
        <div className="mt-6 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
          <h3 className="text-[10px] font-semibold text-[#C9A84C] mb-3 tracking-[0.2em] uppercase">Security Requirements</h3>
          <ul className="text-xs text-white/50 space-y-1.5">
            <li className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? 'bg-emerald-400' : 'bg-white/20'}`}></span>
              At least 8 characters
            </li>
            <li className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-emerald-400' : 'bg-white/20'}`}></span>
              One uppercase letter
            </li>
            <li className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[0-9]/.test(password) ? 'bg-emerald-400' : 'bg-white/20'}`}></span>
              One number
            </li>
            <li className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(password) ? 'bg-emerald-400' : 'bg-white/20'}`}></span>
              One special character
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}