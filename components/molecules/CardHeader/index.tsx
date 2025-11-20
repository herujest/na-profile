import React from "react";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/cn";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  variant?: "default" | "primary" | "secondary";
}

const variantStyles = {
  default: "",
  primary: "text-blue-600 dark:text-blue-400",
  secondary: "text-gray-600 dark:text-gray-400",
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  className,
  variant = "default",
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <Text
        variant="h2"
        className={cn(variantStyles[variant])}
      >
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" className="mt-2 text-gray-600 dark:text-gray-400">
          {subtitle}
        </Text>
      )}
    </div>
  );
};

export default CardHeader;
