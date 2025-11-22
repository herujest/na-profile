"use client";

import React from "react";

interface SpinnerProps {
  size?: number | string;
  borderWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Spinner Atom Component
 * A reusable loading spinner component that can be used across the application
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  borderWidth = 3,
  primaryColor = "#EF836E",
  secondaryColor = "#f3f3f3",
  className = "",
  style,
}) => {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        border: `${borderWidth}px solid ${secondaryColor}`,
        borderTop: `${borderWidth}px solid ${primaryColor}`,
        borderRadius: "50%",
        animation: "spinner-spin 1s linear infinite",
        willChange: "transform",
        ...style,
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;

