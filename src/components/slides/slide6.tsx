// components/slides/Slide6.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import styles from "./slides.module.scss";
import DiagramGraph from "@/utils/diagram.utils";

const Slide6 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <DiagramGraph />
    </div>
  );
});

export default Slide6;
