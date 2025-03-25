"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/ui/Toast";
import { Provider } from "react-redux";
import { store } from "@/store";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {isClient ? (
          <Provider store={store}>
            <AppContent>{children}</AppContent>
            <Toast />
          </Provider>
        ) : (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#CEEF0A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, tokens } = useAppSelector((state) => state.auth);
  const publicPaths = ["/auth", "/forgot-password", "/reset-password"];

  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));
  const isAuthenticated = !!user && !!tokens?.accessToken;

  useEffect(() => {
    if (isAuthenticated && isPublicPath) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isPublicPath, router]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
