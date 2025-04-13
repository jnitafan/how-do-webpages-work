"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/components/navigation.module.scss";

const TOTAL_PAGES = 12;

interface NavigationProps {
  children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pageMatch = pathname.match(/^\/(\d+)$/);
  const currentPage = pageMatch ? parseInt(pageMatch[1]) : 1;

  if (pathname === "/") {
    return <>{children}</>;
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= TOTAL_PAGES) {
      router.push(`/${newPage}`);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
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
