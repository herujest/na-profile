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
    const handleScroll = () => {
      // Filter out sections that don't have a ref or are not in DOM
      const validSections = sections.filter((section) => section.ref.current);

      if (validSections.length === 0) {
        setIsVisible(false);
        return;
      }

      // Find which section is currently in view
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let activeIndex = 0;
      let minDistance = Infinity;

      validSections.forEach((section, index) => {
        if (section.ref.current) {
          const elementTop = section.ref.current.offsetTop;
          const elementBottom = elementTop + section.ref.current.offsetHeight;
          const elementCenter =
            elementTop + section.ref.current.offsetHeight / 2;

          // Check if scroll position is within this section
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            const distance = Math.abs(scrollPosition - elementCenter);
            if (distance < minDistance) {
              minDistance = distance;
              activeIndex = index;
            }
          }
        }
      });

      // If no section is found, find the closest one
      if (minDistance === Infinity) {
        validSections.forEach((section, index) => {
          if (section.ref.current) {
            const elementTop = section.ref.current.offsetTop;
            const distance = Math.abs(scrollPosition - elementTop);
            if (distance < minDistance) {
              minDistance = distance;
              activeIndex = index;
            }
          }
        });
      }

      setCurrentSectionIndex(activeIndex);

      // Hide button if we're at the last section or near bottom
      const isLastSection = activeIndex >= validSections.length - 1;
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      setIsVisible(!isLastSection && !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    // Also check on resize
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  const scrollToNextSection = () => {
    // Filter valid sections
    const validSections = sections.filter((section) => section.ref.current);
    const nextIndex = currentSectionIndex + 1;

    if (
      nextIndex < validSections.length &&
      validSections[nextIndex].ref.current
    ) {
      validSections[nextIndex].ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!mounted || !isVisible) return null;

  return (
    <button
      ref={buttonRef}
      onClick={scrollToNextSection}
      className="fixed left-1/2 bottom-[5%] z-50 
                 w-14 h-14 rounded-full flex items-center justify-center
                 bg-black dark:bg-white text-white dark:text-black
                 shadow-lg hover:shadow-xl transition-all duration-300
                 hover:scale-110 active:scale-95
                 opacity-80 hover:opacity-100
                 group floating-scroll-button"
      aria-label="Scroll to next section"
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
