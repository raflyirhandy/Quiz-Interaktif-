"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30",
  secondary:
    "bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/30",
  outline:
    "border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950",
  ghost:
    "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
  danger:
    "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-red-900/30",
  success:
    "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/30",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-2xl",
  lg: "px-6 py-3 text-base rounded-2xl",
  xl: "px-8 py-4 text-lg rounded-3xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </motion.button>
  );
}
