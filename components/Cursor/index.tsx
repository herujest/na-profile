"use client";

import React, { useEffect, useState } from "react";
import CustomCursor from "custom-cursor-react";
import "custom-cursor-react/dist/index.css";
import { useTheme } from "next-themes";

const Cursor: React.FC = () => {
  const theme = useTheme();
  const [mount, setMount] = useState<boolean>(false);

  const getCusomColor = (): string | undefined => {
    if (theme.theme === "dark") {
      return "#fff";
    } else if (theme.theme === "light") {
      return "#000";
    }
    return undefined;
  };

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <CustomCursor
      targets={[".link"]}
      customClass="custom-cursor"
      dimensions={30}
      fill={getCusomColor()}
      smoothness={{
        movement: 0.15,
        scale: 0.08,
        opacity: 0.15,
      }}
      targetOpacity={0.6}
      targetScale={1.8}
    />
  );
};

export default Cursor;

