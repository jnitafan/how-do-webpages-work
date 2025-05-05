// components/slides/Slide7.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import styles from "./slides.module.scss";

const Slide7 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <div></div>
    </div>
  );
});

export default Slide7;
