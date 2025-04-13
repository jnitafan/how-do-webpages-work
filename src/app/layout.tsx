import type { Metadata } from "next";
import { Inter, Roboto_Mono, DM_Serif_Display } from "next/font/google";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import Navigation from "@/components/navigation";
import "@/utils/reactflow.styling.scss";
import "@/utils/highlight.styling.scss";
import "./globals.scss";

const inter: NextFontWithVariable = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono: NextFontWithVariable = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const DMSerif: NextFontWithVariable = DM_Serif_Display({
  variable: "--font-DM-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How do webpages work?",
  description:
    "A simple static website to show how the internet and browsers work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} ${DMSerif.variable}`}
    >
      <body>
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
}
