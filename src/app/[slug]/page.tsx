// app/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Carousel from "@/components/carousel";
import slideSlugs from "@/data/slugs";

export default function SlidePage() {
  const { slug } = useParams();
  // extract slide number from slug (e.g. "3-Placeholder-Slide-3" → 2)
  const index = slideSlugs.findIndex((s) => s === slug);
  const initialIdx = index >= 0 ? index : 0;
  return <Carousel initialIdx={initialIdx} />;
}
