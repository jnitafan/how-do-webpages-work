"use client";

import timelineData from "@/data/timeline-data.json";
import styles from "./slides.module.scss";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

interface ImageData {
  src: string;
  alt: string;
  width: number;
  layer: number;
  item: number;
  offset: { x: number; y: number };
}

type Layer = {
  ratio: number;
  layerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
};

const Slide2 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  const timeline = useRef<HTMLDivElement>(null);
  const layers: Layer[] = [
    { ratio: 2, layerRef: useRef(null), contentRef: useRef(null) },
    { ratio: 4, layerRef: useRef(null), contentRef: useRef(null) },
    { ratio: 8, layerRef: useRef(null), contentRef: useRef(null) },
    { ratio: 10, layerRef: useRef(null), contentRef: useRef(null) },
  ];

  const { scrollYProgress } = useScroll({
    container: timeline,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const updateSizes = () => {
      const primary = timeline.current;
      if (!primary) return;

      const vh = primary.clientHeight;
      const scrollLen = primary.scrollHeight - vh;

      layers.forEach(({ ratio, layerRef, contentRef }) => {
        const layerEl = layerRef.current;
        const contentEl = contentRef.current;
        if (layerEl && contentEl) {
          // layer container is exactly viewport-tall
          layerEl.style.height = `${vh}px`;
          // inner content is viewport + scaled scroll length
          contentEl.style.height = `${vh + scrollLen / ratio}px`;
        }
      });
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [layers]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    layers.forEach(({ layerRef }) => {
      const layerEl = layerRef.current;
      if (layerEl) {
        const maxScroll = layerEl.scrollHeight - layerEl.clientHeight;
        layerEl.scrollTop = maxScroll * p;
      }
    });
  });

  return (
    <div className={styles.slide}>
      {layers.map(({ ratio, layerRef, contentRef }, i) => {
        const z = layers.length - 1 - i; // 0→3 becomes 3→0
        return (
          <div
            key={i}
            className={styles.s2__layer}
            ref={layerRef}
            style={{ zIndex: z }}
          >
            <div ref={contentRef} className={styles.s2__layerContent}>
              {timelineData.data.images
                .filter((img: ImageData) => img.layer === i)
                .map((img, idx) => (
                  <div
                  key={idx}
                  style={{
                    position: "absolute",
                    top: `${
                      (img.item / timelineData.data.events.length) * 100
                    }%`,
                    left: `${img.left}%`,
                    transform: `translate(${img.offset.x}px, ${img.offset.y}px)`,
                    width: `${img.width}%`,
                  }}>
                  <motion.img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: `100%`
                    }}
                  />
                  <p className={styles.alt}>{img.alt}</p>
                  <p className={styles.attr}>{img.attribution}</p>
                  </div>
                ))}
            </div>
          </div>
        );
      })}

      <div className={styles.s2__line} />

      <div className={styles.s2__timeline} ref={timeline}>
        {timelineData.data.events.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.item} ${
              idx % 2 === 0 ? styles.left : styles.right
            }`}
          >
            <div className={styles.content}>
              <span className={styles.year}>{item.year}</span>
              <p className={styles.text}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Slide2;
