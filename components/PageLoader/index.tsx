"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import Spinner from "@/components/atoms/Spinner";
import { usePageLoader } from "./PageLoaderContext";

export default function PageLoader() {
  const { hidePageLoader } = usePageLoader();
  const animationRef = useRef<AnimationItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const loopCountRef = useRef<number>(0);
  const totalFramesRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    // Dynamically import lottie-web for code splitting
    const loadLottie = async () => {
      try {
        // Use dynamic import to split lottie-web from initial bundle
        const lottieModule = await import("lottie-web");
        const lottie = lottieModule.default || lottieModule;

        if (!mounted || !containerRef.current) return;

        // Lazy load animation JSON file (fetch from public folder instead of bundling)
        // This prevents the 26MB file from being included in the initial bundle
        const response = await fetch("/lottie/nisaaulia-intro.json", {
          // Add cache headers for better performance on subsequent loads
          cache: "force-cache",
        });
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.statusText}`);
        }
        const animationData = await response.json();

        if (!mounted || !containerRef.current) return;

        // Use canvas renderer for better performance than SVG
        // Canvas renderer is faster and uses less memory for complex animations
        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "canvas", // Changed from "svg" to "canvas" for better performance
          loop: true, // Enable loop, but we'll stop at 1.5 loops
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            clearCanvas: true,
            progressiveLoad: true, // Enable progressive loading for better initial render
          },
        });

        if (mounted) {
          animationRef.current = anim;
          totalFramesRef.current = anim.totalFrames;
          setIsLoading(false);

          const totalFrames = anim.totalFrames;
          const halfLoopFrames = Math.floor(totalFrames * 0.5); // 0.5 loop frames
          let hasCompletedOneLoop = false;

          // Function to start fade out and show home page
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
              wrapperRef.current.style.transform = "translateZ(0) scale(3)"; // Scale up while fading out
            }

            // After fade out completes, hide loader and show home page
            setTimeout(() => {
              if (!mounted || typeof window === "undefined") return;

              // Step 1: Update body classes FIRST to show home page content
              // CRITICAL: This must happen before unmounting PageLoader
              document.body.classList.remove("loading");
              document.body.classList.add("loaded", "new-page");

              // Force reflow to ensure classes are applied and styles take effect
              void document.body.offsetHeight;

              // Step 2: Cleanup animation
              if (anim) {
                anim.destroy();
                animationRef.current = null;
              }

              // Step 3: Small delay to ensure DOM updates are fully applied
              // Then unmount PageLoader completely
              setTimeout(() => {
                if (!mounted || typeof window === "undefined") return;

                // Hide PageLoader completely (unmount from layout)
                hidePageLoader();
              }, 100); // Small delay to ensure home is visible before unmount
            }, 1500); // Match fade out duration (1.5s)
          };

          // Track frames during the second half loop
          const handleSecondHalfLoop = () => {
            if (!mounted || !anim || isFadingOut || !hasCompletedOneLoop)
              return;

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
        } else {
          anim.destroy();
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load animation"
          );
          setIsLoading(false);
        }
      }
    };

    // Use requestIdleCallback for non-critical loading
    // This ensures the loader doesn't block critical page rendering
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          loadLottie();
        },
        { timeout: 1000 }
      ); // Timeout after 1s to ensure it loads even if idle never comes
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadLottie();
      }, 0);
    }

    // Set initial body class for loading state
    if (typeof window !== "undefined") {
      document.body.classList.add("loading");
      document.body.classList.remove("loaded", "new-page");
    }

    return () => {
      mounted = false;
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [isFadingOut, hidePageLoader]);

  return (
    <div
      ref={wrapperRef}
      className="page-loader"
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
        willChange: "opacity, transform", // Optimize for animations
        transform: isFadingOut
          ? "translateZ(0) scale(1.2)"
          : "translateZ(0) scale(1)", // Scale up on fade out
        opacity: isFadingOut ? 0 : 1, // Initial opacity
        transition: isFadingOut
          ? "opacity 1.5s ease-out, transform 1.5s ease-out"
          : "none", // Smooth transition
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
          willChange: "transform", // Optimize for animations
          transform: "translateZ(0)", // Force GPU acceleration
        }}
      >
        {isLoading && !error && <Spinner />}
        {error && (
          <div style={{ color: "#EF836E", fontSize: "14px" }}>Loading...</div>
        )}
      </div>
    </div>
  );
}
