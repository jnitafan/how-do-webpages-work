"use client";

import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./slides.module.scss";

const MAX_DEPTH = 12;
const SCALE_FACTOR = 0.75;

function Droste({ depth, mouseX, mouseY }) {
  if (depth === 0) return null;

  const translateX = mouseX * (1 - SCALE_FACTOR);
  const translateY = mouseY * (1 - SCALE_FACTOR);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Image
          src="/screenshot.svg"
          alt="screenshot"
          width="1024"
          height="768"
          style={{ height: "100%", width: "100%", background: "#ebebeb" }}
        />

      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${translateX}px, ${translateY}px) scale(${SCALE_FACTOR})`,
          transformOrigin: 'top left'
        }}
      >
        <Droste depth={depth - 1} mouseX={mouseX} mouseY={mouseY} />
      </div>
    </div>
  );
}

function DrosteContainer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only access the window object after the component is mounted
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    // Add event listener only when mounted
    if (mounted) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup on unmount
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Droste depth={MAX_DEPTH} mouseX={mousePos.x} mouseY={mousePos.y} />
    </div>
  );
}

const Slide13 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => { },
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <DrosteContainer />
    </div>
  );
});

export default Slide13;
