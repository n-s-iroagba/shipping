"use client";

import { routes } from "@/data/routes";
import { postRequest, setAccessToken } from "@/utils/apiUtils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await postRequest(routes.auth.login, formData);

      if (data.isVerified === false) {
        console.log("THE FUCKING DATA IS ", data.isVerified);
        router.push(`/auth/verify-email/${data.verificationToken}`);
        return;
      }
      setAccessToken(data.loginToken);
      router.push(`/admin/dashboard`);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center pt-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-goldenrod"
      >
        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-black text-center text-xl font-semibold">
            ADMIN LOGIN
          </h2>
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-goldenrod text-black py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
