"use client";
import { Toaster, ToasterProps } from "sonner";
import { useTheme } from "next-themes";

interface ToastProps extends Partial<ToasterProps> {
  className?: string;
}

export function Toast({
  position = "top-center",
  expand = true,
  visibleToasts = 5,
  closeButton = true,
  richColors = true,
  className,
  ...props
}: ToastProps) {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as "light" | "dark" | "system"}
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      expand={expand}
      visibleToasts={visibleToasts}
      className={className}
      toastOptions={{
        duration: 5000,
        style: {
          borderRadius: "8px",
          fontSize: "14px",
        },
        classNames: {
          success: "sonner-toast-success",
          error: "sonner-toast-error",
          loading: "sonner-toast-loading",
        },
      }}
      offset={{
        top: "32px",
        right: "32px",
        left: "32px",
      }}
      mobileOffset={{
        top: "16px",
        right: "16px",
        left: "16px",
      }}
      {...props}
    />
  );
}
