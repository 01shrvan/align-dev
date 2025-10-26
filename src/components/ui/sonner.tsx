"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = () => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as any}
      className="toaster group"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:!bg-green-950 group-[.toaster]:!text-green-400 group-[.toaster]:!border-green-800",
          error: "group-[.toaster]:!bg-red-950 group-[.toaster]:!text-red-400 group-[.toaster]:!border-red-800",
          warning: "group-[.toaster]:!bg-orange-950 group-[.toaster]:!text-orange-400 group-[.toaster]:!border-orange-800",
          info: "group-[.toaster]:!bg-blue-950 group-[.toaster]:!text-blue-400 group-[.toaster]:!border-blue-800",
        },
      }}
    />
  );
};

export { Toaster }; 