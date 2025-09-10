'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';


import { UserCircleIcon,  LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { routes } from '@/data/routes';
import api, { setAccessToken } from '@/utils/apiUtils';


interface FormState {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const urlToken = params.token;
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

type VerificationResponse = {
  verificationToken: string;
};




const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Passwords don't match");
    }

    setSubmitting(true);
    
      const payload = {
        resetPasswordToken: urlToken,
        password: form.password,
      };
    
try {
  const response = await api.post(routes.auth.resetPassword, payload);

const token = response.data.accessToken;
setAccessToken(token);
router.push(`/admin/dashboard`);
} catch (err: unknown) {
  let msg = 'Unexpected error';
  if (err instanceof Error) msg = err.message;
  console.error('Error in login handleSubmit function', err);
  setError(msg);
} finally {
  setSubmitting(false);
}
    }

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-sky-50 relative max-w-md w-full p-8">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-sky-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-sky-800 opacity-20" />

        <h1 className="text-2xl font-bold text-sky-900 mb-8 text-center flex items-center justify-center gap-2">
          <UserCircleIcon className="w-8 h-8 text-sky-700" />
          New Password
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Password', name: 'password', type: 'password', Icon: LockClosedIcon },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', Icon: LockClosedIcon },
          ].map(({ label, name, type, Icon }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-sky-700 mb-2 flex items-center gap-1">
                <Icon className="w-4 h-4" />
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name as keyof FormState]}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-xl border-2 ${
                  error?.toLowerCase().includes(name) ? 'border-red-300' : 'border-sky-100'
                } focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-sky-700 text-white rounded-xl hover:bg-sky-800 disabled:bg-sky-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}