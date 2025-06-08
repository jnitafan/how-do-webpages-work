// components/slides/Slide9.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import styles from "./slides.module.scss";
import DiagramGraph from "@/utils/diagram.utils";
import crpData from "@/data/critical-rendering-path-data.json";

const Slide9 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <DiagramGraph nodes={crpData.nodes} edges={crpData.edges} />
    </div>
  );
});

export default Slide9;
