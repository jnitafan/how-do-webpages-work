// components/slides/Slide6.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import NetworkCoreData from "@/data/network-core-data.json";
import NetworkGraph from "@/utils/network.utils";
import styles from "./slides.module.scss";

const Slide6 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <NetworkGraph
        nodes={NetworkCoreData.nodes}
        edges={NetworkCoreData.edges}
      />
    </div>
  );
});

export default Slide6;
