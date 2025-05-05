// components/slides/Slide4.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import NetworkEdgeData from "@/data/network-edge-data.json";
import NetworkGraph from "@/utils/network.utils";
import styles from "./slides.module.scss";

const Slide4 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <NetworkGraph
        nodes={NetworkEdgeData.nodes}
        edges={NetworkEdgeData.edges}
      />
    </div>
  );
});

export default Slide4;
