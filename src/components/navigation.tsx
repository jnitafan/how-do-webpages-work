"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./navigation.module.scss";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_PAGES = 12;

const slideVariants = {
  start: { x: -100, transition: { duration: 1.0 } },
  default: { x: 0, transition: { duration: 1.0 } },
  end: { x: 100, transition: { duration: 1.0 } },
};

interface NavigationProps {
  children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pageMatch = pathname.match(/^\/(\d+)$/);
  const currentPage = pageMatch ? parseInt(pageMatch[1]) : 1;
  const [destPage, setDestPage] = useState<number | null>(null);
  const [componentKey, setComponentKey] = useState<string | number>("anim_/");

  const goToPage = async (newPage: number) => {
    if (newPage >= 1 && newPage <= TOTAL_PAGES) {
      router.prefetch(`/${newPage}`);
      setDestPage(newPage);
      setComponentKey("anim_" + newPage);
    }
  };

  const handleExitComplete = () => {
    if (destPage !== null) {
      const queryString = destPage === currentPage + 1 ? "?anim=custom" : "";
      router.push(`/${destPage}${queryString}`);
      setDestPage(null);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        <motion.div
          key={componentKey}
          variants={slideVariants}
          initial="start"
          animate="default"
          exit="end"
          className={styles.content}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <div className={styles.carousel}>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={prevPage}
            disabled={currentPage <= 1}
          >
            ◀
          </button>
          <button
            className={styles.button}
            onClick={nextPage}
            disabled={currentPage >= TOTAL_PAGES}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
