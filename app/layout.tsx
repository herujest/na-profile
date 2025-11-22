// app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import dynamic from "next/dynamic";
import "../styles/globals.css";

// Dynamically import SplashProvider and Splash to enable code splitting
const SplashProvider = dynamic(
  () =>
    import("@/components/Splash/SplashProvider").then((mod) => ({
      default: mod.SplashProvider,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const Splash = dynamic(() => import("@/components/Splash"), {
  ssr: false,
  loading: () => null,
});

// Theme provider wrapper for App Router
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

export const metadata: Metadata = {
  title: {
    default: "Nisa Aulia - Portfolio",
    template: "%s | Nisa Aulia",
  },
  description:
    "Portfolio website for Nisa Aulia - Model, Muse and Makeup Aficionado",
  keywords: ["portfolio", "model", "photography", "beauty", "fashion"],
  authors: [{ name: "Nisa Aulia" }],
  creator: "Nisa Aulia",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nisa Aulia Portfolio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* SplashProvider controls when homepage mounts */}
        <SplashProvider splash={<Splash />}>
          {/* Homepage - only mounts AFTER splash completes */}
          <ThemeWrapper>{children}</ThemeWrapper>
        </SplashProvider>
        {/* jQuery script from _document.tsx - migrated to App Router */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
