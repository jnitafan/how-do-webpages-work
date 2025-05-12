"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { useMotionValue, animate } from "framer-motion";
import styles from "./slides.module.scss";

const GridRevealCanvasSVG = ({
  width = 1000,
  height = 1000,
  rows = 20,
  cols = 20,
  duration = 2,
  svgSrc = "/screenshot.svg",
}) => {
  const canvasRef = useRef(null);
  const progress = useMotionValue(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = svgSrc;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, [svgSrc]);

  useEffect(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const totalCells = rows * cols;

    const drawGrid = (currentValue) => {
      ctx.clearRect(0, 0, width, height);
      const cellsToShow = Math.floor(currentValue);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cellIndex = row * cols + col;
          if (cellIndex < cellsToShow) {
            const srcX = col * (imageRef.current.width / cols);
            const srcY = row * (imageRef.current.height / rows);
            const W = imageRef.current.naturalWidth
            const H = imageRef.current.naturalHeight
            const srcWidth  =  W / cols
            const srcHeight =  H / rows
            

            const destX = col * cellWidth;
            const destY = row * cellHeight;

            ctx.drawImage(
              imageRef.current,
              srcX,
              srcY,
              srcWidth,
              srcHeight,
              destX,
              destY,
              cellWidth,
              cellHeight
            );
          }
        }
      }
    };

    const unsubscribe = progress.onChange((latestValue) => {
      drawGrid(latestValue);
    });

    const animation = animate(progress, totalCells, {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => {
      unsubscribe();
      animation.stop();
    };
  }, [imageLoaded, progress, width, height, rows, cols, duration]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        margin: "0 auto",
        backgroundImage: "url('/framework.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
};

const Slide12 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));
  return (
    <div className={styles.slide}>
      <GridRevealCanvasSVG />
    </div>
  );
});

export default Slide12;
