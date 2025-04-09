"use client";
import { Providers } from "@/store/provider";
import { Poppins } from "next/font/google";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAppSelector } from "@/hooks/useStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Providers>
          <AppContent>{children}</AppContent>
        </Providers>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, token } = useAppSelector((state) => state.auth);
  const publicPaths = ["/", "/forgot-password", "/reset-password"];

  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));
  const isAuthenticated = !!profile && !!token;

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
