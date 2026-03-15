"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Verify OTP
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter the OTP sent to your email
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full mt-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Link
            href="/reset-password"
            className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Verify OTP
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Didn’t receive OTP?{" "}
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Resend OTP
          </Link>
        </p>

      </div>
    </div>
  );
}
