"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { stagger, scrollAnimation, createStickySlide } from "@/animations";
import gsap, { Power3 } from "gsap";
import Button from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import Socials from "@/components/Socials";
import FloatingScrollButton from "@/components/FloatingScrollButton";
import PageLoader from "@/components/PageLoader";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import data from "@/lib/data/portfolio.json";
import Portfolio from "@/components/sections/portfolio";
import GlassRadioGroup from "@/components/Button/GlassRadioGroup";
import Collaboration from "@/components/sections/collaboration";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useSetScrollHandlers } from "./ScrollContext";
import type { PortfolioData } from "@/types/portfolio";

// Declare MorphSVGPlugin type
declare global {
  interface Window {
    MorphSVGPlugin: any;
  }
}

// Type assertion for portfolio data - using unknown first for safe conversion
const defaultPortfolioData = data as unknown as PortfolioData;

interface HomeProps {
  workSlideRef: React.RefObject<HTMLDivElement>;
  aboutSlideRef: React.RefObject<HTMLDivElement>;
}

function Home({ workSlideRef, aboutSlideRef }: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State for portfolio data - fetch from API to get complete data
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData>(defaultPortfolioData);
  // Ref
  const workRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const textOne = useRef<HTMLHeadingElement>(null);
  const textTwo = useRef<HTMLHeadingElement>(null);
  const textThree = useRef<HTMLHeadingElement>(null);
  const textFour = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const aboutBackgroundRef = useRef<HTMLDivElement>(null);

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0); // Start with Featured (value 1)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pendingTabIndex, setPendingTabIndex] = useState<number | null>(null);

  // Fetch portfolio data from API on mount
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const res = await fetch("/api/portfolio?admin=true");
        if (res.ok) {
          const apiData = await res.json();
          // Merge with default data to ensure all required fields exist
          setPortfolioData({
            ...defaultPortfolioData,
            ...apiData,
            // Ensure arrays exist
            socials: apiData.socials || defaultPortfolioData.socials || [],
            services: apiData.services || defaultPortfolioData.services || [],
            resume: apiData.resume || defaultPortfolioData.resume,
          });
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        // Keep default data on error
      }
    };

    fetchPortfolioData();
  }, []);

  // Refs for slide containers
  const heroSlideRef = useRef<HTMLDivElement>(null);
  const servicesSlideRef = useRef<HTMLDivElement>(null);

  // Refs for morphing transition
  const morphinWrapRef = useRef<HTMLDivElement>(null);
  const morphinSvgRef = useRef<SVGSVGElement>(null);
  const morphinPathRef = useRef<SVGPathElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Morphing transition functions
  const morphinShow = (onComplete?: () => void) => {
    if (!morphinPathRef.current) {
      if (onComplete) onComplete();
      return;
    }

    if (!window.MorphSVGPlugin) {
      if (morphinWrapRef.current) {
        morphinWrapRef.current.style.zIndex = "10000";
        gsap.to(morphinWrapRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      } else if (onComplete) {
        onComplete();
      }
      return;
    }

    const end_path =
      "M0,1270.2c0,0,45.2,65.9,148.8,59.8s188.6-143.3,288.2-177.1c99.5-33.9,186.4-29.8,294.4,35.9 c108,65.7,194.8,95.4,315.5,65.7c120.7-29.6,186.4-29.6,285.9,8.5c99.5,38.1,166.8,126.5,271.1,108c95.3-16.9,121-90.5,192.7-194.8 c47.5-69.1,123.5-74.1,123.5-74.1V0H0V1270.2z";

    if (morphinWrapRef.current) {
      morphinWrapRef.current.style.zIndex = "10000";
      gsap.set(morphinWrapRef.current, { opacity: 1 });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    tl.to(morphinPathRef.current, {
      morphSVG: end_path,
      duration: 1,
      ease: "power3.inOut",
    });
  };

  const morphinHide = () => {
    if (!morphinPathRef.current) {
      setIsTransitioning(false);
      return;
    }

    if (!window.MorphSVGPlugin) {
      if (morphinWrapRef.current) {
        gsap.to(morphinWrapRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            if (morphinWrapRef.current) {
              morphinWrapRef.current.style.zIndex = "-100";
            }
            setIsTransitioning(false);
          },
        });
      } else {
        setIsTransitioning(false);
      }
      return;
    }

    const end_path =
      "M0-18.1c0,0,117.3,6.1,221,0s190.7,3.5,264.3,0c53.4-2.6,145-0.1,271.4,0c59.3,0.1,208.2,0,332.5,0 c76.2,0,120.1-3,226.6,0c74.1,2.1,150.4,0,243.5,0c96.8,0,175.8,8.5,230.8,0c55.7-8.6,129.8,0,129.8,0V0H0V-18.1z";

    const tl = gsap.timeline({
      onComplete: () => {
        if (morphinWrapRef.current) {
          morphinWrapRef.current.style.zIndex = "-100";
        }
        setIsTransitioning(false);
      },
    });

    tl.to(morphinPathRef.current, {
      morphSVG: end_path,
      duration: 1,
      ease: "power2.out",
    });
  };

  function onChangeActiveTab(index: number) {
    if (index === currentTabIndex || isTransitioning) return;

    if (typeof window !== "undefined") {
      const { ScrollTrigger } = require("gsap/ScrollTrigger");

      const currentScroll = window.scrollY;

      if (workSlideRef.current) {
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (trigger.vars.trigger === workSlideRef.current) {
            trigger.kill(false);
          }
        });

        const workContent =
          workSlideRef.current.querySelector(".slide-content");
        if (workContent) {
          gsap.set(workContent, {
            clearProps: "all",
            transform: "none",
          });
        }

        gsap.set(workSlideRef.current, {
          position: "relative",
          clearProps: "all",
        });
      }

      setPendingTabIndex(index);
      setIsTransitioning(true);

      // Original logic: call morphinShow directly with setTimeout
      setTimeout(() => {
        morphinShow(() => {
          setCurrentTabIndex(index);
          setPendingTabIndex(null);

          setTimeout(() => {
            morphinHide();
          }, 100);
        });
      }, 500);

      requestAnimationFrame(() => {
        window.scrollTo({
          top: currentScroll,
          behavior: "auto",
        });
      });
    } else {
      setCurrentTabIndex(index);
    }
  }

  useIsomorphicLayoutEffect(() => {
    // Set initial state for h1 elements before animation - hide them immediately
    let checkInterval: NodeJS.Timeout | null = null;

    if (
      textOne.current &&
      textTwo.current &&
      textThree.current &&
      textFour.current
    ) {
      // Set initial state (hidden/animated from state)
      gsap.set(
        [textOne.current, textTwo.current, textThree.current, textFour.current],
        {
          opacity: 0,
          visibility: "hidden",
          y: 40,
          x: -10,
          scale: 0.95,
          skewX: 10,
        }
      );

      // Wait for PageLoader to finish (body has "new-page" class) before starting animation
      let maxChecks = 50; // Max 5 seconds (50 * 100ms)
      let checkCount = 0;
      let hasAnimated = false;

      const checkAndAnimate = () => {
        if (hasAnimated) return; // Prevent multiple animations

        checkCount++;
        const body = document.body;
        const hasNewPage = body.classList.contains("new-page");

        if (hasNewPage || checkCount >= maxChecks) {
          hasAnimated = true;

          // Clear interval if found or max checks reached
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }

          // PageLoader finished (or timeout), now start stagger animation
          if (
            textOne.current &&
            textTwo.current &&
            textThree.current &&
            textFour.current
          ) {
            // Make elements visible first
            gsap.set(
              [
                textOne.current,
                textTwo.current,
                textThree.current,
                textFour.current,
              ],
              {
                visibility: "visible",
              }
            );

            // Small delay before animation starts
            requestAnimationFrame(() => {
              setTimeout(() => {
                if (
                  textOne.current &&
                  textTwo.current &&
                  textThree.current &&
                  textFour.current
                ) {
                  stagger(
                    [
                      textOne.current,
                      textTwo.current,
                      textThree.current,
                      textFour.current,
                    ],
                    { y: 40, x: -10, scale: 0.95, skewX: 10 },
                    { y: 0, x: 0, scale: 1, skewX: 0, duration: 0.8 }
                  );
                }
              }, 200);
            });
          }
        }
      };

      // Start checking immediately, then check every 100ms
      checkAndAnimate();
      checkInterval = setInterval(checkAndAnimate, 100);
    }

    const cleanupFunctions: (() => void)[] = [];

    const timer = setTimeout(() => {
      if (heroSlideRef.current) {
        const heroContent =
          heroSlideRef.current.querySelector(".slide-content");
        if (heroContent) {
          // Ensure hero section has proper positioning and doesn't get affected by pinned sections
          gsap.set(heroSlideRef.current, {
            height: "100vh",
            position: "relative",
            zIndex: 1,
          });

          const cleanup = scrollAnimation(heroContent as HTMLElement, {
            from: { opacity: 0.8, y: 20 },
            to: { opacity: 1, y: 0 },
            duration: 1,
            delay: 0,
          });
          if (cleanup) cleanupFunctions.push(cleanup);
        }
      }

      if (workSlideRef.current) {
        const workContent =
          workSlideRef.current.querySelector(".slide-content");
        if (workContent) {
          gsap.set(workSlideRef.current, {
            height: "auto",
            minHeight: "100vh",
          });

          // Use createStickySlide for work section with pinning
          const cleanup = createStickySlide(
            workSlideRef.current,
            workContent as HTMLElement,
            {
              start: "top top",
              end: `+=${Math.max(
                window.innerHeight,
                workSlideRef.current.offsetHeight || window.innerHeight
              )}`,
              scrub: 1,
              animation: {
                opacity: 1,
                ease: "power2.out",
              },
              onEnter: () => {
                gsap.to(workContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                });
              },
              onLeave: () => {
                // No animation on leave
              },
              onEnterBack: () => {
                gsap.to(workContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                });
              },
            }
          );
          if (cleanup) cleanupFunctions.push(cleanup);
        }
      }

      if (servicesSlideRef.current) {
        const servicesContent =
          servicesSlideRef.current.querySelector(".slide-content");
        if (servicesContent) {
          gsap.set(servicesSlideRef.current, {
            height: "auto",
            minHeight: "100vh",
          });

          // Use createStickySlide for services section with parallax
          const cleanup = createStickySlide(
            servicesSlideRef.current,
            servicesContent as HTMLElement,
            {
              start: "top top+=80",
              end: `+=${Math.max(
                window.innerHeight,
                servicesSlideRef.current.offsetHeight || window.innerHeight
              )}`,
              scrub: 1,
              animation: {
                opacity: 1,
                ease: "power2.out",
              },
              onEnter: () => {
                gsap.to(servicesContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                });
              },
              onLeave: () => {
                // No animation on leave to prevent zoom effect
              },
              onEnterBack: () => {
                gsap.to(servicesContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                });
              },
            }
          );
          if (cleanup) cleanupFunctions.push(cleanup);
        }
      }

      // About section - with parallax effect
      if (aboutSlideRef.current) {
        // Ensure about section has proper positioning and doesn't get affected by pinned sections
        gsap.set(aboutSlideRef.current, {
          position: "relative",
          zIndex: 1,
        });

        const aboutContent =
          aboutSlideRef.current.querySelector(".slide-content");
        const aboutBackground = aboutBackgroundRef.current;

        if (aboutContent && typeof window !== "undefined") {
          const { ScrollTrigger } = require("gsap/ScrollTrigger");

          // Parallax effect for content
          const contentCleanup = scrollAnimation(aboutContent as HTMLElement, {
            from: { opacity: 0.8, y: 50 },
            to: { opacity: 1, y: 0 },
            duration: 1,
            delay: 0,
          });
          if (contentCleanup) cleanupFunctions.push(contentCleanup);

          // Parallax effect for background (moves slower than content)
          if (aboutBackground) {
            gsap.set(aboutBackground, {
              y: 0,
              opacity: 0.4,
            });

            // Create parallax animation for background
            const parallaxScrollTrigger = ScrollTrigger.create({
              trigger: aboutSlideRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onUpdate: (self: any) => {
                const progress = self.progress;
                // Background moves slower (parallax effect)
                const yOffset = progress * 150; // Move 150px total
                const opacity = 0.4 + progress * 0.4; // Fade in as scrolling

                gsap.set(aboutBackground, {
                  y: yOffset,
                  opacity: opacity,
                });
              },
            });

            // Cleanup function for parallax
            const bgCleanup = () => {
              if (parallaxScrollTrigger) {
                parallaxScrollTrigger.kill();
              }
            };
            cleanupFunctions.push(bgCleanup);
          }
        }
      }

      // Tabs section animation
      if (tabsRef.current) {
        const cleanup = scrollAnimation(tabsRef.current, {
          from: { opacity: 0, y: 30 },
          to: { opacity: 1, y: 0 },
          duration: 0.6,
          delay: 0.1,
        });
        if (cleanup) cleanupFunctions.push(cleanup);
      }

      // Socials animation
      if (socialsRef.current) {
        const cleanup = scrollAnimation(socialsRef.current, {
          from: { opacity: 0, y: 20 },
          to: { opacity: 1, y: 0 },
          duration: 0.6,
          delay: 0.2,
        });
        if (cleanup) cleanupFunctions.push(cleanup);
      }

      // Refresh ScrollTrigger after setup to ensure proper pin spacing
      // This prevents sections from overlapping during scroll
      if (typeof window !== "undefined") {
        const { ScrollTrigger } = require("gsap/ScrollTrigger");

        // Wait a bit more for DOM to be ready and all animations to settle
        setTimeout(() => {
          // Refresh all ScrollTriggers to recalculate positions and spacing
          ScrollTrigger.refresh();

          // Force recalculation of pin spacing for pinned sections
          ScrollTrigger.getAll().forEach((trigger: any) => {
            if (trigger.vars && trigger.vars.pin && trigger.vars.pinSpacing) {
              // Ensure pin spacing is properly calculated
              trigger.refresh();
            }
          });

          // Additional refresh after a small delay to ensure everything is settled
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 50);
        }, 150);
      }
    }, 150);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      cleanupFunctions.forEach((cleanup) => cleanup());
      // Cleanup interval if still running
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    };
  }, []);

  // Register MorphSVGPlugin when it loads
  useEffect(() => {
    if (typeof window !== "undefined" && window.MorphSVGPlugin) {
      gsap.registerPlugin(window.MorphSVGPlugin);
    }
  }, []);

  // Note: Hash navigation is now handled in HomeWithProvider to avoid conflicts with ScrollTrigger

  // Refresh ScrollTrigger when tab changes (for conditional content)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { ScrollTrigger } = require("gsap/ScrollTrigger");

      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        // Just refresh ScrollTrigger, no need to re-setup pinning for dynamic content
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentTabIndex]);

  const {
    name,
    headerTaglineOne,
    headerTaglineTwo,
    headerTaglineThree,
    headerTaglineFour,
  } = portfolioData;

  return (
    <>
      <PageLoader />
      <div className="relative page-content">
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://assets.codepen.io/16327/MorphSVGPlugin3.min.js"
          strategy="lazyOnload"
          onLoad={() => {
            if (typeof window !== "undefined" && window.MorphSVGPlugin) {
              gsap.registerPlugin(window.MorphSVGPlugin);
            }
          }}
        />

        <div className="relative hero-section" ref={heroSlideRef}>
          <div className="slide-content h-full flex flex-col justify-between items-start px-2 laptop:px-0 pb-2 laptop:pb-1">
            <div className="w-full flex-grow flex flex-col justify-center">
              <h1
                ref={textOne}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
              >
                {headerTaglineOne}
              </h1>
              <h1
                ref={textTwo}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {headerTaglineTwo}
              </h1>
              <h1
                ref={textThree}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {headerTaglineThree}
              </h1>
              <h1
                ref={textFour}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {headerTaglineFour}
              </h1>

              <div ref={socialsRef} className="w-full">
                <Socials className="mt-2 laptop:mt-5" />
              </div>
            </div>
          </div>
        </div>

        <div ref={workSlideRef}>
          <div
            className="slide-content min-h-screen flex flex-col justify-start tablet:pt-24 relative z-10 w-full px-8 tablet:px-8 laptop:px-10 desktop:px-20"
            ref={workRef}
          >
            <div className="w-full tablet:m-10">
              <div ref={tabsRef}>
                <GlassRadioGroup
                  name="portfolio-tabs"
                  options={[
                    { id: "tab-featured", label: "Featured", value: 0 },
                    {
                      id: "tab-collaboration",
                      label: "Collaboration",
                      value: 1,
                    },
                  ]}
                  selectedValue={currentTabIndex}
                  onChange={onChangeActiveTab}
                />
              </div>
              <div
                ref={tabContentRef}
                className="mt-10"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                {currentTabIndex === 0 && (
                  <Portfolio
                    workRef={workRef}
                    collabs={[]}
                    featured={true}
                    limit={6}
                    key={`portfolio-all-${pendingTabIndex ?? currentTabIndex}`}
                  />
                )}
                {currentTabIndex === 1 && (
                  <Collaboration
                    key={`collaboration-${pendingTabIndex ?? currentTabIndex}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div ref={servicesSlideRef}>
          <div className="slide-content min-h-screen flex flex-col justify-start relative z-10 w-full px-8 tablet:px-8 laptop:px-10 desktop:px-20">
            <div className="w-full tablet:m-10 max-w-[70%] ml-0 mr-auto">
              <h1
                ref={servicesRef}
                className="text-4xl laptop:text-6xl text-bold mb-10"
              >
                Services.
              </h1>
              <div className="grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 laptop:gap-12">
                {portfolioData.services?.map((service, index: number) => (
                  <ServiceCard
                    key={index}
                    name={service.title}
                    description={service.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={aboutSlideRef}
          className="about-section relative min-h-screen overflow-hidden"
        >
          <div ref={aboutBackgroundRef} className="absolute inset-0 z-0">
            <AnimatedBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 dark:from-transparent dark:via-black/40 dark:to-black/60" />
          </div>

          <div
            className="slide-content min-h-screen flex flex-col justify-center relative z-10 w-full px-8 tablet:px-8 laptop:px-10 desktop:px-20"
            ref={aboutRef}
          >
            <div className="w-full tablet:m-10">
              <h1 className="text-2xl pt-10 laptop:text-4xl text-bold mb-6 laptop:mb-10">
                About.
              </h1>
              <p className="text-xl laptop:text-3xl w-full laptop:w-4/5 leading-relaxed">
                {portfolioData.aboutpara}
              </p>
            </div>
          </div>
        </div>

        <FloatingScrollButton
          sections={[
            { ref: heroSlideRef as React.RefObject<HTMLElement>, id: "header" },
            { ref: workSlideRef as React.RefObject<HTMLElement>, id: "work" },
            {
              ref: servicesSlideRef as React.RefObject<HTMLElement>,
              id: "services",
            },
            { ref: aboutSlideRef as React.RefObject<HTMLElement>, id: "about" },
          ]}
        />

        <div ref={morphinWrapRef} className="morphin-wrap">
          <svg
            ref={morphinSvgRef}
            className="morphin-svg"
            width="100%"
            height="100vh"
            preserveAspectRatio="none"
            viewBox="0 0 1920 1080"
          >
            <path
              ref={morphinPathRef}
              fill="url(#morphin-gradient)"
              d="M0-18.1c0,0,117.3,6.1,221,0s190.7,3.5,264.3,0c53.4-2.6,145-0.1,271.4,0c59.3,0.1,208.2,0,332.5,0 c76.2,0,120.1-3,226.6,0c74.1,2.1,150.4,0,243.5,0c96.8,0,175.8,8.5,230.8,0c55.7-8.6,129.8,0,129.8,0V0H0V-18.1z"
            />
            <defs>
              <linearGradient
                id="morphin-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F86BDF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#6B6BF8" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
}

// Wrap Home component with ScrollProvider
function HomeWithProvider() {
  const workSlideRef = useRef<HTMLDivElement>(null);
  const aboutSlideRef = useRef<HTMLDivElement>(null);

  const handleWorkScroll = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Use setTimeout to ensure ref is available after render
    let retryCount = 0;
    const maxRetries = 5;

    const scrollToWork = () => {
      if (workSlideRef.current) {
        const element = workSlideRef.current;
        // Use offsetTop for more reliable positioning
        const offsetTop = element.offsetTop;

        window.scrollTo({
          top: offsetTop,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Retry if ref not available yet (max 5 retries)
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(scrollToWork, 100);
        }
      }
    };

    scrollToWork();
  }, []);

  const handleAboutScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    // Use setTimeout to ensure ref is available after render
    const scrollToAbout = () => {
      if (aboutSlideRef.current) {
        const element = aboutSlideRef.current;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;

        window.scrollTo({
          top: offsetPosition,
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Retry if ref not available yet
        setTimeout(scrollToAbout, 100);
      }
    };

    scrollToAbout();
  }, []);

  const handleContactScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      // Scroll to footer (bottom of page)
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

  // Store handlers in ref to avoid stale closures
  const handlersRef = useRef({
    handleWorkScroll,
    handleAboutScroll,
    handleContactScroll,
  });

  // Update ref when handlers change
  useEffect(() => {
    handlersRef.current = {
      handleWorkScroll,
      handleAboutScroll,
      handleContactScroll,
    };
  }, [handleWorkScroll, handleAboutScroll, handleContactScroll]);

  const setHandlers = useSetScrollHandlers();

  // Set handlers in context when they're created
  useEffect(() => {
    if (setHandlers) {
      setHandlers({
        handleWorkScroll,
        handleAboutScroll,
        handleContactScroll,
      });
    }
  }, [handleWorkScroll, handleAboutScroll, handleContactScroll, setHandlers]);

  // Handle hash navigation when coming from other pages
  // This runs after ScrollTrigger is initialized to avoid conflicts
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only handle hash if it exists (user came from another page)
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Wait for ScrollTrigger to be fully initialized, then use scroll handlers
    const handleHashNavigation = () => {
      // Wait a bit for all ScrollTriggers to be set up, then use the scroll handlers
      setTimeout(() => {
        switch (hash) {
          case "work":
            if (workSlideRef.current) {
              // Use the scroll handler which respects ScrollTrigger
              handleWorkScroll();
              // Clear hash after a delay
              setTimeout(() => {
                window.history.replaceState(null, "", window.location.pathname);
              }, 1000);
            } else {
              // Retry if ref not ready
              setTimeout(handleHashNavigation, 200);
            }
            break;
          case "about":
            if (aboutSlideRef.current) {
              // Use the scroll handler which respects ScrollTrigger
              handleAboutScroll();
              // Clear hash after a delay
              setTimeout(() => {
                window.history.replaceState(null, "", window.location.pathname);
              }, 1000);
            } else {
              // Retry if ref not ready
              setTimeout(handleHashNavigation, 200);
            }
            break;
          case "contact":
            // Use the scroll handler which respects ScrollTrigger
            handleContactScroll();
            // Clear hash after a delay
            setTimeout(() => {
              window.history.replaceState(null, "", window.location.pathname);
            }, 1000);
            break;
          default:
            break;
        }
      }, 800); // Wait 800ms for ScrollTrigger to be initialized
    };

    // Start handling hash navigation after ScrollTrigger is initialized
    setTimeout(handleHashNavigation, 1000);

    // Handle hash changes (when navigating from other pages)
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash) {
        setTimeout(handleHashNavigation, 1000);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: refs don't change, only their .current property

  return <Home workSlideRef={workSlideRef} aboutSlideRef={aboutSlideRef} />;
}

export default HomeWithProvider;
