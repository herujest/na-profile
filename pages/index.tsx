import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { stagger, scrollAnimation, createStickySlide } from "../animations";
import gsap, { Power3 } from "gsap";
import Button from "../components/Button";
import Cursor from "../components/Cursor";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import FloatingScrollButton from "../components/FloatingScrollButton";
import PageLoader from "../components/PageLoader";
import { useIsomorphicLayoutEffect } from "../utils";

// Local Data
import data from "../data/portfolio.json";
import Portfolio from "./sections/portfolio";

import GlassRadioGroup from "../components/Button/GlassRadioGroup";
import Collaboration from "./sections/collaboration";

// Declare MorphSVGPlugin type
declare global {
  interface Window {
    MorphSVGPlugin: any;
  }
}

export default function Home() {
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

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pendingTabIndex, setPendingTabIndex] = useState<number | null>(null);

  // Refs for slide containers
  const heroSlideRef = useRef<HTMLDivElement>(null);
  const workSlideRef = useRef<HTMLDivElement>(null);
  const servicesSlideRef = useRef<HTMLDivElement>(null);
  const aboutSlideRef = useRef<HTMLDivElement>(null);

  // Refs for morphing transition
  const morphinWrapRef = useRef<HTMLDivElement>(null);
  const morphinSvgRef = useRef<SVGSVGElement>(null);
  const morphinPathRef = useRef<SVGPathElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Morphing transition functions
  const morphinShow = (onComplete?: () => void) => {
    if (!morphinPathRef.current) {
      // Fallback: if plugin not loaded, just call onComplete immediately
      if (onComplete) onComplete();
      return;
    }

    if (!window.MorphSVGPlugin) {
      // Fallback: simple fade transition if plugin not available
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
      // Fallback: simple fade transition if plugin not available
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

      // Save current scroll position
      const currentScroll = window.scrollY;

      // Kill existing ScrollTriggers for work section before changing tab
      if (workSlideRef.current) {
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (trigger.vars.trigger === workSlideRef.current) {
            trigger.kill(false); // Kill without animation
          }
        });

        // Clear any GSAP transforms and unpin
        const workContent =
          workSlideRef.current.querySelector(".slide-content");
        if (workContent) {
          gsap.set(workContent, {
            clearProps: "all",
            transform: "none",
          });
        }

        // Remove pinning styles
        gsap.set(workSlideRef.current, {
          position: "relative",
          clearProps: "all",
        });
      }

      // Set pending tab and start transition
      setPendingTabIndex(index);
      setIsTransitioning(true);

      // Wait for GlassRadioGroup animation to finish (0.5s) then start morphing
      setTimeout(() => {
        morphinShow(() => {
          // Change tab after morphing show completes
          setCurrentTabIndex(index);
          setPendingTabIndex(null);

          // Hide morphing after content changes
          setTimeout(() => {
            morphinHide();
          }, 100);
        });
      }, 500); // Wait for GlassRadioGroup transition (0.5s)

      // Restore scroll position after a brief delay
      requestAnimationFrame(() => {
        window.scrollTo({
          top: currentScroll,
          behavior: "auto", // Instant scroll to prevent glitches
        });
      });
    } else {
      setCurrentTabIndex(index);
    }
  }

  // Handling Scroll
  const handleWorkScroll = () => {
    if (workRef.current) {
      window.scrollTo({
        top: workRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleAboutScroll = () => {
    if (aboutRef.current) {
      window.scrollTo({
        top: aboutRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (
      textOne.current &&
      textTwo.current &&
      textThree.current &&
      textFour.current
    ) {
      stagger(
        [textOne.current, textTwo.current, textThree.current, textFour.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
    }

    // Scroll animations for sections
    const cleanupFunctions: (() => void)[] = [];

    // Small delay to ensure DOM is fully ready, especially for conditional content
    const timer = setTimeout(() => {
      // Setup sticky full-page slides with rich animations
      // Hero section - no pinning, natural scroll behavior
      if (heroSlideRef.current) {
        const heroContent =
          heroSlideRef.current.querySelector(".slide-content");
        if (heroContent) {
          // Ensure hero section is exactly viewport height
          // No pinning - let it scroll naturally
          gsap.set(heroSlideRef.current, {
            height: "100vh",
          });

          // Just add scroll animations without pinning for natural scroll
          const cleanup = scrollAnimation(heroContent as HTMLElement, {
            from: { opacity: 0.8, y: 20 },
            to: { opacity: 1, y: 0 },
            duration: 1,
            delay: 0,
          });
          if (cleanup) cleanupFunctions.push(cleanup);
        }
      }

      // Work section - no pinning since content is dynamic
      // Just ensure content is visible
      if (workSlideRef.current) {
        const workContent =
          workSlideRef.current.querySelector(".slide-content");
        if (workContent) {
          gsap.set(workContent, {
            opacity: 1,
            clearProps: "all",
          });
        }
      }

      if (servicesSlideRef.current) {
        const servicesContent =
          servicesSlideRef.current.querySelector(".slide-content");
        if (servicesContent) {
          // Ensure content is visible initially
          gsap.set(servicesContent, { opacity: 1 });

          // Calculate end point based on viewport height
          const endPoint = Math.max(
            window.innerHeight,
            servicesSlideRef.current.offsetHeight || window.innerHeight
          );

          const cleanup = createStickySlide(
            servicesSlideRef.current,
            servicesContent as HTMLElement,
            {
              start: "top top+=80",
              end: `+=${endPoint}`,
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

      // About section - no pinning since it's the last section
      if (aboutSlideRef.current) {
        const aboutContent =
          aboutSlideRef.current.querySelector(".slide-content");
        if (aboutContent) {
          // Just add scroll animation without pinning for last section
          const cleanup = scrollAnimation(aboutContent as HTMLElement, {
            from: { opacity: 0.8, y: 20 },
            to: { opacity: 1, y: 0 },
            duration: 0.8,
            delay: 0,
          });
          if (cleanup) cleanupFunctions.push(cleanup);
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

      // Refresh ScrollTrigger after setup
      if (typeof window !== "undefined") {
        const { ScrollTrigger } = require("gsap/ScrollTrigger");
        ScrollTrigger.refresh();
      }
    }, 150);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  // Register MorphSVGPlugin when it loads
  useEffect(() => {
    if (typeof window !== "undefined" && window.MorphSVGPlugin) {
      gsap.registerPlugin(window.MorphSVGPlugin);
    }
  }, []);

  // Refresh ScrollTrigger when tab changes (for conditional content)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { ScrollTrigger } = require("gsap/ScrollTrigger");
      const workSlideElement = workSlideRef.current;

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

  return (
    <div
      className={`relative page-content ${data.showCursor && "cursor-none"}`}
    >
      {data.showCursor && <Cursor />}
      <PageLoader />
      <Head>
        <title>{data.name}</title>
      </Head>
      <Script
        src="https://assets.codepen.io/16327/MorphSVGPlugin3.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.MorphSVGPlugin) {
            gsap.registerPlugin(window.MorphSVGPlugin);
          }
        }}
      />

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />

        {/* Hero Slide - Full Page */}
        <div
          className="full-page-slide hero-section h-screen"
          ref={heroSlideRef}
        >
          <div className="slide-content h-full flex flex-col justify-between items-start px-2 laptop:px-0 pb-2 laptop:pb-1">
            <div className="w-full flex-grow flex flex-col justify-center">
              <h1
                ref={textOne}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
              >
                {data.headerTaglineOne}
              </h1>
              <h1
                ref={textTwo}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {data.headerTaglineTwo}
              </h1>
              <h1
                ref={textThree}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {data.headerTaglineThree}
              </h1>
              <h1
                ref={textFour}
                className="text-3xl tablet:text-6xl laptop:text-8xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {data.headerTaglineFour}
              </h1>

              <div ref={socialsRef} className="w-full">
                <Socials className="mt-2 laptop:mt-5" />
              </div>
            </div>
          </div>
        </div>
        {/* WORK Collaborations Slide - Full Page */}
        <div className="full-page-slide" ref={workSlideRef}>
          <div
            className="slide-content min-h-screen flex flex-col "
            style={{ opacity: 1, visibility: "visible" }}
          >
            <div className="w-full flex justify-center" ref={tabsRef}>
              <GlassRadioGroup
                name="portfolio-tabs"
                options={[
                  { id: "tab-gallery", label: "Gallery", value: 0 },
                  { id: "tab-collaboration", label: "Collaboration", value: 1 },
                ]}
                selectedValue={
                  pendingTabIndex !== null ? pendingTabIndex : currentTabIndex
                }
                onChange={onChangeActiveTab}
              />
            </div>
            <div
              ref={tabContentRef}
              className="w-full flex-1 flex flex-col"
              key={`tab-content-${currentTabIndex}`}
            >
              {currentTabIndex === 0 && (
                <Portfolio
                  workRef={workRef as React.RefObject<HTMLDivElement>}
                  collabs={data.collaborations || []}
                />
              )}
              {currentTabIndex === 1 && (
                <div ref={workRef} className="w-full">
                  <Collaboration />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Slide - Full Page */}
        <div className="full-page-slide" ref={servicesSlideRef}>
          <div
            className="slide-content min-h-screen flex flex-col justify-center p-2 laptop:p-0"
            ref={servicesRef}
          >
            <h1 className="text-2xl text-bold">Services.</h1>
            <div className="tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
              {data.services.map(
                (
                  service: { title: string; description: string },
                  index: number
                ) => (
                  <ServiceCard
                    key={index}
                    name={service.title}
                    description={service.description}
                  />
                )
              )}
            </div>
          </div>
        </div>
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        {/* About Slide - Full Page */}
        <div className="full-page-slide" ref={aboutSlideRef}>
          <div
            className="slide-content min-h-screen flex flex-col justify-center laptop:p-0"
            ref={aboutRef}
          >
            <h1 className="tablet:m-10 text-2xl text-bold">About.</h1>
            <p className="tablet:m-10 text-xl laptop:text-3xl w-full laptop:w-3/5">
              {data.aboutpara}
            </p>
          </div>
        </div>
        <Footer />
      </div>

      {/* Floating Scroll Button */}
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

      {/* Morphing Transition SVG */}
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
  );
}
