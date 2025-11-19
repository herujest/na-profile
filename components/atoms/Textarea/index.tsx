import React from "react";
import { cn } from "../../../utils/cn";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg",
          "bg-white dark:bg-gray-700",
          "text-gray-900 dark:text-white",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-all resize-none",
          error && "border-red-500 dark:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Textarea;

