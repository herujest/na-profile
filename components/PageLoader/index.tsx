import { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    
    setMounted(true);
    const body = document.body;
    
    // Use jQuery if available, otherwise use vanilla JS
    const $body = (window as any).jQuery ? (window as any).jQuery("body") : null;
    
    // Add loading class immediately - no delay
    if ($body) {
      $body.addClass("loading");
    } else {
      body.classList.add("loading");
    }
    console.log("Loading class added");
    
    // Mark as loaded after animation duration (1.7s) - this triggers layer animations
    const loadedTimer = setTimeout(() => {
      setIsLoaded(true);
      if ($body) {
        $body.addClass("loaded").removeClass("loading");
      } else {
        body.classList.add("loaded");
        body.classList.remove("loading");
      }
      console.log("Loaded class added - layer animations should start now");
    }, 1700);

    // Show new page content (1.95s)
    const newPageTimer = setTimeout(() => {
      setIsNewPage(true);
      if ($body) {
        $body.addClass("new-page");
      } else {
        body.classList.add("new-page");
      }
      console.log("New-page class added, body classes:", body.className);
      
      // Force show content
      const pageContent = document.querySelector(".page-content");
      if (pageContent) {
        (pageContent as HTMLElement).style.opacity = "1";
        (pageContent as HTMLElement).style.visibility = "visible";
        console.log("Page content forced visible");
      }
    }, 1950);

    // Safety fallback: ensure content shows after 3 seconds
    const safetyTimer = setTimeout(() => {
      const hasNewPage = $body ? $body.hasClass("new-page") : body.classList.contains("new-page");
      if (!hasNewPage) {
        if ($body) {
          $body.addClass("new-page");
        } else {
          body.classList.add("new-page");
        }
        setIsNewPage(true);
        console.log("Safety fallback: new-page class added");
      }
      
      // Force show content as final fallback
      const pageContent = document.querySelector(".page-content");
      if (pageContent) {
        (pageContent as HTMLElement).style.opacity = "1";
        (pageContent as HTMLElement).style.visibility = "visible";
        (pageContent as HTMLElement).style.pointerEvents = "auto";
        console.log("Safety fallback: Page content forced visible");
      }
    }, 3000);

    return () => {
      clearTimeout(loadedTimer);
      clearTimeout(newPageTimer);
      clearTimeout(safetyTimer);
      if ($body) {
        $body.removeClass("loading loaded new-page");
      } else {
        body.classList.remove("loading", "loaded", "new-page");
      }
    };
  }, []);

  return (
    <div 
      className={`${styles.container} ${isLoaded ? "loaded" : ""}`}
      suppressHydrationWarning
    >
      <svg className={styles.loader} viewBox="-600 -600 1200 1200" overflow="visible" preserveAspectRatio="xMidYMid meet">
        <g className={styles.core}>
          <circle className={styles.path} cx="50" cy="50" r="1" fill="none" />
        </g>
        <g className={styles.spinner}>
          <circle className={styles.path} cx="50" cy="50" r="20" fill="none" />
        </g>
        <g className={styles.layer1}>
          <circle className={styles.path} cx="50" cy="50" r="70" fill="none" />
        </g>
        <g className={styles.layer2}>
          <circle className={styles.path} cx="50" cy="50" r="120" fill="none" />
        </g>
        <g className={styles.layer3}>
          <circle className={styles.path} cx="50" cy="50" r="180" fill="none" />
        </g>
        <g className={styles.layer4}>
          <circle className={styles.path} cx="50" cy="50" r="240" fill="none" />
        </g>
        <g className={styles.layer5}>
          <circle className={styles.path} cx="50" cy="50" r="300" fill="none" />
        </g>
        <g className={styles.layer6}>
          <circle className={styles.path} cx="50" cy="50" r="380" fill="none" />
        </g>
        <g className={styles.layer7}>
          <circle className={styles.path} cx="50" cy="50" r="450" fill="none" />
        </g>
        <g className={styles.layer8}>
          <circle className={styles.path} cx="50" cy="50" r="540" fill="none" />
        </g>
      </svg>
    </div>
  );
}

