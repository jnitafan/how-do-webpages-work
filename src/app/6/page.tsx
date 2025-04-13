"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function App() {
  const [routingAnim, setRoutingAnim] = useState(null);
  const [headersAnim, setHeadersAnim] = useState(null);

  useEffect(() => {
    // Fetch the animation JSON file from the public folder
    fetch("/routing.json")
      .then((response) => response.json())
      .then((data) => setRoutingAnim(data))
      .catch((error) =>
        console.error("Error loading the Lottie animation:", error)
      );
    fetch("/headers.json")
      .then((response) => response.json())
      .then((data) => setHeadersAnim(data))
      .catch((error) =>
        console.error("Error loading the Lottie animation:", error)
      );
  }, []);

  if (!routingAnim || !headersAnim) {
    return <div>Loading animation...</div>;
  }

  return (
    <div>
      <Lottie animationData={routingAnim} loop={true} />
      <Lottie animationData={headersAnim} loop={false} />
    </div>
  );
}
