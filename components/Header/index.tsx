"use client";

import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
// Local Data
import data from "@/lib/data/portfolio.json";

// Type for Popover render prop (not exported from @headlessui/react)
type PopoverRenderProps = {
  open: boolean;
  close: (
    focusableElement?:
      | HTMLElement
      | React.MutableRefObject<HTMLElement | null>
      | React.MouseEvent<HTMLElement>
  ) => void;
};

interface HeaderProps {
  handleWorkScroll?: () => void;
  handleAboutScroll?: () => void;
  handleContactScroll?: () => void;
  isBlog?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  handleWorkScroll,
  handleAboutScroll,
  handleContactScroll,
  isBlog,
}) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const { name, showBlog, showResume } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle contact scroll - if on home page, scroll directly, otherwise navigate to home with hash
  const handleContactClick = () => {
    if (handleContactScroll) {
      // On home page, scroll directly
      handleContactScroll();
    } else {
      // On other pages, navigate to home with hash
      router.push("/#contact");
    }
  };

  // Handle work scroll - if on home page, scroll directly, otherwise navigate to home with hash
  const handleWorkClick = () => {
    if (handleWorkScroll) {
      // On home page, scroll directly
      handleWorkScroll();
    } else {
      // On other pages, navigate to home with hash
      router.push("/#work");
    }
  };

  // Handle about scroll - if on home page, scroll directly, otherwise navigate to home with hash
  const handleAboutClick = () => {
    if (handleAboutScroll) {
      // On home page, scroll directly
      handleAboutScroll();
    } else {
      // On other pages, navigate to home with hash
      router.push("/#about");
    }
  };

  return (
    <>
      <Popover className="block tablet:hidden mt-5 relative z-50">
        {({ open }: PopoverRenderProps): React.ReactElement => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              <h1
                onClick={() => router.push("/")}
                className="font-medium p-2 laptop:p-0 link text-gray-900 dark:text-white cursor-pointer"
              >
                {name}
              </h1>

              <div className="flex items-center">
                {mounted && (
                  <Button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <img
                      className="h-6"
                      src={`/images/${
                        theme === "dark" ? "moon.svg" : "sun.svg"
                      }`}
                      alt="theme toggle"
                    ></img>
                  </Button>
                )}

                <Popover.Button>
                  <img
                    className="h-5"
                    src={`/images/${
                      !open
                        ? theme === "dark"
                          ? "menu-white.svg"
                          : "menu.svg"
                        : theme === "light"
                        ? "cancel.svg"
                        : "cancel-white.svg"
                    }`}
                    alt="menu"
                  ></img>
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel className="absolute right-0 z-50 w-11/12 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-md rounded-md border border-gray-200/50 dark:border-gray-800/50">
              {!isBlog ? (
                <div className="grid grid-cols-1">
                  <Button onClick={handleWorkClick}>Work</Button>
                  <Button onClick={handleAboutClick}>About</Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showResume && (
                    <Button onClick={() => router.push("/resume")}>
                      Resume
                    </Button>
                  )}

                  <Button onClick={handleContactClick}>Contact</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  <Button onClick={() => router.push("/")} classes="first:ml-1">
                    Home
                  </Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                      classes="first:ml-1"
                    >
                      Resume
                    </Button>
                  )}

                  <Button onClick={handleContactClick}>Contact</Button>
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className="mt-10 hidden flex-row items-center justify-between sticky top-0 z-50 tablet:flex py-3 px-4"
        suppressHydrationWarning
      >
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0 text-gray-900 dark:text-white"
        >
          {name}.
        </h1>
        {!isBlog ? (
          <div className="flex">
            <Button onClick={handleWorkClick}>Work</Button>
            <Button onClick={handleAboutClick}>About</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            <Button onClick={handleContactClick}>Contact</Button>
            {mounted && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  alt="theme toggle"
                ></img>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex">
            <Button onClick={() => router.push("/")}>Home</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            <Button onClick={handleContactClick}>Contact</Button>

            {mounted && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  alt="theme toggle"
                ></img>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
