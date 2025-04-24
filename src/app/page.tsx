"use client";
import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import MonitaLogo from "@/assets/images/MonitaLogo.png";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface Profile {
    id: string;
    name: string;
  }

  const [profile, setProfile] = useState<Profile | null>(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      router.push("/dashboard");
    }
  }, [profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setError(null);

    if (!phone) {
      setFormError("Phone number is required");
      toast.error("Phone number is required");
      return;
    }
    if (!password) {
      setFormError("Passcode is required");
      toast.error("Passcode is required");
      return;
    }

    setLoading(true);

    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (phone === "1234567890" && password === "password") {
            setProfile({ id: "1", name: "Admin User" });
            resolve("Login successful");
          } else {
            setError("Invalid phone number or passcode");
            reject(new Error("Invalid phone number or passcode"));
          }
          setLoading(false);
        }, 1000);
      }),
      {
        loading: "Signing in...",
        success: "Login successful! Redirecting...",
        error: "Invalid phone number or passcode",
      }
    );
  };

  const togglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
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
              style={{ height: "auto" }}
              className="h-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-3 text-gray-800">
            Monita Admin
          </h1>
          <p className="text-text-body text-sm sm:text-base font-poppins">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 font-poppins"
              >
                Passcode
              </label>
              <Link
                href="/forget-password"
                className="text-sm text-[#262C05] hover:text-[#1a2003] font-poppins"
              >
                Forgot passcode?
              </Link>
            </div>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#262C05] font-poppins"
                placeholder="Enter your passcode"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#262C05] transition-colors"
                aria-label={showPassword ? "Hide passcode" : "Show passcode"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {formError && (
            <div className="text-red-500 text-sm font-poppins">{formError}</div>
          )}

          {error && (
            <div className="text-red-500 text-sm font-poppins">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#262C05] hover:bg-[#1a2003] text-white font-semibold py-3.5 px-4 rounded-lg transition duration-200 font-poppins shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
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

export default Login;
