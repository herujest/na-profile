"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";

interface ScrollContextType {
  handleWorkScroll?: () => void;
  handleAboutScroll?: () => void;
  handleContactScroll?: () => void;
  setHandlers?: (handlers: {
    handleWorkScroll?: () => void;
    handleAboutScroll?: () => void;
    handleContactScroll?: () => void;
  }) => void;
}

const ScrollContext = createContext<ScrollContextType>({});

export const ScrollProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [handlers, setHandlers] = useState<{
    handleWorkScroll?: () => void;
    handleAboutScroll?: () => void;
    handleContactScroll?: () => void;
  }>({});

  const updateHandlers = useCallback((newHandlers: {
    handleWorkScroll?: () => void;
    handleAboutScroll?: () => void;
    handleContactScroll?: () => void;
  }) => {
    setHandlers(newHandlers);
  }, []);

  return (
    <ScrollContext.Provider
      value={{ ...handlers, setHandlers: updateHandlers }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  // Return context or empty object to prevent null errors during SSR
  return context || {};
};

export const useSetScrollHandlers = () => {
  const { setHandlers } = useScroll();
  return setHandlers;
};

