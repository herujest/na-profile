"use client";

import React, { useEffect, useState, forwardRef } from "react";
import { useTheme } from "next-themes";
import data from "@/lib/data/portfolio.json";

interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "secondary";
  onClick?: () => void;
  classes?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type, onClick, classes }, ref) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (type === "primary") {
      return (
        <button
          ref={ref}
          onClick={onClick}
          type="button"
          className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg ${
            mounted && theme === "dark" ? "bg-white text-black" : "bg-black text-white"
          }  transition-all duration-300 ease-out first:ml-0 hover:scale-105 active:scale-100 link ${classes || ""}`}
        >
          {children}
        </button>
      );
    }
    return (
      <button
        ref={ref}
        onClick={onClick}
        type="button"
        className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg flex items-center transition-all ease-out duration-300 ${
          mounted && theme === "dark"
            ? "hover:bg-slate-600 text-white"
            : "hover:bg-slate-100"
        } hover:scale-105 active:scale-100  tablet:first:ml-0 ${classes || ""} link`}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

