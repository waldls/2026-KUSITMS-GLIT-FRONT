import "@/app/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import Providers from "@/providers/Providers";
import RouteTransitionProvider from "@/providers/RouteTransitionProvider";

const pretendard = localFont({
  src: "../font/PretendardVariable.woff2",
  display: "swap",
  preload: true,
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "글릿",
  description: "기록할수록 선명해지는 나만의 커리어, 글릿",
  manifest: "/manifest.webmanifest",
  openGraph: {
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "글릿",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  viewportFit: "cover",
  userScalable: false,
};

const apiOrigin = (() => {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    return base ? new URL(base).origin : null;
  } catch {
    return null;
  }
})();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko" className={`h-dvh overflow-hidden bg-gray-900 ${pretendard.variable}`}>
      <head>{apiOrigin && <link rel="preconnect" href={apiOrigin} />}</head>
      <body className="app-viewport-bg h-dvh overflow-hidden">
        <Providers>
          <main className="relative z-10 mx-auto flex h-dvh w-full max-w-107.5 min-w-0 overflow-hidden bg-gray-900">
            <RouteTransitionProvider>{children}</RouteTransitionProvider>
          </main>
        </Providers>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
