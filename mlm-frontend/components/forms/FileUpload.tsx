"use client";

import React from "react";
import { FieldError } from "react-hook-form";

interface FileUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | FieldError;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, id, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        <label htmlFor={id} className="text-sm font-medium text-foreground mb-1">
          {label}
        </label>

        <input
          ref={ref}       // REQUIRED FOR react-hook-form
          id={id}
          type="file"
          {...props}      // includes {...register("file")}
          className={`w-full text-sm text-muted-foreground border rounded-md cursor-pointer
            file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 
            file:text-sm file:font-medium file:bg-primary file:text-white 
            hover:file:bg-primary/90 transition
            ${error ? "border-red-500" : "border-border"} ${className}`}
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-xs mt-1">
            {typeof error === "string" ? error : error.message}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
export default FileUpload;
