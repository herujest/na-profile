import { useTheme } from "next-themes";
import data from "../../data/portfolio.json";
import React from "react";

function TabButton({ children, type, onClick, classes }) {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-sm tablet:text-base p-1 laptop:p-2 laptop:m-2 p-5 flex items-center transition-all ease-out duration-300 ${
        theme === "dark"
          ? "hover:bg-slate-600 text-white"
          : "hover:bg-slate-100"
      } tablet:first:ml-0  ${data.showCursor && "cursor-none"} ${classes} link`}
    >
      {children}
    </button>
  );
}

export default TabButton;
