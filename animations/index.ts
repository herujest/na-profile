import gsap, { Power3, Power4 } from "gsap";

// ScrollTrigger will be loaded dynamically on client-side only
// For server-side, we'll use a mock implementation
let ScrollTrigger: any = {
  create: () => ({ kill: () => {} }),
  refresh: () => {},
  getAll: () => [],
  clearScrollMemory: () => {},
  killAll: () => {},
};

// Only load ScrollTrigger on client-side
if (typeof window !== "undefined") {
  try {
    // Use dynamic require to avoid SSR issues
    const scrollTriggerModule = require("gsap/ScrollTrigger");
    ScrollTrigger =
      scrollTriggerModule.ScrollTrigger ||
      scrollTriggerModule.default ||
      scrollTriggerModule;
    if (ScrollTrigger && gsap) {
      gsap.registerPlugin(ScrollTrigger);
    }
  } catch (e) {
    // Fallback to mock if import fails
    console.warn("Failed to load ScrollTrigger, using mock:", e);
  }
}

export const stagger = (
  target: gsap.TweenTarget,
  fromvVars: gsap.TweenVars,
  toVars: gsap.TweenVars
): gsap.core.Tween => {
  return gsap.fromTo(
    target,
    { opacity: 0, ...fromvVars },
    { opacity: 1, ...toVars, stagger: 0.2, ease: Power3.easeOut }
  );
};

export const scrollAnimation = (
  element: HTMLElement | null,
  options?: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    duration?: number;
    delay?: number;
    once?: boolean;
  }
) => {
  if (!element) return;

  const {
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    duration = 0.8,
    delay = 0,
    once = true,
  } = options || {};

  // Set initial state
  gsap.set(element, from);

  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            ...to,
            duration,
            delay,
            ease: Power3.easeOut,
          });

          // If once is true, stop observing after animation
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  observer.observe(element);

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
};

export interface StickySlideConfig {
  pin?: boolean;
  pinSpacing?: boolean;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  animation?: gsap.TweenVars;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Creates a sticky full-page slide animation using GSAP ScrollTrigger
 * @param element - The element to make sticky
 * @param content - The content element that will animate inside the sticky container
 * @param config - Configuration options for the sticky slide
 * @returns Cleanup function
 */
export const createStickySlide = (
  element: HTMLElement | null,
  content: HTMLElement | null,
  config?: StickySlideConfig
) => {
  if (!element || !content || typeof window === "undefined") return;

  const {
    pin = true,
    pinSpacing = true,
    start = "top top",
    end = "+=100%",
    scrub = 1,
    animation = {},
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = config || {};

  // Set initial styles for element
  gsap.set(element, {
    position: "relative",
    overflow: "visible",
    // Ensure element maintains its natural position in document flow
    willChange: "auto",
  });

  // Set initial styles for content - start visible, will animate on scroll
  gsap.set(content, {
    opacity: 1,
  });

  // Create ScrollTrigger for pinning
  const scrollTrigger = ScrollTrigger.create({
    trigger: element,
    start: start,
    end: end,
    pin: pin,
    pinSpacing: pinSpacing,
    scrub: scrub,
    onEnter: onEnter,
    onLeave: onLeave,
    onEnterBack: onEnterBack,
    onLeaveBack: onLeaveBack,
    anticipatePin: 1,
    invalidateOnRefresh: true, // Ensure proper recalculation on refresh
    preventOverlaps: true, // Prevent overlapping triggers
  });

  // Create animation for content
  if (Object.keys(animation).length > 0) {
    gsap.to(content, {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: start,
        end: end,
        scrub: scrub,
      },
    });
  }

  // Return cleanup function
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === element) {
        trigger.kill();
      }
    });
  };
};

/**
 * Creates a full-page slide container with rich scroll animations
 * @param slides - Array of slide elements
 * @param options - Configuration options
 * @returns Cleanup function
 */
export const createFullPageSlides = (
  slides: HTMLElement[],
  options?: {
    duration?: number;
    ease?: string;
    stagger?: number;
  }
) => {
  if (!slides.length || typeof window === "undefined") return;

  const { duration = 1, ease = "power2.inOut", stagger = 0 } = options || {};

  const cleanupFunctions: (() => void)[] = [];

  slides.forEach((slide, index) => {
    const content = slide.querySelector(".slide-content") as HTMLElement;
    if (!content) return;

    // Set initial state
    gsap.set(content, {
      opacity: 0,
      y: 100,
      scale: 0.9,
    });

    // Create sticky slide
    const cleanup = createStickySlide(slide, content, {
      start: index === 0 ? "top top" : "top top",
      end: "+=100%",
      scrub: true,
      animation: {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: duration,
        ease: ease,
      },
      onEnter: () => {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: Power4.easeOut,
        });
      },
      onLeave: () => {
        gsap.to(content, {
          opacity: 0.7,
          scale: 0.95,
          duration: 0.5,
          ease: Power3.easeIn,
        });
      },
      onEnterBack: () => {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: Power4.easeOut,
        });
      },
      onLeaveBack: () => {
        gsap.to(content, {
          opacity: 0.7,
          scale: 0.95,
          duration: 0.5,
          ease: Power3.easeIn,
        });
      },
    });

    if (cleanup) cleanupFunctions.push(cleanup);
  });

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    ScrollTrigger.getAll().forEach((trigger) => {
      if (slides.includes(trigger.vars.trigger as HTMLElement)) {
        trigger.kill();
      }
    });
  };
};
