"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

const GridRevealCanvasSVG = ({
  width = 1000,
  height = 1000,
  rows = 20,
  cols = 20,
  duration = 2, // Duration of the overall animation (in seconds)
  svgSrc = "/animated.svg", // Path to your SVG file
}) => {
  const canvasRef = useRef(null);
  // Use Framer Motion's motion value for animated progress
  // We'll animate from 0 to (rows + cols - 2)
  const progress = useMotionValue(0);
  // Track whether the SVG image has loaded
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  // Load the SVG image
  useEffect(() => {
    const img = new Image();
    img.src = svgSrc;
    // If needed, uncomment the next line to handle cross-origin images
    // img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, [svgSrc]);

  // Once the image is loaded, set up the canvas drawing and animation
  useEffect(() => {
    if (!imageLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    // Total number of cells in the grid
    const totalCells = rows * cols;

    // The drawGrid function clears and re-draws the grid based on the current progress.
    // For each cell that qualifies, it draws the corresponding segment of the SVG.
    const drawGrid = (currentValue) => {
      // Clear the canvas on each update
      ctx.clearRect(0, 0, width, height);
      const cellsToShow = Math.floor(currentValue);

      // Loop over each cell in the grid
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cellIndex = row * cols + col;
          if (cellIndex < cellsToShow) {
            // Calculate the source rectangle in the SVG.
            // This divides the SVG image into an equally sized grid.
            const srcX = col * (imageRef.current.width / cols);
            const srcY = row * (imageRef.current.height / rows);
            const srcWidth = imageRef.current.width / cols;
            const srcHeight = imageRef.current.height / rows;

            // Determine where to draw on the canvas.
            const destX = col * cellWidth;
            const destY = row * cellHeight;

            // Draw the specific portion of the SVG into the appropriate grid cell.
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

    // Subscribe to changes in the motion value,
    // Redrawing the grid on each update.
    const unsubscribe = progress.onChange((latestValue) => {
      drawGrid(latestValue);
    });

    // Animate the progress value using Framer Motion.
    // By animating to (rows + cols - 2), cells are revealed in diagonal order.
    const animation = animate(progress, totalCells, {
      duration: duration,
      ease: "easeInOut",
    });

    // Cleanup on component unmount.
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
        backgroundImage: "url('/static.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        // backgroundAttachment: "fixed",
      }}
    />
  );
};

export default GridRevealCanvasSVG;
