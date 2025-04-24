"use client";
import React, { useState, useEffect, Suspense } from "react";
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import MonitaLogo from "@/assets/images/MonitaLogo.png";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { maskEmail } from "@/utils/masks";
import { useAuthStore } from "@/store";
import { ResetPasswordPayload } from "@/interfaces";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const maskedEmail = maskEmail(email);
  const {
    resetPassword,
    isLoading: authLoading,
    error: authError,
    otpReference,
  } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [otp, setOtp] = useState("");

  const togglePassword = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "weak";
    if (/^[a-zA-Z0-9]+$/.test(password)) return "medium";
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      return "strong";
    }
    return "medium";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(validatePassword(newPassword));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    if (!otpReference) {
      toast.error(
        "OTP reference is missing. Please request a new password reset"
      );
      return;
    }

    const payload: ResetPasswordPayload = {
      email,
      otp,
      otpReference,
      password,
    };

    try {
      await resetPassword(payload);
      toast.success("Password reset successful!");
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setOtp("");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to reset password. Please try again."
      );
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 sm:p-6 md:p-8">
      <Toaster position="top-center" richColors />
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
            Reset Password
          </h1>
          <p className="text-text-body text-sm sm:text-base font-poppins">
            {success
              ? "Your password has been reset successfully!"
              : `Create a new password for ${maskedEmail}`}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-7">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <p className="text-gray-700 font-poppins">
              You will be redirected to the login page shortly.
            </p>
            <Link
              href="/"
              className="block w-full bg-[#262C05] hover:bg-[#1a2003] text-white font-semibold py-3.5 px-4 rounded-lg transition duration-200 font-poppins shadow-md text-center"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-7">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
              >
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
                placeholder="Enter the OTP code sent to your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
              >
                New Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("password")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#262C05]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full ${
                          passwordStrength === "weak"
                            ? "w-1/3 bg-red-500"
                            : passwordStrength === "medium"
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-green-500"
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs font-medium capitalize text-gray-500 font-poppins">
                      {passwordStrength}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-poppins">
                    Use at least 8 characters with a mix of uppercase,
                    lowercase, numbers, and symbols.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirmPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#262C05]"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-poppins">
                  Passwords do not match
                </p>
              )}
            </div>

            {authError && (
              <div className="text-red-500 text-sm font-poppins">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#262C05] hover:bg-[#1a2003] text-white font-semibold py-3.5 px-4 rounded-lg transition duration-200 font-poppins shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-[#262C05] hover:text-[#1a2003] text-sm font-poppins"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        <div className="text-center mt-10">
          <p className="text-xs sm:text-sm text-gray-500 font-poppins">
            © {new Date().getFullYear()} Monita Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;
