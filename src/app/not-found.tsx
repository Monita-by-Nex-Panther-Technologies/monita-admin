"use client";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] mx-auto text-center space-y-6">
        <div
          className={`flex justify-center transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 transform-none"
              : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="animate-pulse-slow">
            <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1
          className={`text-2xl sm:text-3xl font-bold font-poppins mb-2 text-gray-800 transition-opacity duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          404 - Not Found
        </h1>

        <p
          className={`text-text-body text-sm sm:text-base font-poppins transition-opacity duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div
          className={`pt-4 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/dashboard"
            className="inline-block w-full sm:w-auto px-5 py-3.5 bg-[#CEEF0A] hover:bg-[#c0df00] text-black font-semibold rounded-lg transition duration-200 font-poppins shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
          >
            Return to Dashboard
          </Link>
        </div>

        <div
          className={`text-center mt-8 transition-opacity duration-700 delay-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs sm:text-sm text-gray-500 font-poppins">
            © {new Date().getFullYear()} Monita Admin. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-slow {
            animation: none;
          }
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
