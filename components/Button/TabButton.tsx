import { useTheme } from "next-themes";
import data from "../../data/portfolio.json";
import React, { useEffect, useState } from "react";

interface TabButtonProps {
  children: React.ReactNode;
  type?: string;
  onClick?: () => void;
  classes?: string;
}

function TabButton({ children, type, onClick, classes }: TabButtonProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-sm tablet:text-base p-1 laptop:p-2 laptop:m-2 p-5 flex items-center transition-all ease-out duration-300 ${
        mounted && theme === "dark"
          ? "hover:bg-slate-600 text-white"
          : "hover:bg-slate-100"
      } tablet:first:ml-0  ${data.showCursor && "cursor-none"} ${classes || ""} link`}
    >
      {children}
    </button>
  );
}

export default TabButton;

