// components/slides/Slide3.tsx
"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { animate } from "framer-motion/dom";

const Slide3 = forwardRef((_, ref) => {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    entryAnimation: () => {
      animate(a.current, { x: [-100, 0], opacity: [0, 1] }, { duration: 0.5 });
      animate(b.current, { x: [100, 0], opacity: [0, 1] }, { duration: 0.5 });
    },
    exitAnimation: () =>
      new Promise<void>((res) => {
        animate(
          a.current,
          { x: [0, -100], opacity: [1, 0] },
          { duration: 0.5 }
        );
        animate(
          b.current,
          { x: [0, 100], opacity: [1, 0] },
          { duration: 0.5, onComplete: res }
        );
      }),
  }));

  return (
    <div className="slide3">
      <div ref={a}>Slide 1 – Part A</div>
      <div ref={b}>Slide 1 – Part B</div>
    </div>
  );
});

export default Slide3;
