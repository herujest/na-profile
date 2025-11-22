"use client";

import { ReactNode } from "react";
import { SplashProvider } from "./SplashProvider";
import Splash from "./index";

interface SplashProviderWrapperProps {
  children: ReactNode;
}

/**
 * SplashProviderWrapper - Wraps SplashProvider and Splash
 * This ensures proper structure: Provider wraps both Splash and Homepage
 */
export default function SplashProviderWrapper({ children }: SplashProviderWrapperProps) {
  return (
    <SplashProvider>
      {/* Splash screen - always rendered (controlled by internal state) */}
      <Splash />
      {/* Homepage - conditionally rendered by SplashProvider */}
      {children}
    </SplashProvider>
  );
}

