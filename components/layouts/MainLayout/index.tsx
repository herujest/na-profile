"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import data from "@/lib/data/portfolio.json";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  isBlog?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showCursor?: boolean;
  handleWorkScroll?: () => void;
  handleAboutScroll?: () => void;
  handleContactScroll?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
  isBlog = false,
  showHeader = true,
  showFooter = true,
  showCursor,
  handleWorkScroll,
  handleAboutScroll,
  handleContactScroll,
}) => {
  const cursorEnabled = showCursor ?? data?.showCursor ?? false;

  // Only pass handlers if they exist to prevent errors
  const safeHandleWorkScroll = handleWorkScroll
    ? () => {
        try {
          handleWorkScroll();
        } catch (error) {
          console.error("Error in handleWorkScroll:", error);
        }
      }
    : undefined;

  const safeHandleAboutScroll = handleAboutScroll
    ? () => {
        try {
          handleAboutScroll();
        } catch (error) {
          console.error("Error in handleAboutScroll:", error);
        }
      }
    : undefined;

  const safeHandleContactScroll = handleContactScroll
    ? () => {
        try {
          handleContactScroll();
        } catch (error) {
          console.error("Error in handleContactScroll:", error);
        }
      }
    : undefined;

  return (
    <>
      {cursorEnabled && <Cursor />}
      <div className="container mx-auto mt-10 relative">
        {showHeader && (
          <Header
            isBlog={isBlog}
            handleWorkScroll={safeHandleWorkScroll}
            handleAboutScroll={safeHandleAboutScroll}
            handleContactScroll={safeHandleContactScroll}
          />
        )}
        {children}
        {showFooter && <Footer />}
      </div>
    </>
  );
};

export default MainLayout;
