// components/Carousel.tsx
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
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
} from "@/components/slides/slides";
import styles from "./carousel.module.scss";
import modalContent from "@/data/carousel-text-data";

const START = 11; // For debugging, start on this slide.
const SLIDES = [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
];

// Hook to capture the previous value of any prop/state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(null as any);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

type ModalState = "initial" | "open" | "closed";

const Carousel: React.FC = () => {
  const [idx, setIdx] = useState(START);
  const [loading, setLoading] = useState(false);
  const [visitedSlides, setVisitedSlides] = useState(new Set<number>());
  const [modalState, setModalState] = useState<ModalState>("initial");

  const slideRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const centerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fade helpers
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

  // Navigate
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
      // First visit: reset to “initial” state
      if (!visitedSlides.has(newIdx)) {
        setVisitedSlides((prev) => new Set(prev).add(newIdx));
        setModalState("initial");
      }
    } finally {
      setLoading(false);
    }
  };

  // Entry animation
  useEffect(() => {
    slideRef.current?.entryAnimation?.();
  }, [idx]);

  // Arrow controls animation
  const prevIdx = usePrevious(idx);
  const wasInMiddle =
    prevIdx !== undefined && prevIdx > 0 && prevIdx < SLIDES.length - 1;
  const nowInMiddle = idx > 0 && idx < SLIDES.length - 1;
  useEffect(() => {
    if (!prevRef.current || !nextRef.current) return;
    if (!wasInMiddle && nowInMiddle) {
      prevRef.current.style.display = "block";
      nextRef.current.style.display = "block";
      animate(
        prevRef.current,
        { x: [-100, 0], opacity: [0, 1] },
        { duration: 1 }
      );
      animate(
        nextRef.current,
        { x: [100, 0], opacity: [0, 1] },
        { duration: 1 }
      );
    } else if (wasInMiddle && !nowInMiddle) {
      animate(
        prevRef.current,
        { x: [0, -100], opacity: [1, 0] },
        {
          duration: 1,
          onComplete: () => {
            prevRef.current!.style.display = "none";
          },
        }
      );
      animate(
        nextRef.current,
        { x: [0, 100], opacity: [1, 0] },
        {
          duration: 1,
          onComplete: () => {
            nextRef.current!.style.display = "none";
          },
        }
      );
    }
  }, [wasInMiddle, nowInMiddle]);

  const Current = SLIDES[idx];
  const isFirst = idx === 0;
  const isLast = idx === SLIDES.length - 1;
  const onCenter = () =>
    isFirst ? goTo(1, "next") : isLast ? goTo(0, "fade") : null;

  // Handle initial‐state clicks
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalState !== "initial") return;
    const rect = wrapperRef.current!.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    console.log(clickY, rect.height / 3);
    if (clickY <= rect.height / 3) {
      setModalState("open");
    } else {
      setModalState("closed");
    }
  };

  return (
    <div className={styles.carousel}>
      <div ref={wrapperRef} className={styles.carousel__slide}>
        <Current ref={slideRef} />
      </div>

      {loading && (
        <div className={styles.carousel__spinnerOverlay}>
          <div className={styles.carousel__spinner} />
        </div>
      )}

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
          opacity: isFirst || isLast ? 1 : 0,
        }}
        onClick={onCenter}
      >
        {isFirst ? "Start" : isLast ? "Restart" : ""}
      </button>

      {/* Modal */}
      <div
        ref={modalRef}
        className={`${styles.carousel__modal} ${
          styles[`carousel__modal--${modalState}`]
        }`}
        onClick={handleModalClick}
      >
        <div className={styles.carousel__modalContent}>{modalContent[idx]}</div>
      </div>

      {modalState === "initial" && (
        <div
          className={styles.carousel__initialOverlay}
          onClick={handleModalClick}
        />
      )}

      {/* Up/Down toggle button */}
      {modalState !== "initial" && (
        <button
          className={`${styles.carousel__upButton} ${
            modalState === "open"
              ? styles["carousel__upButton--open"]
              : styles["carousel__upButton--closed"]
          }`}
          onClick={() =>
            setModalState((prev) => (prev === "open" ? "closed" : "open"))
          }
        >
          {modalState === "open" ? "▲" : "▼"}
        </button>
      )}

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
