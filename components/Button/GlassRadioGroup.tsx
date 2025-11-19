import React from "react";
import data from "../../data/portfolio.json";

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
            className={data.showCursor ? "cursor-none" : ""}
          />
          <label
            htmlFor={option.id}
            className={data.showCursor ? "cursor-none" : ""}
          >
            {option.label}
          </label>
        </React.Fragment>
      ))}
      <div className="glass-glider"></div>
    </div>
  );
};

export default GlassRadioGroup;
