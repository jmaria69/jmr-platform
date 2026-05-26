import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Praxia Labs | From Prompt to Praxis",
    template: "%s | Praxia Labs",
  },
  description:
    "Agentes de IA que no solo hablan, ejecutan. Transformamos la intención de tu empresa en automatización real, 24/7.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-CQ6u47R42u"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CQ6u47R42u');
            `,
          }}
        />
      </head>
      <body className="grain min-h-full flex flex-col bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
        <TooltipProvider>
          <main className="flex-1">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}