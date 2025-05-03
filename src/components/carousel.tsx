"use client";

import React, { useState, useRef, useEffect } from "react";
import { animate } from "framer-motion/dom";
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
} from "@/components/slides/slides";
import styles from "./carousel.module.scss";

const START = 5; // For debugging, start on this slide.
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7];

const Carousel: React.FC = () => {
  const [idx, setIdx] = useState(START);
  const [loading, setLoading] = useState(false);
  const slideRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const centerRef = useRef<HTMLButtonElement>(null);

  const fadeOut = () =>
    new Promise<void>((res) =>
      wrapperRef.current
        ? animate(
            wrapperRef.current,
            { opacity: [1, 0] },
            { duration: 1.0, onComplete: res }
          )
        : res()
    );
  const fadeIn = () =>
    new Promise<void>((res) =>
      wrapperRef.current
        ? animate(
            wrapperRef.current,
            { opacity: [0, 1] },
            { duration: 1.0, onComplete: res }
          )
        : res()
    );

  const goTo = async (newIdx: number, mode: "next" | "fade") => {
    if (newIdx < 0 || newIdx >= SLIDES.length || newIdx === idx) return;

    setLoading(true);
    try {
      if (mode === "next" && slideRef.current?.exitAnimation) {
        await slideRef.current.exitAnimation();
        setIdx(newIdx);
      } else {
        await fadeOut();
        setIdx(newIdx);
        await fadeIn();
      }
    } finally {
      setLoading(false);
    }
  };

  // play slide entry animation
  useEffect(() => {
    slideRef.current?.entryAnimation?.();
  }, [idx]);

  // center button opacity
  useEffect(() => {
    if (!centerRef.current) return;
    const isEdge = idx === 0 || idx === SLIDES.length - 1;
    animate(
      centerRef.current,
      { opacity: isEdge ? [0, 1] : [1, 0] },
      { duration: isEdge ? 1.0 : 0.0 }
    );
  }, [idx]);

  // Prev/Next slide in/out
  useEffect(() => {
    if (!prevRef.current || !nextRef.current) return;
    const inMiddle = idx > 0 && idx < SLIDES.length - 1;

    if (inMiddle) {
      prevRef.current.style.display = "block";
      nextRef.current.style.display = "block";
      animate(
        prevRef.current,
        { x: [-100, 0], opacity: [0, 1] },
        { duration: 1.0 }
      );
      animate(
        nextRef.current,
        { x: [100, 0], opacity: [0, 1] },
        { duration: 1.0 }
      );
    } else {
      animate(
        prevRef.current,
        { x: [0, -100], opacity: [1, 0] },
        {
          duration: 1.0,
          onComplete: () => {
            prevRef.current!.style.display = "none";
          },
        }
      );
      animate(
        nextRef.current,
        { x: [0, 100], opacity: [1, 0] },
        {
          duration: 1.0,
          onComplete: () => {
            nextRef.current!.style.display = "none";
          },
        }
      );
    }
  }, [idx]);

  const Current = SLIDES[idx];
  const isFirst = idx === 0;
  const isLast = idx === SLIDES.length - 1;
  const onCenter = () =>
    isFirst ? goTo(1, "next") : isLast ? goTo(0, "fade") : null;

  return (
    <div className={styles.carousel}>
      <div ref={wrapperRef} className={styles.carousel__slide}>
        <Current ref={slideRef} />
      </div>

      {/* spinner */}
      {loading && (
        <div className={styles.carousel__spinnerOverlay}>
          <div className={styles.carousel__spinner} />
        </div>
      )}

      {/* backdrop blur */}
      <div
        className={`${styles.carousel__backdrop} ${
          loading ? styles["carousel__backdrop--active"] : ""
        }`}
      />

      {/* Prev */}
      <button
        ref={prevRef}
        className={styles.carousel__control}
        style={{
          display: "none",
          top: "50%",
          left: "1rem",
          transform: "translateY(-50%)",
          opacity: 0,
        }}
        onClick={() => goTo(idx - 1, "fade")}
      >
        ◀
      </button>

      {/* Next */}
      <button
        ref={nextRef}
        className={styles.carousel__control}
        style={{
          display: "none",
          top: "50%",
          right: "1rem",
          transform: "translateY(-50%)",
          opacity: 0,
        }}
        onClick={() => goTo(idx + 1, "next")}
      >
        ▶
      </button>

      {/* Center Start/Restart */}
      <button
        ref={centerRef}
        className={styles.carousel__control}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
        onClick={onCenter}
      >
        {isFirst ? "Start" : isLast ? "Restart" : ""}
      </button>

      <div className={styles.carousel__indicators}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.carousel__indicator} ${
              i === idx ? styles.active : ""
            }`}
            onClick={() => goTo(i, "fade")}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
