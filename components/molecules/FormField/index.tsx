import React from "react";
import { Input } from "../../atoms/Input";
import { Textarea } from "../../atoms/Textarea";
import { Text } from "../../atoms/Text";

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  children,
}) => {
  return (
    <div className="w-full">
      {label && (
        <Text variant="label" className="mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      )}
      {children}
      {error && (
        <Text variant="caption" className="text-red-600 dark:text-red-400 mt-1">
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text variant="caption" className="mt-1">
          {helperText}
        </Text>
      )}
    </div>
  );
};

export default FormField;

