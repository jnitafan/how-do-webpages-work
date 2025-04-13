"use client";

import React, { useState, useEffect } from "react";

const MAX_DEPTH = 7;
const SCALE_FACTOR = 0.5;

function Droste({ depth, mouseX, mouseY }) {
  if (depth === 0) return null;

  const translateX = mouseX * (1 - SCALE_FACTOR);
  const translateY = mouseY * (1 - SCALE_FACTOR);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, #f06, transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `translate(${translateX}px, ${translateY}px) scale(${SCALE_FACTOR})`,
          transformOrigin: "top left",
          opacity: 0.8,
        }}
      >
        <Droste depth={depth - 1} mouseX={mouseX} mouseY={mouseY} />
      </div>
    </div>
  );
}

function DrosteContainer() {
  // Set initial values to zero to avoid referencing window during SSR
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Track mounting so we know we are on the client.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Now window is available so set initial mouse position based on viewport dimensions.
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Until the component is mounted on the client, render nothing.
  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Droste depth={MAX_DEPTH} mouseX={mousePos.x} mouseY={mousePos.y} />
    </div>
  );
}

export default DrosteContainer;
