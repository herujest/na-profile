"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import Spinner from "@/components/atoms/Spinner";

interface SplashScreenProps {
  lottieData: any | null;
  onComplete: () => void;
}

/**
 * SplashScreen - Displays Lottie animation with fade out and scale up effect
 * Loops 1.5 times, then fades out with scale up
 */
export default function SplashScreen({ lottieData, onComplete }: SplashScreenProps) {
  const animationRef = useRef<AnimationItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !lottieData || hasStartedRef.current) return;

    hasStartedRef.current = true;
    let mounted = true;

    // Dynamically import lottie-web for code splitting
    const loadLottie = async () => {
      try {
        const lottieModule = await import("lottie-web");
        const lottie = lottieModule.default || lottieModule;

        if (!mounted || !containerRef.current) return;

        // Use canvas renderer for better performance
        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "canvas",
          loop: true, // Enable loop, but we'll stop at 1.5 loops
          autoplay: true,
          animationData: lottieData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            clearCanvas: true,
            progressiveLoad: true,
          },
        });

        if (!mounted || !containerRef.current) {
          anim.destroy();
          return;
        }

        animationRef.current = anim;
        setIsLoading(false);

        const totalFrames = anim.totalFrames;
        const halfLoopFrames = Math.floor(totalFrames * 0.5); // 0.5 loop frames
        let hasCompletedOneLoop = false;

        // Function to start fade out
        const startFadeOut = () => {
          if (isFadingOut || !mounted || !anim) return;

          setIsFadingOut(true);

          // Pause animation
          anim.pause();

          // Start fade out + scale up animation
          if (wrapperRef.current) {
            wrapperRef.current.style.transition =
              "opacity 1.5s ease-out, transform 1.5s ease-out";
            wrapperRef.current.style.opacity = "0";
            wrapperRef.current.style.transform = "translateZ(0) scale(3)";
          }

          // After fade out completes, notify parent that splash is done
          setTimeout(() => {
            if (!mounted) return;

            // Cleanup animation
            if (anim) {
              anim.destroy();
              animationRef.current = null;
            }

            // Notify parent that splash is complete
            onComplete();
          }, 1500); // Match fade out duration (1.5s)
        };

        // Track frames during the second half loop
        const handleSecondHalfLoop = () => {
          if (!mounted || !anim || isFadingOut || !hasCompletedOneLoop) return;

          const currentFrame = Math.floor(anim.currentFrame);

          // After completing 1 loop, check if we've reached 0.5 of the second loop
          if (currentFrame >= halfLoopFrames) {
            startFadeOut();
            anim.removeEventListener("enterFrame", handleSecondHalfLoop);
          }
        };

        // Handle first loop complete
        anim.addEventListener("loopComplete", () => {
          if (!mounted || !anim || isFadingOut) return;

          // After first loop completes (1 loop done)
          if (!hasCompletedOneLoop) {
            hasCompletedOneLoop = true;
            // Now track frames for the second half loop
            anim.addEventListener("enterFrame", handleSecondHalfLoop);
          }
        });
      } catch (err) {
        if (mounted) {
          console.error("Failed to initialize Lottie:", err);
          setIsLoading(false);
          // Fallback: complete splash even if animation fails
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      }
    };

    // Load Lottie immediately since data is already preloaded
    loadLottie();

    return () => {
      mounted = false;
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [lottieData, isFadingOut, onComplete]);

  return (
    <div
      ref={wrapperRef}
      className="splash-screen"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        willChange: "opacity, transform",
        transform: isFadingOut
          ? "translateZ(0) scale(3)"
          : "translateZ(0) scale(1)",
        opacity: isFadingOut ? 0 : 1,
        transition: isFadingOut
          ? "opacity 1.5s ease-out, transform 1.5s ease-out"
          : "none",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "20vw",
          height: "20vh",
          maxWidth: "200px",
          maxHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}

