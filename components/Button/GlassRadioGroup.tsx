"use client";

import React, { useEffect, useRef } from "react";
import data from "@/lib/data/portfolio.json";

interface GlassRadioGroupProps {
  options: { id: string; label: string; value: number }[];
  selectedValue: number;
  onChange: (value: number) => void;
  name: string;
}

const GlassRadioGroup: React.FC<GlassRadioGroupProps> = ({
  options,
  selectedValue,
  onChange,
  name,
}) => {
  const gliderRef = useRef<HTMLDivElement>(null);
  const previousSelectedValue = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!gliderRef.current) return;

    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue
    );

    const totalOptions = options.length;
    let translateX = 0;

    if (selectedIndex === -1) {
      // Default to first option if not found
      translateX = 0;
      previousSelectedValue.current = selectedValue;
    } else {
      // Calculate the position: translateX is relative to the glider's own width
      // For 2 options with glider width 50% of parent:
      //   - Option 0 (index 0): translateX(0%) - glider at left (0-50% of parent)
      //   - Option 1 (index 1): translateX(100%) - glider at right (50-100% of parent)
      // Since glider width is 50%, we need to move 100% of glider width to reach second position
      // Formula: selectedIndex * 100
      // For index 1: 1 * 100 = 100% (which moves glider 50% of parent, covering 50-100%)
      translateX = selectedIndex * 100;
    }

    // Check if value actually changed (not initial mount)
    const isInitialMount = previousSelectedValue.current === undefined;
    const valueChanged =
      !isInitialMount && previousSelectedValue.current !== selectedValue;

    // Update glider position and style
    gliderRef.current.style.width = `${100 / totalOptions}%`;
    gliderRef.current.style.transform = `translateX(${translateX}%)`;

    // Update glider color based on selection (gold for both options as per original)
    gliderRef.current.style.background =
      "linear-gradient(135deg, #ffd70055, #ffcc00)";
    gliderRef.current.style.boxShadow =
      "0 0 18px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 235, 150, 0.4) inset";

    // Update previous value
    previousSelectedValue.current = selectedValue;
  }, [selectedValue, options]);

  return (
    <div className="glass-radio-group">
      {options.map((option, index) => (
        <React.Fragment key={option.id}>
          <input
            type="radio"
            id={option.id}
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
          />
          <label
            htmlFor={option.id}
          >
            {option.label}
          </label>
        </React.Fragment>
      ))}
      <div ref={gliderRef} className="glass-glider"></div>
    </div>
  );
};

export default GlassRadioGroup;
