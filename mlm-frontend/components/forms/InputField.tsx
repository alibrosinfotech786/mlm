"use client";

import React from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | FieldError;
}

export default function InputField({
  label,
  id,
  error,
  ...rest
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-foreground mb-1">
        {label}
      </label>

      <input
        id={id}
        {...rest}
        className={`w-full px-4 py-2 rounded-md border ${
          error ? "border-red-500" : "border-border"
        } bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition`}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {(error as any).message ?? error}
        </p>
      )}
    </div>
  );
}
