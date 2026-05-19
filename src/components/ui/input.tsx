"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = "left", hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-2xl border-2 bg-white dark:bg-slate-800 py-3 text-sm font-medium",
              "text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "transition-all duration-200 outline-none",
              "focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30",
              error
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 dark:border-slate-600",
              icon && iconPosition === "left" ? "pl-11 pr-4" : "px-4",
              icon && iconPosition === "right" ? "pr-11" : "",
              className
            )}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 font-medium flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-2xl border-2 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium",
            "text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "transition-all duration-200 outline-none resize-none",
            "focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30",
            error
              ? "border-red-400"
              : "border-gray-200 dark:border-slate-600",
            className
          )}
          rows={4}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 font-medium flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-2xl border-2 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium",
            "text-gray-800 dark:text-white",
            "transition-all duration-200 outline-none cursor-pointer",
            "focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30",
            error
              ? "border-red-400"
              : "border-gray-200 dark:border-slate-600",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-500 font-medium">⚠️ {error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
