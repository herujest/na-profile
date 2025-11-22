"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  const [lottieData, setLottieData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const body = document.body;
    const $body = (window as any).jQuery
      ? (window as any).jQuery("body")
      : null;

    // Add loading class immediately
    $body ? $body.addClass("loading") : body.classList.add("loading");

    // Preload Lottie JSON
    fetch("/lottie/nisaaulia-intro.json")
      .then((res) => res.json())
      .then((json) => {
        setLottieData(json);
        console.log("Lottie preloaded");
      });

    // SAFETY FALLBACK 3s
    const fallbackTimer = setTimeout(() => {
      if (!isLoaded) {
        console.log("Fallback triggered");
        finishLoading();
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Function: finalize loader → show homepage
  const finishLoading = () => {
    const body = document.body;
    const $body = (window as any).jQuery
      ? (window as any).jQuery("body")
      : null;

    setIsLoaded(true);

    // Add fade-out class
    $body
      ? $body.addClass("loaded").removeClass("loading")
      : (body.classList.add("loaded"), body.classList.remove("loading"));

    // Show homepage
    setTimeout(() => {
      setIsNewPage(true);
      $body ? $body.addClass("new-page") : body.classList.add("new-page");

      const pageContent = document.querySelector(
        ".page-content"
      ) as HTMLElement | null;

      if (pageContent) {
        pageContent.style.opacity = "1";
        pageContent.style.visibility = "visible";
        pageContent.style.pointerEvents = "auto";
      }
    }, 300); // kecil supaya fade-out sempet main
  };

  return (
    <div
      className={`${styles.container} ${isLoaded ? "loaded" : ""}`}
      style={{ backgroundColor: "#ffffff" }}
      suppressHydrationWarning
    >
      {lottieData && (
        <Lottie
          animationData={lottieData}
          loop={false}
          className={styles.lottie}
          onComplete={() => {
            console.log("Lottie finished 1 loop");
            finishLoading();
          }}
        />
      )}
    </div>
  );
}
