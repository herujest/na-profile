import Head from "next/head";
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
import { useIsomorphicLayoutEffect } from "../utils";

// Local Data
import data from "../data/portfolio.json";
import Portfolio from "./sections/portfolio";

import GlassRadioGroup from "../components/Button/GlassRadioGroup";
import Collaboration from "./sections/collaboration";

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

  // Refs for slide containers
  const heroSlideRef = useRef<HTMLDivElement>(null);
  const workSlideRef = useRef<HTMLDivElement>(null);
  const servicesSlideRef = useRef<HTMLDivElement>(null);
  const aboutSlideRef = useRef<HTMLDivElement>(null);

  function onChangeActiveTab(index: number) {
    // Clear any GSAP transforms before changing tab to prevent glitches
    if (typeof window !== "undefined" && workSlideRef.current) {
      const workContent = workSlideRef.current.querySelector(".slide-content");
      if (workContent) {
        gsap.set(workContent, { clearProps: "transform" });
      }
    }

    setCurrentTabIndex(index);
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

      if (workSlideRef.current) {
        const workContent =
          workSlideRef.current.querySelector(".slide-content");
        if (workContent) {
          // Ensure content is visible initially
          gsap.set(workContent, {
            opacity: 1,
            clearProps: "transform", // Clear any transform that might cause glitches
          });

          const cleanup = createStickySlide(
            workSlideRef.current,
            workContent as HTMLElement,
            {
              start: "top top+=80",
              end: "+=100%",
              scrub: 1,
              pin: false, // Disable pinning to prevent glitches with dynamic content
              pinSpacing: false,
              animation: {
                opacity: 1,
                ease: "power2.out",
              },
              onEnter: () => {
                gsap.to(workContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                  clearProps: "transform",
                });
              },
              onLeave: () => {
                // No animation on leave to prevent zoom effect
              },
              onEnterBack: () => {
                gsap.to(workContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                  clearProps: "transform",
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
          const cleanup = createStickySlide(
            servicesSlideRef.current,
            servicesContent as HTMLElement,
            {
              start: "top top+=80",
              end: "+=100%",
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

      if (aboutSlideRef.current) {
        const aboutContent =
          aboutSlideRef.current.querySelector(".slide-content");
        if (aboutContent) {
          const cleanup = createStickySlide(
            aboutSlideRef.current,
            aboutContent as HTMLElement,
            {
              start: "top top+=80",
              end: "+=100%",
              scrub: 1,
              animation: {
                opacity: 1,
                ease: "power2.out",
              },
              onEnter: () => {
                gsap.to(aboutContent, {
                  opacity: 1,
                  duration: 0.3,
                  ease: Power3.easeOut,
                });
              },
              onLeave: () => {
                // No animation on leave to prevent zoom effect
              },
              onEnterBack: () => {
                gsap.to(aboutContent, {
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

  // Refresh ScrollTrigger when tab changes (for conditional content)
  // Use debounce to prevent too frequent refreshes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { ScrollTrigger } = require("gsap/ScrollTrigger");

      // Disable ScrollTrigger temporarily to prevent glitches
      ScrollTrigger.refresh(false);

      // Small delay to ensure DOM is updated, then refresh
      const timer = setTimeout(() => {
        // Batch refresh to prevent multiple recalculations
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 200);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentTabIndex]);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

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
          <div className="slide-content h-full flex flex-col justify-between items-start px-4 laptop:px-0 pb-8 laptop:pb-10">
            <div className="w-full flex-grow flex flex-col justify-center">
              <h1
                ref={textOne}
                className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
              >
                {data.headerTaglineOne}
              </h1>
              <h1
                ref={textTwo}
                className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {data.headerTaglineTwo}
              </h1>
              <h1
                ref={textThree}
                className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {data.headerTaglineThree}
              </h1>
              <h1
                ref={textFour}
                className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
              >
                {data.headerTaglineFour}
              </h1>
            </div>

            <div ref={socialsRef} className="w-full">
              <Socials className="mt-2 laptop:mt-5" />
            </div>
          </div>
        </div>
        {/* WORK Collaborations Slide - Full Page */}
        <div className="full-page-slide" ref={workSlideRef}>
          <div
            className="slide-content min-h-screen flex flex-col pt-20 laptop:pt-24"
            style={{ opacity: 1, visibility: "visible" }}
          >
            <div className="w-full flex justify-center mb-8" ref={tabsRef}>
              <GlassRadioGroup
                name="portfolio-tabs"
                options={[
                  { id: "tab-portfolio", label: "Portfolio", value: 0 },
                  { id: "tab-collaboration", label: "Collaboration", value: 1 },
                ]}
                selectedValue={currentTabIndex}
                onChange={onChangeActiveTab}
              />
            </div>
            <div
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
            className="slide-content min-h-screen flex flex-col justify-center p-2 laptop:p-0 pt-20 laptop:pt-24"
            ref={servicesRef}
          >
            <h1 className="tablet:m-10 text-2xl text-bold">Services.</h1>
            <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
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
            className="slide-content min-h-screen flex flex-col justify-center p-2 laptop:p-0 pt-20 laptop:pt-24"
            ref={aboutRef}
          >
            <h1 className="tablet:m-10 text-2xl text-bold">About.</h1>
            <p className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5">
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
    </div>
  );
}
