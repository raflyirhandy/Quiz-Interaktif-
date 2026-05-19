"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "16px",
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
            style: { background: "#f0fdf4", color: "#15803d" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            style: { background: "#fef2f2", color: "#b91c1c" },
          },
        }}
      />
    </ThemeProvider>
  );
}
