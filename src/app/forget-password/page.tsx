"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MonitaLogo from "@/assets/images/MonitaLogo.png";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { toast } from "sonner";

const ForgetPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Password reset requested for ${email}`);
      toast.success("Reset link sent successfully!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Image
              src={MonitaLogo}
              alt="Monita Logo"
              width={140}
              height={50}
              className="h-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-3 text-gray-800">
            Forgot Password
          </h1>
          <p className="text-text-body text-sm sm:text-base font-poppins">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
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
              className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
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
              href="/"
              className="text-[#262C05] hover:text-[#1a2003] text-sm font-poppins"
            >
              Back to Sign In
            </Link>
          </div>
        </form>

        <div className="text-center mt-10">
          <p className="text-xs sm:text-sm text-gray-500 font-poppins">
            © {new Date().getFullYear()} Monita Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
