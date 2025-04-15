"use client";

import { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { animate } from "framer-motion/dom";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null!);
  return (
    <>
      <TransitionRouter
        auto
        leave={(next) => {
          animate(
            wrapperRef.current,
            { opacity: [1, 0] },
            { duration: 3.0, onComplete: next }
          );
        }}
        enter={(next) => {
          animate(
            wrapperRef.current,
            { opacity: [0, 1] },
            { duration: 3.0, onComplete: next }
          );
        }}
      >
        <div ref={wrapperRef}>{children}</div>
      </TransitionRouter>
    </>
  );
};

export default Provider;
