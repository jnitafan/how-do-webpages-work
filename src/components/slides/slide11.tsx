// components/slides/Slide11.tsx
"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { animate } from "framer-motion/dom";
import styles from "./slides.module.scss";

const Slide11 = forwardRef((_, ref) => {
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
    <div className={styles.slide}>
      <div ref={b}>Slide11 – Part B</div>
      <div ref={a}>Slide11 – Part A</div>
    </div>
  );
});

export default Slide11;
