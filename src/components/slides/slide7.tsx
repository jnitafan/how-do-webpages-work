// components/slides/Slide7.tsx
"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import dynamic from "next/dynamic";
import headersLottie from "@/data/headers.json"
import routingLottie from "@/data/routing.json"
import styles from "./slides.module.scss";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Slide7 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  return (
    <div className={styles.slide}>
      <div className={styles.s7}>
        <Lottie className={styles.s7__routingLottie} animationData={routingLottie} loop={true} />
        <div className={styles.s7__stackTitles}>
          <div className={styles.titles}>OSI Model</div>
          <div className={styles.titles}>TCP / IP Model</div>
        </div>
        <div className={styles.s7__headers}>
          <div className={styles.stack}>
            <div className={`${styles.stackItem} ${styles.stack__1}`}>Application Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__2}`}>Transport Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__3}`}>Network Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__4}`}>Link Layer</div>
          </div>
          <Lottie className={styles.s7__headerLottie} animationData={headersLottie} loop={false} />
          <div className={styles.stack}>
            <div className={`${styles.stackItem} ${styles.stack__1}`}>Application Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__1}`}>Presentation Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__1}`}>Session Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__2}`}>Transport Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__3}`}>Network Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__4}`}>Link Layer</div>
            <div className={`${styles.stackItem} ${styles.stack__4}`}>Physical</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Slide7;
