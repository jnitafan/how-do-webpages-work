// src/components/provider.tsx
"use client";
import React, { useRef, useEffect } from "react";
import { TransitionRouter, useTransitionState } from "next-transition-router";
import { PageProvider, usePageContext } from "@/contexts/page-context";
import { animate } from "framer-motion/dom";

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PageProvider>
      <TransitionHandler>{children}</TransitionHandler>
    </PageProvider>
  );
};

const TransitionHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentPage, animationType, setAnimationType } = usePageContext();
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionRouter
      leave={(next) => {
        if (
          animationType === "next" &&
          currentPage &&
          currentPage.exitAnimation
        ) {
          console.log(
            "%cnext exit",
            "color: orange; font-style: italic; background-color: blue;padding: 2px"
          );
          currentPage.exitAnimation(next);
        } else if (wrapperRef.current) {
          console.log(
            "%cfade exit",
            "color: red; font-style: italic; background-color: green;padding: 2px"
          );
          animate(
            wrapperRef.current,
            { opacity: [1, 0] },
            { duration: 0.5, onComplete: next }
          );
        } else {
          next();
        }
      }}
      enter={(next) => {
        if (
          animationType === "next" &&
          currentPage &&
          currentPage.enterAnimation
        ) {
          console.log(
            "%cnext entry",
            "color: orange; font-style: italic; background-color: blue;padding: 2px"
          );
          currentPage.enterAnimation(next);
        } else if (wrapperRef.current) {
          console.log(
            "%cfade entry",
            "color: red; font-style: italic; background-color: green;padding: 2px"
          );
          animate(
            wrapperRef.current,
            { opacity: [0, 1] },
            { duration: 0.5, onComplete: next }
          );
        } else {
          next();
        }
      }}
    >
      <div ref={wrapperRef}>{children}</div>
    </TransitionRouter>
  );
};

export default Provider;
