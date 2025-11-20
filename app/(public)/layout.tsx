"use client";

import { MainLayout } from "@/components/layouts";
import { ScrollProvider, useScroll } from "./ScrollContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function PublicLayoutContent({ children }: { children: ReactNode }) {
  const scrollContext = useScroll();
  const pathname = usePathname();
  const [handlers, setHandlers] = useState({
    handleWorkScroll: scrollContext?.handleWorkScroll,
    handleAboutScroll: scrollContext?.handleAboutScroll,
    handleContactScroll: scrollContext?.handleContactScroll,
  });

  // Detect if current page is a blog page
  const isBlog = pathname?.startsWith("/blog") ?? false;

  // Update handlers when context changes
  useEffect(() => {
    setHandlers({
      handleWorkScroll: scrollContext?.handleWorkScroll,
      handleAboutScroll: scrollContext?.handleAboutScroll,
      handleContactScroll: scrollContext?.handleContactScroll,
    });

    // Debug logging
    console.log("[PublicLayout] Context updated:", {
      hasHandleWorkScroll: !!scrollContext?.handleWorkScroll,
      hasHandleAboutScroll: !!scrollContext?.handleAboutScroll,
      hasHandleContactScroll: !!scrollContext?.handleContactScroll,
      scrollContext,
      pathname,
      isBlog,
    });
  }, [scrollContext, pathname, isBlog]);

  return (
    <>
      <div className="gradient-circle"></div>
      <MainLayout
        isBlog={isBlog}
        showHeader={true}
        showFooter={true}
        handleWorkScroll={handlers.handleWorkScroll}
        handleAboutScroll={handlers.handleAboutScroll}
        handleContactScroll={handlers.handleContactScroll}
      >
        {children}
      </MainLayout>
      <div className="gradient-circle-bottom"></div>
    </>
  );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ScrollProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </ScrollProvider>
  );
}
