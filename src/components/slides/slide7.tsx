// components/slides/Slide7.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import styles from "./slides.module.scss";
import DiagramGraph from "@/utils/diagram.utils";
import protocolData from "@/data/protocol-data.json";

const Slide7 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <DiagramGraph nodes={protocolData.nodes} edges={protocolData.edges} />
    </div>
  );
});

export default Slide7;
