// src/contexts/page-context.tsx
import React, { createContext, useContext, useState } from "react";
import { PageHandle } from "@/app/types";

interface PageContextProps {
  registerPage: (page: PageHandle | null) => void;
  unregisterPage: () => void;
  currentPage: PageHandle | null;
  animationType: "fade" | "next";
  setAnimationType: (type: "fade" | "next") => void;
}

const PageContext = createContext<PageContextProps>({
  registerPage: () => {},
  unregisterPage: () => {},
  currentPage: null,
  animationType: "fade",
  setAnimationType: () => {},
});

export const usePageContext = () => useContext(PageContext);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState<PageHandle | null>(null);
  const [animationType, setAnimationType] = useState<"fade" | "next">("next");
  const registerPage = (page: PageHandle | null) => {
    setCurrentPage(page);
  };

  const unregisterPage = () => {
    setCurrentPage(null);
  };

  return (
    <PageContext.Provider
      value={{
        registerPage,
        unregisterPage,
        currentPage,
        animationType,
        setAnimationType,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
