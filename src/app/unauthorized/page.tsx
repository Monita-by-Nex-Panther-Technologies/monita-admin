"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function Unauthorized() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-alt p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>

        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          {user?.role && (
            <span className="block mt-2">
              Your role ({user.role}) doesn't have the required permissions.
            </span>
          )}
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-primary text-text-body hover:bg-primary/90"
          >
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full border-primary text-text-title hover:bg-primary-fade"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
