"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useStore";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#CEEF0A] border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const { profile, token, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const isAuthenticated = !!profile && !!token;
  const isAdmin = !!profile;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else if (adminOnly && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [isAuthenticated, adminOnly, isAdmin, router]);

  if (loading || !isAuthenticated || (adminOnly && !isAdmin)) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
