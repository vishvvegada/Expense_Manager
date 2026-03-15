"use client";

import { Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";   // ✅ Import Link

export default function ForgotPasswordOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Icon & Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email to receive an OTP
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Send OTP Button */}
          <Link
            href="/verify-otp"
            className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Send OTP
          </Link>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}
