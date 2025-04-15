"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.scss";

export default function Page() {
  // Get the search parameters from the URL.
  const searchParams = useSearchParams();
  // If no "anim" parameter is set, default to "fade".
  const animType = searchParams.get("anim") || "fade";

  // Determine which animation variant to use.
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
    <>
      {/* Conditionally animate this inner div only if the variant is "custom" */}
      {animType === "custom" ? (
        <AnimatePresence propagate>
          <motion.div
            className={styles.innerElement}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1.0 } }}
            exit={{ y: 100, opacity: 1, transition: { duration: 5.0 } }}
          >
            <div>
              <Lottie animationData={routingAnim} loop={true} />
              <Lottie animationData={headersAnim} loop={false} />
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div>
          <Lottie animationData={routingAnim} loop={true} />
          <Lottie animationData={headersAnim} loop={false} />
        </div>
      )}
    </>
  );
}
