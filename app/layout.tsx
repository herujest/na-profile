import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "../styles/globals.css";

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
  description: "Portfolio website for Nisa Aulia - Model, Muse and Makeup Aficionado",
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
        {/* jQuery script from _document.tsx - migrated to App Router */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
          strategy="lazyOnload"
        />
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}

