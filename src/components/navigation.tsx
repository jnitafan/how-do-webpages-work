// src/components/navigation.tsx
"use client";

import React, { useLayoutEffect, useState } from "react";
import { useTransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";
import { usePageContext } from "@/contexts/page-context";
import styles from "./navigation.module.scss";

const PAGES = 3;

interface NavigationProps {
  children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { animationType, setAnimationType } = usePageContext();
  const pageMatch = pathname.match(/^\/(\d+)$/);
  const currentPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;

  // Holds the next page + desired animation until the context updates
  const [pending, setPending] = useState<{
    page: number;
    anim: "fade" | "next";
  } | null>(null);

  const goToPage = (newPage: number, isNext = false) => {
    if (newPage < 1 || newPage > PAGES) return;

    const desiredAnim: "fade" | "next" = isNext ? "next" : "fade";
    setAnimationType(desiredAnim);
    setPending({ page: newPage, anim: desiredAnim });
  };

  // After React commits the new animationType, perform the push
  useLayoutEffect(() => {
    if (pending && animationType === pending.anim) {
      router.push(`/${pending.page}`);
      setPending(null);
    }
  }, [animationType, pending, router]);

  const nextPage = () => goToPage(currentPage + 1, true);
  const prevPage = () => goToPage(currentPage - 1);

  return (
    <>
      <div className={styles.content}>{children}</div>
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
            disabled={currentPage >= PAGES}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
