"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import { useSplash } from "./SplashProvider";

/**
 * Splash - Renders splash screen while Lottie is preloading
 * Only shows when splash is active (lottie is loading or splash is playing)
 */
export default function Splash() {
  const { lottieData, isSplashComplete, onSplashComplete } = useSplash();
  const [isSplashActive, setIsSplashActive] = useState(true);

  // Hide splash when complete
  useEffect(() => {
    if (isSplashComplete) {
      // Small delay before hiding to ensure smooth transition
      const timer = setTimeout(() => {
        setIsSplashActive(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isSplashComplete]);

  const handleSplashComplete = () => {
    setIsSplashActive(false);
    // Notify parent that splash is complete
    if (onSplashComplete) {
      onSplashComplete();
    }
  };

  // Don't render if splash is not active or complete
  if (!isSplashActive || isSplashComplete) {
    return null;
  }

  // Show splash screen with preloaded Lottie data
  return <SplashScreen lottieData={lottieData} onComplete={handleSplashComplete} />;
}

