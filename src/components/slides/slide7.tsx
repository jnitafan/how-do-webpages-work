// components/slides/Slide7.tsx
"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import styles from "./slides.module.scss";

const Slide7 = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    entryAnimation: () => {},
    exitAnimation: () => Promise.resolve(),
  }));

  const [routingAnim, setRoutingAnim] = useState(null);
  const [headersAnim, setHeadersAnim] = useState(null);

  useEffect(() => {
    // Fetch the animation JSON file from the public folder
    fetch("/routing.json")
      .then((response) => response.json())
      .then((data) => setRoutingAnim(data))
      .catch((error) =>
        console.error("Error loading the Lottie animation:", error)
      );
    fetch("/headers.json")
      .then((response) => response.json())
      .then((data) => setHeadersAnim(data))
      .catch((error) =>
        console.error("Error loading the Lottie animation:", error)
      );
  }, []);

  return (
    <div className={styles.slide}>
      <div>
        <Lottie animationData={routingAnim} loop={true} />
        <Lottie animationData={headersAnim} loop={false} />
      </div>
    </div>
  );
});

export default Slide7;
