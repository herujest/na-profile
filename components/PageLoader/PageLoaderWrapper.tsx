"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PageLoaderProvider, usePageLoader } from "./PageLoaderContext";

// Dynamically import PageLoader to enable code splitting
const PageLoader = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => null,
});

function PageLoaderRenderer() {
  const { isPageLoaderVisible } = usePageLoader();

  // Don't render if PageLoader should be hidden
  if (!isPageLoaderVisible) {
    return null;
  }

  return <PageLoader />;
}

export default function PageLoaderWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server
  if (!isMounted) {
    return null;
  }

  return (
    <PageLoaderProvider>
      <PageLoaderRenderer />
    </PageLoaderProvider>
  );
}

