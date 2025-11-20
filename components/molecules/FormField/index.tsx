import React from "react";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Text } from "@/components/atoms/Text";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block mb-2">
        <Text variant="body" className="font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      </label>
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          error={!!error}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          error={!!error}
        />
      )}
      {error && (
        <Text variant="small" className="text-red-500 mt-1">
          {error}
        </Text>
      )}
    </div>
  );
};

export default FormField;
