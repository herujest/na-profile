import gsap, { Power3 } from "gsap";

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

