"use client";

import React, { Fragment } from "react";
import Carousel from "@/components/carousel";

const Home = () => {
  return (
    <>
      <Carousel></Carousel>
      <DebugBreakpoints />
    </>
  );
};

export default Home;

const breakpoints: Record<string, number> = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

function DebugBreakpoints() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {Object.entries(breakpoints).map(([key, px]) => (
        <Fragment key={key}>
          {/* Label */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: px,
              transform: "translateX(-50%)",
              backgroundColor: "rgba(255,255,255,1)",
              padding: "2px 4px",
              fontSize: "10px",
              color: "red",
              fontWeight: 600,
              zIndex: 10,
            }}
          >
            {key}
          </div>
          {/* Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: px,
              height: "100%",
              width: "1px",
              backgroundColor: "rgba(255,0,0,0.7)",
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}
