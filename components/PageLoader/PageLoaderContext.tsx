"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PageLoaderContextType {
  isPageLoaderVisible: boolean;
  hidePageLoader: () => void;
}

const PageLoaderContext = createContext<PageLoaderContextType | undefined>(
  undefined
);

export const PageLoaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPageLoaderVisible, setIsPageLoaderVisible] = useState(true);

  const hidePageLoader = () => {
    setIsPageLoaderVisible(false);
  };

  return (
    <PageLoaderContext.Provider value={{ isPageLoaderVisible, hidePageLoader }}>
      {children}
    </PageLoaderContext.Provider>
  );
};

export const usePageLoader = () => {
  const context = useContext(PageLoaderContext);
  if (context === undefined) {
    throw new Error("usePageLoader must be used within a PageLoaderProvider");
  }
  return context;
};

