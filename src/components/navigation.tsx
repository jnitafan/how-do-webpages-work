"use client";

import { useTransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";
import styles from "./navigation.module.scss";

const PAGES = 3;

interface NavigationProps {
  children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const pageMatch = pathname.match(/^\/(\d+)$/);
  const currentPage = pageMatch ? parseInt(pageMatch[1]) : 1;

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= PAGES) {
      router.push("/" + newPage);
    }
  };

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
