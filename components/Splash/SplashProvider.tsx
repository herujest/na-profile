"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface SplashContextType {
  lottieData: any | null;
  isSplashComplete: boolean;
  onSplashComplete: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

interface SplashProviderProps {
  splash: ReactNode; // Splash component - always rendered
  children: ReactNode; // Homepage - conditionally rendered
}

/**
 * SplashProvider - Controls splash screen and preloads Lottie animation
 * This ensures homepage only mounts AFTER splash is complete
 */
export function SplashProvider({ splash, children }: SplashProviderProps) {
  const [lottieData, setLottieData] = useState<any | null>(null);
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [shouldShowHomepage, setShouldShowHomepage] = useState(false);

  useEffect(() => {
    async function loadSplash() {
      try {
        // 1. Preload Lottie BEFORE splash is shown
        // This prevents spinner from appearing
        const response = await fetch("/lottie/nisaaulia-intro.json", {
          cache: "force-cache",
        });

        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.statusText}`);
        }

        const json = await response.json();
        setLottieData(json);
      } catch (error) {
        console.error("Failed to load splash animation:", error);
        // Even if animation fails, still allow splash to proceed
      }
    }

    loadSplash();
  }, []);

  // Handle splash completion callback - memoized with useCallback
  const handleSplashComplete = useCallback(() => {
    setIsSplashComplete(true);
    
    // Small delay before showing homepage to ensure smooth transition
    setTimeout(() => {
      setShouldShowHomepage(true);
      
      // Update body classes to show homepage content
      if (typeof window !== "undefined") {
        document.body.classList.remove("loading");
        document.body.classList.add("loaded", "new-page");
        // Force reflow to ensure classes are applied
        void document.body.offsetHeight;
      }
    }, 100);
  }, []);

  // Set initial body class for loading state
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.add("loading");
      document.body.classList.remove("loaded", "new-page");
    }
  }, []);

  // Render Splash and Homepage
  // Splash is always rendered (controlled by its internal state)
  // Homepage only renders AFTER splash completes
  return (
    <SplashContext.Provider
      value={{ lottieData, isSplashComplete, onSplashComplete: handleSplashComplete }}
    >
      {/* Splash - always rendered (controlled by its internal state) */}
      {splash}
      {/* Homepage - only mounts after splash completes */}
      {shouldShowHomepage ? children : null}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  return context;
}

