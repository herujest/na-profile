import React from "react";
import { Text } from "../../atoms/Text";
import { cn } from "../../../utils/cn";

interface CardHeaderProps {
  title: string;
  icon?: string;
  description?: string;
  className?: string;
  gradient?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  icon,
  description,
  className,
  gradient = false,
}) => {
  return (
    <div
      className={cn(
        "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
        gradient &&
          "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <Text variant="h4">{title}</Text>
      </div>
      {description && (
        <Text variant="small" className="mt-1">
          {description}
        </Text>
      )}
    </div>
  );
};

export default CardHeader;

