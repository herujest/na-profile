import React from "react";
import { cn } from "../../../utils/cn";

interface TextProps {
  children: React.ReactNode;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "small"
    | "caption"
    | "label";
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label";
}

const variantStyles = {
  h1: "text-4xl laptop:text-6xl laptopl:text-7xl font-light leading-tight text-gray-900 dark:text-white",
  h2: "text-3xl laptop:text-4xl font-semibold leading-tight text-gray-900 dark:text-white",
  h3: "text-2xl laptop:text-3xl font-semibold leading-tight text-gray-900 dark:text-white",
  h4: "text-xl laptop:text-2xl font-semibold leading-tight text-gray-900 dark:text-white",
  h5: "text-lg laptop:text-xl font-semibold leading-tight text-gray-900 dark:text-white",
  h6: "text-base laptop:text-lg font-semibold leading-tight text-gray-900 dark:text-white",
  body: "text-base leading-relaxed text-gray-700 dark:text-gray-300",
  small: "text-sm leading-relaxed text-gray-600 dark:text-gray-400",
  caption: "text-xs leading-relaxed text-gray-500 dark:text-gray-500",
  label: "text-sm font-medium text-gray-700 dark:text-gray-300",
};

const defaultTags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  small: "p",
  caption: "span",
  label: "label",
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  className,
  as,
}) => {
  const Component = as || (defaultTags[variant] as any);
  const baseStyles = variantStyles[variant];

  return (
    <Component className={cn(baseStyles, className)}>{children}</Component>
  );
};

export default Text;

