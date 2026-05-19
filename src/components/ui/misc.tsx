"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "indigo" | "green" | "yellow" | "red" | "pink";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorStyles = {
  indigo: "bg-indigo-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  pink: "bg-pink-500",
};

const sizeStyles = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  color = "indigo",
  size = "md",
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden",
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorStyles[color],
            animated && "relative overflow-hidden"
          )}
          style={{ width: `${percent}%` }}
        >
          {animated && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
          )}
        </div>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-2xl shimmer",
            className
          )}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-6xl mb-4 bounce-slow">{icon}</div>}
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={cn("rounded-3xl p-6 text-white", color)}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold font-fredoka">{value}</div>
      <div className="text-sm opacity-90 mt-1">{label}</div>
    </div>
  );
}
