"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MonitaLogo from "@/assets/images/MonitaLogo.png";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

const ForgetPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Password reset requested for ${email}`);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error sending reset link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src={MonitaLogo}
                alt="Monita Logo"
                width={120}
                height={40}
                className="h-auto"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-2 text-gray-800">
              Forgot Password
            </h1>
            <p className="text-text-body text-sm sm:text-base font-poppins">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#262C05] hover:bg-[#1a2003] text-white font-semibold py-3.5 px-4 rounded-lg transition duration-200 font-poppins shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                  Sending link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/auth"
                className="text-[#262C05] hover:text-[#1a2003] text-sm font-poppins"
              >
                Back to Sign In
              </Link>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-xs sm:text-sm text-gray-500 font-poppins">
              © {new Date().getFullYear()} Monita Admin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
