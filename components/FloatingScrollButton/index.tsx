"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface FloatingScrollButtonProps {
  sections: Array<{
    ref: React.RefObject<HTMLElement>;
    id: string;
  }>;
}

const FloatingScrollButton: React.FC<FloatingScrollButtonProps> = ({
  sections,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation is handled via CSS classes

  useEffect(() => {
    // Filter out sections that don't have a ref or are not in DOM
    const validSections = sections.filter((section) => section.ref.current);

    if (validSections.length === 0) {
      setIsVisible(false);
      return;
    }

    // Use IntersectionObserver to detect which section is most visible
    const observers: IntersectionObserver[] = [];
    const sectionVisibility: Map<number, number> = new Map();

    validSections.forEach((section, index) => {
      if (section.ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // Calculate intersection ratio (how much of the section is visible)
              const ratio = entry.intersectionRatio;
              sectionVisibility.set(index, ratio);

              // Find the section with the highest visibility
              let maxRatio = 0;
              let activeIndex = 0;

              sectionVisibility.forEach((visibility, idx) => {
                if (visibility > maxRatio) {
                  maxRatio = visibility;
                  activeIndex = idx;
                }
              });

              // If no section has significant visibility, find the one closest to viewport
              if (maxRatio < 0.1) {
                const scrollPosition = window.scrollY + window.innerHeight / 2;
                let minDistance = Infinity;

                validSections.forEach((sec, idx) => {
                  if (sec.ref.current) {
                    const rect = sec.ref.current.getBoundingClientRect();
                    const elementCenter =
                      rect.top + rect.height / 2 + window.scrollY;
                    const distance = Math.abs(scrollPosition - elementCenter);
                    if (distance < minDistance) {
                      minDistance = distance;
                      activeIndex = idx;
                    }
                  }
                });
              }

              setCurrentSectionIndex(activeIndex);

              // Hide button only if we're at the last section
              const isLastSection = activeIndex >= validSections.length - 1;
              setIsVisible(!isLastSection);
            });
          },
          {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            rootMargin: "-20% 0px -20% 0px", // Focus on center 60% of viewport
          }
        );

        observer.observe(section.ref.current);
        observers.push(observer);
      }
    });

    // Initial check
    const handleInitialCheck = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let minDistance = Infinity;
      let activeIndex = 0;

      validSections.forEach((section, index) => {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2 + window.scrollY;
          const distance = Math.abs(scrollPosition - elementCenter);
          if (distance < minDistance) {
            minDistance = distance;
            activeIndex = index;
          }
        }
      });

      setCurrentSectionIndex(activeIndex);
    };

    handleInitialCheck();

    // Cleanup
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const scrollToNextSection = () => {
    console.log("[FloatingButton] scrollToNextSection called", {
      currentSectionIndex,
      sectionsCount: sections.length,
    });

    // Filter valid sections
    const validSections = sections.filter((section) => section.ref.current);
    console.log("[FloatingButton] Valid sections:", {
      validCount: validSections.length,
      totalCount: sections.length,
      validSections: validSections.map((s) => ({
        id: s.id,
        hasRef: !!s.ref.current,
        offsetTop: s.ref.current?.offsetTop,
      })),
    });

    const nextIndex = currentSectionIndex + 1;
    console.log("[FloatingButton] Next index:", {
      nextIndex,
      validSectionsLength: validSections.length,
      canScroll: nextIndex < validSections.length,
    });

    if (
      nextIndex < validSections.length &&
      validSections[nextIndex].ref.current
    ) {
      const targetElement = validSections[nextIndex].ref.current;
      const sectionId = validSections[nextIndex].id;

      console.log("[FloatingButton] Scrolling to section:", {
        sectionId,
        currentIndex: currentSectionIndex,
        nextIndex,
        element: targetElement,
        offsetTop: targetElement.offsetTop,
      });

      // Calculate absolute scroll position from document top
      // Use getBoundingClientRect() + scrollY for accurate position
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate absolute position: element's top position relative to viewport + current scroll
      let targetPosition = rect.top + scrollTop;

      console.log("[FloatingButton] Position calculation:", {
        sectionId,
        rectTop: rect.top,
        scrollTop,
        calculatedPosition: targetPosition,
        offsetTop: targetElement.offsetTop,
        getBoundingClientRect: rect.top + scrollTop,
      });

      // For pinned sections (work, services), ScrollTrigger pins them at their natural document position
      // The rect.top + scrollTop gives us the correct position where the section starts in the document
      if (sectionId === "work" || sectionId === "services") {
        // For pinned sections, we want to scroll to where the section naturally starts
        // getBoundingClientRect + scrollY gives us the absolute position from document top
        // This is correct even when the element is pinned, because we're getting its natural position
        
        // If rect.top is negative (element is above viewport) or very close to 0,
        // it means we're already past the section, so use the calculated position as is
        console.log("[FloatingButton] Pinned section - using absolute position from getBoundingClientRect");
      } else {
        // For non-pinned sections, the same calculation applies
        console.log("[FloatingButton] Non-pinned section - using absolute position from getBoundingClientRect");
      }

      console.log("[FloatingButton] Final target position:", targetPosition);

      // Scroll to the target position with smooth behavior
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    } else {
      console.warn("[FloatingButton] Cannot scroll - invalid next section", {
        nextIndex,
        validSectionsLength: validSections.length,
        hasRef: validSections[nextIndex]?.ref.current ? true : false,
      });
    }
  };

  // Debug: Log section refs and button state
  useEffect(() => {
    console.log("[FloatingButton] Component mounted/updated", {
      sectionsCount: sections.length,
      sections: sections.map((s) => ({
        id: s.id,
        hasRef: !!s.ref.current,
        offsetTop: s.ref.current?.offsetTop,
        element: s.ref.current,
      })),
      currentSectionIndex,
      isVisible,
      buttonRefExists: !!buttonRef.current,
    });
  }, [sections, currentSectionIndex, isVisible]);

  if (!mounted) return null;

  // Only hide if we're at the last section
  if (isVisible === false && currentSectionIndex >= sections.length - 1) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("[FloatingButton] Button clicked!", {
          currentSectionIndex,
          sectionsCount: sections.length,
          buttonRef: buttonRef.current,
        });
        scrollToNextSection();
      }}
      onMouseDown={(e) => {
        // Don't prevent default - this might be blocking clicks
        console.log("[FloatingButton] MouseDown event", e);
      }}
      className="fixed left-1/2 bottom-[5%] z-[9999] 
                 w-14 h-14 rounded-full flex items-center justify-center
                 bg-black dark:bg-white text-white dark:text-black
                 shadow-lg hover:shadow-xl transition-all duration-300
                 hover:scale-110 active:scale-95
                 opacity-80 hover:opacity-100
                 group floating-scroll-button
                 pointer-events-auto cursor-pointer"
      style={{
        pointerEvents: "auto",
        zIndex: 9999,
        position: "fixed",
        transform: "translateX(-50%)",
      }}
      aria-label="Scroll to next section"
      type="button"
    >
      <svg
        className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
};

export default FloatingScrollButton;
