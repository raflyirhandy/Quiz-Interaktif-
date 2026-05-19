"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  onClick,
  padding = "md",
}: CardProps) {
  const baseClass = cn(
    "rounded-3xl border transition-all duration-300",
    glass
      ? "glass"
      : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm",
    hover && "card-hover cursor-pointer",
    paddingStyles[padding],
    className
  );

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={baseClass}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClass}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-xl font-bold text-gray-800 dark:text-white", className)}>
      {children}
    </h3>
  );
}
