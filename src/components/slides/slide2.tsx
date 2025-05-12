"use client";

import timelineData from "@/data/timeline-data.json";
import styles from "./slides.module.scss";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";

interface ImageData {
  src: string;
  alt: string;
  width: number;
  layer: number;
  top: number;
}

type Layer = {
  ratio: number;
  layerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
};

const SafeAttr = ({ htmlString }: { htmlString: string }) => {
  const cleanHtml = DOMPurify.sanitize(htmlString);
  return (
    <p
      className={styles.attr}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    ></p>
  );
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
    timeline.current.scrollTo(0, 0);
  }, []);

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

  const handleClickForward = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = timeline.current;
    if (!el) return;

    const { clientX, clientY } = e;
    // 2) “hide” the timeline from hit-testing
    el.style.pointerEvents = "none";
    const underneath = document.elementFromPoint(
      clientX,
      clientY
    ) as HTMLElement | null;
    // 3) restore
    el.style.pointerEvents = "auto";

    // 4) if it’s a link (or has an onClick), invoke it
    if (underneath) {
      if (underneath.tagName.toLowerCase() === "a") {
        (underneath as HTMLAnchorElement).click();
      } else {
        // optionally dispatch a click event if you want to catch React handlers
        underneath.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = timeline.current;
    if (!el) return;

    // temporarily “hide” the overlay from hit-testing
    el.style.pointerEvents = "none";
    const underneath = document.elementFromPoint(
      e.clientX,
      e.clientY
    ) as HTMLElement | null;
    // restore
    el.style.pointerEvents = "auto";

    // if it (or an ancestor) is an <a>, show pointer
    if (underneath?.closest("a")) {
      el.style.cursor = "pointer";
    } else {
      el.style.cursor = "";
    }
  };

  const handleMouseLeave = () => {
    if (timeline.current) timeline.current.style.cursor = "";
  };

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
                      top: `${img.top}%`,
                      left: `${img.left}%`,
                      width: `${img.width}%`,
                    }}
                  >
                    <motion.img
                      src={img.src}
                      alt={img.alt}
                      className={styles.img}
                    />
                    <div className={styles.imgContent}>
                      <p className={styles.alt}>"{img.alt}"</p>
                      <SafeAttr htmlString={img.attribution} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}

      <div
        className={styles.s2__timeline}
        ref={timeline}
        onClick={handleClickForward}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.s2__line} />
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
