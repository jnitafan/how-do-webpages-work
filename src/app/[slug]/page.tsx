// app/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Carousel from "@/components/carousel";

// placeholder slugs for slides 2–14
export const slideSlugs = [
  "0-Introduction",
  "1-What_is_the_Web",
  "2-The_History_of_the_Web",
  "3-The_Internet_Today",
  "4-The_Network_Edge",
  "5-The_Network_Core",
  "6-Protocols",
  "7-Packets",
  "8-Critical_Rendering_Path",
  "9-HTML",
  "10-DOM",
  "11-Layout",
  "12-Paint",
  "13-Ending",
];

export default function SlidePage() {
  const { slug } = useParams();
  // extract slide number from slug (e.g. "3-Placeholder-Slide-3" → 2)
  const index = slideSlugs.findIndex((s) => s === slug);
  const initialIdx = index >= 0 ? index : 0;
  return <Carousel initialIdx={initialIdx} />;
}
