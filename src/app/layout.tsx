import "@/app/globals.css";

import type { Metadata, Viewport } from "next";

import Providers from "@/providers/Providers";
import RouteTransitionProvider from "@/providers/RouteTransitionProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-dvh overflow-hidden bg-gray-300">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="app-viewport-bg h-dvh overflow-hidden">
        <Providers>
          <main className="relative z-10 mx-auto flex h-dvh w-full max-w-107.5 min-w-0 overflow-hidden bg-gray-900">
            <RouteTransitionProvider>{children}</RouteTransitionProvider>
          </main>
        </Providers>
      </body>
    </html>
  );
}
